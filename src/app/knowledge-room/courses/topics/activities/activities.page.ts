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
  private coursesSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    this.isLoading = true;
    const topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    this.coursesSub = this.coursesService.getTopicById(topicId).subscribe(topics => {
      this.topic = topics;
      if (!this.topic.activities || this.topic.activities.length === 0) {
        this.errorMessage = 'Coming Soon';
        this.isLoading = false;
        return;
      }
      this.pages = this.topic.activities.filter(activity => activity instanceof Page);
      this.quiz = this.topic.activities.find(activity => activity instanceof Quiz);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
  }
}
