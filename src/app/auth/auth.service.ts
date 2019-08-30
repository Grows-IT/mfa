import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { from, BehaviorSubject } from 'rxjs';
import { timeout, tap, map, flatMap } from 'rxjs/operators';

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

export interface GetTokenResponseData {
  token: string;
  error: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
  ) { }

  get user() {
    return this._user.asObservable();
  }

  get isLoggedIn() {
    return this._user.asObservable().pipe(map(user =>  user ? !!user.token : false));
  }

  login(username: string, password: string) {
    return this.getToken(username, password).pipe(flatMap(token => {
      return this.getSiteInfo(token).pipe(tap(user => {
        this._user.next(user);
        this.saveUserToStorage(user);
      }));
    }));
  }

  logout() {
    this._user.next(null);
    Plugins.Storage.clear();
  }

  autoLogin() {
    return this.getUserFromStorage().pipe(map(user => {
      this._user.next(user);
      return !!user;
    }));
  }

  private getToken(username: string, password: string) {
    const params = new HttpParams({
      fromObject: {
        username,
        password,
        service: 'moodle_mobile_app'
      }
    });
    return this.http.post<GetTokenResponseData>(loginWsUrl, params, httpOptions).pipe(
      timeout(10000),
      map(res => {
        if (res.error) {
          throw new Error(res.error);
        }
        return res.token;
      })
    );
  }

  private getSiteInfo(token: string) {
    const params = new HttpParams({
      fromObject: {
        wsfunction: 'core_webservice_get_site_info',
        moodlewssettingfilter: 'true',
        moodlewssettingfileurl: 'true',
        wstoken: token
      }
    });
    return this.http.post<GetSiteInfoResponseData>(getSiteInfoWsUrl, params, httpOptions).pipe(
      timeout(10000),
      map(res => {
        if (res.errorcode) {
          throw new Error(res.message);
        }
        const user = new User(
          res.userid,
          res.username,
          res.firstname,
          res.lastname,
          res.userpictureurl,
          token
        );
        return user;
      })
    );
  }

  saveUserToStorage(user: User) {
    const data = JSON.stringify({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imgUrl: user.imgUrl,
      token: user.token
    });
    Plugins.Storage.set({ key: 'user', value: data });
  }

  getUserFromStorage() {
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
        token: string;
      };
      const user = new User(
        parsedData.id,
        parsedData.username,
        parsedData.firstName,
        parsedData.lastName,
        parsedData.imgUrl,
        parsedData.token
      );
      return user;
    }));
  }
}
