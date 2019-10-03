import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { NewsArticle } from '../news/news.model';
import { switchMap } from 'rxjs/operators';
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
    this.getData().subscribe(() => this.isLoading = false);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
  }

  private getData() {
    return this.authService.getUserFromStorage().pipe(
      switchMap(() => this.authService.fetchUser()),
      switchMap(() => this.coursesService.getCoursesFromStorage()),
      switchMap(() => this.coursesService.fetchCourses()),
      switchMap(() => this.newsService.getNewsArticlesFromStorage()),
      switchMap(() => this.newsService.fetchNewsArticles()),
    );
  }
}
