import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { CoursesService } from '../../courses.service';
import { Topic } from '../../course.model';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit, OnDestroy {
  currentTopic = null;
  private topicSub: Subscription;
  topic: Topic;
  topics = [{
    id: '1',
    name: 'หลักการผลิตอ้อย',
    activities: [{
      id: '1',
      name: 'ABOUT อ้อย'
    }, {
      id: '2',
      name: 'ดิน'
    }, {
      id: '3',
      name: 'พันธุ์อ้อยทางการค้า'
    }, {
      id: '4',
      name: 'การจัดการพันธุ์อ้อย'
    }, {
      id: '5',
      name: 'สภาพแวดล้อมที่เหมาะสมสำหรับปลูกอ้อย'
    }, {
      id: '6',
      name: 'คุณภาพอ้อยและการสะสมน้ำตาล'
    }, {
      id: '7',
      name: 'ทดสอบท้ายบท',
      img: 'assets/img/icon-quiz.png'
    }]
  }, {
    id: '2',
    name: 'การเตรียมดินและการจัดการปุ๋ยสำหรับการปลูกอ้อย'
  }, {
    id: '3',
    name: 'ความรู้ทั่วไปเกี่ยวกับเครื่องจักรกลเกษตรและการเก็บเกี่ยว'
  }, {
    id: '4',
    name: 'การอารักขาอ้อย'
  }, {
    id: '5',
    name: 'น้ำและการจัดการน้ำในไร่'
  }, {
    id: '6',
    name: 'Mitr Phol Modern farm'
  }, {
    id: '7',
    name: 'เครื่องจักรกลการเกษตรสำหรับ Modern Farm'
  }, {
    id: '7',
    name: 'Precision Modern Farming'
  }, {
    id: '8',
    name: 'ระบบเก็บเกี่ยวและ Logistic อ้อย'
  }];
  constructor(private activatedRoute: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit() {
    const topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    // this.currentTopic = this.topics.find(topic => topic.id === topicId);
    this.topicSub = this.coursesService.getTopicById(topicId).subscribe(topic => {
      this.topic = topic;
    });
  }

  ngOnDestroy() {
    this.topicSub.unsubscribe();
  }
}
