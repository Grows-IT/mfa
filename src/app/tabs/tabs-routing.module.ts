import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [{
  path: '',
  redirectTo: '/tabs/home',
  pathMatch: 'full'
}, {
  path: '',
  component: TabsPage,
  children: [{
    path: 'home',
    loadChildren: '../home/home.module#HomePageModule'
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule { }
