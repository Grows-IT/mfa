import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-knowledge-room',
  templateUrl: './knowledge-room.page.html',
  styleUrls: ['./knowledge-room.page.scss'],
})
export class KnowledgeRoomPage implements OnInit, OnDestroy {
  user: User;
  category: {
    id: number,
    name: string
  };
  isLoading = false;
  private userSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.category = { id: 3, name: 'Modern Farm' };
    this.isLoading = true;
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
