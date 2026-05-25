import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
const authService = inject(AuthService);
return next(req).pipe(
catchError((error: HttpErrorResponse) => {
if (error.status === 401) {
// Token expirado o inválido — limpiar sesión y redirigir
authService.logout();
router.navigate(['/login']);
}
if (error.status === 403) {
// Autenticado pero sin permisos
console.error('Sin permisos para esta operación');
}
if (error.status === 0) {
// Error de red — servidor no disponible
console.error('No se puede conectar con el servidor');
}
// Propagar el error para que los servicios también lo reciban
return throwError(() => error);
})
)
};
