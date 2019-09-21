import { Component, OnInit } from '@angular/core';
import { CalculatorsService, MachineCalcData } from '../../calculators.service';

@Component({
  selector: 'app-machine-calc-report',
  templateUrl: './machine-calc-report.page.html',
  styleUrls: ['./machine-calc-report.page.scss'],
})
export class MachineCalcReportPage implements OnInit {
  result: MachineCalcData;

  constructor(
    private calculatorsService: CalculatorsService
  ) { }

  ngOnInit() {
    this.result = this.calculatorsService.machineCalcData;
  }

}
