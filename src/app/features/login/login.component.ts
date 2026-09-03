import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  passwordVisible = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    readonly theme: ThemeService
  ) {}

  submit(): void {
    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Enter your username and password to continue.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.authService.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.submitting = false;
        this.errorMessage = 'We could not sign you in. Check your credentials and try again.';
      }
    });
  }
}
