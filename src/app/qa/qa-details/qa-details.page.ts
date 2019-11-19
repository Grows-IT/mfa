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

  constructor(
    private qaService: QaService
  ) { }

  ngOnInit() {
    const discussionId = this.getDiscussionId();

    this.qaService.fetchPosts(discussionId).subscribe(posts => {
      this.qaHeadDetail = posts.pop();
      this.qaDetail = posts.reverse();
    });
  }

  getDiscussionId() {
    const url = window.location.pathname;
    const regex: RegExp = /\/(\d)/;
    const arrRegex = regex.exec(url);
    return +arrRegex[1];
  }

  postComment(discussionForm: any, id: number, subject: string, el: NgForm) {
    if (discussionForm.value['message'] === null || discussionForm.value['message'] === undefined || discussionForm.value['message'] === '') {
      return;
    }

    this.qaService.postDiscussion(discussionForm.value['message'], id, subject).subscribe(res => {
      const discussionId = this.getDiscussionId();

      this.qaService.fetchPosts(discussionId).subscribe(posts => {
        console.log(posts);

        el.reset();
        posts.pop();
        this.qaDetail = posts.reverse();
      });
    });

  }
}
