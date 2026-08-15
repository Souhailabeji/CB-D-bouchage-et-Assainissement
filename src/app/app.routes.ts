import { Routes } from '@angular/router';

import { FrontPagesComponent } from './front-pages/front-pages.component';
import { HomeComponent } from './front-pages/home/home.component';
import { AboutUsComponent } from './front-pages/about-us/about-us.component';
import { FpServicesComponent } from './front-pages/service/services.component';
import { ProjectsComponent } from './front-pages/projects/projects.component';
import { FpContactComponent } from './front-pages/common/fp-contact/fp-contact.component';
import { ProjectdetailsComponent } from './front-pages/project-details/project-details.component';

import { WebdevelopmentComponent } from './front-pages/webdevelopment/webdevelopment.component';
import { MobileappsComponent } from './front-pages/mobileapps/mobileapps.component';
import { ItconsultingComponent } from './front-pages/itconsulting/itconsulting.component';
import { UixdesignComponent } from './front-pages/uixdesign/uixdesign.component';
import { PadelComponent } from './front-pages/padel/padel.component';
import { CarsComponent } from './front-pages/cars/cars.component';
import { AppComponent } from './front-pages/app/app.component';

import { BlankPageComponent } from './pages/blank-page/blank-page.component';


export const routes: Routes = [

  {
    path: '',
    component: FrontPagesComponent,

    children: [

      // ==============================
      // HOME
      // ==============================

      {
        path: '',
        component: HomeComponent
      },


      // ==============================
      // CONTACT
      // ==============================

      {
        path: 'contact',
        component: FpContactComponent
      },


      // ==============================
      // SERVICES
      // ==============================

      {
        path: 'services',
        component: FpServicesComponent
      },


      // ==============================
      // ABOUT
      // ==============================

      {
        path: 'about-us',
        component: AboutUsComponent
      },


      // ==============================
      // PROJECTS / RÉGIONS
      // ==============================

      {
        path: 'projects',
        component: ProjectsComponent
      },


      // ==============================
      // PROJECT DETAILS
      // ==============================

      {
        path: 'project-details/:region',
        component: ProjectdetailsComponent
      },


      // ==============================
      // AUTRES PAGES
      // ==============================

      {
        path: 'webdevelopment',
        component: WebdevelopmentComponent
      },

      {
        path: 'mobileapps',
        component: MobileappsComponent
      },

      {
        path: 'itconsulting',
        component: ItconsultingComponent
      },

      {
        path: 'uixdesign',
        component: UixdesignComponent
      },

      {
        path: 'padel',
        component: PadelComponent
      },

      {
        path: 'cars',
        component: CarsComponent
      },

      {
        path: 'app',
        component: AppComponent
      }

    ]
  },


  // ==============================
  // ÎLE-DE-FRANCE
  // ==============================

  {
    path: 'blank-page',
    component: BlankPageComponent
  },


  // ==============================
  // DEUXIÈME PAGE RÉGION
  // ==============================

  


  // ==============================
  // PAGE NON TROUVÉE
  // ==============================

  {
    path: '**',
    redirectTo: ''
  }

];
