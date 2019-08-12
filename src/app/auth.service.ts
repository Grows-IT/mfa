import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  site = 'http://mitrphol-mfa.southeastasia.cloudapp.azure.com/moodle';
  example = 'http://example.com/';

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    return this.http.post(this.site)
  }
}
