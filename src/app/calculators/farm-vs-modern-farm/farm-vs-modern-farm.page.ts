import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CalculatorsService, FarmModernFarmData } from '../calculators.service';

@Component({
  selector: 'app-farm-vs-modern-farm',
  templateUrl: './farm-vs-modern-farm.page.html',
  styleUrls: ['./farm-vs-modern-farm.page.scss'],
})
export class FarmVsModernFarmPage implements OnInit {
  result: FarmModernFarmData;
  showResult = false;
  inputForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private calculatorsService: CalculatorsService
  ) {
    this.inputForm = this.formBuilder.group({
      sugarcaneArea: ['', Validators.min(1)]
    });
  }

  ngOnInit() {
  }

  calculate(data: any): void {
    if (data.sugarcaneArea <= 0) {
      return;
    }
    this.result = this.calculatorsService.calculateFarmModernFarm(data.sugarcaneArea);
    this.showResult = true;
  }
}
