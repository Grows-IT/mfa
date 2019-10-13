import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CoursesService } from './courses.service';
import { tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CoursesGuard implements CanActivate {
  constructor(
    private navCtrl: NavController,
    private coursesService: CoursesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.coursesService.areCoursesLoaded().pipe(
      tap(coursesExist => {
        if (!coursesExist) {
          const categoryId = +route.paramMap.get('categoryId');
          const url = `/tabs/knowledge-room/${categoryId}/courses`;
          this.navCtrl.navigateBack(url);
        }
      }),
    );
  }
}
