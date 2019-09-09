import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CoursesService } from './courses.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Course } from './course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit, OnDestroy {
  user: User;
  courses: Course[];
  modernFarm: Course;
  isLoading = false;
  private coursesSub: Subscription;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
      this.coursesSub = this.coursesService.courses.subscribe(courses => {
        this.courses = courses;
        this.modernFarm = courses.find(course => course.name === 'Modern Farm');
        this.isLoading = false;
      });
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.coursesSub.unsubscribe();
  }
}
