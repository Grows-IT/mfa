import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { PluginListenerHandle } from '@capacitor/core/dist/esm/web/network';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { NewsService } from '../news/news.service';
import { Page } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { AlertController } from '@ionic/angular';

const { Network } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  user: User;
  newsPages: Page[];
  errorMessage: string;
  isLoading = false;
  private newsSub: Subscription;
  private userSub: Subscription;
  private dataSub: Subscription;
  private networkHandler: PluginListenerHandle;

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private coursesService: CoursesService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.newsSub = this.newsService.newsPages.subscribe(pages => this.newsPages = pages);
    this.userSub = this.authService.user.subscribe(user => this.user = user);
    this.isLoading = true;
    this.dataSub = this.fetchData().subscribe(
      () => {
        this.errorMessage = null;
        this.isLoading = false;
      },
      error => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    );
    this.networkHandler = Network.addListener('networkStatusChange', status => {
      if (!status.connected) {
        this.showAlert('ไม่ได้เชื่อมต่อ Internet');
      }
    });
    this.alertCtrl.create({ animated: false }).then(a => { a.present(); a.dismiss(); }); // Pre-load alert
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.newsSub.unsubscribe();
    this.dataSub.unsubscribe();
    this.networkHandler.remove();
  }

  fetchData() {
    return this.authService.fetchUser().pipe(
      switchMap(() => {
        return this.coursesService.fetchCourses();
      }),
      switchMap(() => {
        return this.newsService.fetchNewsPages();
      })
    );
  }

  doRefresh(event: any) {
    this.dataSub.unsubscribe();
    this.dataSub = this.fetchData().subscribe(
      () => {
        this.errorMessage = null;
        event.target.complete();
      },
      error => {
        this.errorMessage = error.message;
        event.target.complete();
      }
    );
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Error',
        message,
        buttons: ['Close'],
        animated: false
      })
      .then(alertEl => alertEl.present());
  }
}
