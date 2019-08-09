import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FarmVsModernFarmPage } from './farm-vs-modern-farm.page';

const routes: Routes = [
  {
    path: '',
    component: FarmVsModernFarmPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FarmVsModernFarmPage]
})
export class FarmVsModernFarmPageModule {}
