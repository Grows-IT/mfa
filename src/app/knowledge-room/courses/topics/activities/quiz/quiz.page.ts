import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

class Question {
  constructor(
    public text: string,
    public answers: Answer[],
  ) { }
}

class Answer {
  constructor(
    public id: string,
    public choice: string,
    public text: string
  ) { }
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {
  question: any;
  Object = Object;
  quizForm = false;
  allAns = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.fetchQuiz().subscribe(data => {
      console.log(data);
      this.question = data;
    });
  }

  private fetchQuiz() {
    const params = new HttpParams({
      fromObject: {
        wstoken: 'db66538e0bc1d5b3bda7d8d2c5b897d2',
        wsfunction: 'mod_quiz_get_attempt_summary',
        attemptid: '4',
        moodlewsrestformat: 'json'
      }
    });
    return this.http.post<any>(environment.webServiceUrl, params).pipe(
      map(val => {
        const questions: Question[] = val.questions.map(questionEl => {
          const html: string = decodeURI(questionEl.html);
          return this.parseQuestion(html);
        });
        return questions;
      })
    );
  }

  private parseQuestion(text: string) {
    const regexQue: RegExp = /<div class="qtext"><p>(?<question>.+)<\/p><\/div>/;
    const regexAns = /<label for="(?<id>.+)\" class="ml-1"><span class="answernumber">(?<choice>.+) <\/span>(?<text>.+)<\/label>/g;
    const questionData = regexQue.exec(text);
    const question = new Question(questionData.groups.question, []);
    let ansData = regexAns.exec(text);
    while (ansData) {
      const answer = new Answer(ansData.groups.id, ansData.groups.choice, ansData.groups.text);
      question.answers.push(answer);
      ansData = regexAns.exec(text);
    }
    return question;
  }

  public submitAnswers(form: NgForm) {
    if (form.status === 'INVALID') {
      return;
    }
    this.sliceStr(form.value, Object.keys(form.value));
  }

  public sliceStr(form: any, length) {
    const data = [];

    for (let i = 0; i < length.length; i++) {
      const str = form[i];
      const res = str.slice(0, str.length - 1);
      const obj = {
        name: res,
        value: i + 1
      };

      data[i] = obj;
    }

    console.log(data);

    return data;
  }

}
