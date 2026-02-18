import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../service/user';

export const empresaGuard: CanActivateFn = () => {
  const userService = inject(User);
  const router = inject(Router);

  // 1) si no está logueado -> login
  if (!userService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 2) si está logueado pero NO es empresa -> principal
  const role = userService.getRole(); // 'empresa' | 'usuario' | null
  if (role !== 'empresa') {
    router.navigate(['/principal']);
    return false;
  }

  return true;
};
