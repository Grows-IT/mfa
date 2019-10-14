import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { NewsService } from 'src/app/news/news.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  errorMessage: string;
  isPasswordShown = false;
  passwordIconName = 'eye-off';
  passwordType = 'password';
  loginForm: FormGroup;
  loadingEl: HTMLIonLoadingElement;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private newsService: NewsService,
    private navCtrl: NavController
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
            this.navCtrl.navigateRoot('/tabs/home');
          }
        );
      },
      error => {
        this.errorMessage = error;
        loadingEl.dismiss();
      }
    );
  }

  onTogglePassword() {
    if (this.isPasswordShown) {
      this.isPasswordShown = false;
      this.passwordIconName = 'eye-off';
      this.passwordType = 'password';
    } else {
      this.isPasswordShown = true;
      this.passwordIconName = 'eye';
      this.passwordType = 'text';
    }
  }

  private fetchData() {
    return this.authService.fetchUser().pipe(
      switchMap(() => this.newsService.fetchNewsArticles())
    );
  }
}
