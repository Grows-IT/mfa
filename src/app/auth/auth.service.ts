import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { from } from 'rxjs';
import { timeout, tap, map } from 'rxjs/operators';

import { Plugins } from '@capacitor/core';

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
  token: string;

  constructor(
    private http: HttpClient,
  ) {}

  login(username: string, password: string) {
    const params = new HttpParams({
      fromObject: {
        username,
        password,
        service: 'moodle_mobile_app'
      }
    });

    return this.http.post<any>(loginWsUrl, params, httpOptions).pipe(
      timeout(10000),
      tap(res => {
      if (res.error) {
        throw new Error(res.error);
      }
      this.token = res.token;
      Plugins.Storage.set({ key: 'token', value: res.token });
    }));
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'token'})).pipe(tap(data => {
      if (!data || !data.value) {
        throw new Error('Auth token not found.');
      }
      this.token = data.value;
    }));
  }

  getUserProfile() {
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
