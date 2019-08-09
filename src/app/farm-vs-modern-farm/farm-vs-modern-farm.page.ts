import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-farm-vs-modern-farm',
  templateUrl: './farm-vs-modern-farm.page.html',
  styleUrls: ['./farm-vs-modern-farm.page.scss'],
})
export class FarmVsModernFarmPage implements OnInit {
  @ViewChild('lineCanvas', { static: true }) lineCanvas;
  lineChart: any;

  constructor() { }

  ngOnInit() {
    this.lineChartMethod();
  }

  lineChartMethod(): void {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [0, 50],
        datasets: [
          {
            label: 'ModernFarm',
            backgroundColor: '#53A2DB',
            borderColor: '#53A2DB',
            data: [0, 50],
          },
          {
            label: 'Farm',
            backgroundColor: '#ED5015',
            borderColor: '#ED5015',
            data: [0, 100],
          }
        ]
      }
    });
  }
}
