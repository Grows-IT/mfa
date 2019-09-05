import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, switchMap, catchError, timeout, take, flatMap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { from, BehaviorSubject, of, Observable } from 'rxjs';

import { Course, Topic, Page } from './course.model';
import { AuthService } from '../auth/auth.service';

const siteUrl = 'http://santaputra.trueddns.com:46921/moodle';
const getCoursesWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses';
const coreCourseGetContentsWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_contents';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

export interface CourseData {
  id: number;
  shortname: string;
  overviewfiles: [{
    fileurl: string;
  }];
}

export interface CoreCourseGetContentsResponseData {
  id: number;
  name: string;
  modules: [{
    id: number; // activity
    name: string;
    modname: string; // type
    contents: [{
      filename: string;
      mimetype: string;
      fileurl: string;
    }]
  }];
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private _courses = new BehaviorSubject<Course[]>(null);
  private _topics = new BehaviorSubject<Topic[]>(null);

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
          userid: user.id.toString(),
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

  getTopicsByCourseId(courseId: number) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.coreCourseGetContents(courseId, token);
    }));
  }

  private coreCourseGetContents(courseId: number, token: string) {
    const form = new FormData();
    form.append('wstoken', token);
    form.append('courseid', courseId.toString());
    return this.http.post<CoreCourseGetContentsResponseData[]>(coreCourseGetContentsWsUrl, form).pipe(map(resArr => {
      const topics: Topic[] = resArr.map(topicData => {
        const activities = [];
        topicData.modules.forEach(m => {
          if (m.modname === 'page') {
            this.processPageContents(m.contents).pipe(map(htmlStr => {
              activities.push(new Page(m.id, m.name, htmlStr));
            }));
          }
        });
        return new Topic(topicData.id, topicData.name, activities);
      });
      this._topics.next(topics);
      return topics;
    }));
  }

  private processPageContents(contents: { filename: string; mimetype: string; fileurl: string; }[]) {
    const resources = contents.filter(content => content.mimetype);
    const indexHtml = contents.find(content => !content.mimetype);
    return this.getTextFile(indexHtml.fileurl).pipe(flatMap(htmlStr => {
      resources.forEach(resource => {
        this.getBinaryFile(resource.fileurl).pipe(map(resDataUrl => {
          htmlStr.replace(resource.filename, resDataUrl);
        }));
      });
      return htmlStr;
    }));
  }

  getTopicById(topicId: number) {
    return this._topics.asObservable().pipe(map(topics => {
      const topic = topics.find(t => t.id === topicId);
      return topic;
    }));
  }

  getTextFile(url: string) {
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

  getBinaryFile(url: string) {
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
      }).pipe(switchMap(data => {
        return this.blobToDataUrl(data);
      }));
    }));
  }

private blobToDataUrl(data: Blob): Observable<string> {
  return new Observable((observer) => {
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      observer.next(dataUrl);
    };
    fr.readAsDataURL(data);
  });
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
        imgUrl: string;
      }[];
      const courses = parsedData.map(element => new Course(element.id, element.name, element.imgUrl));
      return courses;
    }));
  }
}
