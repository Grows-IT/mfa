import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  errorMessage: string;
  private userSub: Subscription;
  private categoriesSub: Subscription;

  constructor(
    private authService: AuthService,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userSub = this.authService.user.subscribe(user => this.user = user);
    this.categoriesSub = this.coursesService.categories.subscribe(categories => {
      if (categories) {
        if (categories.length === 0) {
          this.errorMessage = 'Coming soon';
          return;
        }
        this.categories = categories.slice(1);
      }
    });
    this.coursesService.fetchCategories().pipe(
      catchError(() => this.coursesService.getCategoriesFromStorage())
    ).subscribe(categories => {
      this.isLoading = false;
      if (!categories) {
        this.errorMessage = 'network ขัดข้อง และไม่มีข้อมูล offline';
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.categoriesSub.unsubscribe();
  }
}
