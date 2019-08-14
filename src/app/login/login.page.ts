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
  errorMessage: string;
  loginAttempt: number = 0;
  loginForm: FormGroup;
  // users = [];

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

  onSubmit(loginData: any): void {
    this.authService.login(loginData.username, loginData.password, (err) => {
      if (err) {
        this.loginAttempt += 1;
        return this.errorMessage = err + '. Login attempt: ' + this.loginAttempt;
      }
      // this.authService.getUserInfo((err, user) => {
      //   if (err) return console.log(err);
      //   console.log('Seccuess');
      // });
      // this.authService.getUserProfile().subscribe(user => console.log(user.firstname));
      this.loginAttempt = 0;
      this.router.navigate(['/home']);
    });
  }
}