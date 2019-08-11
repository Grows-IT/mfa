import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-farm-vs-modern-farm',
  templateUrl: './farm-vs-modern-farm.page.html',
  styleUrls: ['./farm-vs-modern-farm.page.scss'],
})
export class FarmVsModernFarmPage implements OnInit {
  // @ViewChild('lineCanvas', { static: true }) lineCanvas;
  // lineChart: any;
  sugarcaneArea: number;
  oldTotalCost: number;
  modernTotalCost: number;
  reduceCost: number;
  totalIncrease: number;
  increaeResultPerRai: number;

  showResult = false;
  
  constructor() { }

  ngOnInit() {
    //this.lineChartMethod();
  }

  // lineChartMethod(): void {
  //   this.lineChart = new Chart(this.lineCanvas.nativeElement, {
  //     type: 'line',
  //     data: {
  //       labels: [0, 50],
  //       datasets: [
  //         {
  //           label: 'ModernFarm',
  //           backgroundColor: '#53A2DB',
  //           borderColor: '#53A2DB',
  //           data: [0, 50],
  //         },
  //         {
  //           label: 'Farm',
  //           backgroundColor: '#ED5015',
  //           borderColor: '#ED5015',
  //           data: [0, 100],
  //         }
  //       ]
  //     }
  //   });
  // }

  calculate(): void {
    const SugarCanePrice = 700

    const oldPrepareLandPlant = 250
    const oldPrepareLandRipper = 0
    const oldPrepareLandTaida = 400
    const oldSugarcaneDoubleHead = 750
    const oldSugarcaneFertilise = 800
    const oldSugarcaneRoot = 1305
    const oldMaintainFertiliser = 300
    const oldMaintainWeedKill = 200
    const oldHavestCut = 100
    const oldHavestGet = 100
    const oldHavestLoad = 150
    const oldHavestBurned = 30
    const oldTotalCostCal = oldPrepareLandPlant + oldPrepareLandRipper + oldPrepareLandTaida + oldSugarcaneDoubleHead + oldSugarcaneFertilise + oldSugarcaneRoot + oldMaintainFertiliser + oldMaintainWeedKill + oldHavestCut + oldHavestGet + oldHavestLoad + oldHavestBurned

    const oldResultperRai = 13
    const oldCCS = 13
    const oldIncome = (oldResultperRai * SugarCanePrice) + ((oldCCS - 10) * SugarCanePrice * 6 / 100)

    const modernPrepareLandPlant = 250
    const modernPrepareLandRipper = 450
    const modernPrepareLandTaida = 400
    const modernSugarcaneDoubleHead = 750
    const modernSugarcaneFertilise = 800
    const modernSugarcaneRoot = 870
    const modernMaintainFertiliser = 200
    const modernMaintainWeedKill = 100
    const modernHavestCut = 190
    const modernHavestGet = 0
    const modernHavestLoad = 150
    const modernHavestBurned = 0
    const modernTotalCost = modernPrepareLandPlant + modernPrepareLandRipper + modernPrepareLandTaida + modernSugarcaneDoubleHead + modernSugarcaneFertilise + modernSugarcaneRoot + modernMaintainFertiliser + modernMaintainWeedKill + modernHavestCut + modernHavestGet + modernHavestLoad + modernHavestBurned

    const modernResultPerRai = 18
    const modernCCS = 13
    const modernIncome = (modernResultPerRai * SugarCanePrice) + ((modernCCS - 10) * SugarCanePrice * 6 / 100)
    this.oldTotalCost = Math.ceil(this.sugarcaneArea * oldTotalCostCal)
    this.modernTotalCost = Math.ceil(this.sugarcaneArea * modernTotalCost)
    this.reduceCost = Math.floor(this.oldTotalCost - this.modernTotalCost)
    this.increaeResultPerRai = Math.floor(this.sugarcaneArea * (modernResultPerRai - oldResultperRai))
    const increaseIncomeByArea = Math.floor(this.sugarcaneArea * (modernIncome - oldIncome))
    this.totalIncrease = Math.floor(this.reduceCost + increaseIncomeByArea)
    // this.lineChartMethod();
    this.showResult = true;
  }
}
