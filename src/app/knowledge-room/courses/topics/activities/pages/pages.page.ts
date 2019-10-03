import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { CoursesService } from '../../../courses.service';
import { Page } from '../../../course.model';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit, OnDestroy {
  isLoading = false;
  page: Page;
  slideContents: string[];
  prevUrl: string;
  errorMessage: string;
  private activitySub: Subscription;
  private topicId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.setPrevUrl();
    const activityId = +this.activatedRoute.snapshot.paramMap.get('activityId');
    this.activitySub = this.coursesService.topics.subscribe(topics => {
      const currentTopic = topics.find(topic => topic.id === this.topicId);
      this.page = currentTopic.activities.find(activity => activity.id === activityId);
      if (!this.page) {
        this.errorMessage = 'Coming soon';
        this.isLoading = false;
        return;
      }
      const htmlResource = this.page.resources.find(resource => resource.name === 'index.html');
      let htmlContent = htmlResource.data;
      const otherResources = this.page.resources.filter(resource => resource.type);
      otherResources.forEach(resource => {
        htmlContent = htmlContent.replace(resource.name, resource.data);
      });
      this.slideContents = htmlContent.split('<p></p>');
      this.errorMessage = null;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.activitySub.unsubscribe();
  }

  private setPrevUrl() {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    this.prevUrl = `/tabs/knowledge-room/${categoryId}/courses/${courseId}/topics/${this.topicId}/activities`;
  }
}
