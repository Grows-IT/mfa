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
  { path: 'calculator/farm-vs-modern-farm', 
    loadChildren: './calculator/farm-vs-modern-farm/farm-vs-modern-farm.module#FarmVsModernFarmPageModule' },
  { path: 'course/:courseId', loadChildren: './topics/topics.module#TopicsPageModule' },
  { path: 'topic/:topicId', loadChildren: './sub-topics/sub-topics.module#SubTopicsPageModule' },
  { path: 'sub-topic/:subTopicId', loadChildren: './contents/contents.module#ContentsPageModule' },
  { path: 'calculator/human-vs-machine', loadChildren: './calculator/human-vs-machine/human-vs-machine.module#HumanVsMachinePageModule' },
  { path: 'calculator/assess-sugar', loadChildren: './calculator/assess-sugar/assess-sugar.module#AssessSugarPageModule' },
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
