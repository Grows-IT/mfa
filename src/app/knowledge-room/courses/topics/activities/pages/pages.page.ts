import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../../../courses.service';
import { Page } from '../../../course.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit, OnDestroy {
  isLoading = false;
  currentPage: Page;
  slideContents: string[];
  private activitySub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    this.isLoading = true;
    const activityId = +this.activatedRoute.snapshot.paramMap.get('activityId');
    this.activitySub = this.coursesService.getActivityById(activityId).subscribe((page) => {
      this.currentPage = page;
      this.processResources(this.currentPage);
    });
  }

  processResources(page: Page) {
    if (!page.resources) {
      return this.populateSlides(page.content);
    }
    let i = 0;
    page.resources.forEach(resource => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const data = fileReader.result.toString();
        console.log('fileName', resource.name);
        console.log('pageContent', page.content);
        page.content = page.content.replace(resource.name, data);
        i += 1;
        if (i >= page.resources.length) {
          return this.populateSlides(page.content);
        }
      };
      fileReader.readAsDataURL(resource.data);
    });
  }

  populateSlides(content: string) {
    this.slideContents = content.split('<br><br>');
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.activitySub.unsubscribe();
  }
}
