import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../courses.service';
import { Topic, Course } from '../course.model';
import { Subscription, of } from 'rxjs';
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
    this.isLoading = true;
    this.setPrevUrl();
    this.courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      this.course = courses.find(course => course.id === this.courseId);
    });
    this.topicsSub = this.getTopics().subscribe(
      topics => {
        if (topics) {
          this.topics = topics;
          if (this.topics.length === 0) {
            this.errorMessage = 'Coming soon';
          }
          this.isLoading = false;
        }
        this.fetchTopics().subscribe();
      }
    );
  }

  private fetchTopics() {
    return this.coursesService.fetchTopics(this.courseId).pipe(
      switchMap(topics => this.coursesService.downloadResources(topics))
    );
  }

  private getTopics() {
    return this.coursesService.topics.pipe(
      switchMap(topics => {
        if (topics) {
          const filteredTopics = topics.filter(topic => topic.courseId === this.courseId);
          if (filteredTopics) {
            return of(filteredTopics);
          }
        }
        return this.coursesService.getTopicsFromStorage();
      })
    );
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.topicsSub.unsubscribe();
  }

  private setPrevUrl() {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    this.prevUrl = `/tabs/knowledge-room/${categoryId}/courses`;
  }
}
