import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FpNavbarComponent } from '../common/fp-navbar/fp-navbar.component';
import { FpAboutUsComponent } from '../common/fp-about-us/fp-about-us.component';
import { FpTeamComponent } from '../common/fp-team/fp-team.component';


@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    TranslateModule,
    FpNavbarComponent,
    FpAboutUsComponent,
    FpTeamComponent
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {


  missionItems = [
    {
      number: '01',
      text: 'ABOUT.MISSION.ONE'
    },
    {
      number: '02',
      text: 'ABOUT.MISSION.TWO'
    },
    {
      number: '03',
      text: 'ABOUT.MISSION.THREE'
    },
    {
      number: '04',
      text: 'ABOUT.MISSION.FOUR'
    }
  ];


  toggleAccordion(id: string): void {

    const element = document.getElementById(id);

    if (element) {
      element.classList.toggle('hidden');
    }

  }

}