import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NoteService } from '../note.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.page.html',
  styleUrls: ['./note-details.page.scss'],
})
export class NoteDetailsPage implements OnInit {
  @ViewChild('f', { static: false }) form: NgForm;

  noteId = +this.activatedRoute.snapshot.paramMap.get('noteId');
  noteDetail: any;
  isEdit = false;

  constructor(
    private noteService: NoteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.noteService.getDetailNote(this.noteId).subscribe(data => {
      this.noteDetail = data;
    });
  }

  deleteNote() {
    this.router.navigate(['/tabs/home/note']);

    this.noteService.deleteNote(this.noteId);
  }

  edit() {
    this.isEdit = !this.isEdit;
  }

  onUpdateNote() {
    if (!this.form.valid) {
      return;
    }
    this.noteService.updateNote(this.form.value, this.noteId);
    this.noteDetail = this.form.value.note;
    this.edit();
  }

  async confirm() {
    const alert = await this.alertController.create({
      header: 'คุณต้องการลบบันทึกนี้?',
      message: 'คุณต้องการลบบันทึกนี้ บันทึกของคุณจะถูกลบแล้ว <b>ไม่สามารถกู้คืนกลับมาได้</b> !!',
      buttons: [
        {
          text: 'ยืนยัน',
          handler: (value) => {
            this.deleteNote();
          }
        }, {
          text: 'ยกเลิก',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}
