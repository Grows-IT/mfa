import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, toArray, map, withLatestFrom, first, tap } from 'rxjs/operators';

import { Page } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  getNewsPageById(id: number) {
    return this.newsPages.pipe(
      map(newsArticles => {
        if (!newsArticles) {
          return null;
        }
        return newsArticles.find(article => article.id === id);
      })
    );
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
      withLatestFrom(this.authService.token),
      map(([page, token]) => {
        const imgResource = page.resources.find(resource => resource.type && resource.type.includes('image'));
        if (imgResource) {
          page.img = `${imgResource.url}&token=${token}&offline=1`;
        }
        return page;
      }),
      toArray(),
      tap(newsArticles => this._newsPages.next(newsArticles))
    );
  }

  getContent(url: string) {
    return this.http.get(url, {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }), responseType: 'text'
    });
  }
}
