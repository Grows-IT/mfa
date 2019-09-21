import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CalculatorsService, MachineCalcData, HumanMachineData } from '../calculators.service';

@Component({
  selector: 'app-human-vs-machine',
  templateUrl: './human-vs-machine.page.html',
  styleUrls: ['./human-vs-machine.page.scss'],
})
export class HumanVsMachinePage implements OnInit {
  showResult = false;
  inputForm: FormGroup;
  result: HumanMachineData;

  constructor(
    private formBuilder: FormBuilder,
    private calculatorsService: CalculatorsService
  ) {
    this.inputForm = this.formBuilder.group({
      quantity: ['', Validators.min(1)]
    });
  }

  ngOnInit() {
  }

  calculateTotalPrice(data: any) {
    if (data.quantity <= 0) {
      return;
    }
    this.result = this.calculatorsService.calculateHumanMachine(data.quantity);
    this.showResult = true;
  }
}
