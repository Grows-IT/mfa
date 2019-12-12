import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { first, switchMap, withLatestFrom, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllNote() {
    return this.authService.token.pipe(
      first(),
      withLatestFrom(this.authService.userId),
      switchMap(([token, userId]) => {
        const params = new HttpParams({
          fromObject: {
            courseid: `12`,
            userid: `${userId}`,
            moodlewssettingfilter: 'true',
            moodlewssettingfileurl: 'true',
            wsfunction: 'core_notes_get_course_notes',
            wstoken: token
          }
        });
        return this.http.post<any>(environment.webServiceUrl, params);
      })
    );
  }

  getDetailNote(id: number) {
    return this.authService.token.pipe(
      first(),
      withLatestFrom(this.authService.userId),
      switchMap(([token, userId]) => {
        const params = new HttpParams({
          fromObject: {
            courseid: `12`,
            userid: `${userId}`,
            moodlewssettingfilter: 'true',
            moodlewssettingfileurl: 'true',
            wsfunction: 'core_notes_get_course_notes',
            wstoken: token
          }
        });
        return this.http.post<any>(environment.webServiceUrl, params);
      }),
      map(data => {
        let element: any;
        data.personalnotes.map(el => {
          if (el.id === id) {
            element = el.content.replace(/\u21B5/g, '</br>');
          }
        });
        return element;
      })
    );
  }

  addNote(text: string) {
    return this.authService.token.pipe(
      first(),
      withLatestFrom(this.authService.userId),
      switchMap(([token, userId]) => {
        const params = new HttpParams({
          fromObject: {
            'notes[0][courseid]': '12',
            'notes[0][format]': '1',
            'notes[0][publishstate]': 'personal',
            'notes[0][text]': `${text}`,
            'notes[0][userid]': `${userId}`,
            moodlewssettingfilter: 'true',
            moodlewssettingfileurl: 'true',
            wsfunction: 'core_notes_create_notes',
            wstoken: token
          }
        });
        return this.http.post<any>(environment.webServiceUrl, params);
      })
    );
  }

  deleteNote(noteId) {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            'notes[0]': `${noteId}`,
            moodlewssettingfilter: 'true',
            moodlewssettingfileurl: 'true',
            wsfunction: 'core_notes_delete_notes',
            wstoken: token
          }
        });
        return this.http.post<any>(environment.webServiceUrl, params);
      })
    ).subscribe(() => {
      this.getAllNote().subscribe();
    });
  }

  updateNote(text: any, noteId: number) {
    let id: any;
    return this.authService.token.pipe(
      first(),
      withLatestFrom(this.authService.userId),
      switchMap(([token, userId]) => {
        id = userId;
        const params = new HttpParams({
          fromObject: {
            'notes[0][format]': '1',
            'notes[0][publishstate]': 'personal',
            'notes[0][text]': `${text.note}`,
            'notes[0][id]': `${noteId}`,
            wsfunction: 'core_notes_update_notes',
            wstoken: environment.apiKey
          }
        });
        return this.http.post<any>(environment.webServiceUrl, params);
      })
    ).subscribe(() => {
      this.getDetailNote(id).subscribe();
    });
  }
}
