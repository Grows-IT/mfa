import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';
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
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.initializeApp();
  }

  ngOnDestroy() {
    this.networkHandler.remove();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        SplashScreen.hide();
      }
    });
    App.addListener('backButton', () => {
      if (window.location.pathname === '/tabs/home' || window.location.pathname === '/auth/login') {
        this.appMinimize.minimize();
      } else {
        window.history.back();
      }
    });
    this.networkHandler = Network.addListener('networkStatusChange', status => {
      if (!status.connected) {
        this.showAlert('ไม่มีัญญาณ Internet');
      }
    });
  }

  navigate(p: any) {
    if (p.title === 'Logout') {
      this.authService.logout();
      this.coursesService.delete();
      this.newsService.delete();
      this.menuCtrl.close();
      this.menuCtrl.enable(false);
    }
    this.router.navigateByUrl(p.url);
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
}
