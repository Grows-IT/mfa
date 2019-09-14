import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { AuthService } from './auth/auth.service';

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
    url: '/static/2'
  }, {
    title: 'Knowledge Room',
    url: '/tabs/knowledge-room'
  }, {
    title: 'Modern Farm',
    url: '/tabs/knowledge-room/1/courses/3/topics'
  }, {
    title: 'Calculators',
    url: '/tabs/calculators'
  }, {
    title: 'Question - Answer',
    url: '/static/3'
  }, {
    title: 'Settings',
    url: '/static/4'
  }, {
    title: 'Logout',
    url: '/auth/login'
  }];

  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthService,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
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
