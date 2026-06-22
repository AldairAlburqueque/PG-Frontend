import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = sessionStorage.getItem('authUser');
  const pass = sessionStorage.getItem('authPass');

  if (user && pass) {
    const authHeader = 'Basic ' + btoa(`${user}:${pass}`);

    const authReq = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });

    return next(authReq).pipe(
      catchError((error) => {
        // Si recibimos 401 o 403, el usuario ya no es válido
        if (error.status === 401 || error.status === 403) {
          authService.logout();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
