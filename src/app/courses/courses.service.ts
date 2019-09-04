import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, switchMap, catchError, timeout, take } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { from, BehaviorSubject, of } from 'rxjs';

import { Course, Topic, Activity, ActivityFile } from './course.model';
import { AuthService } from '../auth/auth.service';

const siteUrl = 'http://santaputra.trueddns.com:46921/moodle';
const getCoursesWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_enrol_get_users_courses';
const getCourseContentWsUrl = siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_course_get_contents';

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
  private _activities = new BehaviorSubject<Activity[]>(null);
  private _activityFiles = new BehaviorSubject<ActivityFile[]>(null);

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
      const form = new FormData();
      form.append('wstoken', token);
      form.append('courseid', courseId.toString());
      return this.http.post<TopicData[]>(getCourseContentWsUrl, form).pipe(map(res => {
        const topics: Topic[] = res.map(topicData => {
          const activities = topicData.modules.map(m => {
            const files = m.contents.map(content => new ActivityFile(content.filename, content.mimetype, content.fileurl));
            const activity = new Activity(m.id, m.name, m.modname, files);
            return activity;
          });
          return new Topic(topicData.id, topicData.name, activities);
        });
        this._topics.next(topics);
        return topics;
      }));
    }));
  }

  getTopicById(topicId: number) {
    return this._topics.asObservable().pipe(map(topics => {
      const topic = topics.find(t => t.id === topicId);
      this._activities.next(topic.activities);
      return topic;
    }));
  }

  getActivityById(activityId: number) {
    return this._activities.asObservable().pipe(map(activities => {
      const activity = activities.find(a => a.id === activityId);
      return activity;
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
        id: number;
        name: string;
        imgUrl: string;
      }[];
      const courses = parsedData.map(element => new Course(element.id, element.name, element.imgUrl));
      return courses;
    }));
  }
}
