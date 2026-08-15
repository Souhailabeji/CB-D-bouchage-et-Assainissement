import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-fp-team',
    standalone: true,
    imports: [CommonModule ,CarouselModule],
    templateUrl: './fp-team.component.html',
    styleUrl: './fp-team.component.scss'
})
export class FpTeamComponent {

    teamMembers = [
        {
          image: 'images/front-pages/team1.webp',
          name: 'Michael Johnson',
          role: 'CEO',
        },
        {
          image: 'images/front-pages/team2.webp',
          name: 'Emily Davis',
          role: 'Project Manager',
        },
        {
          image: 'images/front-pages/team3.webp',
          name: 'Daniel Lee',
          role: 'Sales Team Lead',
        },
        {
          image: 'images/front-pages/team4.webp',
          name: 'Olivia John',
          role: 'Frontend Lead',
        },
      ];
      
    // Owl Carousel
    teamSlides: OwlOptions = {
		nav: true,
		loop: true,
		margin: 25,
		dots: false,
		autoplay: false,
		smartSpeed: 1000,
		autoplayHoverPause: true,
        
        navText: [
			"<i class='ri-arrow-left-line'></i>",
			"<i class='ri-arrow-right-line'></i>"
		],
        
        responsive: {
            0: {
                items: 1
            },
            515: {
                items: 2
            },
            695: {
                items: 2
            },
            935: {
                items: 3
            },
            1200: {
                items: 3
            }
        }
    }

}
