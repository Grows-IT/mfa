import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoursesPage } from './courses.page';

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
            loadChildren: './topics/topics.module#TopicsPageModule'
          },
          {
            path: ':topicId',
            children: [
              {
                path: 'activities',
                children: [
                  {
                    path: '',
                    loadChildren: './topics/activities/activities.module#ActivitiesPageModule'
                  },
                  {
                    path: ':activityId',
                    children: [
                      {
                        path: 'pages',
                        loadChildren: './topics/activities/pages/pages.module#PagesPageModule'
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
