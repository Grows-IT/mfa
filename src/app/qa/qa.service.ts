import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { first, switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Post, Discussion } from './qa.model';

interface PostResData {
  posts: [
    {
      id: number;
      subject: string;
      message: string;
      modified: number;
      userfullname: string;
    }
  ];
}

@Injectable({
  providedIn: 'root'
})
export class QaService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  addDiscussion(subject: string, message: string) {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            wstoken: token,
            wsfunction: 'mod_forum_add_discussion',
            forumid: '11',
            'options[0][name]': 'discussionsubscribe',
            'options[0][value]': '1',
            subject,
            message,
          }
        });
        return this.http.post<{ discussionid: number }>(environment.webServiceUrl, params);
      }),
      map(res => {
        if (res.discussionid) {
          return true;
        }
        return false;
      })
    );
  }

  fetchPosts(discussionId: number) {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            wstoken: token,
            wsfunction: 'mod_forum_get_forum_discussion_posts',
            discussionid: discussionId.toString(),
          }
        });
        return this.http.post<PostResData>(environment.webServiceUrl, params);
      }),
      map(res => {
        const posts = res.posts.map(resPost => {
          const date = new Date(resPost.modified * 1000);
          return new Post(resPost.id, resPost.subject, resPost.message, resPost.userfullname, date);
        });
        return posts;
      })
    );
  }
}
