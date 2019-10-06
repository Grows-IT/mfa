import { Component, OnInit } from '@angular/core';
import { CalculatorsService, FarmModernFarmData } from '../../calculators.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modern-farm-calc-report',
  templateUrl: './modern-farm-calc-report.page.html',
  styleUrls: ['./modern-farm-calc-report.page.scss'],
})
export class ModernFarmCalcReportPage implements OnInit {
  result: FarmModernFarmData;
  lastPage = false;

  constructor(
    private calculatorsService: CalculatorsService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    const id = +this.activatedRoute.snapshot.paramMap.get('id');
    if (id === 1) {
      this.result = this.calculatorsService.farmModernFarmData1Rai;
      const calculatedResult = this.calculatorsService.farmModernFarmData;
      if (!calculatedResult || calculatedResult.landSize === 1) {
        this.lastPage = true;
      }
    } else {
      this.result = this.calculatorsService.farmModernFarmData;
      this.lastPage = true;
    }
  }
}
