import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, UrlSegment, Route, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CoursesService } from './courses/courses.service';
import { first, switchMap, map, tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CategoriesGuard implements CanLoad  {
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private coursesService: CoursesService
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.coursesService.categories.pipe(
      first(),
      switchMap(categories => {
        if (categories) {
          return of(!!categories);
        }
        return this.coursesService.getCategoriesFromStorage().pipe(
          map(storedCategories => {
            return !!storedCategories;
          })
        );
      }),
      tap(categoriesExist => {
        if (!categoriesExist) {
          this.navCtrl.navigateBack('/tabs/knowledge-room');
        }
      })
    );
  }
}
