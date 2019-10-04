import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, of } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { NewsArticle } from '../news/news.model';
import { switchMap, catchError } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';
import { CoursesService } from '../knowledge-room/courses/courses.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;
  newsArticles: NewsArticle[];
  private newsSub: Subscription;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    private coursesService: CoursesService,
    private newsService: NewsService,
    private menuCtrl: MenuController
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
    this.menuCtrl.enable(true);
    this.authService.fetchUser().pipe(
      catchError(() => this.authService.getUserFromStorage()),
      switchMap(() => this.coursesService.fetchCourses()),
      catchError(() => this.coursesService.getCoursesFromStorage()),
      switchMap(() => this.newsService.fetchNewsArticles()),
      catchError(() => this.newsService.getNewsArticlesFromStorage())
    ).subscribe();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
  }
}
