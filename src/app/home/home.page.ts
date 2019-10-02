import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PluginListenerHandle } from '@capacitor/core/dist/esm/web/network';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { NewsArticle } from '../news/news.model';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;
  newsArticles: NewsArticle[];
  isLoading = false;
  private newsSub: Subscription;
  private userSub: Subscription;
  private fetchSub: Subscription;

  constructor(
    private authService: AuthService,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userSub = this.authService.user.subscribe(user => this.user = user);
    this.newsSub = this.newsService.newsArticles.subscribe(articles => {
      this.newsArticles = articles;
    });
    this.fetchSub = this.getNews().subscribe(
      () => {
        this.isLoading = false;
      },
      error => {
        console.log('[ERROR] home.page.ts#ngOnInit', error.message);
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
    this.fetchSub.unsubscribe();
  }

  getNews() {
    return this.newsService.fetchNewsArticles().pipe(
      catchError(() => this.newsService.getNewsArticlesFromStorage())
    );
  }

  doRefresh(event: any) {
    this.fetchSub.unsubscribe();
    this.fetchSub = this.getNews().subscribe(
      () => event.target.complete(),
      error => {
        console.log('[ERROR] home.page.ts#doRefresh', error.message);
        event.target.complete();
      }
    );
  }
}
