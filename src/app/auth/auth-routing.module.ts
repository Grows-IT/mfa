import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserGuard } from './user.guard';

const routes: Routes = [{
  path: '',
  redirectTo: 'login',
  pathMatch: 'full'
}, {
  path: 'login',
  loadChildren: './login/login.module#LoginPageModule'
}, {
  path: 'profile',
  loadChildren: './profile/profile.module#ProfilePageModule',
  canLoad: [UserGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
