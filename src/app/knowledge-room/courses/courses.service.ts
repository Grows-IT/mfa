import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, switchMap, timeout, take, concatMap, first, takeLast, withLatestFrom, toArray, find } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { from, BehaviorSubject, of, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Course, Topic, Page, Quiz, PageResource, Category } from './course.model';
import { AuthService } from '../../auth/auth.service';

const siteUrl = environment.siteUrl;
const getCoursesWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses';
const coreCourseGetContentsWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_contents';
const coreCourseGetCategoriesWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_categories';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

export interface CoursesResponseData {
  id: number;
  shortname: string;
  category: number;
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

export interface CategoryResponseData {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private _categories = new BehaviorSubject<Category[]>(null);
  private _courses = new BehaviorSubject<Course[]>(null);
  private _topics = new BehaviorSubject<Topic[]>(null);
  private _activities = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  get categories() {
    return this._categories.asObservable();
  }

  get courses() {
    return this._courses.asObservable().pipe(map(courses => courses ? courses : null));
  }

  fetchCategories() {
    return this.coreCourseGetCategories().pipe(
      switchMap(resArr => from(resArr)),
      withLatestFrom(this.authService.token),
      map(([res, token]) => {
        let imgUrl: string;
        if (res.description && res.description.length > 0) {
          const regex = /<img src="(\S+)"/;
          const match = regex.exec(decodeURI(res.description));
          imgUrl = `${match[1]}?token=${token}&offline=1`;
        }
        return new Category(res.id, res.name, imgUrl);
      }),
      toArray(),
      tap(categories => this._categories.next(categories))
    );
  }

  fetchCourses() {
    return this.coreEnrolGetUsersCourses().pipe(
      switchMap(resArr => {
        return from(resArr);
      }),
      withLatestFrom(this.authService.token),
      map(([res, token]) => {
        let img: string;
        if (res.overviewfiles && res.overviewfiles.length > 0) {
          img = `${res.overviewfiles[0].fileurl}?token=${token}&offline=1`;
        }
        return new Course(res.id, res.shortname, img, res.category);
      }),
      toArray(),
      tap(courses => this._courses.next(courses))
    );
  }

  fetchTopics(courseId: number) {
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
        this._topics.next(topics);
        return topics;
      })
    );
  }

  getTopicById(topicId: number) {
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
      const activity = activities.find((a: any) => a.id === activityId);
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

  private coreCourseGetCategories() {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const form = new FormData();
        form.append('wstoken', token);
        return this.http.post<CategoryResponseData[]>(coreCourseGetCategoriesWsUrl, form);
      }),
      timeout(10000)
    );
  }

  private coreEnrolGetUsersCourses() {
    return this.authService.token.pipe(
      first(),
      withLatestFrom(this.authService.userId),
      switchMap(([token, userId]) => {
        const params = new HttpParams({
          fromObject: {
            userid: userId.toString(),
            wstoken: token
          }
        });
        return this.http.post<CoursesResponseData[]>(getCoursesWsUrl, params, httpOptions);
      }),
      timeout(10000)
    );
  }

  private coreCourseGetContents(courseId: number) {
    return this.authService.token.pipe(
      first(),
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
      first(),
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

  getTextFile(url: string) {
    return this.authService.token.pipe(
      first(),
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
