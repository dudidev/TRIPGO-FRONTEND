import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const empresaGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya terminó de verificar la sesión, decide normal
  if (authService.hasCheckedAuth()) {
    if (!authService.isLoggedIn()) {
      return router.createUrlTree(['/login']);
    }

    const role = authService.getCurrentUser()?.rol;
    if (role !== 'empresa') {
      return router.createUrlTree(['/principal']);
    }

    return true;
  }

  // Si aún no termina de restaurar, esperar /auth/me
  return authService.restoreSession().pipe(
    map((res: any): boolean | UrlTree => {
      const user = res?.user ?? authService.getCurrentUser();

      if (!user) {
        return router.createUrlTree(['/login']);
      }

      if (user.rol !== 'empresa') {
        return router.createUrlTree(['/principal']);
      }

      return true;
    }),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};