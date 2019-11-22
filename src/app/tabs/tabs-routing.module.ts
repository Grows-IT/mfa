import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { UserGuard } from '../auth/user.guard';
import { CategoriesGuard } from '../knowledge-room/categories.guard';
import { CoursesGuard } from '../knowledge-room/courses/courses.guard';
import { NewsGuard } from '../news/news.guard';
import { TopicsGuard } from '../knowledge-room/courses/topics/topics.guard';

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
            loadChildren: '../home/home.module#HomePageModule',
          },
          {
            path: 'news/:id',
            children: [
              {
                path: '',
                loadChildren: '../news/news-detail/news-detail.module#NewsDetailPageModule',
                canLoad: [NewsGuard]
              }
            ]
          },
          {
            path: 'weather',
            loadChildren: '../weather/weather.module#WeatherPageModule'
          },
          {
            path: 'sugar-price',
            loadChildren: '../sugar-price/sugar-price.module#SugarPricePageModule'
          },
          {
            path: 'favorite',
            children: [
              {
                path: '',
                loadChildren: '../favorite/favorite.module#FavoritePageModule',
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
                        loadChildren: '../knowledge-room/knowledge-room.module#KnowledgeRoomPageModule',
                        canLoad: [UserGuard, CategoriesGuard]
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
                                loadChildren: '../knowledge-room/courses/topics/topics.module#TopicsPageModule',
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
                                        loadChildren: '../knowledge-room/courses/topics/activities/activities.module#ActivitiesPageModule',
                                      },
                                      {
                                        path: ':activityId',
                                        children: [
                                          {
                                            path: 'pages',
                                            loadChildren: '../knowledge-room/courses/topics/activities/pages/pages.module#PagesPageModule',
                                          },
                                          {
                                            path: '',
                                            redirectTo: 'pages',
                                            pathMatch: 'full'
                                          },
                                          {
                                            path: 'quiz',
                                            loadChildren: '../knowledge-room/courses/topics/activities/quiz/quiz.module#QuizPageModule'
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
                    ]
                  },
                  {
                    path: '',
                    redirectTo: 'courses',
                    pathMatch: 'full'
                  }
                ]
              }
            ]
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
        children: [
          {
            path: '',
            loadChildren: '../qa/qa.module#QaPageModule',
          },
          {
            path: 'new',
            loadChildren: '../qa/qa-new/qa-new.module#QaNewPageModule'
          },
          {
            path: ':id',
            loadChildren: '../qa/qa-details/qa-details.module#QaDetailsPageModule'
          },
        ]
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
                canLoad: [NewsGuard]
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
