import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { map, count } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

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
    public text: string,
    public sqId: string,
    public sqCount: string
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
        attemptid: '40',
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

  public submitAnswers(form: NgForm) {
    if (form.status === 'INVALID') {
      return;
    }
    let data;
    data = this.sliceStr(form.value, Object.keys(form.value));

    return this.submitForm(data);
  }

  public sliceStr(form: any, length) {
    const data = [];

    for (let i = 0; i < length.length; i++) {
      const str = form[i];
      const ansName = str.slice(0, str.length - 1);
      const ansVal = str.substr(str.length - 1);

      for (let j = 0; j < this.question[i].answers.length; j++) {
        if (ansVal === j.toString()) {
          if (i === 0) {
            // answer
            const obj = {
              name: ansName,
              value: ansVal,
            };
            // sequencecheck
            const obj2 = {
              sqId: this.question[i].answers[j].sqId,
              sqCount: this.question[i].answers[j].sqCount
            };

            data[i] = obj;
            data[i + 1] = obj2;

          } else {
            // answer
            const obj = {
              name: ansName,
              value: ansVal,
            };
            // sequencecheck
            const obj2 = {
              sqId: this.question[i].answers[j].sqId,
              sqCount: this.question[i].answers[j].sqCount
            };

            data[i * 2] = obj;
            data[i * 2 + 1] = obj2;
          }
        }
      }
    }
    console.log(data);

    return data;
  }

  private submitForm(data) {
    let params = new HttpParams(
      {
        fromObject: {
          finishattempt: '1',
          timeup: '0',
          moodlewssettingfilter: 'true',
          moodlewssettingfileurl: 'true',
          wstoken: 'db66538e0bc1d5b3bda7d8d2c5b897d2',
          wsfunction: 'mod_quiz_process_attempt',
          attemptid: '40',
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
    // console.log(params);

    this.http.post<any>(environment.webServiceUrl, params).subscribe((res) => {
      return this.getGrade();
    });

  }

  private getGrade() {
    const params2 = new HttpParams(
      {
        fromObject: {
          attemptid: '40',
          page: '-1',
          moodlewssettingfilter: 'true',
          moodlewssettingfileurl: 'true',
          wsfunction: 'mod_quiz_get_attempt_review',
          wstoken: 'db66538e0bc1d5b3bda7d8d2c5b897d2',
        }
      }
    );

    return this.http.post<any>(environment.webServiceUrl, params2).subscribe((review) => {
      // console.log(review);
      return review;
    });
  }
}
