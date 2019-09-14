import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CoursesService } from './courses.service';
import { Course, Category } from './course.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit, OnDestroy {
  courses: Course[] = [
    new Course(1 , 'อ้อย', 'assets/courses/modern-farm/1-sugar.png'),
    new Course(2 , 'อารักขาอ้อย', 'assets/courses/modern-farm/2-guard.png'),
    new Course(3 , 'ดินและปุ๋ย', 'assets/courses/modern-farm/3-soil.png'),
    new Course(4 , 'AE', 'assets/courses/modern-farm/4-ae.png'),
    new Course(5 , 'น้ำ', 'assets/courses/modern-farm/5-water.png'),
    new Course(6 , 'Modern Farm', 'assets/courses/modern-farm/6-modern.png'),
    new Course(7 , 'AE - MDF', 'assets/courses/modern-farm/7-mdf.png'),
    new Course(8 , 'Precision Farming', 'assets/courses/modern-farm/8-precision.png'),
    new Course(9 , 'Logistic', 'assets/courses/modern-farm/9-logistic.png'),
  ];
  category: Category;
  modernFarm: Course;
  isLoading = false;
  private coursesSub: Subscription;

  constructor(
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    // TODO: call get courses by category
    this.category = new Category(categoryId, 'Modern Farm', 'assets/courses/modern-farm/banner.png');
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      const moderFarm = courses.find(course => course.name === 'Modern Farm');
      const index = this.courses.findIndex(course => course.name === 'Modern Farm');
      this.courses[index].id = moderFarm.id;
      this.isLoading = false;
    });
  }

  onClick(course: Course) {
    if (course.name === 'Modern Farm') {
      this.router.navigate([course.id, 'topics'], {relativeTo: this.activatedRoute});
    }
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
  }
}
