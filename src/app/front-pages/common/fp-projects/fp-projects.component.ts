import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  details: string[];
}

@Component({
  selector: 'app-fp-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './fp-projects.component.html',
  styleUrls: ['./fp-projects.component.scss'],
  animations: [
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
})

export class FpProjectsComponent {
   projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A scalable online store with seamless payment integration and user-friendly navigation.',
      technologies: ['React', 'Node.js', 'MongoDB'],
      image: 'images/projects.gif',
      isHovered: false
    },
    {
      title: 'Mobile Banking App',
      description: 'A secure mobile app for banking with real-time transactions and intuitive design.',
      technologies: ['Flutter', 'Firebase'],
      image: 'images/project2.gif',
      isHovered: false
    },
    {
      title: 'Corporate Website',
      description: 'A modern showcase website highlighting a corporate brand with responsive design.',
      technologies: ['HTML', 'Tailwind CSS', 'JavaScript'],
      image: 'images/project3.gif',
      isHovered: false
    },
    {
      title: 'AI-Powered Dashboard',
      description: 'An interactive dashboard leveraging AI for data visualization and analytics.',
      technologies: ['Python', 'Django', 'TensorFlow'],
      image: 'images/project4.gif',
      isHovered: false
    }
  ];
  selectedProject: Project | null = null;

  /* Sélectionner un projet
  selectProject(projectId: string) {
    this.selectedProject = this.projects.find(project => project.id === projectId) || null;
  }*/

  // Réinitialiser la sélection
  clearSelection() {
    this.selectedProject = null;
  }
}


