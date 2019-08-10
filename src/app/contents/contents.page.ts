import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.page.html',
  styleUrls: ['./contents.page.scss'],
})
export class ContentsPage implements OnInit {
  currentSubTopic;
  subTopics = [{
    id: '1' ,
    name: 'ABOUT อ้อย',
    contents: ['assets/img/pages/ABOUT อ้อย/1.png']
  }, {
    id: '2',
    name: 'ดิน',
    contents: ['assets/img/pages/ดิน/1.png', 'assets/img/pages/ดิน/2.png', 'assets/img/pages/ดิน/3.png']
  }, {
    id: '3',
    name: 'พันธุ์อ้อยทางการค้า',
    contents: ['assets/img/pages/พันธุ์อ้อยทางการค้า/1.png', 'assets/img/pages/พันธุ์อ้อยทางการค้า/2.png', 'assets/img/pages/พันธุ์อ้อยทางการค้า/3.png']
  }, {
    id: '4',
    name: 'การจัดการพันธุ์อ้อย',
    contents: ['assets/img/pages/การจัดการพันธุ์อ้อย/1.png', 'assets/img/pages/การจัดการพันธุ์อ้อย/2.png', 'assets/img/pages/การจัดการพันธุ์อ้อย/3.png']
  }, {
    id: '5',
    name: 'สภาพแวดล้อมที่เหมาะสมสำหรับปลูกอ้อย',
    contents: ['assets/img/pages/สภาพแวดล้อมที่เหมาะสมสำหรับปลูกอ้อย/1.png', 'assets/img/pages/สภาพแวดล้อมที่เหมาะสมสำหรับปลูกอ้อย/2.png', '']
  }, {
    id: '6',
    name: 'คุณภาพอ้อยและการสะสมน้ำตาล',
    contents: ['assets/img/pages/คุณภาพอ้อยและการสะสมน้ำตาล/1.png', 'assets/img/pages/คุณภาพอ้อยและการสะสมน้ำตาล/2.png']
  }, {
    id: '7',
    name: 'ทดสอบท้ายบท',
    contents: ['assets/img/pages/quiz/1.png', 'assets/img/pages/quiz/2.png']
  }];
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const subTopicId = this.activatedRoute.snapshot.paramMap.get('subTopicId');
    this.currentSubTopic = this.subTopics.find(subTopic => subTopic.id === subTopicId);
  }

}
