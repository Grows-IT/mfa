import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, switchMap, timeout, first, withLatestFrom, toArray, flatMap, concatMap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { from, BehaviorSubject, Observable, throwError, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Course, Topic, Page, Quiz, PageResource, Category } from './course.model';
import { AuthService } from '../../auth/auth.service';

const { Storage } = Plugins;
const duration = environment.timeoutDuration;
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

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  get categories() {
    return this._categories.asObservable();
  }

  get courses() {
    return this._courses.asObservable();
  }

  get topics() {
    return this._topics.asObservable();
  }

  fetchCategories() {
    return this.coreCourseGetCategories().pipe(
      switchMap(resArr => from(resArr)),
      withLatestFrom(this.authService.token),
      concatMap(([res, token]) => {
        if (res.description && res.description.length > 0) {
          const regex = /<img src="(\S+)"/;
          const match = regex.exec(decodeURI(res.description));
          const imgUrl = `${match[1]}?token=${token}&offline=1`;
          return this.http.get(imgUrl, { responseType: 'blob' }).pipe(
            tap(data => console.log(data)),
            switchMap(blob => this.readFile(blob)),
            tap(data => console.log(data)),
            map(imgData => {
              return new Category(res.id, res.name, imgUrl, imgData);
            })
          );
        }
        return of(new Category(res.id, res.name));
      }),
      toArray(),
      map(categories => {
        this._categories.next(categories);
        this.saveCategoriesToStorage(categories);
        return true;
      })
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
      map(courses => {
        this._courses.next(courses);
        this.saveCoursestoStorage(courses);
        return true;
      })
    );
  }

  fetchTopics(courseId: number) {
    return this.coreCourseGetContents(courseId).pipe(
      withLatestFrom(this.authService.token),
      map(([resArr, token]) => {
        const topics = resArr.map(res => {
          const activities = res.modules.map(mod => {
            if (mod.modname === 'quiz') {
              return new Quiz(mod.id, mod.name);
            } else if (mod.modname === 'page') {
              const pageResources = mod.contents.map(content => {
                const fileUrl = `${content.fileurl}&token=${token}&offline=1`;
                return new PageResource(content.filename, content.mimetype, fileUrl);
              });
              return new Page(mod.id, mod.name, null, pageResources);
            }
          });
          return new Topic(res.id, res.name, activities);
        });
        return topics;
      }),
      withLatestFrom(this.courses),
      map(([topics, courses]) => {
        const course = courses.find(c => c.id === courseId);
        course.topics = topics;
        this._courses.next(courses);
        this.saveCoursestoStorage(courses);
        return topics;
      })
    );
  }

  downloadCourse(courseId: number) {
    let courses: Course[];
    return this.courses.pipe(
      first(),
      map(cs => {
        courses = cs;
        return cs.find(c => c.id === courseId);
      }),
      switchMap(c => from(c.topics)),
      flatMap(topic => from(topic.activities.filter(activity => activity instanceof Page))),
      flatMap((p: Page) => {
        return this.downloadResources(p);
      }),
      toArray(),
      tap(() => {
        this._courses.next(courses);
        this.saveCoursestoStorage(courses);
      })
    );
  }

  private downloadResources(page: Page) {
    let currentResource: PageResource;
    return from(page.resources).pipe(
      concatMap(resource => {
        currentResource = resource;
        if (resource.name === 'index.html') {
          return this.http.get(resource.url, { responseType: 'text' });
        }
        return this.http.get(resource.url, { responseType: 'blob' }).pipe(
          flatMap(blob => {
            return this.readFile(blob);
          })
        );
      }),
      map(data => {
        currentResource.data = data;
        return currentResource;
      }),
      toArray(),
      map(resources => {
        page.resources = resources;
        return page;
      })
    );
  }

  private readFile(blob: Blob): Observable<string> {
    if (!(blob instanceof Blob)) {
      return throwError(new Error('`blob` must be an instance of File or Blob.'));
    }
    return new Observable(obs => {
      const reader = new FileReader();
      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result.toString());
      reader.onloadend = () => obs.complete();
      return reader.readAsDataURL(blob);
    });
  }

  fetchResources(courseId: number, topicId: number, activityId: number) {
    let page: Page;
    let courses: Course[];
    return this.courses.pipe(
      first(),
      map(cs => {
        courses = cs;
        return cs.find(c => c.id === courseId);
      }),
      map(course => course.topics.find(topic => topic.id === topicId)),
      map(topic => topic.activities.find(activity => activity.id === activityId)),
      switchMap((p: Page) => {
        page = p;
        const indexHtmlResource = p.resources.find(resource => resource.name === 'index.html');
        return this.getTextFile(indexHtmlResource.url);
      }),
      map(content => {
        const mediaResources = page.resources.filter(resource => resource.type);
        mediaResources.forEach(mediaResource => {
          content = content.replace(mediaResource.name, mediaResource.url);
        });
        page.content = content;
        this._courses.next(courses);
        this.saveCoursestoStorage(courses);
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
      timeout(duration)
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
      timeout(duration)
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

  private saveCategoriesToStorage(categories: Category[]) {
    const data = JSON.stringify(categories.map(category => {
      return category.toObject();
    }));
    Storage.set({ key: 'categories', value: data });
  }

  getCategoriesFromStorage() {
    return from(Storage.get({ key: 'categories' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        console.log('Categories are not stored locally');
        return false;
      }
      const parsedData = JSON.parse(storedData.value) as {
        id: number,
        name: string,
        imgUrl: string,
        imgData: string
      }[];
      const categories = parsedData.map(categoryData => {
        return new Category(categoryData.id, categoryData.name, categoryData.imgUrl, categoryData.imgData);
      });
      this._categories.next(categories);
      return true;
    }));
  }

  private saveCoursestoStorage(courses: Course[]) {
    const data = JSON.stringify(courses.map(course => course.toObject()));
    Storage.set({ key: 'courses', value: data });
  }

  getCoursesFromStorage() {
    return from(Storage.get({ key: 'courses' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        console.log('Courses are not stored locally.');
        return false;
      }
      const parsedData = JSON.parse(storedData.value) as {
        id: number;
        name: string;
        img: string,
        categoryId: number;
        topics: [{
          id: number;
          name: string,
          activities: [{
            id: number,
            name: string,
            type: string,
            content: string,
            img: string,
            resources: [{
              name: string,
              type: string,
              url: string,
              data: string
            }]
          }]
        }]
      }[];
      const courses = parsedData.map(courseData => {
        let topics: Topic[];
        if (courseData.topics) {
          topics = courseData.topics.map(topicData => {
            let activities: any[];
            if (topicData.activities) {
              activities = topicData.activities.map(activityData => {
                if (activityData.type === 'quiz') {
                  return new Quiz(activityData.id, activityData.name);
                }
                if (activityData.type === 'page') {
                  let resources: PageResource[];
                  if (activityData.resources) {
                    resources = activityData.resources.map(resourceData => {
                      return new PageResource(resourceData.name, resourceData.type, resourceData.url, resourceData.data);
                    });
                    return new Page(activityData.id, activityData.name, activityData.content, resources, activityData.img);
                  }
                }
              });
            }
            return new Topic(topicData.id, topicData.name, activities);
          });
        }
        return new Course(courseData.id, courseData.name, courseData.img, courseData.categoryId, topics);
      });
      this._courses.next(courses);
      return true;
    }));
  }
}
