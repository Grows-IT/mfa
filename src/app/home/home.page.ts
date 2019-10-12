import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { NewsArticle } from '../news/news.model';
import { switchMap, tap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;
  newsArticles: NewsArticle[];
  isLoading = false;
  errorMessage: string;
  private newsSub: Subscription;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.newsSub = this.newsService.newsArticles.subscribe(articles => {
      this.newsArticles = articles;
    });
  }

  ionViewWillEnter() {
    this.authService.fetchUser().pipe(
      catchError(() => this.authService.getUserFromStorage())
    );
    this.newsService.fetchNewsArticles().pipe(
      catchError(() => this.newsService.getNewsArticlesFromStorage())
    ).subscribe(newsArticles => {
      this.isLoading = false;
      if (!newsArticles) {
        this.errorMessage = 'การเชื่อมต่อล้มเหลว';
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
  }
}
