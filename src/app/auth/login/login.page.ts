import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  errorMessage: string;
  loginForm: FormGroup;
  private loginSub: Subscription;
  private backButtonSub: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.backButtonSub = this.platform.backButton.subscribe(() => {
      const app = 'app';
      navigator[app].exitApp();
    });
  }

  onSubmitLoginForm(): void {
    if (!this.loginForm.valid) {
      return;
    }
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Logging in...'
    }).then(loadingEl => {
      loadingEl.present();
      this.loginSub = this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(() => {
        this.errorMessage = null;
        this.loginForm.value.username = null;
        this.loginForm.value.password = null;
        this.menuCtrl.enable(true);
        this.router.navigateByUrl('/home');
        loadingEl.dismiss();
      }, error => {
        this.errorMessage = error.message;
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
    if (this.backButtonSub) {
      this.backButtonSub.unsubscribe();
    }
  }
}
