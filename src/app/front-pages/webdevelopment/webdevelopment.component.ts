import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-webdevelopment',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './webdevelopment.component.html',
  styleUrl: './webdevelopment.component.scss'
})
export class WebdevelopmentComponent {

  constructor(public translate: TranslateService) {}

  get isRTL(): boolean {
    return this.translate.currentLang === 'ar';
  }

}
