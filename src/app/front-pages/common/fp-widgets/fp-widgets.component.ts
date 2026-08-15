import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Widget {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-fp-widgets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fp-widgets.component.html',
  styleUrl: './fp-widgets.component.scss'
})
export class FpWidgetsComponent {
  widgets: Widget[] = [
    {
      icon: 'fa-solid fa-rocket',
      title: '',
      description: ''
    },
    {
      icon: 'fa-solid fa-shield-halved',
      title: '',
      description: '.'
    },
    {
      icon: 'fa-solid fa-lightbulb',
      title: '',
      description: '.'
    }
  ];
}
