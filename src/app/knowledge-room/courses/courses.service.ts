import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, switchMap, timeout, take, concatMap, first, takeLast, withLatestFrom, toArray, find } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { from, BehaviorSubject, of, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Course, Topic, Page, Quiz, PageResource } from './course.model';
import { AuthService } from '../../auth/auth.service';

const siteUrl = environment.siteUrl;
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
  idnumber: string;
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
  private _topics = new BehaviorSubject<Topic[]>(null);
  private _activities = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get courses() {
    // return this._courses.asObservable().pipe(first(), switchMap(courses => {
    //   if (!courses) {
    //     return this.coreEnrolGetUsersCourses();
    //   }
    //   return of(courses);
    // }));
    return this.coreEnrolGetUsersCourses();
  }

  getCourseById(courseId: number) {
    return this.courses.pipe(
      switchMap(courses => {
        const course = courses.find(c => c.id === courseId);
        // if (!!course.topics) {
        //   this._topics.next(course.topics);
        //   return of(course);
        // }
        return this.coreCourseGetContents(courseId).pipe(
          map(resArr => {
            const topics = resArr.map(res => {
              const activities = res.modules.map(mod => {
                if (mod.modname === 'quiz') {
                  return new Quiz(mod.id, mod.name);
                } else if (mod.modname === 'page') {
                  const pageResources = mod.contents.map(content => {
                    return new PageResource(content.filename, content.mimetype, content.fileurl);
                  });
                  return new Page(mod.id, mod.name, null, pageResources);
                }
              });
              return new Topic(res.id, res.name, activities);
            });
            course.topics = topics;
            this._topics.next(topics);
            this._courses.next(courses);
            return course;
          })
        );
      }),
    );
  }

  getTopicById(topicId: number) {
    // return this.courses.pipe(
    //   map(courses => {
    //     let topic: Topic = null;
    //     courses.forEach(course => {
    //       if (!topic && course.topics) {
    //         topic = course.topics.find(t => t.id === topicId);
    //         return;
    //       }
    //     });
    //     return topic;
    //   })
    // );
    return this._topics.asObservable().pipe(map(topics => {
      const topic = topics.find(t => t.id === topicId);
      if (topic && topic.activities) {
        this._activities.next(topic.activities);
      }
      return topic;
    }));
  }

  getActivityById(activityId: number) {
    // return this.courses.pipe(
    //   map(courses => {
    //     let activity = null;
    //     courses.forEach(course => {
    //       if (course.topics) {
    //         course.topics.forEach(topic => {
    //           if (!activity && topic.activities) {
    //             activity = topic.activities.find(a => a.id === activityId);
    //             return;
    //           }
    //         });
    //       }
    //     });
    //     return activity;
    //   })
    // );
    return this._activities.asObservable().pipe(map(activities => {
      const activity = activities.find(a => a.id === activityId);
      return activity;
    }));
  }

  getPageById(pageId: number): Observable<Page> {
    return this.getActivityById(pageId).pipe(
      switchMap(activity => {
        if (!(activity instanceof Page)) {
          return of(null);
        }
        const page = activity as Page;
        if (page.content) {
          return of(page);
        }
        const indexHtmlResource = page.resources.find(resource => resource.name === 'index.html');
        const otherResources = page.resources.filter(resource => resource.type);
        let otherResource: PageResource;
        return this.getTextFile(indexHtmlResource.url).pipe(
          switchMap(content => {
            page.content = content;
            return from(otherResources);
          }),
          concatMap(resource => {
            otherResource = resource;
            return this.getBinaryFile(resource.url);
          }),
          map(data => {
            otherResource.data = data;
            return otherResource;
          }),
          toArray(),
          map(resources => {
            page.resources = resources;
            return page;
          })
        );
      })
    );
  }

  downloadResources(page: Page) {
    const indexHtmlResource = page.resources.find(resource => resource.name === 'index.html');
    const otherResources = page.resources.filter(resource => resource.type);
    let otherResource: PageResource;
    return this.getTextFile(indexHtmlResource.url).pipe(
      switchMap(content => {
        page.content = content;
        return from(otherResources);
      }),
      concatMap(resource => {
        otherResource = resource;
        return this.getBinaryFile(resource.url);
      }),
      map(data => {
        otherResource.data = data;
        return otherResource;
      }),
      toArray(),
      map(resources => {
        page.resources = resources;
        return page;
      })
    );
  }

  private coreEnrolGetUsersCourses() {
    return this.authService.token.pipe(
      withLatestFrom(this.authService.userId),
      switchMap(([token, userId]) => {
        const params = new HttpParams({
          fromObject: {
            userid: userId.toString(),
            wstoken: token
          }
        });
        return this.http.post<CoreEnrolGetUsersCoursesResponse[]>(getCoursesWsUrl, params, httpOptions);
      }),
      timeout(10000),
      map(res => {
        const courses = res.map(data => new Course(data.id, data.shortname, data.idnumber));
        this._courses.next(courses);
        return courses;
      })
    );
  }

  private coreCourseGetContents(courseId: number) {
    return this.authService.token.pipe(
      switchMap(token => {
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
      })
    );
  }

  private getBinaryFile(url: string) {
    return this.authService.token.pipe(
      switchMap(token => {
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
      })
    );
  }

  private getTextFile(url: string) {
    return this.authService.token.pipe(
      switchMap(token => {
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
      })
    );
  }

  // private saveCoursestoStorage(courses: Course[]) {
  //   const data = JSON.stringify(courses.map(course => course.toObject()));
  //   Plugins.Storage.set({ key: 'courses', value: data });
  // }

  // private getCoursesFromStorage() {
  //   return from(Plugins.Storage.get({ key: 'courses' })).pipe(map(storedData => {
  //     if (!storedData || !storedData.value) {
  //       console.log('Courses are not stored locally.');
  //       return null;
  //     }
  //     const parsedData = JSON.parse(storedData.value) as {
  //       id: number;
  //       name: string;
  //     }[];
  //     const courses = parsedData.map(element => new Course(element.id, element.name));
  //     return courses;
  //   }));
  // }
}
