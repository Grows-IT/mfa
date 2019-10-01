import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../courses.service';
import { Topic, Course } from '../course.model';
import { Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

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
  private downloadSub: Subscription;
  private storedTopicsSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      this.course = courses.find(course => course.id === courseId);
    });
    this.fetchSub = this.coursesService.fetchTopics(courseId).subscribe(
      topics => {
        if (!topics || topics.length === 0) {
          this.errorMessage = 'Coming soon';
          this.isLoading = false;
          return;
        }
        this.topics = topics;
        this.isLoading = false;
        this.downloadSub = this.coursesService.downloadResources(courseId, topics).subscribe(
          () => null,
          downloadError => {
            console.log('[ERROR] topics.page.ts#downloadResources', downloadError.message);
          }
        );
      }, error => {
        console.log('[ERROR] topics.page.ts#fetchTopics', error.message);
        this.storedTopicsSub = this.coursesService.getTopicsFromStorage(courseId).subscribe(
          topics => {
            this.topics = topics;
            this.isLoading = false;
          },
          storageError => {
            console.log('[ERROR] topics.page.ts#getTopicsFromStorage', storageError.message);
            this.errorMessage = storageError.message;
            this.isLoading = false;
          }
        );
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.fetchSub.unsubscribe();
    if (this.downloadSub) {
      this.downloadSub.unsubscribe();
    }
    if (this.storedTopicsSub) {
      this.storedTopicsSub.unsubscribe();
    }
  }
}
