import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, switchMap, catchError, timeout, take, flatMap, toArray } from 'rxjs/operators';
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

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get courses() {
    return this._courses.asObservable().pipe(take(1), switchMap(courses => {
      if (!courses) { // No courses stored in memory, fetch new courses.
        return this.coreEnrolGetUsersCourses();
      }
      return of(courses);
    }));
  }
  getCourseById(courseId: number) {
    return this._courses.asObservable().pipe(take(1), switchMap(courses => {
      const course = courses.find(c => c.id === courseId);
      if (!course) {
        throw new Error(`Course with id: ${courseId} does not exist.`);
      }
      if (!course.topics) {
        return this.coreCourseGetContents(courseId).pipe(switchMap(topics => {
          course.topics = topics;
          return from(topics);
        }), switchMap(topic => {
          const pages: Page[] = topic.activities.filter(activity => activity instanceof Page);
          return from(pages);
        }), flatMap(page => {
          return this.downloadPageResources(page);
        }), toArray(), map(() => {
          this._courses.next(courses);
          return course;
        }));
      }
      return of(course);
    }));
  }

  private downloadPageResources(page: Page) {
    return from(page.resources).pipe(flatMap(resource => {
      return this.getBinaryFile(resource.url).pipe(map(data => {
        resource.data = data;
      }));
    }));
  }

  private coreEnrolGetUsersCourses() {
    return this.authService.user.pipe(switchMap(user => {
      const params = new HttpParams({
        fromObject: {
          userid: user.id.toString(),
          wstoken: user.token
        }
      });
      return this.http.post<CourseData[]>(getCoursesWsUrl, params, httpOptions).pipe(timeout(10000), map(res => {
        const courses = res.map((data) => new Course(data.id, data.shortname, data.overviewfiles[0].fileurl));
        this._courses.next(courses);
        return courses;
      }));
    }));
  }

  private readFile(data: Blob) {
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
    };
    fr.readAsDataURL(data);
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
      return responseArray.map(topicData => {
        return this.parseTopicData(topicData);
      });
    }));
  }

  private parseTopicData(topicData: TopicData) {
    const activities = topicData.modules.map(module => {
      return this.parseModule(module);
    });
    return new Topic(topicData.id, topicData.name, activities);
  }

  private parseModule(module: Module) {
    if (module.modname === 'quiz') {
      return new Quiz(module.id, module.name);
    } else { // Page
      const resources = module.contents.map(content => new PageResource(content.filename, content.fileurl, content.mimetype));
      return new Page(module.id, module.name, resources);
    }
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
