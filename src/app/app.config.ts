import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter} from '@angular/router';

// Import common services
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Import custom interceptors
import { authInterceptor} from './interceptors/auth-interceptor';
import { languageInterceptor } from './interceptors/language-interceptor';

// Import service worker configuration
import { provideServiceWorker } from '@angular/service-worker';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
// Define routes for the application
import { routes } from './app.routes';

// Import animations module
import { provideAnimations } from '@angular/platform-browser/animations';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// Export the application configuration object
export const appConfig: ApplicationConfig = {
  providers: [
    // Provide the router with the defined routes
    provideRouter(routes),
    
    // Apply Angular animations
    provideAnimations(),
    
    // Configure HTTP client with interceptors
    provideHttpClient(withInterceptors([authInterceptor, languageInterceptor, credentialsInterceptor])),
    
    // Set up service worker for progressive web app support
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    importProvidersFrom(
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  )
  ]
};