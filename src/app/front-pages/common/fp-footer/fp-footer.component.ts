import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-fp-footer',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './fp-footer.component.html',
  styleUrl: './fp-footer.component.scss'
})
export class FpFooterComponent {

  constructor(private router: Router) {}

  socialLinks = [
    { icon: 'ri-facebook-fill', url: '#' },
    { icon: 'ri-linkedin-fill', url: 'https://www.linkedin.com/company/qode-technologiesqr/' },
    { icon: 'ri-dribbble-fill', url: '#' }
  ];

  descriptionKeys = [
    'FOOTER.description1',
    'FOOTER.description2'
  ];

  companyLinks = [
    { text: 'FOOTER.presentation', url: '/about-us' },
    { text: 'FOOTER.projects', url: '/projects' }
  ];

  servicesLinks = [
    { text: 'FOOTER.webDevelopment', url: '/webdevelopment' },
    { text: 'FOOTER.mobileDevelopment', url: '/mobileapps' },
    { text: 'FOOTER.uiux', url: '/uixdesign' },
    { text: 'FOOTER.itConsulting', url: '/itconsulting' }
  ];

  quickLinks = [
    { text: 'FOOTER.contact', url: '/contact' }
  ];

  copyrightKey = 'FOOTER.copyright';

  trackByUrl(index: number, item: { text: string; url: string }): string {
    return item.url;
  }

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
