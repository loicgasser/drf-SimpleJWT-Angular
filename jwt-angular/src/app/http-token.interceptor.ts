import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {};

    const csrftoken = this.authService.getCSRFToken();

    if (csrftoken) {
      headersConfig['X-CSRFTOKEN'] = csrftoken;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
}
