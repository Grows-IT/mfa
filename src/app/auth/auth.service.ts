import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, BehaviorSubject } from 'rxjs';
import { timeout, tap, map, flatMap, switchMap, take } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { environment } from '../../environments/environment';
import { User } from './user.model';

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

  constructor(
    private http: HttpClient,
  ) { }

  get user() {
    return this._user.asObservable();
  }
  get token() {
    return this._user.asObservable().pipe(map(user => user ? user.token : null));
  }

  get isLoggedIn() {
    return this._user.asObservable().pipe(map(user => user ? !!user.token : false));
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

  updateProfilePicture(imageData: Blob | File) {
    return this.user.pipe(take(1), switchMap(user => {
      return this.uploadWs(user.token, imageData).pipe(switchMap(itemId => {
        return this.coreUserUpdatePictureWs(user.token, user.id, itemId).pipe(switchMap(() => {
          return this.getSiteInfo(user.token).pipe(tap(u => {
            this._user.next(u);
            this.saveUserToStorage(u);
          }));
        }));
      }));
    }));
  }

  private uploadWs(token: string, file: File | Blob) {
    const uploadData = new FormData();
    uploadData.append('token', token);
    uploadData.append('filearea', 'draft');
    uploadData.append('itemid', '0');
    uploadData.append('file', file);
    return this.http.post<{ itemid: string }[]>(uploadImageWsUrl, uploadData).pipe(timeout(10000), map(res => {
      if (!res[0]) {
        throw new Error('Cannot upload image.');
      }
      return res[0].itemid;
    }));
  }

  private coreUserUpdatePictureWs(token: string, userId: number, itemId: string) {
    const formData = new FormData();
    formData.append('wstoken', token);
    formData.append('userid', userId.toString());
    formData.append('draftitemid', itemId);
    return this.http.post<{ profileimageurl: string }>(coreUserUpdatePictureWsUrl, formData).pipe(timeout(10000), map(res => {
      if (!res.profileimageurl) {
        throw new Error('Cannot update profile picture.');
      }
      return res.profileimageurl;
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
    return this.http.post<GetTokenResponseData>(loginWsUrl, params, httpOptions).pipe(timeout(10000), map(res => {
      if (res.error) {
        throw new Error(res.error);
      }
      return res.token;
    }));
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

  private saveUserToStorage(user: User) {
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
