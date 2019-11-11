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
    const discussionId = 1;
    this.qaService.fetchPosts(discussionId).subscribe(posts => {
      console.log(posts);
    });
  }

}
