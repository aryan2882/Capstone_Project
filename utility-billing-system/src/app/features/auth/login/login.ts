import { MatSpinner } from '@angular/material/progress-spinner';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRole } from '../../../core/models/user';
import { MatError, MatFormField, MatLabel } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports:[MatSpinner,MatError,MatLabel,RouterLink,CommonModule,
    MatFormField,MatCard,MatCardContent,MatCardHeader,MatCardSubtitle,MatCardTitle,MatIcon,MatCheckbox,MatDivider,ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          // Redirect based on role string from API
          this.redirectBasedOnRole(response.role);
        },
        error: (error) => {
          this.loading = false;
          const message = error.error?.message || 'Login failed. Please check your credentials.';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        }
      });
    }
  }

  private redirectBasedOnRole(roleString: string): void {
    // Convert role string to number for routing
    const roleMap: { [key: string]: number } = {
      'Admin': 1,
      'BillingOfficer': 2,
      'AccountOfficer': 3,
      'Consumer': 4
    };
    
    const roleNumber = roleMap[roleString] || 0;
    
    switch (roleNumber) {
      case 1: // Admin
        this.router.navigate(['/admin/users']);
        break;
      case 2: // BillingOfficer
        this.router.navigate(['/billing-officer/meter-readings']);
        break;
      case 3: // AccountOfficer
        this.router.navigate(['/account-officer/dashboard']);
        break;
      case 4: // Consumer
        this.router.navigate(['/consumer/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 6 characters`;
    }
    return '';
  }
}