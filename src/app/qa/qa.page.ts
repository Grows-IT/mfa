import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { map, first, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.page.html',
  styleUrls: ['./qa.page.scss'],
})
export class QaPage implements OnInit {
  allDiscus = null;
  date: Date;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getDiscussions();
  }

  getDiscussions() {
    const params = new HttpParams({
      fromObject: {
        forumid: '11',
        page: '0',
        perpage: '10',
        sortorder: '1',
        moodlewssettingfilter: 'true',
        moodlewssettingfileurl: 'true',
        wsfunction: 'mod_forum_get_forum_discussions',
        wstoken: 'db66538e0bc1d5b3bda7d8d2c5b897d2',
      }
    });
    return this.http.post<any>(environment.webServiceUrl, params).subscribe(
      res => {
        this.date = new Date(1573203584);
        this.allDiscus = res.discussions;
        console.log(this.allDiscus);
      });
  }

}
