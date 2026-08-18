import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-padel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './padel.component.html',
  styleUrls: ['./padel.component.scss']
})
export class PadelComponent {

  problemImages: CarouselImage[] = [
    {
      src: 'images/ca1.webp',
      alt: 'Padel court booking screen'
    },
    {
      src: 'images/ca2.webp',
      alt: 'Padel AI match analysis screen'
    },
    {
      src: 'images/ca3.webp',
      alt: 'Padel court information'
    },
    {
      src: 'images/ca4.webp',
      alt: 'Padel court booked'
    }
  ];

  // Images répétées pour créer une boucle infinie
  loopImages: CarouselImage[] = [];

  // Largeur d'une image
  readonly imageWidth = 320;

  // Espace entre les images
  readonly gap = 30;

  // Déplacement d'UNE image
  readonly slideWidth = this.imageWidth + this.gap;

  // Position de départ au milieu
  index = this.problemImages.length * 50;

  transition = true;

  constructor() {

    // Répète les images pour créer une longue piste
    for (let i = 0; i < 100; i++) {
      this.loopImages.push(...this.problemImages);
    }

  }

  get trackTransform(): string {
    return `translate3d(-${this.index * this.slideWidth}px, 0, 0)`;
  }

  nextSlide(): void {

    this.index++;

    this.checkInfiniteLoop();

  }

  prevSlide(): void {

    this.index--;

    this.checkInfiniteLoop();

  }

  private checkInfiniteLoop(): void {

    const middle = this.problemImages.length * 50;

    const max = this.problemImages.length * 80;

    const min = this.problemImages.length * 20;

    if (this.index >= max || this.index <= min) {

      this.transition = false;

      this.index = middle;

      setTimeout(() => {
        this.transition = true;
      }, 20);

    }

  }

}
