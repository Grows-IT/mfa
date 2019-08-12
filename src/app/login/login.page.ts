import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  siteUrl = 'http://mitrphol-mfa.southeastasia.cloudapp.azure.com/moodle';
  username: string;
  password: string;
  errorMessage: string;
  loginForm: FormGroup;
  users = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // for (let index = 0; index < 30; index++) {
    //   const user = {
    //     id: index.toString(),
    //     username: 'user' + index,
    //     password: 'password' + index
    //   }
    //   this.users.push(user);
    // }
  }

  onSubmit(loginData): void {
    this.authService.login(loginData.username, loginData.password, (err) => {
      if (err) return this.errorMessage = err;
      this.router.navigate(['/home']);
    });
  }
}