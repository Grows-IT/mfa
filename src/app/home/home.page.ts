import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { NewsArticle } from '../news/news.model';
import { catchError, switchMap } from 'rxjs/operators';
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
  isLoading = false;
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
    this.isLoading = true;
    this.menuCtrl.enable(true);
    this.getData().subscribe(
      () => {
        this.isLoading = false;
      },
      error => {
        console.log('[ERROR] home.page.ts#getData', error.message);
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
  }

  doRefresh(event: any) {
    this.getData().subscribe(
      () => event.target.complete(),
      error => {
        console.log('[ERROR] home.page.ts#doRefresh', error.message);
        event.target.complete();
      }
    );
  }

  private getData() {
    return this.authService.fetchUser().pipe(
      switchMap(() => this.coursesService.fetchCourses()),
      switchMap(() => this.newsService.fetchNewsArticles()),
      catchError(() => this.newsService.getNewsArticlesFromStorage())
    );
  }
}
