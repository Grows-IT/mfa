import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NewsService } from './news.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NewsGuard implements CanLoad {
  constructor(
    private newsService: NewsService,
    private navCtrl: NavController
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.newsService.areNewsArticlesLoaded().pipe(tap(newsExist => {
      if (!newsExist) {
        this.navCtrl.navigateBack('/tabs/news');
      }
    }));
  }
}
