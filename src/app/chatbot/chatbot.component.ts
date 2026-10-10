import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

/* =========================================================
   CONFIGURATION — à adapter
========================================================= */

const CHAT_ENDPOINT = '/api/chat'; // proxy vers server/chat-server.mjs
const PHONE_DISPLAY = '+33 6 02 79 12 08';
const PHONE_HREF = 'tel:+33602791208'; // même numéro, format international sans espaces
const STORAGE_KEY = 'cb-chat-v2';
const TEASER_KEY = 'cb-chat-teaser-seen';
const MAX_INPUT = 1000;
const TEASER_DELAY_MS = 4000;

/**
 * Appel direct en cas d'urgence : sur téléphone, le composeur s'ouvre tout seul
 * avec votre numéro dès que le visiteur écrit « urgence ».
 * Sur ordinateur, un gros bouton « Appeler maintenant » s'affiche à la place.
 * Mettre false pour n'afficher que le bouton, sur tous les appareils.
 */
const URGENT_AUTO_DIAL = true;

/** Mots qui déclenchent le mode urgence (réponse instantanée, sans passer par l'IA) */
const URGENT_INTENT = /(urgen\w*|\bsos\b|au secours|inond\w*|d[ée]borde\w*|refoul\w*|d[ée]g[âa]ts? des eaux)/i;
/** « pas urgent », « sans urgence »… ne doivent pas déclencher l'appel */
const NOT_URGENT = /(pas (tr[èe]s |vraiment |si )?urgen|non urgen|sans urgence|aucune urgence|plus urgen)/i;

/** Détecte quand le visiteur demande le numéro / veut appeler : réponse instantanée, sans passer par l'IA */
const PHONE_INTENT =
  /(num[ée]ro|t[ée]l[ée]phone|\bt[ée]l\b|\btel\b|portable|appeler|vous joindre|vous contacter|contacter|coordonn[ée]es|phone|call you)/i;

const PHONE_REPLY =
  `Bien sûr ! Voici notre numéro : ${PHONE_DISPLAY} 📞\n` +
  'Appelez-nous directement (touchez le bouton ci-dessous) : nous intervenons rapidement, ' +
  'et en cas d’urgence nous vous répondons en priorité.';

const URGENT_REPLY =
  `🚨 C’est une urgence : appelez-nous maintenant au ${PHONE_DISPLAY}, nous vous répondons en priorité.\n` +
  'Touchez le bouton ci-dessous pour lancer l’appel.';

/**
 * PHOTO DE L'ASSISTANT
 * - Pour une vraie photo (technicien de l'entreprise, par ex.), mettez son chemin :
 *     const AVATAR_URL = 'assets/technicien.jpg';   (carré, 200×200 px minimum)
 * - Laissé vide : un avatar illustré (technicien avec casque) est utilisé.
 */
const AVATAR_URL = '';

const DEFAULT_AVATAR_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#38d6f0'/><stop offset='1' stop-color='#0e7490'/></linearGradient></defs>
<rect width='96' height='96' fill='url(#g)'/>
<path d='M8 96c2-19 17-28 40-28s38 9 40 28z' fill='#ff7a1a'/>
<path d='M36 69l12 12 12-12z' fill='#fff' opacity='.92'/>
<rect x='41' y='56' width='14' height='15' rx='6' fill='#e3a981'/>
<circle cx='48' cy='44' r='17' fill='#f4c9a5'/>
<circle cx='31.5' cy='46' r='3' fill='#e9b98f'/><circle cx='64.5' cy='46' r='3' fill='#e9b98f'/>
<path d='M28 41a20 20 0 0 1 40 0z' fill='#ffc61a'/>
<rect x='45' y='20' width='6' height='11' rx='2.5' fill='#f2a900'/>
<rect x='24' y='39' width='48' height='6.5' rx='3.2' fill='#f2a900'/>
<circle cx='41' cy='52' r='2.2' fill='#2b2b2b'/><circle cx='55' cy='52' r='2.2' fill='#2b2b2b'/>
<path d='M41 59q7 6 14 0' stroke='#2b2b2b' stroke-width='2.2' fill='none' stroke-linecap='round'/>
</svg>`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  /** Message affiché uniquement côté site (jamais envoyé à l'IA) */
  local?: boolean;
  /** Message d'urgence : affiche le gros bouton « Appeler maintenant » */
  urgent?: boolean;
}

const WELCOME: ChatMessage = {
  role: 'assistant',
  local: true,
  content:
    'Bonjour 👋 Je suis l’assistant de CB Débouchage & Assainissement. ' +
    'Je peux vous renseigner sur le débouchage, le curage, l’inspection caméra ' +
    'ou l’assainissement. Que se passe-t-il chez vous ?',
};

const SUGGESTIONS = [
  { icon: '🚨', label: 'C’est une urgence' },
  { icon: '🚽', label: 'Mon WC est bouché' },
  { icon: '🚿', label: 'Évier ou douche qui ne s’évacue plus' },
  { icon: '👃', label: 'Mauvaises odeurs dans la maison' },
  { icon: '📋', label: 'Je veux un devis' },
];

@Component({
  selector: 'app-chatbot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Bulle d'accroche -->
    @if (teaser() && !open()) {
      <div class="teaser" role="status">
        <button type="button" class="teaser-x" (click)="dismissTeaser()" aria-label="Masquer le message">×</button>
        <button type="button" class="teaser-body" (click)="toggle()">
          <strong>Un souci de canalisation ?</strong>
          <span>Décrivez-moi le problème, je vous guide 👇</span>
        </button>
      </div>
    }

    <!-- Bouton flottant avec photo -->
    <button
      class="launcher"
      type="button"
      #launcher
      (click)="toggle()"
      [class.is-open]="open()"
      [attr.aria-expanded]="open()"
      aria-controls="cb-chat-panel"
      [attr.aria-label]="open() ? 'Fermer l’assistant' : 'Ouvrir l’assistant'"
    >
      <span class="ring" aria-hidden="true"></span>
      <img class="launcher-photo" [src]="avatar" alt="" width="64" height="64" />
      <svg class="ico-close" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
      @if (!open()) {
        <span class="badge" aria-hidden="true">1</span>
      }
      <span class="online" aria-hidden="true"></span>
    </button>

    <section
      id="cb-chat-panel"
      class="panel"
      role="dialog"
      aria-label="Assistant CB Débouchage & Assainissement"
      [class.open]="open()"
      [attr.inert]="open() ? null : ''"
      (keydown.escape)="close()"
    >
      <header class="head">
        <div class="who">
          <span class="who-photo">
            <img [src]="avatar" alt="" width="46" height="46" />
            <i class="who-dot" aria-hidden="true"></i>
          </span>
          <div class="head-text">
            <strong>Assistant CB</strong>
            <span>En ligne · Débouchage &amp; assainissement</span>
          </div>
        </div>
        <button class="close" type="button" (click)="close()" aria-label="Fermer l’assistant">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </header>

      <a class="urgent" [href]="phoneHref" aria-label="Urgence : appeler l’entreprise">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z" />
        </svg>
        <span>Urgence ? Appelez-nous</span>
        <strong>{{ phoneDisplay }}</strong>
      </a>

      <div class="log" #log role="log" aria-live="polite" aria-relevant="additions">
        @for (m of messages(); track $index) {
          <div class="row" [class.user]="m.role === 'user'">
            @if (m.role === 'assistant') {
              <img class="av" [src]="avatar" alt="" width="28" height="28" />
            }
            <div class="msg">{{ m.content }}@if (m.urgent) {<a class="msg-call urgent-btn" [href]="phoneHref"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z" /></svg>Appeler maintenant<small>{{ phoneDisplay }}</small></a>} @else if (hasPhone(m)) {<a class="msg-call" [href]="phoneHref"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z" /></svg>Appeler {{ phoneDisplay }}</a>}</div>
          </div>
        }
        @if (loading()) {
          <div class="row">
            <img class="av" [src]="avatar" alt="" width="28" height="28" />
            <div class="msg typing" aria-label="L’assistant écrit">
              <span></span><span></span><span></span>
            </div>
          </div>
        }
      </div>

      @if (showSuggestions()) {
        <div class="chips">
          @for (s of suggestions; track s.label) {
            <button type="button" (click)="send(s.label)">
              <span aria-hidden="true">{{ s.icon }}</span> {{ s.label }}
            </button>
          }
        </div>
      }

      <form class="composer" (submit)="onSubmit($event)">
        <label class="sr-only" for="cb-chat-input">Votre message</label>
        <textarea
          id="cb-chat-input"
          #input
          rows="1"
          [maxLength]="maxInput"
          [value]="draft()"
          (input)="onInput($event)"
          (keydown.enter)="onEnter($event)"
          placeholder="Décrivez votre problème…"
        ></textarea>
        <button type="submit" [disabled]="!canSend()" aria-label="Envoyer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20l18-8L3 4v6l11 2-11 2z" /></svg>
        </button>
      </form>

      <p class="legal">
        Assistant IA : il peut se tromper. N’indiquez pas d’informations sensibles.
      </p>
    </section>
  `,
  styles: [
    `
    :host {
      --cb-navy: #082f3f;
      --cb-primary: #0e7490;
      --cb-primary-dark: #0a5a72;
      --cb-primary-light: #22b8d6;
      --cb-accent: #ff7a1a;
      --cb-accent-dark: #e8650a;
      --cb-ok: #22c55e;
      --cb-text: #1c2b33;
      --cb-soft: #eef6f9;
      --cb-line: #cfe3ea;
      --cb-ease: cubic-bezier(0.22, 1, 0.36, 1);
      --cb-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

      position: fixed;
      inset-inline-end: 20px;
      bottom: 20px;
      z-index: 2147483000;
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
      color: var(--cb-text);
    }

    .sr-only {
      position: absolute; width: 1px; height: 1px; overflow: hidden;
      clip: rect(0 0 0 0); white-space: nowrap;
    }

    img { display: block; object-fit: cover; }

    /* ---------- Bulle d'accroche ---------- */
    .teaser {
      position: absolute;
      inset-inline-end: 0;
      bottom: 82px;
      width: 250px;
      animation: teaserIn 0.6s var(--cb-spring) backwards;
    }
    .teaser-body {
      display: flex; flex-direction: column; gap: 2px; width: 100%;
      padding: 12px 34px 12px 14px;
      border: 0; border-radius: 16px 16px 4px 16px;
      background: #fff; color: var(--cb-text);
      font: inherit; text-align: start; cursor: pointer;
      box-shadow: 0 12px 32px rgba(8, 47, 63, 0.25);
      border-inline-start: 4px solid var(--cb-accent);
    }
    .teaser-body strong { font-size: 13.5px; color: var(--cb-navy); }
    .teaser-body span { font-size: 12.5px; color: #55707c; line-height: 1.4; }
    .teaser-x {
      position: absolute; top: 6px; inset-inline-end: 8px; z-index: 1;
      width: 22px; height: 22px; border: 0; border-radius: 50%;
      background: transparent; color: #7b95a0; font-size: 18px; line-height: 1; cursor: pointer;
    }
    .teaser-x:hover { background: var(--cb-soft); color: var(--cb-navy); }
    .teaser-body:focus-visible, .teaser-x:focus-visible { outline: 3px solid var(--cb-primary); outline-offset: 2px; }

    /* ---------- Bouton flottant ---------- */
    .launcher {
      position: relative;
      display: grid; place-items: center;
      width: 68px; height: 68px; padding: 0;
      border: 3px solid #fff; border-radius: 50%;
      background: var(--cb-primary);
      color: #fff; cursor: pointer;
      box-shadow: 0 12px 30px rgba(8, 47, 63, 0.4);
      transition: scale 0.4s var(--cb-spring), box-shadow 0.3s ease, background-color 0.3s ease;
      animation: launcherIn 0.8s var(--cb-spring) 1s backwards;
    }
    .launcher:hover { scale: 1.07; box-shadow: 0 16px 36px rgba(8, 47, 63, 0.5); }
    .launcher:active { scale: 0.94; }
    .launcher:focus-visible { outline: 3px solid var(--cb-accent); outline-offset: 3px; }

    .ring {
      position: absolute; inset: -3px; border-radius: 50%;
      border: 2px solid var(--cb-primary-light);
      animation: pulse 2.4s ease-out infinite;
      pointer-events: none;
    }
    .launcher.is-open .ring { display: none; }

    .launcher-photo {
      grid-area: 1 / 1; width: 100%; height: 100%; border-radius: 50%;
      transition: opacity 0.25s ease, scale 0.4s var(--cb-spring);
    }
    .ico-close {
      grid-area: 1 / 1; width: 28px; height: 28px;
      fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round;
      opacity: 0; rotate: -90deg; scale: 0.5;
      transition: opacity 0.25s ease, rotate 0.5s var(--cb-spring), scale 0.5s var(--cb-spring);
    }
    .launcher.is-open { background: var(--cb-navy); }
    .launcher.is-open .launcher-photo { opacity: 0; scale: 0.5; }
    .launcher.is-open .ico-close { opacity: 1; rotate: 0deg; scale: 1; }
    .launcher.is-open .online { display: none; }

    .badge {
      position: absolute; top: -4px; inset-inline-end: -4px;
      display: grid; place-items: center;
      min-width: 22px; height: 22px; padding: 0 5px;
      border: 2px solid #fff; border-radius: 999px;
      background: var(--cb-accent); color: #fff;
      font-size: 11px; font-weight: 700;
      animation: badgePop 0.6s var(--cb-spring) 2s backwards;
    }
    .online {
      position: absolute; bottom: 2px; inset-inline-start: 2px;
      width: 15px; height: 15px; border: 2.5px solid #fff; border-radius: 50%;
      background: var(--cb-ok);
    }

    /* ---------- Panneau ---------- */
    .panel {
      position: absolute;
      inset-inline-end: 0;
      bottom: 84px;
      display: flex; flex-direction: column;
      width: min(390px, calc(100vw - 24px));
      height: min(600px, calc(100dvh - 120px));
      overflow: hidden;
      border-radius: 22px;
      background: #fff;
      box-shadow: 0 28px 70px rgba(8, 47, 63, 0.35);
      transform-origin: bottom right;
      opacity: 0; visibility: hidden;
      translate: 0 16px; scale: 0.92;
      transition: opacity 0.25s ease, translate 0.3s var(--cb-ease), scale 0.3s var(--cb-ease), visibility 0s 0.3s;
    }
    .panel.open {
      opacity: 1; visibility: visible; translate: 0 0; scale: 1;
      transition: opacity 0.3s ease, translate 0.5s var(--cb-ease), scale 0.5s var(--cb-ease), visibility 0s;
    }

    .head {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 14px 14px 14px 16px;
      background: linear-gradient(135deg, var(--cb-navy) 0%, var(--cb-primary) 100%);
      color: #fff;
    }
    .who { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .who-photo { position: relative; flex-shrink: 0; }
    .who-photo img {
      width: 46px; height: 46px; border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.85);
    }
    .who-dot {
      position: absolute; bottom: 0; inset-inline-end: 0;
      width: 12px; height: 12px; border: 2px solid var(--cb-navy); border-radius: 50%;
      background: var(--cb-ok);
    }
    .head-text { display: flex; flex-direction: column; line-height: 1.3; min-width: 0; }
    .head-text strong { font-size: 15.5px; }
    .head-text span { font-size: 12px; opacity: 0.85; }

    .close {
      display: grid; place-items: center; flex-shrink: 0;
      width: 34px; height: 34px; border: 0; border-radius: 50%;
      background: rgba(255, 255, 255, 0.12); color: #fff; cursor: pointer;
      transition: background-color 0.3s ease, rotate 0.4s var(--cb-spring);
    }
    .close svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; }
    .close:hover { background: rgba(255, 255, 255, 0.25); rotate: 90deg; }
    .close:focus-visible { outline: 3px solid #fff; outline-offset: -3px; }

    /* Bandeau d'appel urgence */
    .urgent {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 16px;
      background: var(--cb-accent); color: #fff;
      font-size: 13px; text-decoration: none;
      transition: background-color 0.3s ease;
    }
    .urgent:hover { background: var(--cb-accent-dark); }
    .urgent svg { width: 16px; height: 16px; fill: currentColor; flex-shrink: 0; animation: ring 2.8s ease-in-out infinite; transform-origin: 50% 50%; }
    .urgent span { flex: 1; }
    .urgent strong { font-size: 13.5px; letter-spacing: 0.02em; white-space: nowrap; }
    .urgent:focus-visible { outline: 3px solid var(--cb-navy); outline-offset: -3px; }

    /* ---------- Messages ---------- */
    .log {
      flex: 1; overflow-y: auto; overscroll-behavior: contain;
      display: flex; flex-direction: column; gap: 10px;
      padding: 16px 14px; background: var(--cb-soft);
      scroll-behavior: smooth;
    }
    .row {
      display: flex; align-items: flex-end; gap: 8px;
      align-self: flex-start; max-width: 88%;
      animation: msgIn 0.45s var(--cb-ease) backwards;
    }
    .row.user { align-self: flex-end; flex-direction: row-reverse; }
    .av { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); }
    .msg {
      padding: 10px 13px;
      border-radius: 16px 16px 16px 4px;
      background: #fff;
      font-size: 14px; line-height: 1.5;
      white-space: pre-wrap; overflow-wrap: anywhere;
      box-shadow: 0 1px 3px rgba(8, 47, 63, 0.1);
    }
    .row.user .msg {
      border-radius: 16px 16px 4px 16px;
      background: linear-gradient(135deg, var(--cb-primary) 0%, var(--cb-primary-dark) 100%);
      color: #fff;
    }
    .msg-call {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-top: 10px; padding: 10px 14px;
      border-radius: 999px;
      background: var(--cb-accent); color: #fff;
      font-size: 14px; font-weight: 700; text-decoration: none;
      box-shadow: 0 6px 16px rgba(255, 122, 26, 0.35);
      transition: background-color 0.3s ease, scale 0.3s var(--cb-spring);
    }
    .msg-call svg { width: 16px; height: 16px; fill: currentColor; }
    .msg-call:hover { background: var(--cb-accent-dark); scale: 1.03; }
    .msg-call:focus-visible { outline: 3px solid var(--cb-navy); outline-offset: 2px; }

    /* Gros bouton d'urgence */
    .urgent-btn {
      flex-direction: column; gap: 2px;
      padding: 14px 16px; border-radius: 18px;
      background: #e11d2e; font-size: 16px;
      box-shadow: 0 8px 22px rgba(225, 29, 46, 0.45);
      animation: urgentPulse 1.8s ease-in-out infinite;
    }
    .urgent-btn svg { width: 22px; height: 22px; }
    .urgent-btn small { font-size: 14px; font-weight: 600; opacity: 0.95; letter-spacing: 0.02em; }
    .urgent-btn:hover { background: #c4121f; }

    .typing { display: flex; gap: 4px; padding: 14px; }
    .typing span {
      width: 7px; height: 7px; border-radius: 50%; background: #8fb3c0;
      animation: dot 1.2s ease-in-out infinite;
    }
    .typing span:nth-child(2) { animation-delay: 0.15s; }
    .typing span:nth-child(3) { animation-delay: 0.3s; }

    /* ---------- Suggestions ---------- */
    .chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 14px 0; background: var(--cb-soft); }
    .chips button {
      padding: 8px 12px; border: 1px solid var(--cb-line); border-radius: 999px;
      background: #fff; color: var(--cb-primary-dark);
      font: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer;
      transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, translate 0.3s var(--cb-ease);
    }
    .chips button:hover { background: var(--cb-primary); border-color: var(--cb-primary); color: #fff; translate: 0 -2px; }
    .chips button:focus-visible { outline: 3px solid var(--cb-accent); outline-offset: 2px; }

    /* ---------- Saisie ---------- */
    .composer { display: flex; align-items: flex-end; gap: 8px; padding: 12px 12px 6px; background: var(--cb-soft); }
    .composer textarea {
      flex: 1; max-height: 110px; padding: 10px 14px;
      border: 1px solid var(--cb-line); border-radius: 18px; resize: none;
      font: inherit; font-size: 16px; /* 16px : évite le zoom auto sur iOS */
      line-height: 1.4; background: #fff; color: var(--cb-text);
      field-sizing: content;
    }
    .composer textarea:focus { outline: 2px solid var(--cb-primary); outline-offset: 0; }
    .composer button {
      display: grid; place-items: center; flex-shrink: 0;
      width: 44px; height: 44px; border: 0; border-radius: 50%;
      background: var(--cb-accent); color: #fff; cursor: pointer;
      box-shadow: 0 6px 16px rgba(255, 122, 26, 0.4);
      transition: scale 0.3s var(--cb-spring), background-color 0.3s ease, opacity 0.3s ease;
    }
    .composer button svg { width: 20px; height: 20px; fill: currentColor; }
    .composer button:hover:not(:disabled) { scale: 1.08; background: var(--cb-accent-dark); }
    .composer button:active:not(:disabled) { scale: 0.92; }
    .composer button:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
    .composer button:focus-visible { outline: 3px solid var(--cb-navy); outline-offset: 2px; }

    .legal { margin: 0; padding: 0 16px 10px; background: var(--cb-soft); color: #62808c; font-size: 11px; text-align: center; }

    /* ---------- Mobile : plein écran ---------- */
    @media (max-width: 520px) {
      :host { inset-inline-end: 14px; bottom: 14px; }
      .panel {
        position: fixed; inset: 0; width: 100%; height: 100dvh;
        border-radius: 0;
      }
      .teaser { width: min(250px, calc(100vw - 100px)); }
      /* le bouton de fermeture du panneau prend le relais */
      .launcher.is-open { display: none; }
    }

    /* ---------- Keyframes ---------- */
    @keyframes launcherIn { from { opacity: 0; scale: 0.4; translate: 0 20px; } }
    @keyframes teaserIn { from { opacity: 0; translate: 0 12px; scale: 0.9; } }
    @keyframes badgePop { from { scale: 0; } }
    @keyframes msgIn { from { opacity: 0; translate: 0 10px; scale: 0.97; } }
    @keyframes pulse {
      0% { opacity: 0.7; scale: 1; }
      100% { opacity: 0; scale: 1.5; }
    }
    @keyframes urgentPulse {
      0%, 100% { box-shadow: 0 8px 22px rgba(225, 29, 46, 0.45); }
      50% { box-shadow: 0 8px 30px rgba(225, 29, 46, 0.8); }
    }
    @keyframes ring {
      0%, 70%, 100% { rotate: 0deg; }
      75% { rotate: -14deg; } 80% { rotate: 12deg; } 85% { rotate: -10deg; } 90% { rotate: 8deg; }
    }
    @keyframes dot {
      0%, 60%, 100% { translate: 0 0; opacity: 0.5; }
      30% { translate: 0 -5px; opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        translate: none !important; scale: none !important; rotate: none !important;
        transition-duration: 0.01ms !important; transition-delay: 0s !important;
      }
    }
  `,
  ],
})
export class ChatbotComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly open = signal(false);
  readonly loading = signal(false);
  readonly draft = signal('');
  readonly teaser = signal(false);
  readonly messages = signal<ChatMessage[]>(this.restore());

  readonly suggestions = SUGGESTIONS;
  readonly phoneDisplay = PHONE_DISPLAY;
  readonly phoneHref = PHONE_HREF;
  readonly maxInput = MAX_INPUT;

  readonly avatar: string | SafeUrl = AVATAR_URL
    ? AVATAR_URL
    : this.sanitizer.bypassSecurityTrustUrl(
        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(DEFAULT_AVATAR_SVG),
      );

  @ViewChild('log') private log?: ElementRef<HTMLElement>;
  @ViewChild('input') private input?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('launcher') private launcher?: ElementRef<HTMLButtonElement>;

  private abort?: AbortController;

  constructor() {
    // Sauvegarde de la conversation pendant la session (changement de page inclus)
    effect(() => {
      const data = JSON.stringify(this.messages());
      try { sessionStorage.setItem(STORAGE_KEY, data); } catch { /* stockage indisponible */ }
    });

    // Bulle d'accroche : une seule fois par session
    let seen = false;
    try { seen = sessionStorage.getItem(TEASER_KEY) === '1'; } catch { /* ignore */ }
    if (!seen) {
      setTimeout(() => {
        if (!this.open()) this.teaser.set(true);
      }, TEASER_DELAY_MS);
    }
  }

  showSuggestions(): boolean {
    return this.messages().length <= 1 && !this.loading();
  }

  /** Affiche le bouton « Appeler » sous tout message de l'assistant qui contient le numéro */
  hasPhone(m: ChatMessage): boolean {
    return m.role === 'assistant' && m.content.includes(PHONE_DISPLAY);
  }

  canSend(): boolean {
    return !this.loading() && this.draft().trim().length > 0;
  }

  toggle(): void {
    this.open() ? this.close() : this.openPanel();
  }

  openPanel(): void {
    this.dismissTeaser();
    this.open.set(true);
    setTimeout(() => {
      this.input?.nativeElement.focus();
      this.scrollDown(false);
    }, 60);
  }

  close(): void {
    this.open.set(false);
    this.launcher?.nativeElement.focus();
  }

  dismissTeaser(): void {
    this.teaser.set(false);
    try { sessionStorage.setItem(TEASER_KEY, '1'); } catch { /* ignore */ }
  }

  onInput(e: Event): void {
    this.draft.set((e.target as HTMLTextAreaElement).value);
  }

  onEnter(e: Event): void {
    const ev = e as KeyboardEvent;
    if (ev.shiftKey) return; // Maj+Entrée = retour à la ligne
    ev.preventDefault();
    this.send(this.draft());
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    this.send(this.draft());
  }

  async send(raw: string): Promise<void> {
    const text = raw.trim().slice(0, MAX_INPUT);
    if (!text || this.loading()) return;

    const isUrgent = URGENT_INTENT.test(text) && !NOT_URGENT.test(text);
    const isPhone = !isUrgent && PHONE_INTENT.test(text);

    // Les messages traités sur le site ne sont pas envoyés à l'IA
    this.messages.update((m) => [...m, { role: 'user', content: text, local: isUrgent || isPhone }]);
    this.draft.set('');
    if (this.input) this.input.nativeElement.value = '';

    // URGENCE : réponse immédiate + appel direct
    if (isUrgent) {
      this.messages.update((m) => [
        ...m,
        { role: 'assistant', content: URGENT_REPLY, local: true, urgent: true },
      ]);
      this.scrollDown();
      // Sur téléphone, on ouvre directement le composeur avec le numéro.
      // (Doit rester ici, sans « await » avant, pour compter comme une action du visiteur.)
      if (URGENT_AUTO_DIAL && this.isMobile()) {
        window.location.href = PHONE_HREF;
      }
      return;
    }

    // Demande de numéro : on répond tout de suite, avec le bouton « Appeler »
    if (isPhone) {
      this.messages.update((m) => [...m, { role: 'assistant', content: PHONE_REPLY, local: true }]);
      this.scrollDown();
      return;
    }

    this.loading.set(true);
    this.scrollDown();

    this.abort?.abort();
    this.abort = new AbortController();

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: this.messages()
            .filter((m) => !m.local)
            .map(({ role, content }) => ({ role, content })),
        }),
        signal: this.abort.signal,
      });

      if (res.status === 429) throw new Error('rate');
      if (!res.ok) throw new Error('http');

      const data = (await res.json()) as { reply?: string };
      const reply = (data.reply ?? '').trim();
      if (!reply) throw new Error('empty');

      this.messages.update((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const msg =
        (err as Error).message === 'rate'
          ? 'Vous envoyez beaucoup de messages. Patientez un instant avant de réessayer.'
          : `Désolé, je rencontre un problème technique. Vous pouvez nous appeler au ${PHONE_DISPLAY}.`;
      this.messages.update((m) => [...m, { role: 'assistant', content: msg, local: true }]);
    } finally {
      this.loading.set(false);
      this.scrollDown();
    }
  }

  /** Téléphone (Android / iPhone / iPad) : le lien « tel: » ouvre le composeur */
  private isMobile(): boolean {
    return typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  private scrollDown(smooth = true): void {
    setTimeout(() => {
      const el = this.log?.nativeElement;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    });
  }

  private restore(): ChatMessage[] {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch { /* ignore */ }
    return [WELCOME];
  }
}