import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Base api URL
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  post(path: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${path}`, data, { withCredentials: true });
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${this.apiUrl}${path}`, { params, withCredentials: true });
  }
}
