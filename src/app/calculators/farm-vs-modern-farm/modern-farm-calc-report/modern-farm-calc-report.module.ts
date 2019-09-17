import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModernFarmCalcReportPage } from './modern-farm-calc-report.page';

const routes: Routes = [
  {
    path: '',
    component: ModernFarmCalcReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModernFarmCalcReportPage]
})
export class ModernFarmCalcReportPageModule {}
