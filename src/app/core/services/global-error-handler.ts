import { ErrorHandler, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  
    handleError(error: unknown): void {
    // Registrar el error en consola con toda la información
    console.error('Error no controlado:', error);
    
    var errorMessage = "Error no controlado.";

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errorMessage = 'No hay conexión con el servidor. Revisa tu red.';
      } else {
        // Extrae el JSON enviado por tu backend .NET (ej: error.error.message o el texto directo)
        errorMessage = error.error?.message || error.error?.Message || error.error || error.message;
      }
    } else if (error instanceof Error) {
      // Errores de lógica de TypeScript/JavaScript en el frontend
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // 3. Enviar el texto limpio al servicio de notificaciones para mostrar la alerta
    this.notificationService.showError(errorMessage);
    
    // En producción aquí se enviaría el error a un servicio
    // de monitorización como Sentry o Azure Application Insights
    // Para errores críticos se podría mostrar una página de error
    // this.router.navigate(['/error']);
  }
}
