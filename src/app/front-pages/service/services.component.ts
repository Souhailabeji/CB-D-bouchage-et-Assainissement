import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class FpServicesComponent implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.observeItems();
  }

  private observeItems(): void {
    const items: NodeListOf<HTMLElement> =
      this.el.nativeElement.querySelectorAll('.services-item');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((item) => {
      observer.observe(item);

      // Fix: si l'élément est déjà dans le viewport au moment du montage,
      // l'IntersectionObserver peut ne jamais déclencher son callback
      // (aucun changement d'intersection détecté) => is-visible n'est
      // jamais ajouté et l'item reste à opacity: 0.
      const rect = item.getBoundingClientRect();
      const isAlreadyInViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (isAlreadyInViewport) {
        item.classList.add('is-visible');
        observer.unobserve(item);
      }
    });
  }
}
