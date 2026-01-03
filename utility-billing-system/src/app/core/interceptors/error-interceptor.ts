import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storageService = inject(StorageService);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        snackBar.open('Session expired. Please login again.', 'Close', { duration: 3000 });
        storageService.clearStorage();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        snackBar.open('Access denied. Insufficient permissions.', 'Close', { duration: 3000 });
      } else if (error.status === 500) {
        snackBar.open('Server error. Please try again later.', 'Close', { duration: 3000 });
      }
      return throwError(() => error);
    })
  );
};