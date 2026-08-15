import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FpFooterComponent } from './common/fp-footer/fp-footer.component';
import { FpNavbarComponent } from './common/fp-navbar/fp-navbar.component';
import { ToggleService } from '../common/header/toggle.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-front-pages',
    standalone: true,
    imports: [RouterOutlet, FpNavbarComponent, FpFooterComponent, CommonModule],
    templateUrl: './front-pages.component.html',
    styleUrl: './front-pages.component.scss'
})
export class FrontPagesComponent {
    showScrollButton = false;

    constructor(
        public toggleService: ToggleService
    ) {}

    ngOnInit(): void {
        // Initialize theme and direction on component load
        this.toggleService.initializeTheme();
    }

    // Toggle theme between light and dark
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Toggle direction between LTR and RTL
    toggleDirection() {
        this.toggleService.toggleDirection();
    }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 100;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
