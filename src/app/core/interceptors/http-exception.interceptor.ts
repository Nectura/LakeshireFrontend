import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpExceptionInterceptor implements HttpInterceptor {

  constructor(
    private readonly authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        console.error("Error Intercepted: [" + error.status + "] " + error.message);

        if (error.status === HttpStatusCode.Unauthorized) {
          this.authService.refreshAccessToken();
        }

        return throwError(() => error);
      })
    );
  }
}
