import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserRole, RoleNames } from '../../../../core/models/user';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-assign-role-dialog',
  templateUrl: './assign-role-dialog.html',
  styleUrls: ['./assign-role-dialog.scss'],
  imports: [
    ReactiveFormsModule,MatIcon,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogActions,MatDialogContent,CommonModule
  ]
})
export class AssignRoleDialogComponent {
  roleForm: FormGroup;
  user: User;
  roleNames = RoleNames;
  
  // Roles available for assignment (only 2, 3, 4 - not Admin)
  roles = [
    { value: UserRole.BillingOfficer, name: 'Billing Officer', description: 'Can enter meter readings and generate bills' },
    { value: UserRole.AccountOfficer, name: 'Account Officer', description: 'Can track payments and outstanding balances' },
    { value: UserRole.Consumer, name: 'Consumer', description: 'Can view bills and make payments' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssignRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.user = data.user;
    this.roleForm = this.fb.group({
      role: [this.user.role || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      // Return the selected role number (2, 3, or 4)
      this.dialogRef.close(this.roleForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getRoleDescription(roleValue: number): string {
    const role = this.roles.find(r => r.value === roleValue);
    return role ? role.description : '';
  }
  getCurrentRoleName(): string {
  if (this.user.role && this.user.role > 0) {
    return this.roleNames[this.user.role] || 'Unknown';
  }
  return 'Pending';
}
}