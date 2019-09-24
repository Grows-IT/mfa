import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { Page } from '../knowledge-room/courses/course.model';
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
  private userSub: Subscription;
  private dataSub: Subscription;

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.newsSub = this.newsService.newsPages.subscribe(pages => this.newsPages = pages);
    this.userSub = this.authService.user.subscribe(user => this.user = user);
    this.isLoading = true;
    this.dataSub = this.fetchData().subscribe(
      () => {
        this.errorMessage = null;
        this.isLoading = false;
      },
      error => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    );
  }

  fetchData() {
    return this.authService.fetchUser().pipe(
      switchMap(() => {
        return this.coursesService.fetchCourses();
      }),
      switchMap(() => {
        return this.newsService.fetchNewsPages();
      })
    );
  }

  doRefresh(event: any) {
    this.dataSub.unsubscribe();
    this.dataSub = this.fetchData().subscribe(
      () => {
        this.errorMessage = null;
        event.target.complete();
      },
      error => {
        this.errorMessage = error.message;
        event.target.complete();
      }
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
    this.dataSub.unsubscribe();
  }
}
