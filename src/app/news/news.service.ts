import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, toArray, map, withLatestFrom, first, tap } from 'rxjs/operators';

import { Page } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private _newsPages = new BehaviorSubject<Page[]>(null);

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  get newsPages() {
    return this._newsPages.asObservable();
  }

  fetchNewsPages() {
    return this.coursesService.courses.pipe(
      first(),
      switchMap(courses => {
        const newsCourse = courses.find(course => course.name === 'News and Update');
        return this.coursesService.fetchTopics(newsCourse.id);
      }),
      switchMap(topics => {
        return from(topics[0].activities as Page[]);
      }),
      map(page => {
        const imgResource = page.resources.find(resource => resource.type && resource.type.includes('image'));
        if (imgResource) {
          page.img = imgResource.url;
        }
        return page;
      }),
      toArray(),
      tap(newsPages => this._newsPages.next(newsPages))
    );
  }

  fetchResources(pageId: number) {
    return this.coursesService.courses.pipe(
      first(),
      switchMap(courses => {
        const course = courses.find(c => c.name === 'News and Update');
        const topic = course.topics[0];
        return this.coursesService.fetchResources(course.id, topic.id, pageId);
      }),
      withLatestFrom(this.newsPages),
      map(([fetchedPage, newsPages]) => {
        const index = newsPages.findIndex(p => p.id === fetchedPage.id);
        newsPages.splice(index, 1, fetchedPage);
        this._newsPages.next(newsPages);
        return fetchedPage;
      })
    );
  }
}
