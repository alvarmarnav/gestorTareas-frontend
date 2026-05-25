import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
const router = inject(Router);
if (!authService.isAuthenticated()) {
// No está autenticado — puede acceder al login
return true;
}
// Ya está autenticado — redirigir a tareas
return router.createUrlTree(['/tasks']);
};
