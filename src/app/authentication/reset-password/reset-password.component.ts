import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ToggleService } from '../../common/header/toggle.service';
import { CommonModule, NgClass, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  isDarkMode = false;
  constructor(
    public toggleService: ToggleService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.toggleService.initializeTheme();
    if (isPlatformBrowser(this.platformId)){
      this.isDarkMode = document.documentElement.classList.contains('dark');}
    //this.isResetPasswordPopupOpen = true; 
  }

  // Toggle theme between light and dark
  toggleTheme() {
    this.toggleService.toggleTheme();
    this.isDarkMode = !this.isDarkMode;
  }

  // Toggle direction between LTR and RTL
  toggleDirection() {
    this.toggleService.toggleDirection();
  }

  /* Reset Password Popup
  isResetPasswordPopupOpen = false;
  closeResetPasswordPopup() {
    this.isResetPasswordPopupOpen = false;
    this.router.navigate(['/authentication']); 
  }*/

  // Form Data
  password1 = ''; 
  password2 = ''; 
  password3 = ''; 
  isPassword1Visible = false;
  isPassword2Visible = false;
  isPassword3Visible = false;

  togglePassword1Visibility(): void {
    this.isPassword1Visible = !this.isPassword1Visible;
  }
  togglePassword2Visibility(): void {
    this.isPassword2Visible = !this.isPassword2Visible;
  }
  togglePassword3Visibility(): void {
    this.isPassword3Visible = !this.isPassword3Visible;
  }

  onResetPasswordSubmit() {
    if (this.password1 && this.password2 && this.password3) {
      if (this.password2 === this.password3) {
        console.log('Reset Password Data:', { oldPassword: this.password1, newPassword: this.password2 });
        //this.isResetPasswordPopupOpen = false;
        this.password1 = '';
        this.password2 = '';
        this.password3 = '';
        this.router.navigate(['/authentication']); 
      } else {
        console.log('New password and confirm password do not match');
      }
    }
  }
}