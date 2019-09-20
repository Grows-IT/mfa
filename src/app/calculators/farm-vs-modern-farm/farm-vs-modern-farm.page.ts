import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CalculatorsService, ModernFarmCalcData } from '../calculators.service';

@Component({
  selector: 'app-farm-vs-modern-farm',
  templateUrl: './farm-vs-modern-farm.page.html',
  styleUrls: ['./farm-vs-modern-farm.page.scss'],
})
export class FarmVsModernFarmPage implements OnInit {
  calcData: ModernFarmCalcData;
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
    this.calcData = this.calculatorsService.calculateModernfarm(data.sugarcaneArea);
    this.showResult = true;
  }
}
