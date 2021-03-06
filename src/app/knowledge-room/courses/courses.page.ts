import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from './courses.service';
import { Course, Category } from './course.model';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit, OnDestroy {
  courses: Course[];
  category: Category;
  errorMessage: string;
  isLoading = false;
  private categoriesSub: Subscription;

  constructor(
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    this.categoriesSub = this.coursesService.categories.subscribe(categories => {
      if (categories && categories.length > 0) {
        this.category = categories.find(category => category.id === categoryId);
      }
    });
    this.coursesService.fetchCourses().pipe(
      catchError(() => this.coursesService.getCoursesFromStorage())
    ).subscribe(courses => {

      this.isLoading = false;
      if (!courses) {
        this.errorMessage = 'การเชื่อมต่อล้มเหลว';
        return;
      }
      const filteredCourses = courses.filter(course => course.categoryId === categoryId);
      if (filteredCourses.length === 0) {
        this.errorMessage = 'Coming soon';
        return;
      }
      this.courses = filteredCourses;
    });
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}
