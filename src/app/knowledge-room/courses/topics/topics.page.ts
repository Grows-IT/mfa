import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { CoursesService } from '../courses.service';
import { Topic, Course } from '../course.model';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      this.course = courses.find(course => course.id === this.courseId);
    });
    this.setPrevUrl();
    this.coursesService.fetchTopics(this.courseId).pipe(
      switchMap(topics => this.coursesService.downloadResources(topics)),
      catchError(() => this.coursesService.getTopicsFromStorage())
    ).subscribe(topics => {
      this.isLoading = false;
      if (!topics) {
        this.errorMessage = 'ไม่มีข้อมูล';
        return;
      }
      const filteredTopics = topics.filter(topic => topic.courseId === this.courseId);
      if (filteredTopics.length === 0) {
        this.errorMessage = 'Coming soon';
        return;
      }
      this.topics = filteredTopics;
    });
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
  }

  private setPrevUrl() {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    this.prevUrl = `/tabs/knowledge-room/${categoryId}/courses`;
  }
}
