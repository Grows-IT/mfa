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

export interface GetSiteInfoResponseData {
  userid: string;
  username: string;
  firstname: string;
  lastname: string;
  userpictureurl: string;
  errorcode: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private userBs = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
  ) { }

  get userToken() {
    return this.token;
  }

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
    if (this.userBs.value) {
      return this.userBs.asObservable();
    }
    return from(Plugins.Storage.get({ key: 'user' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        imgUrl: string;
      };
      const user = new User(parsedData.id, parsedData.username, parsedData.firstName, parsedData.lastName, parsedData.imgUrl);
      this.userBs.next(user);
      return user;
    }));
  }

  login(username: string, password: string) {
    const params = new HttpParams({
      fromObject: {
        username,
        password,
        service: 'moodle_mobile_app'
      }
    });

    return this.http.post<any>(loginWsUrl, params, httpOptions).pipe(timeout(10000), tap(res => {
      if (res.error) {
        throw new Error(res.error);
      }
      this.token = res.token;
      Plugins.Storage.set({ key: 'token', value: res.token });
    }));
  }

  getSiteInfo() {
    const params = new HttpParams({
      fromObject: {
        wsfunction: 'core_webservice_get_site_info',
        moodlewssettingfilter: 'true',
        moodlewssettingfileurl: 'true',
        wstoken: this.token
      }
    });

    return this.http.post<GetSiteInfoResponseData>(getSiteInfoWsUrl, params, httpOptions).pipe(timeout(10000), map(res => {
      if (res.errorcode) {
        throw new Error(res.message);
      }
      const data = JSON.stringify({
        id: res.userid,
        username: res.username,
        firstName: res.firstname,
        lastName: res.lastname,
        imgUrl: res.userpictureurl
      });
      Plugins.Storage.set({ key: 'user', value: data });
      const user = new User(res.userid, res.username, res.firstname, res.lastname, res.userpictureurl);
      this.userBs.next(user);
      return user;
    }));
  }
}
