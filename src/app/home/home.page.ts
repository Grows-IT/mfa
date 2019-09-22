import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { Platform } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { Page } from '../knowledge-room/courses/course.model';
import { switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;
  newsPages: Page[] = null;
  errorMessage: string;
  isLoading = false;
  private userSub: Subscription;
  private backButtonSub: Subscription;
  private newsSub: Subscription;

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userSub = this.authService.fetchUser().subscribe(
      user => {
        this.user = user;
        this.newsSub = this.newsService.fetchNews().subscribe(pages => {
          this.newsPages = pages;
          this.isLoading = false;
        });
      },
      error => {
        console.log(error.message);
        this.errorMessage = 'Error getting user information';
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    if (this.newsSub) {
      this.newsSub.unsubscribe();
    }
    if (this.backButtonSub) {
      this.backButtonSub.unsubscribe();
    }
  }
}
