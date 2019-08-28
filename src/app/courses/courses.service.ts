import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, switchMap, catchError, timeout, take } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { Course } from './course.model';
import { from, BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const siteUrl = 'http://santaputra.trueddns.com:46921/moodle';
const getCoursesWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses';
const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

export interface CourseData {
  id: string;
  shortname: string;
  overviewfiles: [{
    fileurl: string;
  }];
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private _courses = new BehaviorSubject<Course[]>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get courses() {
    return this._courses.asObservable().pipe(take(1), switchMap(courses => {
      if (!courses) {
        return this.getCoursesFromServer().pipe(catchError(err => {
          console.log(err.message);
          return this.getCoursesFromStorage();
        }), tap(cs => {
          this._courses.next(cs);
        }));
      }
      return of(courses);
    }));
  }

  getCoursesFromServer() {
    return this.authService.user.pipe(switchMap(user => {
      const params = new HttpParams({
        fromObject: {
          userid: user.id,
          wstoken: user.token
        }
      });
      return this.http.post<any>(getCoursesWsUrl, params, httpOptions).pipe(timeout(10000), map(res => {
        if (res.errorcode) {
          throw new Error(res.message);
        }
        const courses: Course[] = res.map((data: CourseData) => new Course(data.id, data.shortname, data.overviewfiles[0].fileurl));
        this.saveCoursestoStorage(courses);
        return courses;
      }));
    }));
  }

  private saveCoursestoStorage(courses: Course[]) {
    const data = JSON.stringify(courses.map(course => course.toObject()));
    Plugins.Storage.set({ key: 'courses', value: data });
  }

  private getCoursesFromStorage() {
    return from(Plugins.Storage.get({ key: 'courses'})).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        console.log('Courses are not stored locally.');
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {
        id: string;
        name: string;
        imgUrl: string;
      }[];
      const courses = parsedData.map(element => new Course(element.id, element.name, element.imgUrl));
      return courses;
    }));
  }
}
