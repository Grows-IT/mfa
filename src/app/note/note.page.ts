import { Component, OnInit } from '@angular/core';
import { NoteService } from './note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {
  data: any;

  constructor(
    private noteService: NoteService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.noteService.getAllNote().subscribe((data) => {
      this.data = data.personalnotes;
    });
  }
}
