import {
  AfterViewInit,
  Component,
  DestroyRef,
  Inject,
  Renderer2,
  PLATFORM_ID,
  HostListener
} from '@angular/core';

import {
  CommonModule,
  DOCUMENT,
  isPlatformBrowser
} from '@angular/common';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-fp-banner',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule
  ],

  templateUrl: './fp-banner.component.html',
  styleUrls: ['./fp-banner.component.scss']
})


export class FpBannerComponent implements AfterViewInit {



  images: string[] = [

    'images/browsers/image01.webp'

  ];


  // --- NAVBAR STATE ---

  isSticky = false;

  classApplied = false;

  currentLang: string;





  constructor(

    @Inject(PLATFORM_ID)
    private platformId: object,


    @Inject(DOCUMENT)
    private document: Document,


    private renderer: Renderer2,


    private destroyRef: DestroyRef,


    private translate: TranslateService

  ) {

    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'en';

  }







  ngAfterViewInit(): void {


    if (!isPlatformBrowser(this.platformId)) {

      return;

    }



    this.animateCounter(
      'projects-count',
      8,
      3000
    );



    this.animateCounter(
      'clients-count',
      11,
      3000
    );



    this.destroyRef.onDestroy(() => {

      // nettoyage automatique Angular

    });


  }







  private animateCounter(

    elementId: string,

    targetValue: number,

    duration: number

  ): void {



    if (!isPlatformBrowser(this.platformId)) {

      return;

    }



    const element =
      this.document.getElementById(elementId);



    if (!element) {

      return;

    }




    let currentValue = 0;



    const increment =
      targetValue / (duration / 16);





    const updateCounter = () => {



      currentValue += increment;



      if (currentValue >= targetValue) {


        this.renderer.setProperty(

          element,

          'textContent',

          targetValue.toString()

        );


        return;

      }






      this.renderer.setProperty(

        element,

        'textContent',

        Math.floor(currentValue).toString()

      );




      requestAnimationFrame(updateCounter);


    };




    requestAnimationFrame(updateCounter);


  }





  // --- NAVBAR LOGIC ---


  @HostListener('window:scroll', [])
  onWindowScroll(): void {

    if (!isPlatformBrowser(this.platformId)) {

      return;

    }

    this.isSticky = window.scrollY > 50;

  }



  toggleClass(): void {

    this.classApplied = !this.classApplied;

  }



  closeDropdown(): void {

    this.classApplied = false;

  }



  onNavItemClick(): void {

    this.classApplied = false;

  }



  changeLanguage(): void {

    const newLang = this.currentLang === 'en' ? 'ar' : 'en';

    this.currentLang = newLang;

    this.translate.use(newLang);

  }



}
