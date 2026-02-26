import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LanguageService } from '../service/language.service';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const lang = inject(LanguageService).current;

  // No tocar assets del frontend
  if (req.url.includes('/assets/')) return next(req);

  const cloned = req.clone({
    setHeaders: {
      'Accept-Language': lang,
    },
  });

  return next(cloned);
};