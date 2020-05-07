import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { first, switchMap, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Post, Discussion } from './qa.model';
import { Plugins } from '@capacitor/core';
import { from, BehaviorSubject } from 'rxjs';

const { Storage } = Plugins;

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
  private _qas = new BehaviorSubject<Discussion[]>(null);
  private _posts = new BehaviorSubject<Post[]>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get qas() {
    return this._qas.asObservable();
  }
  get posts() {
    return this._posts.asObservable();
  }

  addDiscussion(subject: string, message: string) {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            wstoken: token,
            wsfunction: 'mod_forum_add_discussion',
            forumid: '15',
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
            discussionid: discussionId.toString()
          }
        });
        return this.http.post<PostResData>(environment.webServiceUrl, params);
      }),
      map(res => {
        // console.log(res.posts);
        // console.log(res.posts[res.posts.length - 1]['discussion']);

        const posts = res.posts.map(resPost => {
          const date = new Date(resPost.modified * 1000);
          return new Post(resPost.id, resPost.subject, resPost.message, resPost.userfullname, date);
        });
        this._posts.next(posts);
        this.savePostToStroage(posts, res.posts[res.posts.length - 1]['discussion']);
        return posts;
        //   return [{ posts: posts, discussion: res.posts[res.posts.length - 1]['discussion'] }];
        // }),
        // tap(data => {
        //   console.log(data[0]);

        //   this._posts.next(data[0].posts);
        //   this.savePostToStroage(data[0].posts, data[0].discussion);
      })
    );
  }

  getDiscussions() {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            forumid: '15',
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
          // console.log(res);

          return new Discussion(resQa.discussion, resQa.subject, resQa.userfullname, date);
        });
        return qa;
      }),
      tap(qa => {
        this._qas.next(qa);
        this.saveQaToStorage(qa);
      })
    );
  }

  postDiscussion(messages: string, id: number, subject: string) {
    console.log(messages);

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
      }),
      tap(qa => {
        this._qas.next(qa);
      })
    );
  }

  private saveQaToStorage(qas: Discussion[]) {
    const data = JSON.stringify(qas.map(qa => qa.toObject()));
    Storage.set({ key: 'qa', value: data });
  }

  private savePostToStroage(posts: Post[], id: number) {
    const data = JSON.stringify(posts.map(post => post.toObject()));
    Storage.set({ key: `qa_${id}_post`, value: data });
  }

  getQaFromStorage() {
    return from(Storage.get({ key: 'qa' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const qas = JSON.parse(storedData.value) as Discussion[];
      this._qas.next(qas);
      return qas;
    }));
  }

  getPostFromStorage(id: number) {
    return from(Storage.get({ key: `qa_${id}_post` })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const posts = JSON.parse(storedData.value) as Post[];
      this._posts.next(posts);
      return posts;
    }));
  }
}
