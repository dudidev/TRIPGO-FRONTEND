import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const empresaGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1) si no está logueado -> login
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 2) si está logueado pero NO es empresa -> principal
  const role = authService.getCurrentUser()?.rol;
  if (role !== 'empresa') {
    router.navigate(['/principal']);
    return false;
  }

  return true;
};