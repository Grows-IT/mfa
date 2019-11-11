import { Component, OnInit } from '@angular/core';
import { QaService } from '../qa.service';

@Component({
  selector: 'app-qa-details',
  templateUrl: './qa-details.page.html',
  styleUrls: ['./qa-details.page.scss'],
})
export class QaDetailsPage implements OnInit {

  constructor(
    private qaService: QaService
  ) { }

  ngOnInit() {
    const discussionId = this.getDiscussionId();

    this.qaService.fetchPosts(discussionId).subscribe(posts => {
    });
  }

  getDiscussionId() {
    const url = window.location.pathname;
    const regex: RegExp = /\/(\d)/;
    const arrRegex = regex.exec(url);
    // const discusId = +arrRegex[1];
    return +arrRegex[1];
  }

}
