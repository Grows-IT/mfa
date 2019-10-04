import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { NewsService } from '../news/news.service';
import { first, switchMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private coursesService: CoursesService,
    private newsService: NewsService,
    private router: Router
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isUserAvailable().pipe(
      switchMap(userLoaded => {
        if (!userLoaded) {
          return of(userLoaded);
        }
        return this.coursesService.areCoursesLoaded().pipe(
          switchMap(coursesLoaded => {
            if (!coursesLoaded) {
              return of(coursesLoaded);
            }
            return this.newsService.areNewsArticlesLoaded();
          })
        );
      }),
      tap(dataLoaded => {
        if (!dataLoaded) {
          this.router.navigateByUrl('/auth/login');
        }
      })
    );
  }
}
