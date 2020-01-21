import { Injectable } from '@angular/core';
import { BehaviorSubject, of, from } from 'rxjs';
import { switchMap, map, first, tap, withLatestFrom, concatMap, toArray } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { Page } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { NewsArticle } from './news.model';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private _newsArticles = new BehaviorSubject<NewsArticle[]>(null);

  constructor(
    private coursesService: CoursesService,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  get newsArticles() {
    return this._newsArticles.asObservable();
  }

  areNewsArticlesLoaded() {
    return this.newsArticles.pipe(
      first(),
      switchMap(newsArticles => {
        if (newsArticles) {
          return of(!!newsArticles);
        }
        return this.getNewsArticlesFromStorage().pipe(
          map(storedNewsArticles => {
            return !!storedNewsArticles;
          })
        );
      })
    );
  }

  fetchNewsArticles() {
    return this.coursesService.fetchAndDownloadNewsTopics().pipe(
      switchMap(topics => {
        const pages = topics[0].activities as Page[];
        return from(pages);
      }),
      withLatestFrom(this.authService.token),
      concatMap(([page, token]) => {
        // Parse news content
        const contentRes = page.resources.find(resource => resource.name === 'index.html');
        const otherRes = page.resources.filter(resource => resource.type);
        let content = decodeURI(contentRes.data);
        const regex = /(\?time=.+?")/;
        otherRes.forEach(resource => {
          content = content.replace(regex, '"');
          content = content.replace(resource.name, resource.data);
        });
        // Get description for cover image
        const regex2 = /<img src=\"(\w+:\/\/[\w\d\.]+)(\S+)"/g;
        let descriptionUrl = null;

        if (page.description) {
          const match = regex2.exec(page.description);
          if (match) {
            const regexDeleteTime = /(\?time=.+\?)/;
            descriptionUrl = `${match[1]}/webservice${match[2]}?token=${token}`;
            descriptionUrl = descriptionUrl.replace(regexDeleteTime, '?');

            return this.http.get(descriptionUrl, { responseType: 'blob' }).pipe(
              switchMap(blob => this.authService.readFile(blob)),
              map(imgData => {
                const description = page.description.replace(regex2, '<img src=\"' + imgData + '"');
                return new NewsArticle(page.id, page.name, content, description);
              })
            );
          }
          return of(new NewsArticle(page.id, page.name, content, page.description));
        }
        return of(new NewsArticle(page.id, page.name, content, null));
      }),
      toArray(),
      tap(newsArticles => {
        newsArticles = newsArticles.reverse();
        this._newsArticles.next(newsArticles);
        this.saveNewsArticlesToStorage(newsArticles);
      })
    );
  }

  private saveNewsArticlesToStorage(newsArticles: NewsArticle[]) {
    const data = JSON.stringify(newsArticles.map(newsArticle => newsArticle.toObject()));
    Storage.set({ key: 'news', value: data });
  }

  getNewsArticlesFromStorage() {
    return from(Storage.get({ key: 'news' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const newsArticles = JSON.parse(storedData.value) as NewsArticle[];
      this._newsArticles.next(newsArticles);
      return newsArticles;
    }));
  }

  delete() {
    this._newsArticles.next(null);
  }
}
