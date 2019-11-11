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
  {
    path: 'quiz',
    loadChildren: './knowledge-room/courses/topics/activities/quiz/quiz.module#QuizPageModule'
  },  { path: 'qa-details', loadChildren: './qa/qa-details/qa-details.module#QaDetailsPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
