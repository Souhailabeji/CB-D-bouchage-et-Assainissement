import { Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize, timeout } from 'rxjs/operators';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContactSubject = 'general' | 'web' | 'uiux' | 'other';

interface ContactErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

type FieldName = keyof ContactErrors;

interface FieldRule {
  read: () => string;
  isValid: (value: string) => boolean;
  errorKey: string;
}

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: ContactSubject;
  message: string;
}

/** Retour affiché sous le formulaire. On stocke une clé i18n (et non le texte) pour suivre le changement de langue. */
export interface ContactFeedback {
  type: 'success' | 'error';
  messageKey: string;
}

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const CONTACT_ENDPOINT = '/api/contact';
const REQUEST_TIMEOUT_MS = 15_000;
const EMAIL_MAX_LENGTH = 254;

/**
 * 2 à 50 caractères : lettres de toutes les langues (arabe inclus), accents,
 * espaces, apostrophes, points et tirets.
 * L'ancienne plage `À-ÿ` rejetait l'arabe et acceptait par erreur × et ÷.
 */
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}\s'’.-]{1,49}$/u;

/** Pattern e-mail du standard WHATWG (celui des navigateurs pour <input type="email">). */
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Téléphone : 8 à 15 chiffres, préfixe international facultatif (+ ou 00).
 * Accepte donc un numéro à 8 chiffres, un numéro français (0612345678)
 * ou international (+33612345678). Les espaces, points, tirets et
 * parenthèses sont ignorés avant le test.
 */
const PHONE_PATTERN = /^(?:\+|00)?\d{8,15}$/;

const FIELD_ORDER: readonly FieldName[] = ['firstName', 'lastName', 'email', 'phone'];

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  subject: 'general' as ContactSubject
};

/** Tolérant aux valeurs null/undefined (NgForm.reset() met les champs à null). */
const clean = (value: string | null | undefined): string => (value ?? '').trim();

const normalizePhone = (value: string): string => value.replace(/[\s.()-]/g, '');

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

@Component({
  selector: 'app-fp-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './fp-contact.component.html',
  styleUrls: ['./fp-contact.component.scss']
})
export class FpContactComponent {
  private readonly translate = inject(TranslateService);
  private readonly http = inject(HttpClient);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('contactForm') contactForm?: NgForm;

  // Modèle du formulaire
  firstName = EMPTY_FORM.firstName;
  lastName = EMPTY_FORM.lastName;
  email = EMPTY_FORM.email;
  phone = EMPTY_FORM.phone;
  message = EMPTY_FORM.message;
  subject: ContactSubject = EMPTY_FORM.subject;

  /** Valeurs possibles du sujet, pour générer les radios avec @for / *ngFor. */
  readonly subjects: readonly ContactSubject[] = ['general', 'web', 'uiux', 'other'];

  // État UI
  isSending = false;
  submitted = false;
  errors: ContactErrors = {};
  feedback: ContactFeedback | null = null;

  /** Règles de validation, une seule définition par champ. */
  private readonly rules: Record<FieldName, FieldRule> = {
    firstName: {
      read: () => this.firstName,
      isValid: (v) => NAME_PATTERN.test(v),
      errorKey: 'CONTACT.errorFirstName'
    },
    lastName: {
      read: () => this.lastName,
      isValid: (v) => NAME_PATTERN.test(v),
      errorKey: 'CONTACT.errorLastName'
    },
    email: {
      read: () => this.email,
      isValid: (v) => v.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(v),
      errorKey: 'CONTACT.errorEmail'
    },
    phone: {
      read: () => this.phone,
      isValid: (v) => PHONE_PATTERN.test(normalizePhone(v)),
      errorKey: 'CONTACT.errorPhone'
    }
  };

  constructor() {
    // Les messages d'erreur sont stockés déjà traduits : on les recalcule si la langue change
    this.translate.onLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.submitted) {
          this.validateAll();
        }
      });
  }

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------

  /**
   * Valide un seul champ et met à jour `errors`.
   * À brancher dans le template : (blur)="validateField('email')"
   */
  validateField(field: FieldName): boolean {
    const rule = this.rules[field];
    const valid = rule.isValid(clean(rule.read()));

    if (valid) {
      delete this.errors[field];
    } else {
      this.errors[field] = this.translate.instant(rule.errorKey);
    }

    return valid;
  }

  /** Valide tous les champs (même après une première erreur, pour tous les afficher d'un coup). */
  private validateAll(): boolean {
    return FIELD_ORDER.map((field) => this.validateField(field)).every(Boolean);
  }

  // -------------------------------------------------------------------------
  // Envoi
  // -------------------------------------------------------------------------

  sendForm(): void {
    if (this.isSending) {
      return; // évite les doubles envois
    }

    this.submitted = true;
    this.feedback = null;

    if (!this.validateAll()) {
      this.focusFirstError();
      return;
    }

    this.isSending = true;

    this.http
      .post(CONTACT_ENDPOINT, this.buildPayload())
      .pipe(
        timeout(REQUEST_TIMEOUT_MS), // sans timeout, le bouton pouvait rester bloqué en « envoi… »
        finalize(() => (this.isSending = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError()
      });
  }

  private buildPayload(): ContactPayload {
    return {
      firstName: clean(this.firstName),
      lastName: clean(this.lastName),
      email: clean(this.email),
      phone: normalizePhone(clean(this.phone)),
      subject: this.subject,
      message: clean(this.message)
    };
  }

  private handleSuccess(): void {
    this.resetForm();
    this.feedback = { type: 'success', messageKey: 'CONTACT.success' };
  }

  private handleError(): void {
    this.feedback = { type: 'error', messageKey: 'CONTACT.errorSend' };
  }

  private resetForm(): void {
    Object.assign(this, EMPTY_FORM);
    this.errors = {};
    this.submitted = false;
    this.feedback = null;

    // Important : passer les valeurs initiales. `resetForm()` sans argument met
    // tous les champs à null via ngModel, et le prochain `.trim()` plantait.
    this.contactForm?.resetForm({ ...EMPTY_FORM });
  }

  /** Place le curseur sur le premier champ invalide (utile au clavier et aux lecteurs d'écran). */
  private focusFirstError(): void {
    const first = FIELD_ORDER.find((field) => this.errors[field]);
    if (!first) {
      return;
    }
    this.host.nativeElement.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }
}