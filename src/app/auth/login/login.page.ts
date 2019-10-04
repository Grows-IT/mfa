import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Subscription, from } from 'rxjs';

import { AuthService } from '../auth.service';
import { switchMap, concatMap, toArray } from 'rxjs/operators';
import { CoursesService } from 'src/app/knowledge-room/courses/courses.service';
import { NewsService } from 'src/app/news/news.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  errorMessage: string;
  loginForm: FormGroup;
  loadingEl: HTMLIonLoadingElement;
  private loginSub: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private coursesService: CoursesService,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.loginForm = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
  }

  onSubmitLoginForm() {
    this.startLoading();
    if (!this.loginForm.valid) {
      return;
    }
    this.loginSub = this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      () => {
        this.errorMessage = null;
        this.fetchData().subscribe(
          data => {
            this.menuCtrl.enable(true);
            this.stopLoading();
            this.router.navigateByUrl('/tabs/home');
          }
        );
      },
      error => {
        this.errorMessage = error;
        this.stopLoading();
      }
    );
  }

  private fetchData() {
    return this.authService.fetchUser().pipe(
      switchMap(() => this.coursesService.fetchCourses()),
      switchMap(courses => {
        return from(courses);
      }),
      concatMap(course => {
        return this.coursesService.fetchTopics(course.id);
      }),
      concatMap(topics => {
        return this.coursesService.downloadResources(topics);
      }),
      switchMap(() => this.newsService.fetchNewsArticles()),
    );
  }

  private startLoading() {
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'กำลังเข้าระบบ...'
    }).then(loadingEl => {
      this.loadingEl = loadingEl;
      this.loadingEl.present();
    });
  }

  private stopLoading() {
    this.loadingEl.dismiss();
  }
}
