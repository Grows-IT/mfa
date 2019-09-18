import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

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
            loadChildren: '../knowledge-room/knowledge-room.module#KnowledgeRoomPageModule'
          },
          {
            path: ':categoryId',
            children: [
              {
                path: 'courses',
                children: [
                  {
                    path: '',
                    loadChildren: '../knowledge-room/courses/courses.module#CoursesPageModule'
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
        path: 'calculators',
        loadChildren: '../calculators/calculators.module#CalculatorsPageModule'
      },
      {
        path: 'news',
        loadChildren: './news/news.module#NewsPageModule'
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


// , {
//   path: 'knowledge-room',
//   children: [
//     {
//       path: '',
//       loadChildren: '../knowledge-room/knowledge-room.module#KnowledgeRoomPageModule'
//     }, {
//       path: ':categoryId',
//       children: [
//         {
//           path: '',
//           redirectTo: 'courses',
//           pathMatch: 'full'
//         }, {
//           path: 'courses',
//           children: [
//             {
//               path: '',
//               loadChildren: '../knowledge-room/courses/courses.module#CoursesPageModule',
//             }, {
//               path: ':courseId',
//               children: [{
//                 path: '',
//                 redirectTo: 'topics',
//                 pathMatch: 'full'
//               }, {
//                 path: 'topics',
//                 children: [{
//                   path: '',
//                   loadChildren: '../knowledge-room/courses/topics/topics.module#TopicsPageModule'
//                 }]
//               }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }
