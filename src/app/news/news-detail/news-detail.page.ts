import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { NewsService } from '../news.service';
import { NewsArticle } from '../news-article.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {
  newsSub: Subscription;
  article: NewsArticle;
  errorMessage: string;
  indexHtml: SafeHtml;

  constructor(
    private newsService: NewsService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    const id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.newsSub = this.newsService.getNewsArticleById(id).subscribe(article => {
      if (article === null) {
        this.errorMessage = 'Error getting news article';
        return;
      }
      this.newsService.getContent(article).subscribe(content => {
        this.indexHtml = this.sanitizer.bypassSecurityTrustHtml(content);
        article.content = content;
        this.article = article;
      });
    });
  }

}
