import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}, {
  path: 'home',
  loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
}, {
  path: 'courses',
  loadChildren: './courses/courses.module#CoursesPageModule'
}, {
  path: 'calculators',
  loadChildren: './calculators/calculators.module#CalculatorsPageModule'
}, {
  path: 'auth',
  loadChildren: './auth/auth.module#AuthModule'
}, {
  path: 'static/:pageId',
  loadChildren: './static/static.module#StaticPageModule'
}, {
  path: 'my-account',
  loadChildren: './my-account/my-account.module#MyAccountPageModule'
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
