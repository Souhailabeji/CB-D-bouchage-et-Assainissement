import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-fp-costumers',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './fp-costumers.component.html',
  styleUrl: './fp-costumers.component.scss',
  animations: [
    [
      trigger('fadeSlide', [
        state('void', style({
          opacity: 0,
          maxHeight: '0px',
          overflow: 'hidden'
        })),
        state('*', style({
          opacity: 1,
          maxHeight: '500px' 
        })),
        transition('void => *', [
          animate('300ms ease-in-out')
        ]),
        transition('* => void', [
          animate('300ms ease-in-out')
        ])
      ])
    ]
  ]
})
export class FpCostumersComponent {

}
