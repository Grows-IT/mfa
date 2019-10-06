import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { NewsArticle } from '../news/news.model';

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

  constructor(
    private authService: AuthService,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.newsSub = this.newsService.newsArticles.subscribe(articles => {
      this.newsArticles = articles;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    // this.authService.fetchUser().subscribe();
    this.newsService.fetchNewsArticles().subscribe(() => this.isLoading = false);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
  }
}
