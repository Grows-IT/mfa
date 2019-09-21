import { Component, OnInit } from '@angular/core';
import { CalculatorsService, HumanMachineData } from '../../calculators.service';

@Component({
  selector: 'app-machine-calc-report',
  templateUrl: './machine-calc-report.page.html',
  styleUrls: ['./machine-calc-report.page.scss'],
})
export class MachineCalcReportPage implements OnInit {
  result: HumanMachineData;
  result1Rai: HumanMachineData;

  constructor(
    private calculatorsService: CalculatorsService
  ) { }

  ngOnInit() {
    this.result1Rai = this.calculatorsService.humanMachineData1Rai;
    this.result = this.calculatorsService.humanMachineData;
  }

}
