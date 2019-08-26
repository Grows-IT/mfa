import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { LoadingController } from '@ionic/angular';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  private loginSub: Subscription;
  errorMessage: string;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required]
      }),
      password: new FormControl({
        validators: [Validators.required]
      })
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
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(() => {
        loadingEl.dismiss();
        this.router.navigate(['/home']);
      }, error => {
        loadingEl.dismiss();
        this.errorMessage = error.message;
      });
    });
  }

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
}
