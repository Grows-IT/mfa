import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CoursesService } from './courses.service';
import { first, switchMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesGuard implements CanActivate {
  constructor(
    private router: Router,
    private coursesService: CoursesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.coursesService.courses.pipe(
      first(),
      switchMap(courses => {
        if (courses) {
          return of(!!courses);
        }
        return this.coursesService.getCoursesFromStorage().pipe(
          map(storedCourses => {
            return !!storedCourses;
          })
        );
      }),
      tap(coursesExist => {
        if (!coursesExist) {
          const categoryId = +route.paramMap.get('categoryId');
          const url = `/tabs/knowledge-room/${categoryId}/courses`;
          this.router.navigateByUrl(url);
        }
      })
    );
  }
}
