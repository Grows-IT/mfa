import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NewsService } from './news.service';
import { NewsArticle } from './news-article.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit, OnDestroy {
  newsArticles: NewsArticle[];
  isLoading = false;
  private newsSub: Subscription;

  constructor(
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.newsSub = this.newsService.fetchNewsArticles().subscribe(newsArticles => {
      this.newsArticles = newsArticles;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.newsSub) {
      this.newsSub.unsubscribe();
    }
  }

  doRefresh(event: any) {
    if (this.newsSub) {
      this.newsSub.unsubscribe();
    }
    this.newsSub = this.newsService.fetchNewsArticles().subscribe(newsArticles => {
      this.newsArticles = newsArticles;
      event.target.complete();
    });
  }
}
