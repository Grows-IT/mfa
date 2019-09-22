import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, toArray, map, withLatestFrom, first, tap } from 'rxjs/operators';

import { Page } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { AuthService } from '../auth/auth.service';
import { NewsArticle } from './news-article.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private _newsArticles = new BehaviorSubject<NewsArticle[]>(null);

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService
  ) { }

  get newsArticles() {
    return this._newsArticles.asObservable();
  }

  fetchNewsArticles() {
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
        const imgResource = page.resources.find(resource => resource.type.includes('image'));
        const img = `${imgResource.url}&token=${token}&offline=1`;
        const newsArticle = new NewsArticle(page.name, img);
        return newsArticle;
      }),
      toArray(),
      tap(newsArticles => this._newsArticles.next(newsArticles))
    );
  }
}
