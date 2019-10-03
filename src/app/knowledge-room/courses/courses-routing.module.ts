import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoursesPage } from './courses.page';
import { CoursesGuard } from './courses.guard';
import { TopicsGuard } from './topics/topics.guard';
import { ActivitiesGuard } from './topics/activities/activities.guard';

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
        children: [
          {
            path: '',
            loadChildren: './topics/topics.module#TopicsPageModule',
            canActivate: [CoursesGuard]
          },
          {
            path: ':topicId',
            children: [
              {
                path: 'activities',
                children: [
                  {
                    path: '',
                    loadChildren: './topics/activities/activities.module#ActivitiesPageModule',
                    canActivate: [TopicsGuard]
                  },
                  {
                    path: ':activityId',
                    children: [
                      {
                        path: 'pages',
                        loadChildren: './topics/activities/pages/pages.module#PagesPageModule',
                        canActivate: [ActivitiesGuard]
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
