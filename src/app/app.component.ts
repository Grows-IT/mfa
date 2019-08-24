import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [{
    title: 'Home',
    url: '/home'
  }, {
    title: 'My Account',
    url: '/static/2'
  }, {
    title: 'Knowledge Room',
    url: '/courses'
  }, {
    title: 'Modern Farm',
    url: '/courses/3/topics'
  }, {
    title: 'Calculators',
    url: '/calculators'
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
    private router: Router
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
    if (p.url) {
      this.router.navigate([p.url]);
    }
  }
}
