import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { from, of, BehaviorSubject, Observable } from 'rxjs';
import { timeout, tap, map } from 'rxjs/operators';

import { Plugins } from '@capacitor/core';

import { User } from './user.model';

// const siteUrl = 'http://mitrphol-mfa.southeastasia.cloudapp.azure.com/moodle';
const siteUrl = 'http://santaputra.trueddns.com:46921/moodle';
const loginWsUrl = siteUrl + '/login/token.php';
const getSiteInfoWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_webservice_get_site_info';
const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
  ) { }

  get isLoggedIn() {
    if (this.token) {
      return of(!!this.token);
    }
    return from(Plugins.Storage.get({ key: 'token' })).pipe(map(data => {
      if (!data || !data.value) {
        return false;
      }
      this.token = data.value;
      return true;
    }));
  }

  get userProfile(): Observable<User> {
    if (!this.user.value) {
      return this.getSiteInfo();
    }
    return this.user.asObservable();
  }

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

  private getSiteInfo() {
    const params = new HttpParams({
      fromObject: {
        wsfunction: 'core_webservice_get_site_info',
        moodlewssettingfilter: 'true',
        moodlewssettingfileurl: 'true',
        wstoken: this.token
      }
    });

    return this.http.post<any>(getSiteInfoWsUrl, params, httpOptions).pipe(
      timeout(10000),
      map(res => {
      if (res.errorcode) {
        throw new Error(res.message);
      }
      const user = new User(res.userid, res.username, res.firstname, res.lastname, res.userpictureurl);
      this.user.next(user);
      return user;
    }));
  }
}
