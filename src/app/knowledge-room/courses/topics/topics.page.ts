import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../courses.service';
import { Topic, Course } from '../course.model';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
  ) { }

  ngOnInit() {
    this.setPrevUrl();
    this.courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      this.course = courses.find(course => course.id === this.courseId);
    });
    this.topicsSub = this.coursesService.topics.subscribe(topics => {
      if (topics) {
        this.topics = topics.filter(topic => topic.courseId === this.courseId);
      }
      if (!this.topics || this.topics.length === 0) {
        this.errorMessage = 'Coming soon';
        return;
      }
      this.errorMessage = null;
    });
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.topicsSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.getTopics();
  }

  private getTopics() {
    this.coursesService.getTopicsFromStorage().pipe(
      switchMap(() => {
        return this.coursesService.fetchTopics(this.courseId);
      })
    ).subscribe(
      topics => {
        this.isLoading = false;
        this.coursesService.downloadResources(topics).subscribe();
      }
    );
  }

  private setPrevUrl() {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    this.prevUrl = `/tabs/knowledge-room/${categoryId}/courses`;
  }
}
