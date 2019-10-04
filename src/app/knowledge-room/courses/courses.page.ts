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
  private coursesSub: Subscription;
  private categoriesSub: Subscription;
  private fetchSub: Subscription;

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
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      if (courses) {
        this.courses = courses.filter(course => course.categoryId === categoryId);
        if (this.courses.length === 0) {
          this.errorMessage = 'Coming soon';
        }
      }
    });
    this.fetchSub = this.coursesService.fetchCourses().pipe(
      catchError(() => this.coursesService.getCoursesFromStorage())
    ).subscribe(() => this.isLoading = false);
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.categoriesSub.unsubscribe();
    this.fetchSub.unsubscribe();
  }
}
