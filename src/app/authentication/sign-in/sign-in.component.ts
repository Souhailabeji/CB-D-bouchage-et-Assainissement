import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ToggleService } from '../../common/header/toggle.service';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [RouterLink, NgClass, CommonModule, ReactiveFormsModule, SignUpComponent],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
    @Input() isOpen = false;
    @Output() closeModal = new EventEmitter<void>();
    @Output() closePopup = new EventEmitter<void>();
    
    showLoginPopup = true;
    isLoginModalOpen = false;
    loginForm: FormGroup;
    isLoginMode: boolean = true;
    selectedSignUpType: 'client' | 'worker' | null = null;
    // Password visibility
    password = '';
    isPasswordVisible = false;

    constructor(
        private fb: FormBuilder,
        public toggleService: ToggleService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [false]
        });
    }

    ngOnInit(): void {
        this.toggleService.initializeTheme();
    }

    onCloseModal() {
        this.closeModal.emit();
    }

    onSubmit() {
        if (this.loginForm.valid) {
            console.log('Form submitted:', this.loginForm.value);
            // Add your authentication logic here
            this.onCloseModal();
        }
    }

    toggleAuthMode() {
        this.isLoginMode = !this.isLoginMode;
        this.selectedSignUpType = null;
      }

    loginWithGoogle() {
        console.log('Login with Google');
        // Implement Google auth
    }

    loginWithGithub() {
        console.log('Login with GitHub');
        // Implement GitHub auth
    }
    
    selectSignUpType(type: 'client' | 'worker') {
        this.selectedSignUpType = type;
      }

    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    toggleDirection() {
        this.toggleService.toggleDirection();
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    onPasswordInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.password = inputElement.value;
    }

    openLoginPopup() {
        this.showLoginPopup = true;
    }

    closeLoginPopup() {
        this.showLoginPopup = false;
        this.closePopup.emit();
    }
    onBackdropClick(event: MouseEvent) {
        this.closeLoginPopup();
      }
}