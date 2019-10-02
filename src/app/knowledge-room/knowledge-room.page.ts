import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Category } from './courses/course.model';
import { CoursesService } from './courses/courses.service';

@Component({
  selector: 'app-knowledge-room',
  templateUrl: './knowledge-room.page.html',
  styleUrls: ['./knowledge-room.page.scss'],
})
export class KnowledgeRoomPage implements OnInit, OnDestroy {
  user: User;
  categories: Category[];
  private userSub: Subscription;
  private categoriesSub: Subscription;
  private fetchSub: Subscription;

  constructor(
    private authService: AuthService,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => this.user = user);
    this.categoriesSub = this.coursesService.categories.subscribe(categories => {
      if (!categories || categories.length === 0) {
        // Error message
        this.categories = null;
        return;
      }
      this.categories = categories.slice(1);
    });
  }

  doRefresh(event: any) {
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
    }
    this.fetchSub = this.coursesService.fetchCategories().subscribe(
      () => event.target.complete(),
      error => {
        console.log('[ERROR] knowledge-room.page.ts#doRefresh', error.message);
        event.target.complete();
      }
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.categoriesSub.unsubscribe();
  }
}
