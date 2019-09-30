import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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
  private newsSub: Subscription;
  private fetchSub: Subscription;

  constructor(
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.newsSub = this.newsService.newsArticles.subscribe(articles => this.newsArticles = articles);
  }

  ngOnDestroy() {
    this.newsSub.unsubscribe();
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
    }
  }

  doRefresh(event: any) {
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
    }
    this.fetchSub = this.newsService.fetchNewsArticles().subscribe(
      () => event.target.complete(),
      error => {
        console.log('[ERROR] news.page.ts#doRefresh', error.message);
        event.target.complete();
      }
    );
  }
}
