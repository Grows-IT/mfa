import { Component, OnInit } from '@angular/core';
import { QaService } from '../qa.service';

@Component({
  selector: 'app-qa-new',
  templateUrl: './qa-new.page.html',
  styleUrls: ['./qa-new.page.scss'],
})
export class QaNewPage implements OnInit {

  constructor(
    private qaService: QaService
  ) { }

  ngOnInit() {}

  onCreateNewDiscussion() {
    
  }

}
