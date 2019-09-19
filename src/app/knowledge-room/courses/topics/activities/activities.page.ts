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
  errorMessage: string;
  private topicSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    this.isLoading = true;
    const topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    this.topicSub = this.coursesService.getTopicById(topicId).subscribe(topic => {
      this.currentTopic = topic;
      if (!this.currentTopic.activities || this.currentTopic.activities.length === 0) {
        this.isLoading = false;
        this.errorMessage = 'Coming Soon';
        return;
      }
      this.pages = this.currentTopic.activities.filter(activity => activity instanceof Page);
      this.quiz = this.currentTopic.activities.find(activity => activity instanceof Quiz);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.topicSub.unsubscribe();
  }
}
