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
  private fetchSub: Subscription;
  private categoriesSub: Subscription;

  constructor(
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    this.categoriesSub = this.coursesService.categories.subscribe(categories => {
      this.category = categories.find(cat => cat.id === categoryId);
    });
    this.coursesSub = this.coursesService.courses.subscribe(allCourses => {
      this.courses = allCourses.filter(course => course.categoryId === categoryId);
      if (!this.courses || this.courses.length === 0) {
        this.errorMessage = 'Coming soon';
      }
    });
    this.fetchSub = this.coursesService.fetchCourses().subscribe(
      () => {
        this.isLoading = false;
      },
      error => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.fetchSub.unsubscribe();
    this.categoriesSub.unsubscribe();
  }
}
