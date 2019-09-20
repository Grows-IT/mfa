import { Component, OnInit, OnChanges } from '@angular/core';
import { CalculatorsService, ModernFarmCalcData } from '../../calculators.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modern-farm-calc-report',
  templateUrl: './modern-farm-calc-report.page.html',
  styleUrls: ['./modern-farm-calc-report.page.scss'],
})
export class ModernFarmCalcReportPage implements OnInit {
  result: ModernFarmCalcData;
  lastPage = false;

  constructor(
    private calculatorsService: CalculatorsService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    const id = +this.activatedRoute.snapshot.paramMap.get('id');
    if (id === 1) {
      this.result = this.calculatorsService.modernFarmReport1Rai;
    } else {
      this.result = this.calculatorsService.modernFarmReport;
      this.lastPage = true;
    }
  }
}
