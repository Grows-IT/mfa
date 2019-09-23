import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, toArray, map, withLatestFrom, first, tap } from 'rxjs/operators';

import { Page } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { AuthService } from '../auth/auth.service';
import { NewsArticle } from './news-article.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private _newsArticles = new BehaviorSubject<NewsArticle[]>(null);

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  get newsArticles() {
    return this._newsArticles.asObservable();
  }

  getNewsArticleById(id: number) {
    return this.newsArticles.pipe(
      map(newsArticles => {
        if (!newsArticles) {
          return null;
        }
        return newsArticles.find(article => article.id === id);
      })
    );
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
        const contentResource = page.resources.find(resource => resource.name === 'index.html');
        const img = `${imgResource.url}&token=${token}&offline=1`;
        const content = `${contentResource.url}&token=${token}&offline=1`;
        const newsArticle = new NewsArticle(page.id, page.name, img, content);
        return newsArticle;
      }),
      toArray(),
      tap(newsArticles => this._newsArticles.next(newsArticles))
    );
  }

  getContent(article: NewsArticle) {
    return this.http.get(article.content, {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }), responseType: 'text'
    });
  }
}
