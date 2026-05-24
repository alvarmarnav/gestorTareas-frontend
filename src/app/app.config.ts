import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Registrar HttpClient en el contenedor de DI
    // // withInterceptorsFromDi() permite usar interceptors funcionales
    provideHttpClient(withInterceptorsFromDi())
  ]
};
