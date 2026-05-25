import { ErrorHandler, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler{
  private router = inject(Router);
handleError(error: unknown): void {
// Registrar el error en consola con toda la información
console.error('Error no controlado:', error);
// En producción aquí se enviaría el error a un servicio
// de monitorización como Sentry o Azure Application Insights
// Para errores críticos se podría mostrar una página de error
// this.router.navigate(['/error']);
}
}
