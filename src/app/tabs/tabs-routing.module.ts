import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { UserGuard } from '../auth/user.guard';
import { CategoriesGuard } from '../knowledge-room/categories.guard';
import { CoursesGuard } from '../knowledge-room/courses/courses.guard';
import { NewsGuard } from '../news/news.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: '../home/home.module#HomePageModule'
          }
        ]
      },
      {
        path: 'knowledge-room',
        children: [
          {
            path: '',
            loadChildren: '../knowledge-room/knowledge-room.module#KnowledgeRoomPageModule',
            canLoad: [UserGuard]
          },
          {
            path: ':categoryId',
            children: [
              {
                path: 'courses',
                children: [
                  {
                    path: '',
                    loadChildren: '../knowledge-room/courses/courses.module#CoursesPageModule',
                    canLoad: [UserGuard, CategoriesGuard]
                  }
                ]
              },
              {
                path: '',
                redirectTo: 'courses',
                pathMatch: 'full'
              }
            ]
          },
        ]
      },
      {
        path: 'qa',
        loadChildren: '../static/static.module#StaticPageModule'
      },
      {
        path: 'calculators',
        loadChildren: '../calculators/calculators.module#CalculatorsPageModule'
      },
      {
        path: 'news',
        canActivate: [CoursesGuard],
        children: [
          {
            path: '',
            loadChildren: '../news/news.module#NewsPageModule'
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                loadChildren: '../news/news-detail/news-detail.module#NewsDetailPageModule',
                canActivate: [NewsGuard]
              }
            ]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule { }
