import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}, {
  path: 'home',
  loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  canLoad: [AuthGuard]
}, {
  path: 'courses',
  loadChildren: './courses/courses.module#CoursesPageModule',
  canLoad: [AuthGuard]
}, {
  path: 'calculators',
  loadChildren: './calculators/calculators.module#CalculatorsPageModule'
}, {
  path: 'auth',
  loadChildren: './auth/auth.module#AuthModule'
}, {
  path: 'static/:pageId',
  loadChildren: './static/static.module#StaticPageModule'
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
