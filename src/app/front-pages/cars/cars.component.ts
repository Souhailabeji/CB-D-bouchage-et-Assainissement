import {
  Component,
  ElementRef,
  HostListener,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-erp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss'
})
export class CarsComponent implements AfterViewInit {


  // ==============================
  // VIDEO HERO
  // ==============================
  heroVideo = 'images/camera2.webp';



  // ==============================
  // CAROUSEL IMAGES
  // ==============================
  problemImages = [
    {
      src: 'images/projet.webp',
      alt: 'Custom car modification design preview'
    }
  ];



  // ==============================
  // CAROUSEL REFERENCES
  // ==============================
  @ViewChild('carouselWindow')
  carouselWindowRef?: ElementRef<HTMLElement>;

  @ViewChild('carouselTrack')
  carouselTrackRef?: ElementRef<HTMLElement>;



  // ==============================
  // CAROUSEL STATE
  // ==============================
  private slideWidth = 0;

  index = 0;



  // Position du carousel
  get trackTransform(): string {
    return `translateX(${-this.index * this.slideWidth}px)`;
  }



  // ==============================
  // INIT
  // ==============================
  ngAfterViewInit(): void {

    setTimeout(() => {
      this.updateSlideWidth();
    });

  }



  // ==============================
  // RESPONSIVE
  // ==============================
  @HostListener('window:resize')
  onResize(): void {

    this.updateSlideWidth();

  }



  // ==============================
  // CALCUL LARGEUR SLIDE
  // ==============================
  private updateSlideWidth(): void {


    const track = this.carouselTrackRef?.nativeElement;


    if (!track) return;



    const firstImage =
      track.querySelector('img') as HTMLElement | null;



    if (!firstImage) return;



    const imageWidth =
      firstImage.getBoundingClientRect().width;



    const gap =
      parseFloat(
        getComputedStyle(track).gap || '0'
      );



    this.slideWidth = imageWidth + gap;

  }



  // ==============================
  // PREVIOUS SLIDE
  // ==============================
  prevSlide(): void {


    if (this.problemImages.length <= 1) return;



    this.index--;



    if (this.index < 0) {

      this.index = this.problemImages.length - 1;

    }

  }




  // ==============================
  // NEXT SLIDE
  // ==============================
  nextSlide(): void {


    if (this.problemImages.length <= 1) return;



    this.index++;



    if (this.index > this.problemImages.length - 1) {

      this.index = 0;

    }

  }


}
