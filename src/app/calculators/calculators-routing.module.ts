import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';

import { CalculatorsPage } from './calculators.page';

const routes: Routes = [{
  path: '',
  component: CalculatorsPage
}, {
  path: 'farm-vs-modern-farm',
  loadChildren: './farm-vs-modern-farm/farm-vs-modern-farm.module#FarmVsModernFarmPageModule'
}, {
  path: 'human-vs-machine',
  loadChildren: './human-vs-machine/human-vs-machine.module#HumanVsMachinePageModule'
}, {
  path: 'assess-sugar',
  loadChildren: './assess-sugar/assess-sugar.module#AssessSugarPageModule'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculatorsRoutingModule {}
