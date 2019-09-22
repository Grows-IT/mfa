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
    new Course(null, 'อ้อย', 'อ้อย', 'assets/courses/modern-farm/1-sugar.png'),
    new Course(null, 'อารักขาอ้อย', 'อารักขาอ้อย', 'assets/courses/modern-farm/2-guard.png'),
    new Course(null, 'ดินและปุ๋ย', 'ดินและปุ๋ย', 'assets/courses/modern-farm/3-soil.png'),
    new Course(null, 'AE', 'AE', 'assets/courses/modern-farm/4-ae.png'),
    new Course(null, 'น้ำ', 'น้ำ', 'assets/courses/modern-farm/5-water.png'),
    new Course(null, 'Modern Farm', 'Modern Farm', 'assets/courses/modern-farm/6-modern.png'),
    new Course(null, 'AE - MDF', 'AE - MDF', 'assets/courses/modern-farm/7-mdf.png', ),
    new Course(null, 'Precision Farming', 'Precision Farming', 'assets/courses/modern-farm/8-precision.png'),
    new Course(null, 'Logistic', 'Logistic', 'assets/courses/modern-farm/9-logistic.png'),
  ];
  category: Category;
  modernFarm: Course;
  errorMessage: string;
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
    this.coursesSub = this.coursesService.fetchCourses().subscribe(courses => {
      if (!courses || courses.length === 0) {
        this.errorMessage = 'You are not enrolled in this course.';
        this.isLoading = false;
        return;
      }
      courses.forEach(course => {
        this.updateCourseId(courses, course.name);
      });
      this.isLoading = false;
    }, error => {
      console.log(error.message);
      this.errorMessage = 'Error getting courses';
      this.isLoading = false;
    });
  }

  onClick(course: Course) {
    if (course.id) {
      this.router.navigate([course.id, 'topics'], { relativeTo: this.activatedRoute });
    }
  }

  updateCourseId(courses: Course[], courseName: string) {
    const course = courses.find(c => c.name === courseName);
    if (course) {
      const index = this.courses.findIndex(c => c.name === courseName);
      if (index >= 0) {
        this.courses[index].id = course.id;
      }
    }
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
  }
}
