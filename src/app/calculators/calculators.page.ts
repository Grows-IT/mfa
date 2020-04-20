import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculators',
  templateUrl: './calculators.page.html',
  styleUrls: ['./calculators.page.scss'],
})
export class CalculatorsPage implements OnInit {
  calculators = [{
    id: '1',
    img: 'assets/calculators/modernfarm.svg',
    url: 'farm-vs-modern-farm'
  }, {
    id: '2',
    img: 'assets/calculators/machine.svg',
    url: 'human-vs-machine'
  }, {
    id: '3',
    img: 'assets/calculators/sugarcane.png',
    url: 'assess-sugar'
  },
  {
    id: '4',
    img: 'assets/calculators/calculateArea.svg',
    url: 'calculate-area'
  },
  {
    id: '5',
    img: 'assets/calculators/profit.svg',
    url: 'profit'
  },
  {
    id: '6',
    img: 'assets/calculators/allInvestment.svg',
    url: 'all-investment'
  },
  {
    id: '7',
    img: 'assets/calculators/waterRequiring.svg',
    url: 'water-requiring'
  }
  ];

  constructor() { }

  ngOnInit() {
  }

}
