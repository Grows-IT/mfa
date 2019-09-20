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
  private userSub: Subscription;
  private backButtonSub: Subscription;
  private newsSub: Subscription;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userSub = this.authService.fetchUser().pipe(
      switchMap(user => {
        this.user = user;
        return this.newsService.pages;
      }),
      map(newsPages => {
        this.newsPages = newsPages;
        let i = 0;
        newsPages.forEach(page => {
          const imgResource = page.resources.find(resource => resource.type.includes('image'));
          const fr = new FileReader();
          fr.onload = () => {
            page.img = fr.result.toString();
            i += 1;
            if (i >= newsPages.length) {
              this.isLoading = false;
            }
          };
          fr.readAsDataURL(imgResource.data);
        });
      })
    ).subscribe();
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
