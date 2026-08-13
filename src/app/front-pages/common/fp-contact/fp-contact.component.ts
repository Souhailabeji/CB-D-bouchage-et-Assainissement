import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

interface ContactErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

@Component({
  selector: 'app-fp-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './fp-contact.component.html',
  styleUrls: ['./fp-contact.component.scss']
})
export class FpContactComponent {

  @ViewChild('contactForm') contactForm?: NgForm;

  // Modèle du formulaire
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  message = '';
  subject: 'general' | 'web' | 'uiux' | 'other' = 'general';

  // État UI
  isSending = false;
  submitted = false;
  errors: ContactErrors = {};

  // Regex de validation
  private readonly namePattern = /^[A-Za-zÀ-ÿ\s'-]{2,}$/;
  private readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  private readonly phonePattern = /^[0-9]{8}$/;

  constructor(
    private translate: TranslateService,
    private http: HttpClient
  ) {}

  /**
   * Valide tous les champs et remplit this.errors.
   * Retourne true si le formulaire est valide.
   */
  private validate(): boolean {
    const errors: ContactErrors = {};

    if (!this.namePattern.test(this.firstName.trim())) {
      errors.firstName = this.translate.instant('CONTACT.errorFirstName');
    }

    if (!this.namePattern.test(this.lastName.trim())) {
      errors.lastName = this.translate.instant('CONTACT.errorLastName');
    }

    if (!this.emailPattern.test(this.email.trim())) {
      errors.email = this.translate.instant('CONTACT.errorEmail');
    }

    if (!this.phonePattern.test(this.phone.trim())) {
      errors.phone = this.translate.instant('CONTACT.errorPhone');
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  sendForm(): void {
    this.submitted = true;

    if (this.isSending) {
      return; // évite les doubles envois
    }

    if (!this.validate()) {
      return;
    }

    const payload = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      subject: this.subject,
      message: this.message.trim()
    };

    this.isSending = true;

    this.http.post('/api/contact', payload)
      .pipe(finalize(() => (this.isSending = false)))
      .subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError()
      });
  }

  private handleSuccess(): void {
    // Idéalement remplacer par un toast/snackbar plutôt qu'un alert
    alert(this.translate.instant('CONTACT.success'));
    this.resetForm();
  }

  private handleError(): void {
    alert(this.translate.instant('CONTACT.errorSend'));
  }

  private resetForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = '';
    this.message = '';
    this.subject = 'general';
    this.errors = {};
    this.submitted = false;
    this.contactForm?.resetForm();
  }
}