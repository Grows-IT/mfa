import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../courses.service';
import { Topic, Course } from '../course.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.page.html',
  styleUrls: ['./topics.page.scss'],
})
export class TopicsPage implements OnInit, OnDestroy {
  isLoading = false;
  topics: Topic[];
  errorMessage: string;
  private topicsSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    this.isLoading = true;
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.topicsSub = this.coursesService.fetchTopics(courseId).subscribe(topics => {
      this.topics = topics;
      this.isLoading = false;
    }, error => {
      console.log(error.message);
      this.errorMessage = 'Error getting topics';
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.topicsSub.unsubscribe();
  }
}
