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
  page: Page;
  slideContents: string[];
  private fetchSub: Subscription;
  private coursesSub: Subscription;


  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    const topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    const activityId = +this.activatedRoute.snapshot.paramMap.get('activityId');
    this.coursesSub = this.coursesService.courses.subscribe(courses => {
      const course = courses.find(c => c.id === courseId);
      const topic = course.topics.find(t => t.id === topicId);
      this.page = topic.activities.find(a => a.id === activityId);
      if (this.page.content) {
        this.slideContents = this.page.content.split('<p></p>');
      }
    });
    this.fetchSub = this.coursesService.fetchResources(courseId, topicId, activityId).subscribe(
      () => {
        this.isLoading = false;
      },
      error => {
        console.log('[ERROR] pages.page.ts#ngOnInit', error.message);
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    this.fetchSub.unsubscribe();
  }
}
