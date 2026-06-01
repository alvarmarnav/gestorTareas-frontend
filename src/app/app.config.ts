import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { ApplicationConfig, ErrorHandler, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/services/global-error-handler';
import { authInterceptor } from './interceptors/auth-interceptor';
import { errorInterceptor } from './interceptors/error-interceptor';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    // provideBrowserGlobalErrorListeners(),
    provideRouter(routes,withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'es' },
    // Registrar HttpClient en el contenedor de DI
    // // withInterceptorsFromDi() permite usar interceptors funcionales
    // provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withInterceptors([
      authInterceptor,
      errorInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
