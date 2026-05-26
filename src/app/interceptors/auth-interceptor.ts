import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  // Si no hay token dejar pasar la petición sin modificar
// Esto permite que el login funcione sin token
if (!token) {
return next(req);
}
// Clonar la petición añadiendo la cabecera Authorization
// Las peticiones HTTP son inmutables — hay que clonarlas para modificarlas
const reqConToken = req.clone({
setHeaders: {
'Authorization': `Bearer ${token}`
}
});
console.log("token:",token);
  return next(req);
};
