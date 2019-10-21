import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, switchMap, timeout, first, withLatestFrom, toArray, flatMap, concatMap, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { from, BehaviorSubject, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Course, Topic, Page, Quiz, PageResource, Category } from './course.model';
import { AuthService } from '../../auth/auth.service';

const { Storage } = Plugins;

interface CoreEnrolResponseData {
  id: number;
  shortname: string;
  category: number;
  visible: number;
  overviewfiles: OverviewFile[];
}

interface OverviewFile {
  fileurl: string;
}

interface CoreCourseGetContentsResponse {
  id: number;
  name: string;
  modules: Module[];
}

interface Module {
  id: number;
  name: string;
  modname: string;
  contents: ContentData[];
}

interface ContentData {
  filename: string;
  mimetype: string;
  fileurl: string;
}

interface CategoryResponseData {
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

  areTopicsLoaded(courseId: number) {
    return this.topics.pipe(
      switchMap(topics => {
        if (topics) {
          return of(!!topics);
        }
        return this.getTopicsFromStorage(courseId).pipe(map(storedTopics => {
          return !!storedTopics;
        }));
      })
    );
  }

  // Return courses in memory, in storage or from fetching.
  getCourses() {
    return this.courses.pipe(
      first(),
      switchMap(courses => {
        if (courses) {
          return of(courses);
        }
        return this.getCoursesFromStorage().pipe(
          switchMap(storedCourses => {
            if (storedCourses) {
              return of(storedCourses);
            }
            return this.fetchCourses();
          })
        );
      })
    );
  }

  // Return topics in memory, in storage, or from fetching.
  getTopics(courseId: number) {
    return this.topics.pipe(
      first(),
      switchMap(topics => {
        if (topics) {
          return of(topics);
        }
        return this.getTopicsFromStorage(courseId).pipe(
          switchMap(storedTopics => {
            if (storedTopics) {
              return of(storedTopics);
            }
            return this.fetchTopics(courseId);
          })
        );
      })
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

  fetchAndDownloadNewsTopics() {
    return this.getCourses().pipe(
      map(courses => {
        const newsCourse = courses.find(course => course.name === environment.newsCourseName);
        return newsCourse.id;
      }),
      switchMap(courseId => {
        return this.fetchTopics(courseId);
      }),
      switchMap(topics => {
        return this.downloadResources(topics);
      }),
    );
  }

  fetchCourseTopics(courseId: number) {
    return this.fetchTopics(courseId).pipe(
      tap(topics => {
        this._topics.next(topics);
        this.saveTopicsToStorage(courseId, topics);
      })
    );
  }

  // Download topics's resources for offline use.
  downloadCourseTopics(courseId: number) {
    return this.getTopics(courseId).pipe(
      first(),
      switchMap(topics => this.downloadResources(topics)),
      tap(topics => {
        this._topics.next(topics);
        this.saveTopicsToStorage(courseId, topics);
      })
    );
  }

  delete() {
    this._categories.next(null);
    this._courses.next(null);
    this._topics.next(null);
  }

  private fetchTopics(courseId: number) {
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
      toArray()
    );
  }

  private downloadResources(topics: Topic[]) {
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
      toArray()
    );
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
        const params = new HttpParams({
          fromObject: {
            wstoken: token,
            wsfunction: 'core_course_get_categories'
          }
        });
        return this.http.post<CategoryResponseData[]>(environment.webServiceUrl, params);
      }),
      timeout(environment.timeoutDuration)
    );
  }

  private coreEnrolGetUsersCourses() {
    return this.authService.token.pipe(
      first(),
      withLatestFrom(this.authService.userId),
      switchMap(([token, userId]) => {
        const params = new HttpParams({
          fromObject: {
            wstoken: token,
            wsfunction: 'core_enrol_get_users_courses',
            userid: userId.toString(),
          }
        });
        return this.http.post<CoreEnrolResponseData[]>(environment.webServiceUrl, params);
      }),
      timeout(environment.timeoutDuration)
    );
  }

  private coreCourseGetContents(courseId: number) {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            wstoken: token,
            wsfunction: 'core_course_get_contents',
            courseid: courseId.toString()
          }
        });
        return this.http.post<CoreCourseGetContentsResponse[]>(environment.webServiceUrl, params);
      }),
      timeout(environment.timeoutDuration)
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
    const data = JSON.stringify(categories);
    Storage.set({ key: 'categories', value: data });
  }

  getCategoriesFromStorage() {
    return from(Storage.get({ key: 'categories' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const categories: Category[] = JSON.parse(storedData.value);
      this._categories.next(categories);
      return categories;
    }));
  }

  private saveTopicsToStorage(courseId: number, topics: Topic[]) {
    const data = JSON.stringify(topics.map(topic => topic.toObject()));
    Storage.set({ key: `course_${courseId}_topics`, value: data });
  }

  getTopicsFromStorage(courseId: number) {
    return from(Storage.get({ key: `course_${courseId}_topics` })).pipe(map(storedData => {
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
    const data = JSON.stringify(courses);
    Storage.set({ key: 'courses', value: data });
  }

  getCoursesFromStorage() {
    return from(Storage.get({ key: 'courses' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const courses: Course[] = JSON.parse(storedData.value);
      this._courses.next(courses);
      return courses;
    }));
  }
}
