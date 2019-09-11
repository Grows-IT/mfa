import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, switchMap, catchError, timeout, take, flatMap, toArray, concatMap, find, filter, first } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { from, BehaviorSubject, of, pipe, Observable } from 'rxjs';

import { Course, Topic, Page, Quiz, PageResource } from './course.model';
import { AuthService } from '../auth/auth.service';

const siteUrl = 'http://santaputra.trueddns.com:46921/moodle37';
const getCoursesWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses';
const coreCourseGetContentsWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_contents';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

export interface CoreEnrolGetUsersCoursesResponse {
  id: number;
  shortname: string;
  overviewfiles: [{
    fileurl: string;
  }];
}

export interface CoreCourseGetContentsResponse {
  id: number;
  name: string;
  modules: Module[];
}

export interface Module {
  id: number;
  name: string;
  modname: string;
  contents: ContentData[];
}

export interface ContentData {
  filename: string;
  mimetype: string;
  fileurl: string;
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
    return this._courses.asObservable().pipe(first(), switchMap(courses => {
      if (!courses) { // No courses stored in memory, fetch new courses.
        return this.coreEnrolGetUsersCourses();
      }
      return of(courses);
    }));
  }

  getCourseById(courseId: number) {
    return this._courses.asObservable().pipe(first(), switchMap(courses => {
      const course = courses.find(c => c.id === courseId);
      if (!!course.topics) {
        return of(course);
      }
      let topicData: CoreCourseGetContentsResponse;
      return this.coreCourseGetContents(courseId).pipe(
        switchMap(resArr => from(resArr)),
        tap(res => topicData = res),
        concatMap(res => from(res.modules)),
        tap(val => console.log('mod', val)),
        concatMap(mod => this.createActivity(mod)),
        tap(activity => console.log(topicData.name, activity))
      );
    }));
  }

  private createActivity(mod: Module) {
    if (mod.modname === 'quiz') {
      return of(new Quiz(mod.id, mod.name));
    } else if (mod.modname === 'page') {
      const page = new Page(mod.id, mod.name, null);
      const mainContent = mod.contents.find(content => content.filename === 'index.html');
      const otherContents = mod.contents.filter(content => content.mimetype);
      let currentContent: ContentData;
      return this.getTextFile(mainContent.fileurl).pipe(
        switchMap(resData => {
          page.content = resData;
          if (otherContents.length === 0) {
            return of(page);
          }
          return from(otherContents).pipe(
            concatMap(otherContent => {
              currentContent = otherContent;
              return this.getBinaryFile(otherContent.fileurl);
            }), concatMap(blob => {
              return this.readFile(blob);
            }), map(dataUrl => {
              page.content = page.content.replace(currentContent.filename, dataUrl);
              return page;
            })
          );
        })
      );
    }
  }

  private readFile(blob: Blob): Observable<string> {
    return new Observable(observer => {
      const fileReader = new FileReader();
      fileReader.onerror = err => observer.error(err);
      fileReader.onabort = err => observer.error(err);
      fileReader.onloadend = () => observer.complete();
      fileReader.onload = () => observer.next(fileReader.result.toString());
      return fileReader.readAsDataURL(blob);
    });
  }

  private coreEnrolGetUsersCourses() {
    return this.authService.user.pipe(switchMap(user => {
      const params = new HttpParams({
        fromObject: {
          userid: user.id.toString(),
          wstoken: user.token
        }
      });
      return this.http.post<CoreEnrolGetUsersCoursesResponse[]>(getCoursesWsUrl, params, httpOptions).pipe(timeout(10000), map(res => {
        const courses = res.map(data => new Course(data.id, data.shortname));
        this._courses.next(courses);
        return courses;
      }));
    }));
  }

  private coreCourseGetContents(courseId: number) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      const form = new FormData();
      form.append('wstoken', token);
      form.append('courseid', courseId.toString());
      const params = new HttpParams({
        fromObject: {
          courseid: courseId.toString(),
          wstoken: token
        }
      });
      return this.http.post<CoreCourseGetContentsResponse[]>(coreCourseGetContentsWsUrl, params, httpOptions);
    }));
  }

  private getBinaryFile(url: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      const params = new HttpParams({
        fromObject: {
          token
        }
      });
      return this.http.post(url, params, {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }), responseType: 'blob'
      });
    }));
  }

  private getTextFile(url: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      const params = new HttpParams({
        fromObject: {
          token
        }
      });
      return this.http.post(url, params, {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }), responseType: 'text'
      });
    }));
  }

  private saveCoursestoStorage(courses: Course[]) {
    const data = JSON.stringify(courses.map(course => course.toObject()));
    Plugins.Storage.set({ key: 'courses', value: data });
  }

  private getCoursesFromStorage() {
    return from(Plugins.Storage.get({ key: 'courses' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        console.log('Courses are not stored locally.');
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {
        id: number;
        name: string;
      }[];
      const courses = parsedData.map(element => new Course(element.id, element.name));
      return courses;
    }));
  }
}
