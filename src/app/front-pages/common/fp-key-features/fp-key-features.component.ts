import { CommonModule, isPlatformBrowser } from '@angular/common';
import { 
  Component, 
  OnInit, 
  OnDestroy, 
  Inject, 
  PLATFORM_ID,
  AfterViewInit
} from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import AOS from 'aos';


@Component({
  selector: 'app-fp-key-features',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule
  ],
  templateUrl: './fp-key-features.component.html',
  styleUrl: './fp-key-features.component.scss'
})


export class FpKeyFeaturesComponent 
implements OnInit, AfterViewInit, OnDestroy {


  isDarkMode = false;

  activeIndex = -1;


  private observer?: MutationObserver;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}





  ngOnInit(): void {


    if (!isPlatformBrowser(this.platformId)) {
      return;
    }



    this.checkTheme();



    this.observer = new MutationObserver(() => {

      this.checkTheme();

    });



    this.observer.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ['class']
      }
    );


  }





  ngAfterViewInit(): void {


    if (!isPlatformBrowser(this.platformId)) {
      return;
    }



    setTimeout(() => {


      AOS.init({

        once: true,

        offset: window.innerWidth < 768 ? 20 : 80,

        duration: window.innerWidth < 768 ? 700 : 1000,

        easing: 'ease-out-cubic'

      });



      AOS.refresh();


    }, 150);



  }






  ngOnDestroy(): void {


    this.observer?.disconnect();


    if (isPlatformBrowser(this.platformId)) {

      AOS.refreshHard();

    }


  }







  private checkTheme(): void {


    if (!isPlatformBrowser(this.platformId)) {
      return;
    }



    this.isDarkMode =
      document.documentElement.classList.contains('dark');


  }







  toggleAccordion(index: number): void {


    this.activeIndex =
      this.activeIndex === index
      ? -1
      : index;


  }






  isActive(index:number): boolean {


    return this.activeIndex === index;


  }



}