import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CoursesService } from '../courses.service';
import { tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TopicsGuard implements CanActivate {
  constructor(
    private navCtrl: NavController,
    private coursesService: CoursesService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const courseId = +route.paramMap.get('courseId');
    return this.coursesService.areTopicsLoaded(courseId).pipe(tap(topicsExist => {
      if (!topicsExist) {
        const categoryId = +route.paramMap.get('categoryId');
        this.navCtrl.navigateBack(`/tabs/knowledge-room/${categoryId}/courses/${courseId}/topics`);
      }
    }));
  }
}
