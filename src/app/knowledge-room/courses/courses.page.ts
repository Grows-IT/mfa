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
  private categoryId: number;
  private coursesSub: Subscription;
  private categoriesSub: Subscription;

  constructor(
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    this.categoriesSub = this.coursesService.categories.subscribe(categories => {
      this.category = categories.find(category => category.id === this.categoryId);
    });
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      this.courses = courses.filter(course => course.categoryId === this.categoryId);
      if (!this.courses || this.courses.length === 0) {
        this.errorMessage = 'Coming soon';
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
