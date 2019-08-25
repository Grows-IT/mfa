import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.userProfile.subscribe(user => {
      console.log(user);
    }, error => {
      console.log(error.message);
      this.router.navigateByUrl('/auth/login');
    });
  }
}
