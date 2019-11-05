import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { timeout, map, switchMap, withLatestFrom, catchError, concatMap, concat } from 'rxjs/operators';

const url = 'http://203.150.199.148/webservice/rest/server.php';
const params = new HttpParams({
  fromObject: {
    wstoken: 'db66538e0bc1d5b3bda7d8d2c5b897d2',
    wsfunction: 'mod_quiz_get_attempt_summary',
    attemptid: '1',
    moodlewsrestformat: 'json'
  }
});
const regexQ: RegExp = /<div class="qtext"><p>(.+)<\/p><\/div>/;
const regexA: RegExp = /<label for=\"(.+)\" class=\"ml-1\"><span class=\"answernumber\">(.+) <\/span>(.+)<\/label>/;

class Question {
  constructor(
    public questions: string,
    public answer: Answer[],
  ) { }
}

class Answer {
  constructor(
    public select: string,
    public choice: string,
    public answer: string
  ) { }
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {


  constructor(private http: HttpClient, private authService: AuthService) {
  }

  ngOnInit() {
    this.http.post<any>(url, params).pipe(
      map(val => {
        const data = val.questions[0].html;
        const a = [];
        const match = data.match(regexA);

        if (regexA.test(data)) {
          // console.log(val.questions[0].html);
          
          console.log(match[1]);
          console.log(match[2]);
          console.log(match[3]);
          console.log(match[4]);
        }

      }),
      catchError((err) => {
        throw err;
      })
      // console.log(regexA.exec(val.questions[0].html)[1]);

      // for (let i = 0; i < val.questions.length; i++) {
      //   const array = [], arrayAns = [], obj = {};

      //   for (let j = 0; j < val.questions[i].html.length; j++) {
      //     const value = val.questions[j].html;

      //     obj[j] = {};

      //     obj[j] = new Answer(regexA.exec(value)[1], regexA.exec(value)[2], regexA.exec(value)[3]);
      //     arrayAns.push(obj);

      //   }
      //   array.push(new Question(regexQ.exec(val.questions[i].html)[1], arrayAns));
      //   regexA.exec(value)[1], regexA.exec(value)[2], regexA.exec(value)[3]
      // }

    ).subscribe(data => {
      console.log(data);
    });
  }
}
