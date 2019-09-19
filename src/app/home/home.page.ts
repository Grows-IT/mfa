import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { Page } from '../knowledge-room/courses/course.model';

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

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.backButtonSub = this.platform.backButton.subscribe(() => {
      const app = 'app';
      navigator[app].exitApp();
    });
    this.newsSub = this.newsService.pages.subscribe(pages => {
      this.newsPages = pages;
      let i = 0;
      pages.forEach(page => {
        const imgResource = page.resources.find(resource => resource.type.includes('image'));
        const fr = new FileReader();
        fr.onload = () => {
          page.img = fr.result.toString();
          i += 1;
        };
        fr.readAsDataURL(imgResource.data);
      });
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
    this.backButtonSub.unsubscribe();
  }
}
