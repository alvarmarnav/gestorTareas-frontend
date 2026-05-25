import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

// Un guard funcional es simplemente una función que devuelve
// true (acceso permitido) o false / UrlTree (acceso denegado)
export const authGuard: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
const router = inject(Router);
if (authService.isAuthenticated()) {
// El usuario tiene token — permitir el acceso
return true;
}
// No tiene token — redirigir al login
// router.createUrlTree() crea una UrlTree para redirigir
return router.createUrlTree(['/login']);
}
