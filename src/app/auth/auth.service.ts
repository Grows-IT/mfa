import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './user.model';

const siteUrl = 'http://mitrphol-mfa.southeastasia.cloudapp.azure.com/moodle';
const loginWsUrl = siteUrl + '/login/token.php';
const getSiteInfoWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_webservice_get_site_info';
const httpOptions = {
  headers: new HttpHeaders({
    Accept:  'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

export interface LoginResponseData {
  token: string;
  privatetoken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<User>(null);
  token: string;

  constructor(
    private http: HttpClient,
  ) {}

  login(username: string, password: string): Observable<string> {
    const params = new HttpParams({
      fromObject: {
        username,
        password,
        service: 'moodle_mobile_app'
      }
    });

    return this.http.post<any>(loginWsUrl, params, httpOptions).pipe(map(res => {
      if (res.error) {
        return res.error;
      }
      this.token = res.token;
      return null;
    }, (error: any) => {
      return error.error.message;
    }));
  }

  isLoggedin() {
    return this.token.length > 0;
  }

  getUserInfo(callback: (err: string, user?: User) => void) {
    const params = new HttpParams({
      fromObject: {
        wsfunction: 'core_webservice_get_site_info',
        moodlewssettingfilter: 'true',
        moodlewssettingfileurl: 'true',
        wstoken: this.token
      }
    });

    this.http.post<any>(getSiteInfoWsUrl, params, httpOptions).subscribe(res => {
      if (res.error) {
        return callback(res.error);
      }
      callback(null);
    }, (err) => {
      callback(err.error.message);
    });
  }

  getUserProfile(): Observable<User> {
    const params = new HttpParams({
      fromObject: {
        wsfunction: 'core_webservice_get_site_info',
        moodlewssettingfilter: 'true',
        moodlewssettingfileurl: 'true',
        wstoken: this.token
      }
    });

    return this.http.post<User>(getSiteInfoWsUrl, params, httpOptions);
  }
}
