import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CoursesService } from './courses.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit, OnDestroy {
  user: User;
  private userSub: Subscription;
  private coursesSub: Subscription;
  courses = [{
    id: 1,
    name: 'Know Yourself',
    img: 'assets/img/icon-course-know-yourself.png'
  }, {
    id: 2,
    name: 'Empathy',
    img: 'assets/img/icon-course-empathy.png'
  }, {
    id: 3,
    name: 'Modern Farm',
    img: 'assets/img/icon-course-modern-farm.png'
  }, {
    id: 4,
    name: 'Specialization',
    img: 'assets/img/icon-course-specialization.png'
  }];

  constructor(
    private authService: AuthService,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
      this.coursesSub = this.coursesService.getCourses(user).subscribe(courses => {
        // this.courses = courses;
        console.log(courses);
      });
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.coursesSub) {
      this.coursesSub.unsubscribe();
    }
  }
}
