import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, switchMap, first, catchError, map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { CoursesService } from '../knowledge-room/courses/courses.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private coursesService: CoursesService,
    private router: Router
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        if (!token) {
          return this.authService.autoLogin();
        }
        return of(!!token);
      }),
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          return of(isLoggedIn);
        }
        return this.loadUser().pipe(
          switchMap(() => {
            return this.loadCategories();
          }),
          switchMap(() => {
            return this.loadCourses();
          })
        );
      }),
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigateByUrl('/auth/login');
        }
      })
    );
  }

  loadUser() {
    return this.authService.user.pipe(
      first(),
      switchMap(user => {
        if (!user) {
          return this.authService.fetchUser().pipe(
            catchError(() => of(false))
          );
        }
        return of(!!user);
      }),
      switchMap(userExist => {
        if (!userExist) {
          return this.authService.getUserFromStorage();
        }
        return of(userExist);
      }),
    );
  }

  loadCategories() {
    return this.coursesService.categories.pipe(
      first(),
      switchMap(categories => {
        if (!categories || categories.length === 0) {
          return this.coursesService.getCategoriesFromStorage().pipe(
            catchError(() => of(null)),
            map(storedCategories => !!storedCategories),
          );
        }
        return of(!!categories);
      }),
      switchMap(categoriesExist => {
        if (!categoriesExist) {
          return this.coursesService.fetchCategories().pipe(
            catchError(() => of(false)),
            map(categories => !!categories)
          );
        }
        return of(categoriesExist);
      })
    );
  }

  loadCourses() {
    return this.coursesService.courses.pipe(
      first(),
      switchMap(courses => {
        if (!courses || courses.length === 0) {
          return this.coursesService.getCoursesFromStorage().pipe(
            catchError(() => of(null)),
            map(savedCourses => !!savedCourses),
            );
        }
        return of(!!courses);
      }),
      switchMap(result => {
        if (!result) {
          return this.coursesService.fetchCourses().pipe(
            catchError(() => of(false)),
            map(courses => !!courses)
          );
        }
        return of(result);
      })
    );
  }
}
