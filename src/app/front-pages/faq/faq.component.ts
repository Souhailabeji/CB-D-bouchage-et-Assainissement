import { Component } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';
import { FpFaqComponent } from '../common/fp-faq/fp-faq.component';
import { FpCtaComponent } from '../common/fp-cta/fp-cta.component';

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [FpFaqComponent, FpCtaComponent, NgClass, CommonModule],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss'
})
export class FaqComponent {
    faqItems = [
        { question: 'What is Qode Technology?', answer: 'Qode Technology is a comprehensive project management software...' },
        { question: 'What features does Qode Technology offer?', answer: 'It offers task tracking, team collaboration...' },
        { question: 'How can Qode Technology benefit my team?', answer: 'It enhances communication, tracks progress...' },
        { question: 'Is Qode Technologysuitable for small businesses?', answer: 'Yes, it scales well for all business sizes...' },
        { question: 'Can I customize Qode Technology to fit my team\'s needs?', answer: 'Absolutely, it is highly customizable...' },
        { question: 'Is Qode Technology cloud-based or on-premises?', answer: 'It supports both deployment types...' }
      ];
      openSectionIndex: number = 0;
      toggleSection(index: number): void {
          if (this.openSectionIndex === index) {
              this.openSectionIndex = -1;
          } else {
              this.openSectionIndex = index;
          }
      }
      isSectionOpen(index: number): boolean {
          return this.openSectionIndex === index;
      }
}