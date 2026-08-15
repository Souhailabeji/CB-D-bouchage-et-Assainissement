import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ToggleService } from '../../common/header/toggle.service';
import { CommonModule, NgClass, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  constructor(
    public toggleService: ToggleService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.toggleService.initializeTheme();
    if(isPlatformBrowser(this.platformId)){
    this.isDarkMode = document.documentElement.classList.contains('dark');}
    this.isForgotPasswordPopupOpen = true; 
  }

  // Toggle theme between light and dark
  isDarkMode = false;
  toggleTheme() {
    this.toggleService.toggleTheme();
    this.isDarkMode = !this.isDarkMode;
  }

  // Toggle direction between LTR and RTL
  toggleDirection() {
    this.toggleService.toggleDirection();
  }

  // Forgot Password Popup
  isForgotPasswordPopupOpen = false;
  closeForgotPasswordPopup() {
    this.isForgotPasswordPopupOpen = false;
    this.router.navigate(['/']); 
}

  // Form Data
  email = '';

  onForgotPasswordSubmit() {
    if (this.email) {
      console.log('Forgot Password Data:', { email: this.email });
      this.isForgotPasswordPopupOpen = false;
      this.email = '';
      this.router.navigate(['/set-password']); }
  }
}
