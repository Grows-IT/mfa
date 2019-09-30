import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Page, Course, Topic } from 'src/app/knowledge-room/courses/course.model';
import { CoursesService } from 'src/app/knowledge-room/courses/courses.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit, OnDestroy {
  private fetchSub: Subscription;
  private newsSub: Subscription;
  newsCourse: Course;
  newsTopic: Topic;
  newsPage: Page;
  errorMessage: string;
  indexHtml: SafeHtml;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private newsService: NewsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const pageId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.newsSub = this.newsService.newsPages.subscribe(pages => {
      this.newsPage = pages.find(page => page.id === pageId);
      this.indexHtml = this.sanitizer.bypassSecurityTrustHtml(this.newsPage.content);
    });
    // this.fetchSub = this.newsService.fetchResources(pageId).subscribe(
    //   () => {
    //     this.isLoading = false;
    //   },
    //   error => {
    //     console.log('[ERROR] news-detail.page.ts#ngOnInit', error.message);
    //     this.isLoading = false;
    //   }
    // );
  }

  ngOnDestroy() {
    this.fetchSub.unsubscribe();
    this.newsSub.unsubscribe();
  }
}
