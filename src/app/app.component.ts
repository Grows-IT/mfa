import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

import { AuthService } from './auth/auth.service';

const { SplashScreen, App } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
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
    private appMinimize: AppMinimize
  ) {
    this.initializeApp();
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
  }

  navigate(p: any) {
    if (p.title === 'Logout') {
      this.authService.logout();
      this.menuCtrl.enable(false);
    }
    this.router.navigateByUrl(p.url);
  }
}
