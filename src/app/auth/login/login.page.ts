import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
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

  async onSubmitLoginForm() {
    if (!this.loginForm.valid) {
      return;
    }
    const loadingEl = await this.loadingCtrl.create({
      keyboardClose: true,
      message: 'กำลังเข้าระบบ...'
    });
    loadingEl.present();
    this.loginSub = this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(() => {
      this.errorMessage = null;
      this.router.navigateByUrl('/tabs/home');
      loadingEl.dismiss();
    }, error => {
      this.errorMessage = error;
      loadingEl.dismiss();
    });
  }
}
