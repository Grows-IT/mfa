import { Component, OnInit } from '@angular/core';
import { QaService } from './qa.service';
import { Discussion } from './qa.model';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.page.html',
  styleUrls: ['./qa.page.scss'],
})
export class QaPage implements OnInit {
  allDiscus;

  constructor(
    private qaService: QaService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.qaService.getDiscussions().subscribe((qa) => {
      return this.allDiscus = qa;
    });
  }
}
