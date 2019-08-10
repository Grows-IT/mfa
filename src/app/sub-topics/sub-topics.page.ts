import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-topics',
  templateUrl: './sub-topics.page.html',
  styleUrls: ['./sub-topics.page.scss'],
})
export class SubTopicsPage implements OnInit {
  currentTopic = null;
  topics: [{ 
    id: '1' ,
    name: 'ABOUT อ้อย',
    subTopics: [{
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
      name: 'ทดสอบท้ายบท'
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
  }]
  constructor() { }

  ngOnInit() {
  }

}
