import {
  Component,
  DestroyRef,
  HostListener,
  NgZone,
  OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { DOCUMENT, CommonModule, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, filter, fromEvent, map, startWith } from 'rxjs';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

/**
 * Logos selon le fond de la navbar.
 * Les deux chemins sont identiques pour l'instant : l'ancien code testait
 * `scrollY > 100` mais renvoyait la même image dans les deux branches.
 * Si vous avez une version sombre du logo, mettez-la dans LOGO_FOR_LIGHT_BG
 * (affichée sur fond blanc, quand la navbar est « sticky »).
 *
 * À améliorer : le fichier fait 2000 px pour un logo affiché à ~64 px, et son
 * nom contient un espace et des parenthèses. Exportez une version ≈ 256 px
 * nommée sans caractères spéciaux, par exemple « images/cb-logo.webp ».
 */
const LOGO_FOR_DARK_BG = 'images/CB_logo_principal_2000px (2).webp';
const LOGO_FOR_LIGHT_BG = 'images/CB_logo_principal_2000px (2).webp';

const STICKY_OFFSET_PX = 50;

const SUPPORTED_LANGS = ['en', 'ar'] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
const DEFAULT_LANG: Lang = 'en';
const RTL_LANGS: readonly Lang[] = ['ar'];

const STORAGE_LANG = 'language';
const STORAGE_THEME = 'theme';

const isSupportedLang = (value: unknown): value is Lang =>
  typeof value === 'string' && (SUPPORTED_LANGS as readonly string[]).includes(value);

/** Retire ?query, #fragment et slash final. `/#contact` est bien reconnu comme l'accueil. */
const toPath = (url: string): string => url.split(/[?#]/)[0].replace(/\/+$/, '') || '/';

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

@Component({
  selector: 'app-fp-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, TranslateModule],
  templateUrl: './fp-navbar.component.html',
  styleUrl: './fp-navbar.component.scss'
})
export class FpNavbarComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  isSticky = false;
  isDarkTheme = false;
  classApplied = false; // menu mobile ouvert
  activeDropdown: string | null = null;
  isServicesPage = false;
  isHomePage = true; // true uniquement sur la page d'accueil
  currentLang: Lang = DEFAULT_LANG;

  /** Logo affiché : clair/foncé selon le fond réel de la navbar. */
  get logoSrc(): string {
    const onLightBackground = this.isSticky && !this.isDarkTheme;
    return onLightBackground ? LOGO_FOR_LIGHT_BG : LOGO_FOR_DARK_BG;
  }

  // -------------------------------------------------------------------------
  // Cycle de vie
  // -------------------------------------------------------------------------

  ngOnInit(): void {
    this.initLanguage();
    this.initTheme();
    this.updatePageState(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.updatePageState(event.urlAfterRedirects);
        this.onNavItemClick(); // referme menu et sous-menu à chaque navigation
      });

    this.watchScroll();
  }

  /**
   * Écoute du scroll HORS de la zone Angular.
   * `@HostListener('window:scroll')` déclenchait une détection de changements
   * à chaque évènement (des dizaines par seconde). Ici on n'y rentre que
   * quand `isSticky` change réellement (≈ 2 fois par visite).
   */
  private watchScroll(): void {
    const win = this.document.defaultView;
    if (!this.isBrowser || !win) {
      return; // rendu serveur : pas de window
    }

    this.zone.runOutsideAngular(() => {
      fromEvent(win, 'scroll', { passive: true })
        .pipe(
          startWith(null), // état correct au chargement, même si le navigateur restaure un scroll
          map(() => win.scrollY > STICKY_OFFSET_PX),
          distinctUntilChanged(),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((sticky) => this.zone.run(() => (this.isSticky = sticky)));
    });
  }

  // -------------------------------------------------------------------------
  // État de la page
  // -------------------------------------------------------------------------

  private updatePageState(url: string): void {
    const path = toPath(url);

    this.isHomePage = path === '/' || path === '/home';
    // Segment exact : /services, /services/x ou /fr/services, mais pas /web-services
    this.isServicesPage = /(^|\/)services(\/|$)/.test(path);
  }

  // -------------------------------------------------------------------------
  // Menu et sous-menus
  // -------------------------------------------------------------------------

  toggleClass(): void {
    this.classApplied = !this.classApplied;
  }

  toggleDropdown(event: Event, name: string): void {
    event.stopPropagation(); // empêche le clic de remonter jusqu'à onDocumentClick
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  closeDropdown(): void {
    this.activeDropdown = null;
  }

  onNavItemClick(): void {
    this.classApplied = false;
    this.activeDropdown = null;
  }

  /** Clic en dehors du sous-menu : on le ferme. */
  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.activeDropdown) {
      this.closeDropdown();
    }
  }

  /** Échap ferme le sous-menu et le menu mobile (accessibilité clavier). */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activeDropdown || this.classApplied) {
      this.onNavItemClick();
    }
  }

  // -------------------------------------------------------------------------
  // Thème
  // -------------------------------------------------------------------------

  private initTheme(): void {
    const saved = this.readStorage(STORAGE_THEME);

    if (saved === 'dark' || saved === 'light') {
      this.isDarkTheme = saved === 'dark';
      this.applyTheme();
    } else {
      // Pas de préférence enregistrée : on se cale sur l'état réel du DOM
      // (avant, isDarkTheme valait false même si <html> avait déjà .dark)
      this.isDarkTheme = this.document.documentElement.classList.contains('dark');
    }
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    this.writeStorage(STORAGE_THEME, this.isDarkTheme ? 'dark' : 'light');
  }

  private applyTheme(): void {
    this.document.documentElement.classList.toggle('dark', this.isDarkTheme);
  }

  // -------------------------------------------------------------------------
  // Langue
  // -------------------------------------------------------------------------

  private initLanguage(): void {
    const saved = this.readStorage(STORAGE_LANG);
    const current = this.translate.currentLang;

    // Une valeur inconnue en localStorage faisait appeler translate.use('xx')
    this.currentLang = isSupportedLang(saved)
      ? saved
      : isSupportedLang(current)
        ? current
        : DEFAULT_LANG;

    this.translate.use(this.currentLang);
    this.updateDirection();
  }

  /** Passe à la langue suivante de SUPPORTED_LANGS (ajouter « fr » suffit à l'inclure). */
  changeLanguage(): void {
    const index = SUPPORTED_LANGS.indexOf(this.currentLang);
    this.currentLang = SUPPORTED_LANGS[(index + 1) % SUPPORTED_LANGS.length];

    this.translate.use(this.currentLang);
    this.writeStorage(STORAGE_LANG, this.currentLang);
    this.updateDirection();
    this.onNavItemClick();
  }

  private updateDirection(): void {
    const root = this.document.documentElement;
    root.lang = this.currentLang;
    root.dir = RTL_LANGS.includes(this.currentLang) ? 'rtl' : 'ltr';
  }

  // -------------------------------------------------------------------------
  // Stockage (sûr côté serveur et en navigation privée)
  // -------------------------------------------------------------------------

  private readStorage(key: string): string | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null; // stockage bloqué (navigation privée, cookies désactivés)
    }
  }

  private writeStorage(key: string, value: string): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignoré : la préférence ne sera simplement pas mémorisée */
    }
  }
}