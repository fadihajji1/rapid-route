import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  passwordVisible = false;
  confirmPasswordVisible = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    readonly theme: ThemeService
  ) {}

  submit(): void {
    if (!this.name.trim() || !this.email.trim() || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Complete all fields to continue.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.passwordStrength < 3) {
      this.errorMessage = 'Choose a stronger password before continuing.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.authService.register({
      name: this.name.trim(),
      email: this.email.trim()
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        this.submitting = false;
        this.errorMessage = 'We could not create your profile. Check your details and try again.';
      }
    });
  }

  get passwordStrength(): number {
    return [
      this.password.length >= 8,
      /[A-Z]/.test(this.password),
      /[a-z]/.test(this.password),
      /\d/.test(this.password),
      /[^A-Za-z0-9]/.test(this.password)
    ].filter(Boolean).length;
  }

  get passwordStrengthLabel(): string {
    if (!this.password) {
      return 'Enter a password';
    }

    if (this.passwordStrength <= 2) {
      return 'Weak password';
    }

    if (this.passwordStrength <= 4) {
      return 'Good password';
    }

    return 'Strong password';
  }

  googleSignIn(): void {
    this.errorMessage = 'Google sign-in is not configured yet.';
  }
}
