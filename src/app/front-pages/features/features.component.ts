import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FpTestimonialsComponent } from '../common/fp-testimonials/fp-testimonials.component';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-features',
    standalone: true,
    imports: [FpTestimonialsComponent, CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './features.component.html',
    styleUrl: './features.component.scss'
})
export class FeaturesComponent {

  services = [
    {
      title: 'Website Design and Development',
      url:'services',
      image: 'images/services/web-develop.webp',
      description: 'We craft modern, responsive websites tailored to your brand, this includes UI/UX design, SEO, CMS integration, and ongoing support.',
    },
    {
      title: 'Mobile App Development',
      url:'mobile-development',
      image: 'images/services/mobile-dev.webp',
      description: 'We build native and cross-platform mobile apps from prototyping to publishing, we ensure a seamless experience.',
    },
    {
      title: 'IT Consulting',
      url:'tech-consulting',
      image: 'images/services/it-consulting.webp',
      description: 'Our experts guide your digital transformation. We assist with architecture, cloud strategy, and optimization.',
    },
    {
      title: 'UI/UX Design',
      url:'ui-ux-design',
      image: 'images/services/ux-ui-design.webp',
      description: 'We design interfaces that blend beauty with usability, every interaction is crafted for simplicity and satisfaction.',
    },
  ];
}
