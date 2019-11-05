import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchQuiz().subscribe(data => {
      console.log(data);
    });
  }

  private fetchQuiz() {
    const params = new HttpParams({
      fromObject: {
        wstoken: 'db66538e0bc1d5b3bda7d8d2c5b897d2',
        wsfunction: 'mod_quiz_get_attempt_summary',
        attemptid: '1',
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
    const regexAns = /<label for="(?<id>.\d:\d_[a-z]+\d)\" class="ml-1"><span class="answernumber">(?<choice>[a-zA-Z\d]+.) <\/span>(?<text>[A-Za-z\d\s]+)<\/label>/g;
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
}
