import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard - Checking auth for:', state.url);
  console.log('AuthGuard - Is logged in?', authService.isLoggedIn());
  
  if (authService.isLoggedIn()) {
    return true;
  }

  console.log('AuthGuard - Redirecting to login');
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};