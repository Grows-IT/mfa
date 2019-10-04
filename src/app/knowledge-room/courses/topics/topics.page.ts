import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../courses.service';
import { Topic, Course } from '../course.model';
import { Subscription, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

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
  prevUrl: string;
  private courseId: number;
  private coursesSub: Subscription;
  private topicsSub: Subscription;
  private fetchSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.setPrevUrl();
    this.courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      this.course = courses.find(course => course.id === this.courseId);
    });
    this.topicsSub = this.coursesService.topics.subscribe(topics => {
      if (topics) {
        this.topics = topics.filter(topic => topic.courseId === this.courseId);
        if (!this.isLoading && this.topics.length === 0) {
          this.errorMessage = 'Coming soon';
        }
      }
    });
    this.fetchSub = this.coursesService.fetchTopics(this.courseId).pipe(
      switchMap(topics => this.coursesService.downloadResources(topics)),
      catchError(() => this.coursesService.getTopicsFromStorage())
    ).subscribe(() => this.isLoading = false);

  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.topicsSub.unsubscribe();
    this.fetchSub.unsubscribe();
  }

  private setPrevUrl() {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    this.prevUrl = `/tabs/knowledge-room/${categoryId}/courses`;
  }
}
