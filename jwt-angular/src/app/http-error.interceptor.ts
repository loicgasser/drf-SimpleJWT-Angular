
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  private isRefreshingSource = new BehaviorSubject<boolean>(false);
  isRefreshing$ = this.isRefreshingSource.asObservable();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
      // If the refresh token token request has failed, we should sign out
      if (request.url.includes('/token/access/')) {
        this.authService.deleteToken().subscribe(_ => _);
        return throwError(err);
      }
      // If the server returns a 401 this means that there was an authentification error
      // In this case we want to try to refresh the access token, unless the 401 was triggered by a sign in request
      if (err.status === 401 && !request.url.includes('/token/both/')) {
        return this.handle401Error(request, next);
      }
      return throwError(err);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If we are not already refreshing the token, try to refresh it
    if (!this.isRefreshingSource.getValue()) {
      this.isRefreshingSource.next(true);
      // Try to refresh the token
      return this.authService.refreshToken()
        .pipe(
          switchMap((_: any) => {
            return next.handle(request);
          }),
          finalize(() => this.isRefreshingSource.next(false))
        );
    }
    // postpone all future other request until the refresh request resolves
    return this.isRefreshing$.pipe(
      filter(refreshing => !refreshing),
      take(1),
      switchMap(() => next.handle(request))
    );
  }
}
