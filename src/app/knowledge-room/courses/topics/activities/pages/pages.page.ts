import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { CoursesService } from '../../../courses.service';
import { Page } from '../../../course.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit, OnDestroy {
  isLoading = false;
  page: Page;
  slideContents: SafeHtml[];
  prevUrl: string;
  private activitySub: Subscription;
  private topicId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    const activityId = +this.activatedRoute.snapshot.paramMap.get('activityId');
    this.activitySub = this.coursesService.topics.subscribe(topics => {
      const currentTopic = topics.find(topic => topic.id === this.topicId);
      this.page = currentTopic.activities.find(activity => activity.id === activityId);
      const htmlResource = this.page.resources.find(resource => resource.name === 'index.html');
      let htmlContent = decodeURI(htmlResource.data);
      const otherResources = this.page.resources.filter(resource => resource.type);
      otherResources.forEach(resource => {
        htmlContent = htmlContent.replace(resource.name, resource.data);
      });
      this.slideContents = htmlContent.split('<p></p>').map(str => this.sanitizer.bypassSecurityTrustHtml(str));
      this.isLoading = false;
    });
    this.setPrevUrl();
  }

  ngOnDestroy() {
    this.activitySub.unsubscribe();
  }

  private setPrevUrl() {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.prevUrl = `/tabs/knowledge-room/${categoryId}/courses/${courseId}/topics/${this.topicId}/activities`;
  }
}
