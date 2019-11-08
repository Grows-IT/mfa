import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { first, switchMap, map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class Question {
  constructor(
    public text: string,
    public answers: Answer[],
  ) { }
}

export class Answer {
  constructor(
    public id: string,
    public choice: string,
    public text: string,
    public sqId: string,
    public sqCount: string
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  startAttempt(quizInstance: number) {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            wsfunction: 'mod_quiz_start_attempt',
            quizid: quizInstance.toString(),
            forcenew: '1',
            wstoken: token,
            moodlewsrestformat: 'json',
          }
        });
        return this.http.post<{ attempt: { id: number } }>(environment.webServiceUrl, params)
      }),
      map(res => {
        return res.attempt.id;
      })
    );
  }

  fetchQuiz(attemptId: number) {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params = new HttpParams({
          fromObject: {
            wstoken: token,
            wsfunction: 'mod_quiz_get_attempt_summary',
            attemptid: attemptId.toString(),
            moodlewsrestformat: 'json'
          }
        });
        return this.http.post<any>(environment.webServiceUrl, params);
      }),
      map(res => {
        const questions: Question[] = res.questions.map(questionEl => {
          const html: string = decodeURI(questionEl.html);
          return this.parseQuestion(html);
        });
        return questions;
      })
    );
  }

  submitQuiz(data: any, attemptId: number) {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        let params = new HttpParams(
          {
            fromObject: {
              finishattempt: '1',
              timeup: '0',
              moodlewssettingfilter: 'true',
              moodlewssettingfileurl: 'true',
              wstoken: token,
              wsfunction: 'mod_quiz_process_attempt',
              attemptid: attemptId.toString(),
              moodlewsrestformat: 'json',
            }
          }
        );
        data.forEach((el, index) => {
          if ((index % 2) === 0) {
            params = params.set(`data[${index}][name]`, el.name);
            params = params.set(`data[${index}][value]`, el.value);
          } else if ((index % 2) === 1) {
            params = params.set(`data[${index}][name]`, el.sqId);
            params = params.set(`data[${index}][value]`, el.sqCount);
          }
        });
        return this.http.post<any>(environment.webServiceUrl, params);
      })
    );
  }

  getGrade(attemptId: number) {
    return this.authService.token.pipe(
      first(),
      switchMap(token => {
        const params2 = new HttpParams(
          {
            fromObject: {
              attemptid: attemptId.toString(),
              page: '-1',
              moodlewssettingfilter: 'true',
              moodlewssettingfileurl: 'true',
              wsfunction: 'mod_quiz_get_attempt_review',
              wstoken: token,
            }
          }
        );
        return this.http.post<any>(environment.webServiceUrl, params2);
      })
    );
  }

  private parseQuestion(text: string) {
    const regexQue: RegExp = /<div class="qtext"><p>(?<question>.+)<\/p><\/div>/;
    const regexAns = /<label for="(?<id>.+)\" class="ml-1"><span class="answernumber">(?<choice>.+) <\/span>(?<text>.+)<\/label>/g;
    const regexSeq = /<\/h4><input type="hidden" name=\"(?<sqId>.+)\" value=\"(?<sqCount>\d+)\" \/>/g;
    const questionData = regexQue.exec(text);
    const question = new Question(questionData.groups.question, []);
    const SeqData = regexSeq.exec(text);
    let ansData = regexAns.exec(text);
    while (ansData) {
      const answer = new Answer(ansData.groups.id, ansData.groups.choice, ansData.groups.text, SeqData.groups.sqId, SeqData.groups.sqCount);
      question.answers.push(answer);
      ansData = regexAns.exec(text);
    }
    return question;
  }
}
