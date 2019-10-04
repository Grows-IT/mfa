import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { NewsService } from './news.service';
import { NewsArticle } from './news.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit, OnDestroy {
  newsArticles: NewsArticle[];
  isLoading = false;
  errorMessage: string;
  private newsSub: Subscription;

  constructor(
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.newsSub = this.newsService.newsArticles.subscribe(articles => {
      this.newsArticles = articles;
      if (!this.newsArticles || this.newsArticles.length === 0) {
        this.errorMessage = 'Coming soon';
      }
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.newsSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    if (this.newsArticles) {
      this.isLoading = false;
    } else {
      this.newsService.getNewsArticlesFromStorage().subscribe();
    }
    this.newsService.fetchNewsArticles().subscribe();
  }
}
