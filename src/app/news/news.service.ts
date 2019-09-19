import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { switchMap, concatMap, toArray, tap, map, first, take, takeWhile } from 'rxjs/operators';

import { Page } from '../knowledge-room/courses/course.model';
import { CoursesService } from '../knowledge-room/courses/courses.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private _pages = new BehaviorSubject<Page[]>(null);

  constructor(
    private coursesService: CoursesService
  ) {
    // const pages = [];
    // pages.push(new Page(1, 'มิตรผล เคล็ดลับความสุข..ส่งจากไร่ : "Farmสุข..โมเดิร์น"', '&lt;iframe width=&quot;560&quot; height=&quot;315&quot; src=&quot;https://www.youtube.com/embed/6eNckyUQ670&quot; frameborder=&quot;0&quot; allow=&quot;accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture&quot; allowfullscreen&gt;&lt;/iframe&gt;', null, 'assets/news/1.png'));
    // pages.push(new Page(2, 'Modern Technology Agriculture Huge Machines', '&lt;iframe width=&quot;560&quot; height=&quot;315&quot; src=&quot;https://www.youtube.com/embed/FNn5DB1Zen4&quot; frameborder=&quot;0&quot; allow=&quot;accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture&quot; allowfullscreen&gt;&lt;/iframe&gt;', null, 'assets/news/2.png'));
    // this._pages.next(pages);
  }

  get pages() {
    return this._pages.asObservable().pipe(
      first(),
      switchMap(pages => {
        if (pages) {
          return of(pages);
        }
        let pageNum: number;
        return this.coursesService.courses.pipe(
          switchMap(courses => {
            const newsCourse = courses.find(course => course.identifier === 'news');
            return this.coursesService.getCourseById(newsCourse.id);
          }),
          switchMap(newsCourse => {
            const p = newsCourse.topics[0].activities as Page[];
            pageNum = p.length;
            return from(p);
          }),
          concatMap(page => {
            return this.coursesService.downloadResources(page);
          }),
          take(2),
          toArray(),
          tap(p => this._pages.next(p))
        );
      })
    );
  }
}
