import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, take, switchMap, flatMap, map, first } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn.pipe(
      first(),
      switchMap(loggedIn => {
        if (!loggedIn) {
          return this.authService.autoLogin();
        } else {
          return of(loggedIn);
        }
      }),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigateByUrl('/auth/login');
        }
      })
    );
  }
}
