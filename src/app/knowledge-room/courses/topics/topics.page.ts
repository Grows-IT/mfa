import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../courses.service';
import { Topic, Course } from '../course.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.page.html',
  styleUrls: ['./topics.page.scss'],
})
export class TopicsPage implements OnInit, OnDestroy {
  isLoading = false;
  topics: Topic[];
  course: Course;
  errorMessage: string;
  private courseSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    this.isLoading = true;
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.courseSub = this.coursesService.getCourseById(courseId).subscribe(course => {
      this.course = course;
      this.topics = course.topics;
      this.isLoading = false;
    }, error => {
      console.log(error.message);
      this.errorMessage = 'Error getting course';
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.courseSub.unsubscribe();
  }
}
