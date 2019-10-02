import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { from, BehaviorSubject, throwError, Observable } from 'rxjs';
import { timeout, map, switchMap, first, withLatestFrom, catchError } from 'rxjs/operators';
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
  errorcode: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);
  private _token = new BehaviorSubject<string>(null);

  constructor(
    private http: HttpClient
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

  fetchUser() {
    return this.coreWebserviceGetSiteInfo().pipe(
      map(user => {
        this._user.next(user);
        this.saveUserToStorage(user);
        return true;
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
          throw new Error('ไฟล์ขนาดใหญ่ไป');
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
          throw new Error('อัพโหลดรูปภาพล้มเหลว');
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
      catchError(this.handleHttpError),
      timeout(duration),
      map(res => {
        if (res.errorcode === 'invalidlogin') {
          throw new Error('ชื่อหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
        }
        this._token.next(res.token);
        this.saveTokenToStorage(res.token);
        return res.token;
      }));
  }

  private coreWebserviceGetSiteInfo() {
    let token: string;
    let user: User;
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
      switchMap(res => {
        if (res.errorcode) {
          throw new Error(res.message);
        }
        user = new User(res.userid, res.username, res.firstname, res.lastname, res.userpictureurl);
        if (!res.userpictureurl.includes('theme/image.php')) {
          const regex = /(\w+:\/\/[\w\d\.]+)(\S+)/g;
          const match = regex.exec(res.userpictureurl);
          user.imgUrl = `${match[1]}/webservice${match[2]}&token=${token}&offline=1#moodlemobile-embedded`;
        }
        return this.http.get(user.imgUrl, { responseType: 'blob' });
      }),
      switchMap(blob => this.readFile(blob)),
      map(imgData => {
        user.imgData = imgData;
        return user;
      }),
    );
  }

  private readFile(blob: Blob): Observable<string> {
    return new Observable(obs => {
      const reader = new FileReader();
      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result.toString());
      reader.onloadend = () => obs.complete();
      return reader.readAsDataURL(blob);
    });
  }

  private saveTokenToStorage(token: string) {
    Plugins.Storage.set({ key: 'token', value: token });
  }

  getTokenFromStorage() {
    return from(Plugins.Storage.get({ key: 'token' })).pipe(
      map(storedToken => {
        if (!storedToken || !storedToken.value) {
          return null;
        }
        const token = storedToken.value;
        this._token.next(token);
        return token;
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
      imgData: user.imgData
    });
    Plugins.Storage.set({ key: 'user', value: data });
  }

  getUserFromStorage() {
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
        imgData: string;
      };
      const user = new User(
        parsedData.id,
        parsedData.username,
        parsedData.firstName,
        parsedData.lastName,
        parsedData.imgUrl,
        parsedData.imgData
      );
      this._user.next(user);
      return user;
    }));
  }

  private handleHttpError(error: HttpErrorResponse) {
    let message: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      message = 'แอพขัดข้อง โปรดติดต่อทีมงาน';
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.status === 0) { // No internet connection
        message = 'คุณไม่ได้เชื่อมต่อ internet ไม่สามารถ login ได้';
      } else {
        message = 'เซอร์เวอร์ขัดข้อง โปรดลองใหม่อีกครั้ง';
      }
    }
    // return an observable with a user-facing error message
    console.error(message);
    return throwError(message);
  }
}
