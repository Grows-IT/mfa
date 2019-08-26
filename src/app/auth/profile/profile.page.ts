import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

import { User } from '../user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  private userSub: Subscription;
  private getSiteInfoSub: Subscription;
  user: User;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userSub = this.authService.userProfile.subscribe(user => {
      if (!user) {
        this.getSiteInfoSub = this.authService.getSiteInfo().subscribe(u => {
          this.user = u;
        }, err => {
          console.log('Error getSiteInfo(): ', err.message);
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.getSiteInfoSub) {
      this.getSiteInfoSub.unsubscribe();
    }
  }
}
