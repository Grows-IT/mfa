import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { CoursesService } from 'src/app/knowledge-room/courses/courses.service';
import { NewsService } from 'src/app/news/news.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  errorMessage: string;
  loginForm: FormGroup;
  loadingEl: HTMLIonLoadingElement;

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

  async onSubmitLoginForm() {
    if (!this.loginForm.valid) {
      return;
    }
    const loadingEl = await this.loadingCtrl.create({
      keyboardClose: true,
      message: 'กำลังเข้าสู่ระบบ...'
    });
    loadingEl.present();
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      () => {
        this.errorMessage = null;
        this.fetchData().subscribe(
          () => {
            this.menuCtrl.enable(true);
            loadingEl.dismiss();
            this.router.navigateByUrl('/tabs/home');
          }
        );
      },
      error => {
        this.errorMessage = error;
        loadingEl.dismiss();
      }
    );
  }

  private fetchData() {
    return this.authService.fetchUser().pipe(
      // switchMap(() => this.coursesService.fetchCategories()),
      switchMap(() => this.coursesService.fetchCourses()),
      // switchMap(courses => from(courses)),
      // concatMap(course => this.coursesService.fetchTopics(course.id)),
      // concatMap(topics => this.coursesService.downloadResources(topics)),
      switchMap(() => this.newsService.fetchNewsArticles()),
    );
  }
}
