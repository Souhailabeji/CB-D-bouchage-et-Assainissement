import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  problemImages: CarouselImage[] = [
    {
      src: '/images/app.png',
      alt: 'Application screenshot'
    },
    {
      src: '/images/app2.png',
      alt: 'Navigation screenshot'
    },
    {
      src: '/images/app3.png',
      alt: 'Home screen'
    },
    {
      src: '/images/app4.png',
      alt: 'User home'
    }
  ];

  // Tableau utilisé par le carousel
  loopImages: CarouselImage[] = [];

  // Largeur d'une slide
  slideWidth = 340;

  // Position de départ
  currentIndex = 0;

  // Animation
  transition = true;

  constructor() {

    // Répète les images 100 fois
    for (let i = 0; i < 100; i++) {
      this.loopImages.push(...this.problemImages);
    }

    // Démarre au milieu
    this.currentIndex = this.problemImages.length * 50;
  }

  get trackTransform(): string {
    return `translateX(-${this.currentIndex * this.slideWidth}px)`;
  }

  nextSlide(): void {

    this.currentIndex++;

    // Revient discrètement au milieu
    if (this.currentIndex >= this.problemImages.length * 90) {
      this.transition = false;

      this.currentIndex = this.problemImages.length * 50;

      setTimeout(() => {
        this.transition = true;
      });
    }
  }

  prevSlide(): void {

    this.currentIndex--;

    if (this.currentIndex <= this.problemImages.length * 10) {
      this.transition = false;

      this.currentIndex = this.problemImages.length * 50;

      setTimeout(() => {
        this.transition = true;
      });
    }
  }

}