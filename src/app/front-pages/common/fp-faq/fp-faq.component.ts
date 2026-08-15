import { Component } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';

@Component({
    selector: 'app-fp-faq',
    standalone: true,
    imports: [NgClass, CommonModule],
    templateUrl: './fp-faq.component.html',
    styleUrl: './fp-faq.component.scss'
})
export class FpFaqComponent {
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
