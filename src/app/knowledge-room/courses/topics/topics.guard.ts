import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CoursesService } from '../courses.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TopicsGuard implements CanActivate {
  constructor(
    private router: Router,
    private coursesService: CoursesService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const courseId = +route.paramMap.get('courseId');
    return this.coursesService.areTopicsLoaded(courseId).pipe(tap(topicsExist => {
      if (!topicsExist) {
        const categoryId = +route.paramMap.get('categoryId');
        this.router.navigateByUrl(`/tabs/knowledge-room/${categoryId}/courses/${courseId}/topics`);
      }
    }));
  }
}
