import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const RoleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as number[];
  const userRole = authService.getUserRole();

  console.log('RoleGuard - Required roles:', requiredRoles);
  console.log('RoleGuard - User role:', userRole);

  if (userRole && requiredRoles.includes(userRole)) {
    console.log('RoleGuard - Access granted');
    return true;
  }

  console.log('RoleGuard - Access denied, redirecting to unauthorized');
  router.navigate(['/unauthorized']);
  return false;
};