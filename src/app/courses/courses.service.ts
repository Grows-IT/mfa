import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, switchMap, catchError, timeout, take } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { from, BehaviorSubject, of } from 'rxjs';

import { Course, Topic, Page, Quiz, PageResource } from './course.model';
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

export interface TopicData {
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
  private _activities = new BehaviorSubject<any[]>(null);

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

  getTopicById(topicId: number) {
    return this._topics.asObservable().pipe(take(1), map(topics => {
      const topic = topics.find(t => t.id === topicId);
      this._activities.next(topic.activities);
      return topic;
    }));
  }

  getActivityById(activityId: number) {
    return this._activities.asObservable().pipe(take(1), map(activities => {
      const activity = activities.find(a => a.id === activityId);
      return activity;
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

  // getTopicsByCourseId(courseId: number) {
  //   return this.authService.token.pipe(take(1), switchMap(token => {
  //     const form = new FormData();
  //     form.append('wstoken', token);
  //     form.append('courseid', courseId.toString());
  //     return this.http.post<TopicData[]>(coreCourseGetContentsWsUrl, form).pipe(map(topicsData => {
  //       const topics = topicsData.map(topicData => {
  //         const activities = [];
  //         topicData.modules.map(module => {
  //           if (module.modname === 'page') {
  //             let htmlString: string;
  //             const indexHtml = module.contents.find(content => content.filename === 'index.html');
  //             const params = new HttpParams({
  //               fromObject: {
  //                 token
  //               }
  //             });
  //             this.http.post(indexHtml.fileurl, params, {
  //               headers: new HttpHeaders({
  //                 Accept: 'application/json',
  //                 'Content-Type': 'application/x-www-form-urlencoded'
  //               }), responseType: 'text'
  //             }).subscribe(str => {
  //               htmlString = str;
  //               const resources = module.contents.filter(content => content.mimetype);
  //               if (resources.length === 0) {
  //                 activities.push(new Page(module.id, module.name, htmlString));
  //               }
  //               resources.map(resource => {
  //                 this.http.post(resource.fileurl, params, {
  //                   headers: new HttpHeaders({
  //                     Accept: 'application/json',
  //                     'Content-Type': 'application/x-www-form-urlencoded'
  //                   }), responseType: 'blob'
  //                 }).subscribe(data => {
  //                   const fr = new FileReader();
  //                   fr.onload = () => {
  //                     const dataUrl = fr.result.toString();
  //                     htmlString = htmlString.replace(resource.filename, dataUrl);
  //                     activities.push(new Page(module.id, module.name, htmlString));
  //                   };
  //                   fr.readAsDataURL(data);
  //                 });
  //               });
  //             });
  //           } else if (module.modname === 'quiz') {
  //             activities.push(new Quiz(module.id));
  //           }
  //         });
  //         return new Topic(topicData.id, topicData.name, activities);
  //       });
  //       this._topics.next(topics);
  //       return topics;
  //     }));
  //   }));
  // }

  getCourseById(courseId: number) {
    return this.coreCourseGetContents(courseId);
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
      return this.http.post<TopicData[]>(coreCourseGetContentsWsUrl, params, httpOptions);
    }), map(responseArray => {
      const topics = responseArray.map(response => {
        return this.parseTopicData(response);
      });
      return topics;
    }));
  }

  private parseTopicData(topicData: TopicData) {
    const activities = topicData.modules.map(module => {
      return this.parseModule(module);
    });
    return new Topic(topicData.id, topicData.name, activities);
  }

  private parseModule(moduleData: Module) {
    if (moduleData.modname === 'quiz') {
      return new Quiz(moduleData.id);
    } else {
      const pageResources = moduleData.contents.map(moduleContent => {
        return new PageResource(moduleContent.filename, moduleContent.fileurl, moduleContent.mimetype, null);
      });
      return new Page(moduleData.id, moduleData.name, null, pageResources);
    }
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
