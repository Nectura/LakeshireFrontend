import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private readonly authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let requestToHandle = request;

    if (this.authService.isAuthenticated() && request.url.startsWith(environment.apiServer)) {
      requestToHandle = requestToHandle.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`
        }
      });
    }
    
    return next.handle(requestToHandle);
  }
}
