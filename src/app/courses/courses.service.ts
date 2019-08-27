import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../auth/user.model';

const siteUrl = 'http://santaputra.trueddns.com:46921/moodle';
const getCoursesWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses'
const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

export interface GetCourseResponseData {
  id: string;
  name: string;
  overviewfiles: {
    fileurl: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(
    private http: HttpClient
  ) { }

  getCourses(user: User) {
    const params = new HttpParams({
      fromObject: {
        userid: user.id,
        wstoken: user.token
      }
    });

    return this.http.post<GetCourseResponseData[]>(getCoursesWsUrl, params, httpOptions).pipe(map(res => {
      return res;
    }));
  }
}
