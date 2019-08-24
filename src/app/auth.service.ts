import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

const siteUrl = 'http://mitrphol-mfa.southeastasia.cloudapp.azure.com/moodle';
const loginWsUrl = siteUrl + '/login/token.php';
const getSiteInfoWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_webservice_get_site_info';
const httpOptions = {
  headers: new HttpHeaders({
    Accept:  'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

export interface User {
  userid: string;
  firstname: string;
  lastname: string;
  userpictureurl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;

  constructor(
    private http: HttpClient,
  ) {
    // if (!this.token) {
    //   this.storage.get('token').then(token => {
    //     this.token = token;
    //   });
    // }
  }

  login(username: string, password: string, callback: (err: string) => void) {
    const params = new HttpParams({
      fromObject: {
        username,
        password,
        service: 'moodle_mobile_app'
      }
    });

    this.http.post<any>(loginWsUrl, params, httpOptions).subscribe(res => {
      if (res.error) {
        return callback(res.error);
      }
      this.token = res.token;
      // this.storage.set('token', this.token);
      callback(null);
    }, (err) => callback(err.error.message));
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
