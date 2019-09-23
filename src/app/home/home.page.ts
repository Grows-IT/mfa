import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { Platform } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { Page } from '../knowledge-room/courses/course.model';
import { switchMap, map, tap } from 'rxjs/operators';
import { NewsArticle } from '../news/news-article.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;
  newsPages: Page[];
  errorMessage: string;
  isLoading = false;
  private newsSub: Subscription;

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private newsService: NewsService,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.newsSub = this.authService.fetchUser().pipe(
      switchMap(user => {
        this.user = user;
        return this.coursesService.fetchCourses();
      }),
      switchMap(() => {
        return this.newsService.fetchNewsPages();
      })
    ).subscribe(
      newsArticles => {
        this.newsPages = newsArticles;
        this.isLoading = false;
      },
      error => {
        console.log(error.message);
        this.errorMessage = 'Error conneting to the server. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.newsSub.unsubscribe();
  }
}
