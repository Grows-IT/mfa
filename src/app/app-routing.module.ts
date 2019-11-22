import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  {
    path: '',
    loadChildren: './tabs/tabs.module#TabsPageModule',
    canLoad: [AuthGuard]
  },
  { path: 'static', loadChildren: './static/static.module#StaticPageModule' },
  { path: 'qa-new', loadChildren: './qa/qa-new/qa-new.module#QaNewPageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
