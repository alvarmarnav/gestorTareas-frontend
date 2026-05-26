import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { GlobalErrorHandler } from './core/services/global-error-handler';
import { errorInterceptor } from './interceptors/error-interceptor';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideBrowserGlobalErrorListeners(),
    provideRouter(routes,withComponentInputBinding()),
    // Registrar HttpClient en el contenedor de DI
    // // withInterceptorsFromDi() permite usar interceptors funcionales
    // provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withInterceptors([
      authInterceptor,
      errorInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
