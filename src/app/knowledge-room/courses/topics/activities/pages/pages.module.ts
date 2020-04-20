import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PagesPage } from './pages.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

const routes: Routes = [
  {
    path: '',
    component: PagesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxIonicImageViewerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PagesPage]
})
export class PagesPageModule {}
