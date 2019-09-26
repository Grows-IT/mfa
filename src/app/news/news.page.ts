import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NewsService } from './news.service';
import { Page, Course, Topic } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit, OnDestroy {
  newsPages: Page[];
  isLoading = false;
  private newsSub: Subscription;
  private fetchSub: Subscription;

  constructor(
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.newsSub = this.newsService.newsPages.subscribe(pages => this.newsPages = pages);
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
    this.fetchSub.unsubscribe();
    this.fetchSub = this.newsService.fetchNewsPages().subscribe(
      () => event.target.complete(),
      error => {
        console.log('[ERROR] news.page.ts#doRefresh', error.message);
        event.target.complete();
      }
    );
  }
}
