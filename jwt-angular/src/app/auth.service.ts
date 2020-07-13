import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from './api.service';

export interface AuthData {
  username: string;
  password: string;
}

export interface AuthResponse {
  csrf_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Local storage
  private ls = window.localStorage;

  // Scheduled refresh
  private scheduledRefreshSub: Subscription;

  constructor(private apiService: ApiService) { }

  // Sign in
  obtainBoth(data: AuthData): Observable<AuthResponse> {
    return this.apiService.post(`/token/both/`, data)
      .pipe(tap(response => {
        this.setToken(response);
      }));
  }

  refreshToken(): Observable<AuthResponse> {
    return this.apiService.post(`/token/access/`, {})
      .pipe(tap(response => {
        this.setToken(response);
      }));
  }

  // Sign out
  deleteToken(): Observable<null> {
    return this.apiService.post(`/token/delete/`, {})
      .pipe(tap(_ => {
        this.clearToken();
      }));
  }

  cancelRefresh(): void {
    // Cancel any active scheduled refresh
    if (this.scheduledRefreshSub) {
      this.scheduledRefreshSub.unsubscribe();
    }
  }

  // Get CSRF token from localstorage
  getCSRFToken(): string {
    return this.ls.getItem('csrftoken');
  }

  // Indicates if the current user is possibly still authenticated
  isAuthenticated(): boolean {
    return !!this.getCSRFToken();
  }

  setToken(response: AuthResponse): void {
    this.ls.setItem('csrftoken', response.csrf_token);
  }

  clearToken(): void {
    this.ls.removeItem('csrftoken');
  }
}
