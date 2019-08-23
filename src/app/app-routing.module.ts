import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'courses', loadChildren: './courses/courses.module#CoursesPageModule' },
  { path: 'courses/:courseId/topics', loadChildren: './courses/topics/topics.module#TopicsPageModule' },
  { path: 'courses/:courseId/topics/:topicId/activities',
    loadChildren: './courses/topics/activities/activities.module#ActivitiesPageModule' },
  { path: 'courses/:courseId/topics/:topicId/activities/:activityId/pages',
    loadChildren: './courses/topics/activities/pages/pages.module#PagesPageModule' },
  { path: 'calculators', loadChildren: './calculators/calculators.module#CalculatorsPageModule' },
  { path: 'calculators/farm-vs-modern-farm',
    loadChildren: './calculators/farm-vs-modern-farm/farm-vs-modern-farm.module#FarmVsModernFarmPageModule' },
  { path: 'calculators/human-vs-machine', loadChildren: './calculators/human-vs-machine/human-vs-machine.module#HumanVsMachinePageModule' },
  { path: 'calculators/assess-sugar', loadChildren: './calculators/assess-sugar/assess-sugar.module#AssessSugarPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'static/:pageId', loadChildren: './static/static.module#StaticPageModule' },
  { path: 'my-account', loadChildren: './my-account/my-account.module#MyAccountPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
