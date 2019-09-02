import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, BehaviorSubject } from 'rxjs';
import { timeout, tap, map, flatMap, switchMap, take } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { User } from './user.model';

// const siteUrl = 'http://mitrphol-mfa.southeastasia.cloudapp.azure.com/moodle';
const siteUrl = 'http://santaputra.trueddns.com:46921/moodle';
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

function base64toBlob(base64Data: string, contentType: string) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

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

  updateProfilePicture(imageData: string | File) {
    let imageFile: any;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    return this.user.pipe(take(1), switchMap(user => {
      return this.uploadWs(user.token, imageFile).pipe(switchMap(itemId => {
        return this.coreUserUpdatePictureWs(user.token, user.id, itemId).pipe(switchMap(() => {
          return this.getSiteInfo(user.token).pipe(tap(u => {
            this._user.next(u);
            this.saveUserToStorage(u);
          }));
        }));
      }));
    }));
  }

  private uploadWs(token: string, file: File) {
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

  private coreUserUpdatePictureWs(token: string, userId: string, itemId: string) {
    const formData = new FormData();
    formData.append('wstoken', token);
    formData.append('userid', userId);
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
