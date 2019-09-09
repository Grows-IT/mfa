import { Component, OnInit, PipeTransform, Pipe, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from 'src/app/courses/courses.service';
import { Page } from 'src/app/courses/course.model';
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
  private coursesSub: Subscription;
  private pageContentSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    this.isLoading = true;
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    const topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    const activityId = +this.activatedRoute.snapshot.paramMap.get('activityId');
    this.coursesSub = this.coursesService.getCourseById(courseId).subscribe(currentCourse => {
      const currentTopic = currentCourse.topics.find(topic => topic.id === topicId);
      const pages: Page[] = currentTopic.activities.filter(activity => activity instanceof Page);
      this.currentPage = pages.find(page => page.id === activityId);
      this.slideContents = this.currentPage.content.split('=====');
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.coursesSub.unsubscribe();
    if (this.pageContentSub) {
      this.pageContentSub.unsubscribe();
    }
  }
}
