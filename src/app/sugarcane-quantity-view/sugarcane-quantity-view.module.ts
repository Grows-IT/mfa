import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SugarcaneQuantityViewPage } from './sugarcane-quantity-view.page';

const routes: Routes = [
  {
    path: '',
    component: SugarcaneQuantityViewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SugarcaneQuantityViewPage]
})
export class SugarcaneQuantityViewPageModule {}
