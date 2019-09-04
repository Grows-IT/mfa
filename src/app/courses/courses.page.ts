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
  isLoading = false;
  private coursesSub: Subscription;
  knowYourself = {
    id: 1,
    name: 'Know Yourself',
    img: 'assets/img/icon-course-know-yourself.png'
  };
  empathy = {
    id: 2,
    name: 'Empathy',
    img: 'assets/img/icon-course-empathy.png'
  };
  // modernFarm = {
  //   id: 3,
  //   name: 'Modern Farm',
  //   img: 'assets/img/icon-course-modern-farm.png'
  // };
  modernFarm: Course;
  specialization = {
    id: 4,
    name: 'Specialization',
    img: 'assets/img/icon-course-specialization.png'
  };

  constructor(
    private authService: AuthService,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      this.modernFarm = courses.find(course => course.name === 'Modern Farm');
      this.modernFarm.imgUrl = 'assets/img/icon-course-modern-farm.png';
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.coursesSub) {
      this.coursesSub.unsubscribe();
    }
  }
}
