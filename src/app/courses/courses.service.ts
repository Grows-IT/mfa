import { Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

const siteUrl = 'http://santaputra.trueddns.com:46921/moodle';
const getCoursesWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses'
const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

export interface Course {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getCourses() {
    const params = new HttpParams({
      fromObject: {
        wstoken: '895f4421604c30173983ba06fb75af0e',
        userid: '2'
      }
    });

    return this.http.post<any>(getCoursesWsUrl, params, httpOptions).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }
}
