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
  private activitySub: Subscription;


  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const activityId = +this.activatedRoute.snapshot.paramMap.get('activityId');
    this.activitySub = this.coursesService.getActivityById(activityId).subscribe((page: Page) => {
      this.page = page;
      const htmlResource = this.page.resources.find(resource => resource.name === 'index.html');
      let htmlContent = htmlResource.data;
      const otherResources = this.page.resources.filter(resource => resource.type);
      otherResources.forEach(resource => {
        htmlContent = htmlContent.replace(resource.name, resource.data);
      });
      this.slideContents = htmlContent.split('<p></p>');
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.activitySub.unsubscribe();
  }
}
