import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-human-vs-machine',
  templateUrl: './human-vs-machine.page.html',
  styleUrls: ['./human-vs-machine.page.scss'],
})
export class HumanVsMachinePage implements OnInit {
  humanDays: number;
  machineDays: number;

  constructor() { }

  ngOnInit() {
    this.humanDays = 1000;
    this.machineDays = 90;
  }
}
