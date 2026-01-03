import { MatSpinner } from '@angular/material/progress-spinner';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports:[MatCard,MatIcon,RouterLink,CommonModule,
    MatInput,MatSpinner,MatError,MatLabel,MatFormField,MatHint,MatOption,MatSelect,MatCardContent,MatCardHeader,MatCardTitle,MatCardSubtitle,ReactiveFormsModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  idProofTypes = ['Aadhaar', 'PAN Card', 'Voter ID', 'Driving License', 'Passport'];
  states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z ]+$')]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z ]+$')]],
      fatherName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required]],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      idProofType: ['', [Validators.required]],
      idProofNumber: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.snackBar.open(
            'Registration successful! Please wait for admin approval to assign your role.', 
            'Close', 
            { duration: 6000 }
          );
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading = false;
          const message = error.error?.message || error.error?.title || 'Registration failed. Please try again.';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(field)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Must be at least ${minLength} characters`;
    }
    if (control?.hasError('pattern')) {
      if (field === 'phone') return 'Please enter a valid 10-digit mobile number';
      if (field === 'pinCode') return 'Please enter a valid 6-digit PIN code';
      if (field === 'password') return 'Password must contain uppercase, lowercase, number and special character';
      if (field === 'firstName' || field === 'lastName' || field === 'fatherName') {
        return 'Only alphabets are allowed';
      }
    }
    if (control?.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  private getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      fatherName: "Father's Name",
      email: 'Email',
      phone: 'Phone Number',
      address: 'Address',
      city: 'City',
      state: 'State',
      pinCode: 'PIN Code',
      idProofType: 'ID Proof Type',
      idProofNumber: 'ID Proof Number',
      password: 'Password',
      confirmPassword: 'Confirm Password'
    };
    return labels[field] || field;
  }

  hasError(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}