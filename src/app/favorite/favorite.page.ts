import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../knowledge-room/courses/courses.service';
import { map, first, switchMap } from 'rxjs/operators';
import { Course } from '../knowledge-room/courses/course.model';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  _favoriteIndex: number = 0;
  myFavorite: any = [];

  constructor(
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.coursesService.getFavourite().subscribe((favourite) => {
      this.myFavorite = favourite;
    });
  }

  setFavourite(status: boolean, id: number, index: number) {
    this.myFavorite[index].favourite = !this.myFavorite[index].favourite;
    this.coursesService.setFavourite(status, id).subscribe();
  }
}
