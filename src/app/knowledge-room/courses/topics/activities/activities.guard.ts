import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';

import { CoursesService } from '../../courses.service';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesGuard implements CanActivate {
  constructor(
    private router: Router,
    private coursesService: CoursesService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const topicId = +route.paramMap.get('topicId');
    return this.coursesService.topics.pipe(
      first(),
      switchMap(topics => {
        if (topics) {
          const currentTopic = topics.find(topic => topic.id === topicId);
          return of(!!currentTopic.activities);
        }
        return this.coursesService.getTopicsFromStorage().pipe(
          map(storedTopics => {
            const storedTopic = storedTopics.find(topic => topic.id === topicId);
            return !!storedTopic.activities;
          })
        );
      }),
      tap(activitiesExist => {
        if (!activitiesExist) {
          const categoryId = +route.paramMap.get('categoryId');
          const courseId = +route.paramMap.get('courseId');
          this.router.navigateByUrl(`/tabs/knowledge-room/${categoryId}/courses/${courseId}/topics/${topicId}/activities`);
        }
      })
    );
  }
}
