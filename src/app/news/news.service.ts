import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { switchMap, concatMap, toArray, tap, map, first, take, takeWhile, flatMap, withLatestFrom } from 'rxjs/operators';

import { Page } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private _pages = new BehaviorSubject<Page[]>(null);

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService
  ) { }

  get pages() {
    return this._pages.asObservable();
    // return this._pages.asObservable().pipe(
    //   first(),
    //   switchMap(pages => {
    //     if (pages) {
    //       return of(pages);
    //     }
    //     let pageNum: number;
    //     return this.coursesService.courses.pipe(
    //       switchMap(courses => {
    //         const newsCourse = courses.find(course => course.identifier === 'news');
    //         return this.coursesService.getCourseById(newsCourse.id);
    //       }),
    //       switchMap(newsCourse => {
    //         const p = newsCourse.topics[0].activities as Page[];
    //         pageNum = p.length;
    //         return from(p);
    //       }),
    //       concatMap(page => {
    //         return this.coursesService.downloadResources(page);
    //       }),
    //       take(2),
    //       toArray(),
    //       tap(p => this._pages.next(p))
    //     );
    //   })
    // );
  }

  fetchNews() {
    return this.coursesService.fetchCourses().pipe(
      switchMap(courses => {
        const newsCourse = courses.find(course => course.name === 'News and Update');
        return this.coursesService.fetchTopics(newsCourse.id);
      }),
      switchMap(topics => {
        return from(topics[0].activities as Page[]);
      }),
      withLatestFrom(this.authService.token),
      map(([page, token]) => {
        const imgResource = page.resources.find(resource => resource.type.includes('image'));
        page.img = `${imgResource.url}&token=${token}&offline=1`;
        return page;
      }),
      toArray()
    );
  }
}
