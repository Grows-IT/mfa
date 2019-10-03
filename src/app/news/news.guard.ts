import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';

import { NewsService } from './news.service';

@Injectable({
  providedIn: 'root'
})
export class NewsGuard implements CanActivate {
  constructor(
    private newsService: NewsService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state:
    RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.newsService.newsArticles.pipe(
        switchMap(newsArticles => {
          if (newsArticles) {
            return of(!!newsArticles);
          }
          return this.newsService.getNewsArticlesFromStorage().pipe(
            map(storedNewsArticles => {
              return !!storedNewsArticles;
            })
          );
        }),
        tap(newsExist => {
          if (!newsExist) {
            this.router.navigateByUrl('/tabs/news');
          }
        })
      );
  }

}
