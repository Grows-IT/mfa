import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { NewsService } from './news.service';
import { NewsArticle } from './news.model';
import { catchError, switchMap } from 'rxjs/operators';

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
    });
  }

  ngOnDestroy() {
    this.newsSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.getNewsArticles().subscribe(
      () => this.isLoading = false,
      error => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    );
  }

  private getNewsArticles(): Observable<NewsArticle[]> {
    return this.newsService.getNewsArticlesFromStorage().pipe(
      switchMap(() => this.newsService.fetchNewsArticles())
    );
  }
}
