import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { NewsService } from '../news.service';
import { NewsArticle } from '../news.model';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit, OnDestroy {
  private newsSub: Subscription;
  newsArticle: NewsArticle;
  indexHtml: SafeHtml;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private newsService: NewsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const newsArticleId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.newsSub = this.newsService.newsArticles.subscribe(articles => {
      this.newsArticle = articles.find(article => article.id === newsArticleId);
      if (this.newsArticle) {
        this.indexHtml = this.sanitizer.bypassSecurityTrustHtml(this.newsArticle.content);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.newsSub.unsubscribe();
  }
}
