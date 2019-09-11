import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { CoursesService } from '../../courses.service';
import { Topic, Page, Quiz } from '../../course.model';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit, OnDestroy {
  isLoading = false;
  currentTopic: Topic;
  pages: Page[];
  quiz: Quiz;
  private courseSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    this.isLoading = true;
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    const topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    this.courseSub = this.coursesService.getCourseById(courseId).subscribe(course => {
      this.currentTopic = course.topics.find(topic => topic.id === topicId);
      this.pages = this.currentTopic.activities.filter(activity => activity instanceof Page);
      this.quiz = this.currentTopic.activities.find(activity => activity instanceof Quiz);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.courseSub.unsubscribe();
  }
}
