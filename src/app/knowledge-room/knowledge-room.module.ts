import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { KnowledgeRoomPage } from './knowledge-room.page';

const routes: Routes = [
  {
    path: '',
    component: KnowledgeRoomPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KnowledgeRoomPage]
})
export class KnowledgeRoomPageModule {}
