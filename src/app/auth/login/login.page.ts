import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { LoadingController } from '@ionic/angular';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  errorMessage: string;
  isLoading = false;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit(loginData: any): void {
    this.isLoading = true;
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Logging in...'
    }).then(loadingEl => {
      loadingEl.present();
      this.authService.login(loginData.username, loginData.password).subscribe(error => {
        loadingEl.dismiss();
        if (error) {
          return this.errorMessage = error;
        }
        this.router.navigate(['/home']);
      });
    });
  }
}
