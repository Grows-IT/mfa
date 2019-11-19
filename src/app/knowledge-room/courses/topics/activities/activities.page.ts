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
  topic: Topic;
  pages: Page[];
  quiz: Quiz;
  errorMessage: string;
  prevUrl: string;
  private topicsSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    this.isLoading = true;
    const topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    this.topicsSub = this.coursesService.topics.subscribe(topics => {
      this.topic = topics.find(topic => topic.id === topicId);
      if (this.topic.activities && this.topic.activities.length >= 0) {
        this.pages = this.topic.activities.filter(activity => activity instanceof Page);
        this.quiz = this.topic.activities.find(activity => activity instanceof Quiz);
        if (this.pages.length > 0) {
          this.errorMessage = null;
        } else {
          this.errorMessage = 'Coming Soon';
        }
      } else {
        this.errorMessage = 'Coming Soon';
      }
      this.isLoading = false;
    });
    this.setPrevUrl();
  }

  ngOnDestroy() {
    this.topicsSub.unsubscribe();
  }

  private setPrevUrl() {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.prevUrl = `/tabs/knowledge-room/${categoryId}/courses/${courseId}/topics`;
  }
}
