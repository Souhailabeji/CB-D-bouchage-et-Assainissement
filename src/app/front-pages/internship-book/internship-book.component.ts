import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FpCostumersComponent } from '../common/fp-costumers/fp-costumers.component';
import { FpNavbarComponent } from '../common/fp-navbar/fp-navbar.component';
import { FpTestimonialsComponent } from '../common/fp-testimonials/fp-testimonials.component';

@Component({
  selector: 'app-internship-book',
  standalone: true,
  imports: [RouterOutlet, FpCostumersComponent, FpNavbarComponent, FpTestimonialsComponent, RouterLink],
  templateUrl: './internship-book.component.html',
  styleUrl: './internship-book.component.scss'
})
export class InternshipBookComponent implements AfterViewInit{
  @ViewChild('internshipTab') internshipTab!: ElementRef<HTMLButtonElement>;
  @ViewChild('pfeTab') pfeTab!: ElementRef<HTMLButtonElement>;
  @ViewChild('internshipContent') internshipContent!: ElementRef<HTMLDivElement>;
  @ViewChild('pfeContent') pfeContent!: ElementRef<HTMLDivElement>;
  @ViewChild('paginationText') paginationText!: ElementRef<HTMLParagraphElement>;
  @ViewChild('contentArea') contentArea!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    if (!this.internshipTab || !this.pfeTab || !this.internshipContent || !this.pfeContent || !this.paginationText) {
      console.error('One or more elements not found');
      return;
    }

    // Set initial state
    this.internshipTab.nativeElement.classList.add('underline');
    this.internshipContent.nativeElement.style.display = 'grid';
    this.pfeContent.nativeElement.style.display = 'none';
    this.paginationText.nativeElement.textContent = 'Showing 6 of 6 results';

    // Tab click handlers
    this.internshipTab.nativeElement.addEventListener('click', () => {
      this.internshipTab.nativeElement.classList.add('underline');
      this.pfeTab.nativeElement.classList.remove('underline');
      this.internshipContent.nativeElement.style.display = 'grid';
      this.pfeContent.nativeElement.style.display = 'none';
      this.paginationText.nativeElement.textContent = 'Showing 6 of 6 results';
    });

    this.pfeTab.nativeElement.addEventListener('click', () => {
      this.pfeTab.nativeElement.classList.add('underline');
      this.internshipTab.nativeElement.classList.remove('underline');
      this.pfeContent.nativeElement.style.display = 'grid';
      this.internshipContent.nativeElement.style.display = 'none';
      this.paginationText.nativeElement.textContent = 'Showing 2 of 2 results';
    });
  }
}
