import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../courses.service';
import { Topic, Course, Category } from '../course.model';
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
  private coursesSub: Subscription;
  private fetchSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      this.course = courses.find(course => course.id === courseId);
      this.topics = this.course.topics;
    });
    this.fetchSub = this.coursesService.fetchTopics(courseId).subscribe(topics => {
      if (!topics || topics.length === 0) {
        this.errorMessage = 'Coming soon';
      }
      this.isLoading = false;
    }, error => {
      console.log('[ERROR] topics.page.ts#ngOnInit', error.message);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.fetchSub.unsubscribe();
  }
}
