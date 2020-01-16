import { Injectable } from '@angular/core';
import { BehaviorSubject, of, from } from 'rxjs';
import { switchMap, map, first, tap, catchError } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { Page } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { NewsArticle } from './news.model';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private _newsArticles = new BehaviorSubject<NewsArticle[]>(null);

  constructor(
    private coursesService: CoursesService
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
      map(topics => {
        const pages = topics[0].activities as Page[];
        const newsArticles = pages.map(page => {
          const contentRes = page.resources.find(resource => resource.name === 'index.html');
          const imgRes = page.resources.find(resource => resource.type && resource.type.includes('image'));
          const otherRes = page.resources.filter(resource => resource.type);
          let content = decodeURI(contentRes.data);
          const regex = /(\?time=.+?")/;
          otherRes.forEach(resource => {
            content = content.replace(regex, '"');
            content = content.replace(resource.name, resource.data);
          });
          const newsArticle = new NewsArticle(page.id, page.name, content);
          if (imgRes) {
            newsArticle.imgUrl = imgRes.url;
            newsArticle.imgData = imgRes.data;
          }
          return newsArticle;
        });
        return newsArticles;
      }),
      tap(newsArticles => {
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
