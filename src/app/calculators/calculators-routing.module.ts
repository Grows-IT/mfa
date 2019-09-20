import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculatorsPage } from './calculators.page';

const routes: Routes = [
  {
    path: '',
    component: CalculatorsPage,
  },
  {
    path: 'farm-vs-modern-farm',
    children: [
      {
        path: '',
        loadChildren: './farm-vs-modern-farm/farm-vs-modern-farm.module#FarmVsModernFarmPageModule'
      },
      {
        path: 'modern-farm-calc-report',
        children: [
          {
            path: ':id',
            loadChildren: './farm-vs-modern-farm/modern-farm-calc-report/modern-farm-calc-report.module#ModernFarmCalcReportPageModule'
          },
          {
            path: '',
            redirectTo: '1',
            pathMatch: 'full'
          }
        ]
      }
    ]
  },
  {
    path: 'human-vs-machine',
    loadChildren: './human-vs-machine/human-vs-machine.module#HumanVsMachinePageModule'
  },
  {
    path: 'assess-sugar',
    loadChildren: './assess-sugar/assess-sugar.module#AssessSugarPageModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculatorsRoutingModule { }
