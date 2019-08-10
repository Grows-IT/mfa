import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {
  courses = [{
    id: 1,
    name: 'Know Yourself',
    img: 'assets/img/icon-course-know-yourself.png'
  }, {
    id: 2,
    name: 'Empathy',
    img: 'assets/img/icon-course-empathy.png'
  }, {
    id: 3,
    name: 'Modern Farm',
    img: 'assets/img/icon-course-modern-farm.png'
  }, {
    id: 4,
    name: 'Specialization',
    img: 'assets/img/icon-course-specialization.png'
  }];

  constructor() { }

  ngOnInit() {
  }

}
