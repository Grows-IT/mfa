import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { first, switchMap, map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  arr: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getListNotification().subscribe();
  }

  openNotification(val: any) {
    const regex = /php\?(?<disscusionId>.+)#p(?<postId>.+)/;
    const postDisscusion = regex.exec(val);
    console.log(postDisscusion);
  }

  getListNotification() {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            useridto: '3',
            newestfirst: '1',
            offset: '0',
            limit: '21',
            moodlewssettingfilter: 'true',
            moodlewssettingfileurl: 'true',
            wsfunction: 'message_popup_get_popup_notifications',
            wstoken: '83080e20a19620d0db6c9a738b7c0755',
          }
        });
        return this.http.post<any>('https://grows-it.moodlecloud.com/webservice/rest/server.php?moodlewsrestformat=json&', params);
      }),
      map((data) => {
        this.arr = data;
        console.log(this.arr);
      })
    );
  }
}
