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
  { path: 'calculator', loadChildren: './calculator/calculator.module#CalculatorPageModule' },
  { path: 'courses', loadChildren: './courses/courses.module#CoursesPageModule' },
  { path: 'farm-vs-modern-farm', loadChildren: './farm-vs-modern-farm/farm-vs-modern-farm.module#FarmVsModernFarmPageModule' },
  { path: 'course/:courseId', loadChildren: './topics/topics.module#TopicsPageModule' },
  { path: 'topic/:topicId', loadChildren: './sub-topics/sub-topics.module#SubTopicsPageModule' },
  { path: 'sub-topic/:subTopicId', loadChildren: './contents/contents.module#ContentsPageModule' },
  { path: 'human-vs-machine', loadChildren: './human-vs-machine/human-vs-machine.module#HumanVsMachinePageModule' },
  { path: 'assess-sugar', loadChildren: './assess-sugar/assess-sugar.module#AssessSugarPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'static/:pageId', loadChildren: './static/static.module#StaticPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
