import { 
  Component, 
  HostListener, 
  OnInit, 
  OnDestroy 
} from '@angular/core';

import { 
  Router, 
  RouterLink, 
  RouterLinkActive, 
  NavigationEnd 
} from '@angular/router';

import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter, Subscription } from 'rxjs';


@Component({
  selector: 'app-fp-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './fp-navbar.component.html',
  styleUrl: './fp-navbar.component.scss'
})
export class FpNavbarComponent implements OnInit, OnDestroy {

  isSticky = false;
  isDarkTheme = false;
  classApplied = false;
  activeDropdown: string | null = null;
  isServicesPage = false;

  // true uniquement sur la page d'accueil
  isHomePage = true;

  logoSrc = '/images/CB_logo_principal_2000px (2).png';
  currentLang = 'en';

  private routerSubscription!: Subscription;

  constructor(
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('language');
    this.currentLang = savedLang || this.translate.currentLang || 'en';
    this.translate.use(this.currentLang);
    this.updateDirection();
    this.updatePageState(this.router.url);

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.updatePageState(url);
      });
  }

  private updatePageState(url: string): void {
    const cleanUrl = url.split('?')[0];

    this.isServicesPage = cleanUrl.includes('/services');
    this.isHomePage = cleanUrl === '/' || cleanUrl === '/home';

    this.updateLogo(url);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isSticky = window.scrollY > 50;

    if (this.isHomePage) {
      this.logoSrc = window.scrollY > 100
        ? '/images/CB_logo_principal_2000px (2).png'
        : '/images/CB_logo_principal_2000px (2).png';
    }
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    document.documentElement.classList.toggle('dark', this.isDarkTheme);
  }

  toggleClass(): void {
    this.classApplied = !this.classApplied;
  }

  toggleDropdown(event: Event, name: string): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  closeDropdown(): void {
    this.activeDropdown = null;
  }

  onNavItemClick(): void {
    this.classApplied = false;
    this.activeDropdown = null;
  }

  changeLanguage(): void {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('language', this.currentLang);
    this.updateDirection();
    this.onNavItemClick();
  }

  private updateDirection(): void {
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  private updateLogo(url: string): void {
    const cleanUrl = url.split('?')[0];
    const isHome = cleanUrl === '/' || cleanUrl === '/home';

    if (isHome) {
      this.logoSrc = window.scrollY > 100
        ? '/images/CB_logo_principal_2000px (2).png'
        : '/images/CB_logo_principal_2000px (2).png';
    } else {
      this.logoSrc = '/images/CB_logo_principal_2000px (2).png';
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}