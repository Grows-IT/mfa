import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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
    title: 'My Account'
  }, {
    title: 'Knowledge Room',
    url: '/courses'
  }, {
    title: 'Modern Farm',
    url: '/course/3'
  }, {
    title: 'Calculator',
    url: '/calculator'
  }, {
    title: 'Question - Answer'
  }, {
    title: 'Settings'
  }, {
    title: 'Logout'
  }];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  navigate(p: any) {
    if (p.url) this.router.navigate([p.url])
  }
}
