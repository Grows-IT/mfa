import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap, first, catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanLoad {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.user.pipe(
      first(),
      switchMap(user => {
        if (user) {
          return of(!!user);
        }
        return this.authService.getUserFromStorage().pipe(
          map(storedUser => {
            return !!storedUser;
          })
        );
      }),
      tap(userExist => {
        if (!userExist) {
          this.router.navigateByUrl('/tabs/home');
        }
      })
    );
  }
}
