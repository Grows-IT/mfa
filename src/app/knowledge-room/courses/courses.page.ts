import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from './courses.service';
import { Course, Category } from './course.model';

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
        this.courses = courses.filter(course => course.categoryId === categoryId);
        if (this.courses.length === 0) {
          return this.errorMessage = 'Coming soon';
        }
        this.errorMessage = null;
      }
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.coursesService.fetchCourses().subscribe(
      () => this.isLoading = false,
      () => {
        this.coursesService.getCoursesFromStorage().subscribe(
          () => this.isLoading = false,
          storageError => {
            this.errorMessage = storageError;
            this.isLoading = false;
          }
        );
      }
    );
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.categoriesSub.unsubscribe();
  }
}
