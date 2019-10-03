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
      if (!topics || topics.length === 0) {
        return this.errorMessage = 'Coming soon';
      }
      this.topics = topics;
      this.errorMessage = null;
    });
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.topicsSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.coursesService.fetchTopics(this.courseId).subscribe(
      topics => {
        this.isLoading = false;
        this.coursesService.downloadResources(this.courseId, topics).subscribe();
      }, () => {
        this.coursesService.getTopicsFromStorage(this.courseId).subscribe(
          () => this.isLoading = false,
          storageError => {
            this.errorMessage = storageError.message;
            this.isLoading = false;
          }
        );
      }
    );
  }

  private setPrevUrl() {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    this.prevUrl = `/tabs/knowledge-room/${categoryId}/courses`;
  }
}
