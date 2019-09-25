import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, BehaviorSubject } from 'rxjs';
import { timeout, tap, map, flatMap, switchMap, take, first, withLatestFrom } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { environment } from '../../environments/environment';
import { User } from './user.model';

const duration = environment.timeoutDuration;
const siteUrl = environment.siteUrl;
const loginWsUrl = siteUrl + '/login/token.php';
const getSiteInfoWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_webservice_get_site_info';
const uploadImageWsUrl = siteUrl + '/webservice/upload.php';
const coreUserUpdatePictureWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_user_update_picture';
const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

export interface GetSiteInfoResponseData {
  userid: number;
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
  private _token = new BehaviorSubject<string>(null);

  constructor(
    private http: HttpClient,
  ) { }

  get user() {
    return this._user.asObservable();
  }

  get token() {
    return this._token.asObservable();
  }

  get userId() {
    return this.user.pipe(map(user => user ? user.id : null));
  }

  get isLoggedIn() {
    return this.token.pipe(
      first(),
      map(token => token ? !!token : false));
  }

  login(username: string, password: string) {
    return this.getToken(username, password).pipe(
      map(token => {
        this._token.next(token);
        this.saveTokenToStorage(token);
        return !!token;
      })
    );
  }

  logout() {
    this._user.next(null);
    this._token.next(null);
    Plugins.Storage.clear();
  }

  autoLogin() {
    return this.getTokenFromStorage().pipe(
      map(token => {
        this._token.next(token);
        return !!token;
      })
    );
  }

  fetchUser() {
    return this.coreWebserviceGetSiteInfo().pipe(
      tap(user => {
        this._user.next(user);
        this.saveUserToStorage(user);
      })
    );
  }

  updateProfilePicture(imageData: Blob | File) {
    return this.uploadWs(imageData).pipe(
      switchMap(itemId => {
        return this.coreUserUpdatePictureWs(itemId);
      }),
      switchMap(() => {
        return this.fetchUser();
      })
    );
  }

  private uploadWs(file: File | Blob) {
    return this.token.pipe(
      first(),
      switchMap(token => {
        const uploadData = new FormData();
        uploadData.append('token', token);
        uploadData.append('filearea', 'draft');
        uploadData.append('itemid', '0');
        uploadData.append('file', file);
        return this.http.post<any>(uploadImageWsUrl, uploadData);
      }),
      map(res => {
        if (res.errorcode === 'upload_error_ini_size') {
          throw new Error('File size cannot exceed 2 MB');
        }
        return res[0].itemid;
      })
    );
  }

  private coreUserUpdatePictureWs(itemId: string) {
    return this.token.pipe(
      withLatestFrom(this.userId),
      switchMap(([token, userId]) => {
        const formData = new FormData();
        formData.append('wstoken', token);
        formData.append('userid', userId.toString());
        formData.append('draftitemid', itemId);
        return this.http.post<{ profileimageurl: string }>(coreUserUpdatePictureWsUrl, formData);
      }),
      timeout(duration),
      map(res => {
        if (!res.profileimageurl) {
          throw new Error('Cannot update profile picture.');
        }
        return res.profileimageurl;
      })
    );
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
      timeout(duration),
      map(res => {
        if (res.error) {
          throw new Error(res.error);
        }
        this._token.next(res.token);
        this.saveTokenToStorage(res.token);
        return res.token;
      }));
  }

  private coreWebserviceGetSiteInfo() {
    let token: string;
    return this.token.pipe(
      first(),
      switchMap(t => {
        token = t;
        const params = new HttpParams({
          fromObject: {
            wstoken: token
          }
        });
        return this.http.post<GetSiteInfoResponseData>(getSiteInfoWsUrl, params, httpOptions);
      }),
      timeout(duration),
      map(res => {
        if (res.errorcode) {
          throw new Error(res.message);
        }
        if (!res.userpictureurl.includes('theme/image.php')) {
          const regex = /(\w+:\/\/[\w\d\.]+)(\S+)/g;
          const match = regex.exec(res.userpictureurl);
          res.userpictureurl = `${match[1]}/webservice${match[2]}&token=${token}&offline=1#moodlemobile-embedded`;
        }
        const user = new User(
          res.userid,
          res.username,
          res.firstname,
          res.lastname,
          res.userpictureurl
        );
        return user;
      })
    );
  }

  private saveTokenToStorage(token: string) {
    Plugins.Storage.set({ key: 'token', value: token });
  }

  private getTokenFromStorage() {
    return from(Plugins.Storage.get({ key: 'token' })).pipe(
      map(storedToken => {
        if (!storedToken || !storedToken.value) {
          return null;
        }
        this._token.next(storedToken.value);
        return storedToken.value;
      })
    );
  }

  private saveUserToStorage(user: User) {
    const data = JSON.stringify({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imgUrl: user.imgUrl
    });
    Plugins.Storage.set({ key: 'user', value: data });
  }

  private getUserFromStorage() {
    return from(Plugins.Storage.get({ key: 'user' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        imgUrl: string;
      };
      const user = new User(
        parsedData.id,
        parsedData.username,
        parsedData.firstName,
        parsedData.lastName,
        parsedData.imgUrl
      );
      return user;
    }));
  }
}
