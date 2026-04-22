import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/api/auth/login')) {
        authService.logout();
        toastService.showError('Sessão expirada. Faça login novamente.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
