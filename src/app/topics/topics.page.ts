import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.page.html',
  styleUrls: ['./topics.page.scss'],
})
export class TopicsPage implements OnInit {
  currentCourse;
  demoTopic = {
    id: '1' ,
    name: 'หลักการผลิตอ้อย'
  }
  courses = [{
    id: '1',
    name: 'Know Yourself'
  }, {
    id: '2',
    name: 'Empathy'
  }, {
    id: '3',
    name: 'Modern Farm',
    topics: [{ 
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
  }, {
    id: '4',
    name: 'Specialization'
  }];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const courseId = this.activatedRoute.snapshot.paramMap.get('courseId');
    this.currentCourse = this.courses.find(course => course.id === courseId);
  }
}