import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { from, BehaviorSubject, throwError, Observable, of } from 'rxjs';
import { timeout, map, switchMap, first, withLatestFrom, catchError } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface GetSiteInfoResponseData {
  userid: number;
  username: string;
  firstname: string;
  lastname: string;
  userpictureurl: string;
  errorcode: string;
  message: string;
}

interface FetchTokenResponseData {
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
    return this.user.pipe(
      first(),
      map(user => user ? user.id : null)
    );
  }

  login(username: string, password: string) {
    return this.fetchToken(username, password).pipe(
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

  isLoggedIn() {
    return this.token.pipe(
      first(),
      switchMap(token => {
        if (!token) {
          return this.getTokenFromStorage().pipe(
            catchError(() => of(null)),
            map(storedtoken => !!storedtoken)
          );
        }
        return of(!!token);
      })
    );
  }

  isUserAvailable() {
    return this.user.pipe(
      first(),
      switchMap(user => {
        if (user) {
          return of(!!user);
        }
        return this.getUserFromStorage().pipe(
          map(storedUser => {
            return !!storedUser;
          })
        );
      })
    );
  }

  fetchUser() {
    return this.coreWebserviceGetSiteInfo().pipe(
      map(user => {
        this._user.next(user);
        this.saveUserToStorage(user);
        return user;
      })
    );
  }

  updateProfilePicture(imageData: Blob | File) {
    return this.uploadFile(imageData).pipe(
      switchMap(itemId => {
        return this.coreUserUpdatePicture(itemId);
      }),
      switchMap(() => {
        return this.fetchUser();
      })
    );
  }

  updateUserProfile(profile: { username: string, password: string }) {
    return this.userId.pipe(
      switchMap(userId => {
        const data = new FormData();
        data.append('wsfunction', 'core_user_update_users');
        data.append('moodlewsrestformat', 'json');
        data.append('wstoken', environment.apiKey);
        data.append('users[0][id]', userId.toString());
        if (profile.username && profile.username !== '') {
          data.append('users[0][username]', profile.username);
        }
        if (profile.password && profile.password !== '') {
          data.append('users[0][password]', profile.password);
        }
        return this.http.post<{ errorcode: string }>(environment.webServiceUrl, data);
      }),
      map(res => {
        if (res && res.errorcode) {
          console.log(res.errorcode);
          return false;
        }
        return true;
      })
    );
  }

  private uploadFile(file: File | Blob) {
    return this.token.pipe(
      first(),
      switchMap(token => {
        const url = environment.siteUrl + '/webservice/upload.php';
        const uploadData = new FormData();
        uploadData.append('token', token);
        uploadData.append('filearea', 'draft');
        uploadData.append('itemid', '0');
        uploadData.append('file', file);
        return this.http.post<any>(url, uploadData);
      }),
      catchError(() => throwError('อัพโหลดไฟล์ล้มเหลว โปรดลองใหม่อีกครั้ง')),
      timeout(environment.timeoutDuration),
      map(res => {
        if (res.errorcode === 'upload_error_ini_size') {
          throw new Error('ไฟล์ขนาดใหญ่ไป');
        }
        return res[0].itemid;
      })
    );
  }

  private coreUserUpdatePicture(itemId: string) {
    return this.token.pipe(
      withLatestFrom(this.userId),
      switchMap(([token, userId]) => {
        const params = new HttpParams({
          fromObject: {
            wstoken: token,
            wsfunction: 'core_user_update_picture',
            userid: userId.toString(),
            draftitemid: itemId
          }
        });
        return this.http.post<{ profileimageurl: string }>(environment.webServiceUrl, params);
      }),
      catchError(() => throwError('การเชื่อมต่อ server ล้มเหลว')),
      timeout(environment.timeoutDuration),
      map(res => {
        if (!res.profileimageurl) {
          throw new Error('การเปลี่ยนรูปโปรไฟล์ล้มเหลว');
        }
        return res.profileimageurl;
      })
    );
  }

  private fetchToken(username: string, password: string) {
    const url = environment.siteUrl + '/login/token.php';
    const params = new HttpParams({
      fromObject: {
        username,
        password,
        service: 'moodle_mobile_app'
      }
    });
    return this.http.post<FetchTokenResponseData>(url, params).pipe(
      catchError(this.handleHttpError),
      timeout(environment.timeoutDuration),
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
            wstoken: token,
            wsfunction: 'core_webservice_get_site_info'
          }
        });
        return this.http.post<GetSiteInfoResponseData>(environment.webServiceUrl, params);
      }),
      timeout(environment.timeoutDuration),
      switchMap(res => {
        if (res.errorcode) {
          throw new Error(res.message);
        }
        user = new User(res.userid, res.username, res.firstname, res.lastname, res.userpictureurl);
        if (res.userpictureurl.includes('theme/image.php')) {
          user.imgUrl = 'assets/profile/avatar.png';
        } else {
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

  readFile(blob: Blob): Observable<string> {
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
    const data = JSON.stringify(user);
    Plugins.Storage.set({ key: 'user', value: data });
  }

  getUserFromStorage() {
    return from(Plugins.Storage.get({ key: 'user' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const user: User = JSON.parse(storedData.value);
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
