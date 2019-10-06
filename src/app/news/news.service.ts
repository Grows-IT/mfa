import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, map, first, tap, withLatestFrom } from 'rxjs/operators';

import { Page } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { NewsArticle } from './news.model';

const newsCourseName = 'News and Update';

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
    return this.getNewsCourseId().pipe(
      switchMap(courseId => {
        return this.coursesService.fetchTopics(courseId);
      }),
      switchMap(topics => {
        return this.coursesService.downloadResources(topics);
      }),
      map(topics => {
        const pages = topics[0].activities as Page[];
        const newsArticles = pages.map(page => {
          const contentRes = page.resources.find(resource => resource.name === 'index.html');
          const imgRes = page.resources.find(resource => resource.type && resource.type.includes('image'));
          const otherRes = page.resources.filter(resource => resource.type);
          let content = contentRes.data;
          otherRes.forEach(resource => {
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
      tap(newsArticles => this._newsArticles.next(newsArticles))
    );
  }

  getNewsArticlesFromStorage() {
    return this.coursesService.getTopicsFromStorage().pipe(
      withLatestFrom(this.getNewsCourseId()),
      map(([topics, courseId]) => {
        if (topics) {
          const newsTopics = topics.filter(topic => topic.courseId === courseId);
          if (newsTopics.length > 0) {
            const pages = newsTopics[0].activities as Page[];
            if (pages) {
              const newsArticles = this.createNewsArticlesFromPages(pages);
              this._newsArticles.next(newsArticles);
              return newsArticles;
            }
          }
        }
        return null;
      })
    );
  }

  delete() {
    this._newsArticles.next(null);
  }

  private getNewsCourseId() {
    return this.coursesService.courses.pipe(
      first(),
      map(courses => {
        const newsCourse = courses.find(course => course.name === newsCourseName);
        return newsCourse.id;
      }),
    );
  }

  private createNewsArticlesFromPages(pages: Page[]) {
    const newsArticles = pages.map(page => {
      const contentRes = page.resources.find(resource => resource.name === 'index.html');
      const imgRes = page.resources.find(resource => resource.type && resource.type.includes('image'));
      const otherRes = page.resources.filter(resource => resource.type);
      let content = contentRes.data;
      otherRes.forEach(resource => {
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
  }
}
