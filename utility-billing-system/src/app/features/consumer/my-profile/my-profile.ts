// my-profile.component.ts - Updated with Signals

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ConsumerService } from '../../../core/services/consumer';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  template: `
    <div class="profile-container">
      <div class="page-header">
        <h1><mat-icon>person</mat-icon> My Profile</h1>
        <p>View and update your personal information</p>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading()" class="profile-content">
        <!-- Profile Info Card -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Personal Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>badge</mat-icon>
                <div>
                  <span class="label">Consumer Code</span>
                  <span class="value">{{profile?.consumerCode}}</span>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>person</mat-icon>
                <div>
                  <span class="label">Full Name</span>
                  <span class="value">{{profile?.firstName}} {{profile?.lastName}}</span>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>email</mat-icon>
                <div>
                  <span class="label">Email</span>
                  <span class="value">{{profile?.email}}</span>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>phone</mat-icon>
                <div>
                  <span class="label">Phone</span>
                  <span class="value">{{profile?.phone}}</span>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div>
                  <span class="label">Member Since</span>
                  <span class="value">{{profile?.createdAt | date:'dd MMM yyyy'}}</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Edit Profile Form -->
        <mat-card class="form-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>edit</mat-icon>
              Update Profile
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Father's Name</mat-label>
                  <input matInput formControlName="fatherName">
                  <mat-icon matPrefix>person</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Address</mat-label>
                  <input matInput formControlName="address">
                  <mat-icon matPrefix>home</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>City</mat-label>
                  <input matInput formControlName="city">
                  <mat-icon matPrefix>location_city</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>State</mat-label>
                  <input matInput formControlName="state">
                  <mat-icon matPrefix>map</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Pin Code</mat-label>
                  <input matInput formControlName="pinCode">
                  <mat-icon matPrefix>pin_drop</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>ID Proof Type</mat-label>
                  <mat-select formControlName="idProofType">
                    <mat-option value="Aadhaar">Aadhaar Card</mat-option>
                    <mat-option value="PAN">PAN Card</mat-option>
                    <mat-option value="Passport">Passport</mat-option>
                    <mat-option value="Driving License">Driving License</mat-option>
                    <mat-option value="Voter ID">Voter ID</mat-option>
                  </mat-select>
                  <mat-icon matPrefix>badge</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>ID Proof Number</mat-label>
                  <input matInput formControlName="idProofNumber">
                  <mat-icon matPrefix>confirmation_number</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-actions">
                <button mat-raised-button type="button" (click)="resetForm()">
                  <mat-icon>refresh</mat-icon>
                  Reset
                </button>
                <button mat-raised-button color="primary" type="submit" [disabled]="!profileForm.valid || saving()">
                  <mat-spinner *ngIf="saving()" diameter="20"></mat-spinner>
                  <mat-icon *ngIf="!saving()">save</mat-icon>
                  {{saving() ? 'Saving...' : 'Update Profile'}}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container { max-width: 1000px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 8px 0; }
    .page-header p { color: #666; margin: 0; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .profile-content { display: flex; flex-direction: column; gap: 24px; }
    .info-card mat-card-header { margin-bottom: 20px; }
    .info-card mat-card-title { font-size: 20px; font-weight: 600; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
    .info-item { display: flex; gap: 16px; padding: 16px; background-color: #f8f9fa; border-radius: 8px; }
    .info-item mat-icon { color: #667eea; font-size: 28px; width: 28px; height: 28px; }
    .info-item div { display: flex; flex-direction: column; }
    .label { font-size: 13px; color: #999; margin-bottom: 6px; }
    .value { font-weight: 500; font-size: 16px; color: #1a1a1a; }
    .form-card mat-card-header { margin-bottom: 20px; }
    .form-card mat-card-title { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 600; }
    .form-card mat-card-title mat-icon { color: #667eea; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 24px; }
    mat-form-field { width: 100%; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .form-actions button { display: flex; align-items: center; gap: 8px; }
    @media (max-width: 768px) {
      .info-grid { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
      .form-actions { flex-direction: column; }
      .form-actions button { width: 100%; }
    }
  `]
})
export class MyProfileComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  
  // Get profile value directly for template use
  get profile() {
    return this.consumerService.profile();
  }
  
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private consumerService: ConsumerService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      fatherName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      idProofType: ['', Validators.required],
      idProofNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const profile = this.consumerService.profile();
    
    if (profile) {
      // Profile already loaded from service
      this.populateForm(profile);
      this.loading.set(false);
    } else {
      // Load profile
      this.consumerService.getMyProfile().subscribe({
        next: (profile) => {
          this.populateForm(profile);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.snackBar.open('Error loading profile', 'Close', { duration: 3000 });
          this.loading.set(false);
        }
      });
    }
  }

  populateForm(profile: any): void {
    this.profileForm.patchValue({
      fatherName: profile.fatherName,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      pinCode: profile.pinCode,
      idProofType: profile.idProofType,
      idProofNumber: profile.idProofNumber
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.saving.set(true);
      this.consumerService.updateMyProfile(this.profileForm.value).subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.saving.set(false);
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.snackBar.open('Error updating profile', 'Close', { duration: 3000 });
          this.saving.set(false);
        }
      });
    }
  }

  resetForm(): void {
    const profile = this.consumerService.profile();
    if (profile) {
      this.populateForm(profile);
    }
  }
}