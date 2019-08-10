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
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const subTopicId = this.activatedRoute.snapshot.paramMap.get('subTopicId');
    this.currentSubTopic = this.subTopics.find(subTopic => subTopic.id === subTopicId);
  }

}
