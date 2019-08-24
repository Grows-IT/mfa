import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalculatorsPage } from './calculators.page';
import { CalculatorsRoutingModule } from './calculators-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CalculatorsRoutingModule
  ],
  declarations: [CalculatorsPage]
})
export class CalculatorsPageModule {}
