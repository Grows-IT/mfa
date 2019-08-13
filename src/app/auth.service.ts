import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  loginUrl = 'http://mitrphol-mfa.southeastasia.cloudapp.azure.com/moodle/login/token.php';

  constructor(private http: HttpClient) { }

  login(username: string, password: string, callback: (err: string) => void) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    const params = new HttpParams({
      fromObject: {
        username: username,
        password: password,
        service: 'moodle_mobile_app'
      }
    });

    this.http.post<any>(this.loginUrl, params, httpOptions).subscribe(res => {
      if (res.error) return callback(res.error);
      this.token = res.token;
      callback(null);
    }, (err) => callback(err));
  }

  isLoggedin() {
    return this.token.length > 0;
  }
}