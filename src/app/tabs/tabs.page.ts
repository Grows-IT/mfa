import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
  private backButtonSub: Subscription;

  constructor(
    private platform: Platform
  ) { }

  ngOnInit() {
    this.backButtonSub = this.platform.backButton.subscribe(() => {
      const app = 'app';
      navigator[app].exitApp();
    });
  }

  ngOnDestroy() {
    this.backButtonSub.unsubscribe();
  }

}
