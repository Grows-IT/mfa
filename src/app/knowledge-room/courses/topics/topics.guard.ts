import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CoursesService } from '../courses.service';
import { first, map, switchMap, tap } from 'rxjs/operators';

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
      return true;

    // return this.coursesService.topics.pipe(
    //   first(),
    //   switchMap(topics => {
    //     if (topics) {
    //       return of(!!topics);
    //     }
    //     return this.coursesService.getTopicsFromStorage().pipe(
    //       map(storedTopics => {
    //         return !!storedTopics;
    //       })
    //     );
    //   }),
    //   tap(topicsExist => {
    //     if (!topicsExist) {
    //       const categoryId = +route.paramMap.get('categoryId');
    //       const courseId = +route.paramMap.get('courseId');
    //       this.router.navigateByUrl(`/tabs/knowledge-room/${categoryId}/courses/${courseId}/topics`);
    //     }
    //   })
    // );
  }

}
