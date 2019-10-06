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

  constructor(
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    this.categoriesSub = this.coursesService.categories.subscribe(categories => {
      if (categories && categories.length > 0) {
        this.category = categories.find(category => category.id === categoryId);
      }
    });
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      if (courses) {
        const filteredCourses = courses.filter(course => course.categoryId === categoryId);
        if (filteredCourses.length > 0) {
          this.courses = filteredCourses;
        } else {
          this.errorMessage = 'Coming soon';
        }
      }
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
  }

  ionViewDidEnter() {
    this.coursesService.fetchCourses().pipe(
      catchError(() => this.coursesService.getCoursesFromStorage())
    ).subscribe(() => this.isLoading = false);
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.categoriesSub.unsubscribe();
  }
}
