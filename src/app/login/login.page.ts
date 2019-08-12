import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

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
  users = [];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    for (let index = 0; index < 30; index++) {
      const user = {
        id: index.toString(),
        username: 'user' + index,
        password: 'password' + index
      }
      this.users.push(user);
    }
  }

  onClick(): void {
    this.authService.login(this.username, this.password, (err) => {
      if (err) return this.errorMessage = err;
      this.router.navigate(['/home']);
    });
  }
}