import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
import { API_URL } from './env.token';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  private baseUrl = inject(API_URL);
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clone = request.clone({
      url: `${this.baseUrl}${request.url}`,
    });
    return next.handle(clone).pipe(
      catchError(() => {
        return EMPTY;
      })
    );
  }
}
