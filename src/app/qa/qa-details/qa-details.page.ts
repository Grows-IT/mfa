import { Component, OnInit, OnDestroy } from '@angular/core';
import { QaService } from '../qa.service';
import { NgForm } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Post } from '../qa.model';

@Component({
  selector: 'app-qa-details',
  templateUrl: './qa-details.page.html',
  styleUrls: ['./qa-details.page.scss'],
})
export class QaDetailsPage implements OnInit, OnDestroy {
  qaDetail;
  qaHeadDetail;
  haveComment: boolean;
  isLoading = false;
  errorMessage: string;
  postsSub: Subscription;
  postObj: Post[];

  constructor(
    private qaService: QaService
  ) { }

  ngOnInit() {
    this.postsSub = this.qaService.posts.subscribe(posts => {
      if (posts) {
        // console.log(posts);
        this.postObj = Object.assign([{}], posts);

        if (this.postObj.length === 1) {
          this.haveComment = false;
        } else {
          this.haveComment = true;
        }
        // console.log(this.postObj);

        this.qaHeadDetail = this.postObj.pop();
        this.qaDetail = this.postObj.reverse();
        // console.log(this.qaDetail);
        console.log(this.qaHeadDetail);
      }
    });

    // this.qaService.fetchPosts(discussionId).subscribe(posts => {
    //   console.log(posts);
    //   if (posts.length === 1) {
    //     this.haveComment = false;
    //   } else {
    //     this.haveComment = true;
    //   }

    //   this.qaHeadDetail = posts.pop();
    //   this.qaDetail = posts.reverse();
    //   // console.log(this.haveComment);
    // });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  ionViewWillEnter() {
    const discussionId = this.getDiscussionId();

    this.qaService.fetchPosts(discussionId).pipe(
      catchError(() => this.qaService.getPostFromStorage(discussionId))
    ).subscribe((posts) => {
      if (!posts) {
        this.isLoading = false;
        this.errorMessage = 'การเชื่อมต่อล้มเหลว';
      }
    });
  }

  getDiscussionId() {
    const url = window.location.pathname;

    const regex: RegExp = /\/(.+)[\/&|](?<id>\d+)/;
    const arrRegex = regex.exec(url);
    return +arrRegex.groups.id;
  }

  postComment(discussionForm: any, id: number, subject: string, el: NgForm) {
    if (discussionForm.value['message'] || discussionForm.value['message'] === '') {
      return;
    }

    this.qaService.postDiscussion(discussionForm.value['message'], id, subject).subscribe(res => {
      const discussionId = this.getDiscussionId();

      this.qaService.fetchPosts(discussionId).subscribe(posts => {
        if (posts.length === 1) {
          this.haveComment = false;
        } else {
          this.haveComment = true;
        }

        el.reset();
        posts.pop();
        this.qaDetail = posts.reverse();
      });
    });
  }
}
