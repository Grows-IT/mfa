import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { NewsArticle } from '../news/news.model';
import { switchMap, tap, map, catchError, first } from 'rxjs/operators';
import { PopoverController, NavController, Platform } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';
import { HttpParams, HttpClient } from '@angular/common/http';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;
  newsArticles: NewsArticle[];
  isLoading = false;
  numberBadge: number = null;
  errorMessage: string;
  private newsSub: Subscription;
  private userSub: Subscription;
  dataReturned: any;
  isAndroid: boolean;

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private http: HttpClient,
    public popoverCtrl: PopoverController,
    public platform: Platform
  ) { }

  ngOnInit() {
    console.log(this.platform.is('android'));
    this.isAndroid = this.platform.is('android');
    this.isLoading = true;
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.newsSub = this.newsService.newsArticles.subscribe(articles => {
      this.newsArticles = articles;
    });

    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();

    // Show us the notification payload if the app is open on our device
    // ถ้าอยู่ในแอพ
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    // ถ้าอยู่นอกแอพ
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );

    this.getNumberListNotification().subscribe();

  }

  ionViewWillEnter() {
    this.authService.fetchUser().pipe(
      catchError(() => this.authService.getUserFromStorage()),
      switchMap(() => this.newsService.fetchNewsArticles()),
      catchError(() => this.newsService.getNewsArticlesFromStorage())
    ).subscribe(newsArticles => {
      this.isLoading = false;
      if (!newsArticles) {
        this.errorMessage = 'การเชื่อมต่อล้มเหลว';
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    this.numberBadge = null;

    return await popover.present();
  }

  getNumberListNotification() {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            useridto: '3',
            newestfirst: '1',
            offset: '0',
            limit: '21',
            moodlewssettingfilter: 'true',
            moodlewssettingfileurl: 'true',
            wsfunction: 'message_popup_get_popup_notifications',
            wstoken: '83080e20a19620d0db6c9a738b7c0755',
          }
        });
        return this.http.post<any>('https://grows-it.moodlecloud.com/webservice/rest/server.php?moodlewsrestformat=json&', params);
      }),
      map((data) => {
        if (data.notifications === null || data.notifications === undefined) {
          return;
        }

        console.log(data);
        // data.notifications.forEach((element) => {
        //   if (element.read === false) {
        //     this.numberBadge += 1;
        //   }
        // });

        // if (this.numberBadge === 0) {
        //   this.numberBadge = null;
        // }

        this.numberBadge = data.notifications.length;

        console.log(this.numberBadge);
      })
    );
  }
}
