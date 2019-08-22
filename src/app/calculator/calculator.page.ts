import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage implements OnInit {
  calculators = [{
    id: '1',
    img: 'assets/img/icon-calculator-farm-modernfarm.png',
    url: '/calculator/farm-vs-modern-farm'
  }, {
    id: '2',
    img: 'assets/img/icon-calculator-human-machine.png',
    url: '/calculator/human-vs-machine'
  }, {
    id: '3',
    img: 'assets/img/icon-calculator-sugarcane.png',
    url: '/calculator/assess-sugar'
  }];

  constructor() { }

  ngOnInit() {
  }

}
