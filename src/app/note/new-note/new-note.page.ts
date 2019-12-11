import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NoteService } from '../note.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.page.html',
  styleUrls: ['./new-note.page.scss'],
})
export class NewNotePage implements OnInit {
  @ViewChild('f', { static: false }) form: NgForm;

  constructor(
    private router: Router,
    private noteService: NoteService
  ) { }

  ngOnInit() {
  }

  onCreateNote() {
    if (!this.form.valid) {
      return;
    }
    this.noteService.addNote(this.form.value.note).subscribe((sucess) => {
      console.log(sucess);
      this.router.navigate(['/tabs/home/note']);

    });
  }
}
