import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  isLoading = false;
  private userSub: Subscription;
  private categoriesSub: Subscription;

  constructor(
    private authService: AuthService,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => this.user = user);
    this.categoriesSub = this.coursesService.categories.subscribe(categories => {
      if (categories && categories.length > 0) {
        this.categories = categories.slice(1);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.categoriesSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    if (this.categories) {
      this.isLoading = false;
    } else {
      this.coursesService.getCategoriesFromStorage().subscribe();
    }
    this.coursesService.fetchCategories().subscribe();
  }
}
