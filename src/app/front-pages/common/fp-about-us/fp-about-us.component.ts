import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';


interface Project {

  title: string;
  alt: string;
  image: string;
  link: string;
  ring?: boolean;

}



interface Stat {

  value: string;
  label: string;

}



@Component({

  selector: 'app-fp-about-us',

  standalone: true,

  imports: [

    CommonModule,

    TranslateModule

  ],

  templateUrl: './fp-about-us.component.html',

  styleUrl: './fp-about-us.component.scss'

})


export class FpAboutUsComponent {



  // Première ligne des projets

  projectsRow1: Project[] = [

    {

      title: 'WORK.parcel',

      alt: 'WORK.parcelAlt',

      image: '/images/rayenhome.webp',

      link: '#'

    },


    {

      title: 'WORK.restaurant',

      alt: 'WORK.restaurantAlt',

      image: '/images/rayenhome2.webp',

      link: '#'

    }


  ];






  // Deuxième ligne des projets

  projectsRow2: Project[] = [

    {

      title: 'WORK.cars',

      alt: 'WORK.carsAlt',

      image: '/images/rayenhome3.webp',

      link: '#'

    },


    {

      title: 'WORK.padel',

      alt: 'WORK.padelAlt',

      image: '/images/rayenhome4.webp',

      link: '#',

      ring: true

    }


  ];







  // Statistiques

  stats: Stat[] = [

    {

      value: '1M+',

      label: 'WORK.stat1'

    },


    {

      value: '92%',

      label: 'WORK.stat2'

    },


    {

      value: '4.9/5.0',

      label: 'WORK.stat3'

    }


  ];



}
