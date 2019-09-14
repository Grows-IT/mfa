import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { CoursesPage } from './courses.page';
// import { CoursesRoutingModule } from './courses-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    // CoursesRoutingModule
  ],
  declarations: [CoursesPage]
})
export class CoursesPageModule {}
