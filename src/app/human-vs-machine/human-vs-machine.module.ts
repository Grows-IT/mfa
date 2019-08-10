import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HumanVsMachinePage } from './human-vs-machine.page';

const routes: Routes = [
  {
    path: '',
    component: HumanVsMachinePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HumanVsMachinePage]
})
export class HumanVsMachinePageModule {}
