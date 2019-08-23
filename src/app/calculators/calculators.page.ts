import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculators',
  templateUrl: './calculators.page.html',
  styleUrls: ['./calculators.page.scss'],
})
export class CalculatorsPage implements OnInit {
  calculators = [{
    id: '1',
    img: 'assets/img/icon-calculator-farm-modernfarm.png',
    url: '/calculators/farm-vs-modern-farm'
  }, {
    id: '2',
    img: 'assets/img/icon-calculator-human-machine.png',
    url: '/calculators/human-vs-machine'
  }, {
    id: '3',
    img: 'assets/img/icon-calculator-sugarcane.png',
    url: '/calculators/assess-sugar'
  }];

  constructor() { }

  ngOnInit() {
  }

}
