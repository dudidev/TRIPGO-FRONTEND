import { HttpInterceptorFn } from '@angular/common/http';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  // No tocar los archivos de traducción
  if (req.url.includes('/assets/i18n/')) {
    return next(req);
  }

  const lang = localStorage.getItem('tripgo_language') || 'es';

  return next(
    req.clone({
      setHeaders: {
        'Accept-Language': lang
      }
    })
  );
};