import { Component, OnInit } from '@angular/core';
import { QaService } from '../qa.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-qa-details',
  templateUrl: './qa-details.page.html',
  styleUrls: ['./qa-details.page.scss'],
})
export class QaDetailsPage implements OnInit {
  qaDetail;
  qaHeadDetail;
  haveComment: boolean;

  constructor(
    private qaService: QaService
  ) { }

  ngOnInit() {
    const discussionId = this.getDiscussionId();

    this.qaService.fetchPosts(discussionId).subscribe(posts => {
      console.log(posts.length);
      if (posts.length === 1) {
        this.haveComment = false;
      } else {
        this.haveComment = true;
      }

      this.qaHeadDetail = posts.pop();
      this.qaDetail = posts.reverse();
      // console.log(this.haveComment);
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
