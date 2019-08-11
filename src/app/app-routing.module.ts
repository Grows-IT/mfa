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
  { path: 'sugarcane-quantity-view', loadChildren: './sugarcane-quantity-view/sugarcane-quantity-view.module#SugarcaneQuantityViewPageModule' },
  { path: 'human-vs-machine', loadChildren: './human-vs-machine/human-vs-machine.module#HumanVsMachinePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
