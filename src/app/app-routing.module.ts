import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  {
    path: '',
    loadChildren: './tabs/tabs.module#TabsPageModule',
    canLoad: [AuthGuard],
    // canActivate: [AuthGuard]
  },
  { path: 'static', loadChildren: './static/static.module#StaticPageModule' },
  // { path: 'weather', loadChildren: './weather/weather.module#WeatherPageModule' },
  // { path: 'sugar-price', loadChildren: './sugar-price/sugar-price.module#SugarPricePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
