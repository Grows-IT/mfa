import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from 'src/app/courses/courses.service';
import { Page } from 'src/app/courses/course.model';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {
  currentActivity;
  page: Page;
  slideContents: string[];
  activities = [{
    id: '1',
    name: 'ABOUT อ้อย',
    pages: ['assets/img/pages/ABOUT อ้อย/1.png']
  }, {
    id: '2',
    name: 'ดิน',
    pages: ['assets/img/pages/ดิน/1.png', 'assets/img/pages/ดิน/2.png', 'assets/img/pages/ดิน/3.png']
  }, {
    id: '3',
    name: 'พันธุ์อ้อยทางการค้า',
    pages: ['assets/img/pages/พันธุ์อ้อยทางการค้า/1.png', 'assets/img/pages/พันธุ์อ้อยทางการค้า/2.png',
      'assets/img/pages/พันธุ์อ้อยทางการค้า/3.png']
  }, {
    id: '4',
    name: 'การจัดการพันธุ์อ้อย',
    pages: ['assets/img/pages/การจัดการพันธุ์อ้อย/1.png', 'assets/img/pages/การจัดการพันธุ์อ้อย/2.png',
      'assets/img/pages/การจัดการพันธุ์อ้อย/3.png', 'assets/img/pages/การจัดการพันธุ์อ้อย/4.png',
      'assets/img/pages/การจัดการพันธุ์อ้อย/5.png', 'assets/img/pages/การจัดการพันธุ์อ้อย/6.png']
  }, {
    id: '5',
    name: 'สภาพแวดล้อมที่เหมาะสมสำหรับปลูกอ้อย',
    pages: ['assets/img/pages/สภาพแวดล้อมที่เหมาะสมสำหรับปลูกอ้อย/1.png', 'assets/img/pages/สภาพแวดล้อมที่เหมาะสมสำหรับปลูกอ้อย/2.png']
  }, {
    id: '6',
    name: 'คุณภาพอ้อยและการสะสมน้ำตาล',
    pages: ['assets/img/pages/คุณภาพอ้อยและการสะสมน้ำตาล/1.png', 'assets/img/pages/คุณภาพอ้อยและการสะสมน้ำตาล/2.png']
  }, {
    id: '7',
    name: 'ทดสอบท้ายบท',
    pages: ['assets/img/pages/quiz/1.png', 'assets/img/pages/quiz/2.png'],
    type: 'quiz'
  }];
  constructor(private activatedRoute: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    const activityId = +this.activatedRoute.snapshot.paramMap.get('activityId');
    // this.currentActivity = this.activities.find(activity => activity.id === activityId);
    this.coursesService.getActivityById(activityId).subscribe(activity => {
      this.page = activity as Page;
      this.slideContents = this.page.content.split('=====');
    });
  }
}
