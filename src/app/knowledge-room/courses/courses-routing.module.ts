import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoursesPage } from './courses.page';
import { CoursesGuard } from './courses.guard';
import { TopicsGuard } from './topics/topics.guard';

const routes: Routes = [
  {
    path: '',
    component: CoursesPage
  },
  {
    path: ':courseId',
    children: [
      {
        path: 'topics',
        canActivate: [CoursesGuard],
        children: [
          {
            path: '',
            loadChildren: './topics/topics.module#TopicsPageModule',
          },
          {
            path: ':topicId',
            children: [
              {
                path: 'activities',
                canActivate: [TopicsGuard],
                children: [
                  {
                    path: '',
                    loadChildren: './topics/activities/activities.module#ActivitiesPageModule',
                  },
                  {
                    path: ':activityId',
                    children: [
                      {
                        path: 'pages',
                        loadChildren: './topics/activities/pages/pages.module#PagesPageModule',
                      },
                      {
                        path: '',
                        redirectTo: 'pages',
                        pathMatch: 'full'
                      }
                    ]
                  }
                ]
              },
              {
                path: '',
                redirectTo: 'activities',
                pathMatch: 'full'
              },
            ]
          }
        ]
      },
      {
        path: '',
        redirectTo: 'topics',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
