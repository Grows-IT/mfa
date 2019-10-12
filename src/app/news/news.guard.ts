import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NewsService } from './news.service';

@Injectable({
  providedIn: 'root'
})
export class NewsGuard implements CanLoad {
  constructor(
    private newsService: NewsService,
    private router: Router
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.newsService.areNewsArticlesLoaded().pipe(tap(newsExist => {
      if (!newsExist) {
        this.router.navigateByUrl('/tabs/news');
      }
    }));
  }
}
