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

interface DiscussionsResData {
  discussions: [
    {
      discussion: number;
      subject: string;
      created: number;
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

  getDiscussions() {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            forumid: '11',
            page: '0',
            perpage: '10',
            sortorder: '1',
            moodlewssettingfilter: 'true',
            moodlewssettingfileurl: 'true',
            wsfunction: 'mod_forum_get_forum_discussions',
            wstoken: token,
          }
        });
        return this.http.post<DiscussionsResData>(environment.webServiceUrl, params);
      }),
      map((res) => {
        const qa = res.discussions.map(resQa => {
          const date = new Date(resQa.created * 1000);
          return new Discussion(resQa.discussion, resQa.subject, resQa.userfullname, date);
        });
        return qa;
      })
    );
  }

  postDiscussion(messages: string, id: number, subject: string) {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            postid: `${id}`,
            subject: 're : ' + subject,
            message: messages,
            moodlewssettingfilter: 'true',
            moodlewssettingfileurl: 'true',
            wsfunction: 'mod_forum_add_discussion_post',
            wstoken: token,
          }
        });
        return this.http.post<any>(environment.webServiceUrl, params);
      })
    );
  }
}
