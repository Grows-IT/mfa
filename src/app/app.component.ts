import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor, PluginListenerHandle } from '@capacitor/core';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

import { AuthService } from './auth/auth.service';
import { CoursesService } from './knowledge-room/courses/courses.service';
import { NewsService } from './news/news.service';

const { SplashScreen, App, Network } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private networkHandler: PluginListenerHandle;
  public appPages = [{
    title: 'Home',
    url: '/tabs/home'
  }, {
    title: 'My Account',
    url: '/auth/profile'
  }, {
    title: 'Knowledge Room',
    url: '/tabs/knowledge-room'
  }, {
    title: 'Modern Farm',
    url: '/tabs/knowledge-room/4/courses'
  }, {
    title: 'Calculators',
    url: '/tabs/calculators'
  }, {
    title: 'Question - Answer',
    url: '/static'
  }, {
    title: 'Settings',
    url: '/static'
  }, {
    title: 'Logout',
    url: '/auth/login'
  }];

  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private appMinimize: AppMinimize,
    private alertCtrl: AlertController,
    private coursesService: CoursesService,
    private newsService: NewsService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.initializeApp();
  }

  ngOnDestroy() {
    this.networkHandler.remove();
  }

  initializeApp() {
    // Launch Splashscreen
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        SplashScreen.hide();
      }
    });
    // Android back-button minimizes the app. Other tabs navigate to home.
    App.addListener('backButton', () => {
      if (window.location.pathname === '/tabs/home' || window.location.pathname === '/auth/login') {
        this.appMinimize.minimize();
      } else if (window.location.pathname === '/tabs/qa' || window.location.pathname === '/tabs/knowledge-room' ||
                window.location.pathname === '/tabs/calculators' || window.location.pathname === '/tabs/news') {
        this.router.navigateByUrl('/tabs/home');
      }
    });
    // Show alert when offline
    this.networkHandler = Network.addListener('networkStatusChange', status => {
      if (!status.connected) {
        this.showAlert('ไม่มีสัญญาณ Internet');
      }
    });
  }

  navigate(p: any) {
    if (p.title === 'Logout') {
      this.logout();
    } else {
      this.router.navigateByUrl(p.url);
    }
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'คำเตือน',
        message,
        buttons: ['ตกลง']
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  private async logout() {
    const loadingEl = await this.loadingCtrl.create({
      keyboardClose: true,
      message: 'กำลังออกจากระบบ...'
    });
    loadingEl.present();
    setTimeout(() => {
      this.authService.logout();
      this.coursesService.delete();
      this.newsService.delete();
      this.menuCtrl.close();
      this.menuCtrl.enable(false);
      loadingEl.dismiss();
      this.router.navigateByUrl('/auth/login');
    }, 2000);
  }
}
