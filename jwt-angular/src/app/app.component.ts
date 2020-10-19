import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from './auth.service';
import { PingService } from './ping.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'jwt-angular';
  form: FormGroup;
  getParam = 'abc';
  getResponse = '';
  postBody = '123';
  postResponse = '';

  constructor(
    private fb: FormBuilder,
    private pingService: PingService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    // Ping server to see if the user is still authenticated
    this.pingService.get()
      .subscribe(_ => _);
  }

  onSubmit(): void {
    this.authService.obtainBoth(this.form.value)
      .subscribe(response => {
        console.log(response);
      });
  }

  signOut(): void {
    this.authService.deleteToken()
      .subscribe(_ => _);
  }

  pingGet(): void {
    const params = new HttpParams({
      fromObject: {
        id: this.getParam
      }
    });
    this.pingService.get(params)
      .subscribe(response => {
        this.getResponse = JSON.stringify(response);
      });
  }

  pingPost(): void {
    this.pingService.post({id: this.postBody})
      .subscribe(response => {
        this.postResponse = JSON.stringify(response);
      });
  }
}
