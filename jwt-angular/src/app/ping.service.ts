import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class PingService {

  constructor(private apiService: ApiService) { }

  get(params: HttpParams = new HttpParams()): Observable<any> {
    return this.apiService.get('/ping/', params);
  }

  post(data: any): Observable<any> {
    return this.apiService.post('/ping/', data);
  }
}
