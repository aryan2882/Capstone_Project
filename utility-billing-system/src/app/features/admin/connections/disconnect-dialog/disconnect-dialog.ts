import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Connection } from '../../../../core/models/connection';

@Component({
  selector: 'app-disconnect-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './disconnect-dialog.html',
  styleUrls: ['./disconnect-dialog.scss']
})
export class DisconnectDialogComponent {
  disconnectForm: FormGroup;
  connection: Connection;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DisconnectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { connection: Connection }
  ) {
    this.connection = data.connection;

    this.disconnectForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.disconnectForm.valid) {
      this.dialogRef.close(this.disconnectForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}