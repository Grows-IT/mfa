import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { QaService } from '../qa.service';

@Component({
  selector: 'app-qa-new',
  templateUrl: './qa-new.page.html',
  styleUrls: ['./qa-new.page.scss'],
})
export class QaNewPage implements OnInit {
  @ViewChild('f', { static: false }) form: NgForm;
  errorMessage = null;

  constructor(
    private router: Router,
    private qaService: QaService
  ) { }

  ngOnInit() {}

  onCreateNewDiscussion() {
    if (!this.form.valid) {
      return;
    }
    this.qaService.addDiscussion(this.form.value.subject, this.form.value.message).subscribe(success => {
      if (success) {
        this.router.navigate(['/tabs/qa']);
      } else {
        this.errorMessage = 'มีปัญหาในการตั้งคำถาม โปรดลองใหม่';
      }
    });
  }

}
