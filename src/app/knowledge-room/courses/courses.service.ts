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
const coreEnrolGetUsersCoursesWsUrl = siteUrl +
  '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses';
const coreCourseGetContentsWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_contents';
const coreCourseGetCategoriesWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_categories';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

export interface CoreEnrolResponseData {
  id: number;
  shortname: string;
  category: number;
  visible: number;
  overviewfiles: OverviewFile[];
}

export interface OverviewFile {
  fileurl: string;
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
    return this._topics.asObservable().pipe();
  }

  areCoursesLoaded() {
    return this.courses.pipe(
      first(),
      switchMap(courses => {
        if (courses) {
          return of(!!courses);
        }
        return this.getCoursesFromStorage().pipe(
          map(storedCourses => {
            return !!storedCourses;
          })
        );
      }),
    );
  }

  areTopicsLoaded() {
    return this.topics.pipe(
      first(),
      switchMap(topics => {
        if (topics) {
          return of(!!topics);
        }
        return this.getTopicsFromStorage().pipe(
          map(storedTopics => {
            return !!storedTopics;
          })
        );
      }),
    );
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
            switchMap(blob => this.readFile(blob)),
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
        return categories;
      })
    );
  }

  fetchCourses() {
    return this.coreEnrolGetUsersCourses().pipe(
      switchMap(resArr => {
        const courseDataArray = resArr.filter(courseData => courseData.visible === 1);
        return from(courseDataArray);
      }),
      withLatestFrom(this.authService.token),
      concatMap(([res, token]) => {
        if (!res.overviewfiles || res.overviewfiles.length === 0) {
          return of(new Course(res.id, res.category, res.shortname));
        }
        const imgUrl = `${res.overviewfiles[0].fileurl}?token=${token}&offline=1`;
        return this.getBinaryFile(imgUrl).pipe(
          map(imgData => {
            return new Course(res.id, res.category, res.shortname, imgUrl, imgData);
          })
        );
      }),
      toArray(),
      map(courses => {
        this._courses.next(courses);
        this.saveCoursestoStorage(courses);
        return courses;
      })
    );
  }

  fetchTopics(courseId: number) {
    return this.coreCourseGetContents(courseId).pipe(
      concatMap(resArr => {
        return from(resArr);
      }),
      concatMap(res => {
        if (!res.modules && res.modules.length === 0) {
          return of(new Topic(res.id, courseId, res.name, null));
        }
        return from(res.modules).pipe(
          concatMap(mod => {
            return this.parseModule(mod);
          }),
          toArray(),
          map(activities => {
            return new Topic(res.id, courseId, res.name, activities);
          }),
        );
      }),
      toArray(),
      withLatestFrom(this.topics),
      map(([newTopics, oldTopics]) => {
        this.updateTopics(newTopics, oldTopics);
        return newTopics;
      })
    );
  }

  downloadResources(topics: Topic[]) {
    return from(topics).pipe(
      concatMap(topic => {
        if (!topic.activities || topic.activities.length === 0) {
          return of(topic);
        }
        return from(topic.activities).pipe(
          concatMap(activity => {
            if (activity instanceof Page) {
              const page = activity as Page;
              let savedResource: PageResource;
              return from(page.resources).pipe(
                concatMap(resource => {
                  savedResource = resource;
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
                  savedResource.data = data;
                  return savedResource;
                }),
                toArray(),
                map(resources => {
                  page.resources = resources;
                  return page;
                })
              );
            }
            return of(activity);
          }),
          toArray(),
          map(activities => {
            topic.activities = activities;
            return topic;
          }),
        );
      }),
      toArray(),
      withLatestFrom(this.topics),
      map(([topicsWithResources, oldTopics]) => {
        const updatedTopics = this.updateTopics(topicsWithResources, oldTopics);
        this._topics.next(updatedTopics);
        this.saveTopicsToStorage(updatedTopics);
        return topicsWithResources;
      })
    );
  }

  delete() {
    this._categories.next(null);
    this._courses.next(null);
    this._topics.next(null);
  }

  private updateTopics(newTopics: Topic[], oldTopics: Topic[]) {
    let updatedTopics: Topic[];
    if (!oldTopics) {
      updatedTopics = newTopics;
    } else {
      const courseId = newTopics[0].courseId;
      const filteredTopics = oldTopics.filter(topic => topic.courseId !== courseId);
      updatedTopics = filteredTopics.concat(newTopics);
    }
    return updatedTopics;
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
        return this.http.post<CoreEnrolResponseData[]>(coreEnrolGetUsersCoursesWsUrl, params, httpOptions);
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
      }),
    );
  }

  private parseModule(mod: Module) {
    if (mod.modname === 'quiz') {
      return of(new Quiz(mod.id, mod.name));
    } else if (mod.modname === 'page') {
      return from(mod.contents).pipe(
        withLatestFrom(this.authService.token),
        map(([content, token]) => {
          content.fileurl = `${content.fileurl}&token=${token}&offline=1`;
          return new PageResource(content.filename, content.mimetype, content.fileurl);
        }),
        toArray(),
        map(resources => {
          return new Page(mod.id, mod.name, null, resources);
        })
      );
    }
  }

  private getBinaryFile(url: string) {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      switchMap(blob => {
        return this.readFile(blob);
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
        return null;
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
      return categories;
    }));
  }

  private saveTopicsToStorage(topics: Topic[]) {
    const data = JSON.stringify(topics.map(course => course.toObject()));
    Storage.set({ key: 'topics', value: data });
  }

  getTopicsFromStorage() {
    return from(Storage.get({ key: 'topics' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {
        id: number,
        courseId: number,
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
      }[];
      const topics = parsedData.map(topicData => {
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
        return new Topic(topicData.id, topicData.courseId, topicData.name, activities);
      });
      this._topics.next(topics);
      return topics;
    }));
  }

  private saveCoursestoStorage(courses: Course[]) {
    const data = JSON.stringify(courses.map(course => course.toObject()));
    Storage.set({ key: 'courses', value: data });
  }

  getCoursesFromStorage() {
    return from(Storage.get({ key: 'courses' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {
        id: number;
        categoryId: number;
        name: string;
        imgUrl: string,
        imgData: string
      }[];
      const courses = parsedData.map(courseData => {
        return new Course(courseData.id, courseData.categoryId, courseData.name, courseData.imgUrl, courseData.imgData);
      });
      this._courses.next(courses);
      return courses;
    }));
  }
}
