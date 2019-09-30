import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { PluginListenerHandle } from '@capacitor/core/dist/esm/web/network';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { NewsArticle } from '../news/news.model';

const { Network } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;
  newsArticles: NewsArticle[];
  isLoading = false;
  private newsSub: Subscription;
  private userSub: Subscription;
  private fetchSub: Subscription;
  private networkHandler: PluginListenerHandle;

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.alertCtrl.create({ animated: false }).then(a => { a.present(); a.dismiss(); }); // Pre-load alert
    this.networkHandler = Network.addListener('networkStatusChange', status => {
      if (!status.connected) {
        this.showAlert('คุณไม่ได้เชื่อมต่อ Internet กำลังใช้งานแบบ offline');
      }
    });
    this.userSub = this.authService.user.subscribe(user => this.user = user);
    this.newsSub = this.newsService.newsArticles.subscribe(articles => {
      this.newsArticles = articles;
    });
    this.fetchSub = this.fetchData().subscribe(
      () => {
        this.isLoading = false;
      },
      error => {
        console.log('[ERROR] home.page.ts#ngOnInit', error.message);
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
    this.fetchSub.unsubscribe();
    this.networkHandler.remove();
  }

  fetchData() {
    return this.newsService.fetchNewsArticles();
  }

  doRefresh(event: any) {
    this.fetchSub.unsubscribe();
    this.fetchSub = this.fetchData().subscribe(
      () => event.target.complete(),
      error => {
        console.log('[ERROR] home.page.ts#doRefresh', error.message);
        event.target.complete();
      }
    );
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Error',
        message,
        buttons: ['OK']
      })
      .then(alertEl => {
        alertEl.present();
      });
  }
}
