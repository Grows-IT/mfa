import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { map, first, switchMap } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../../courses.service';
import { Quiz } from '../../../course.model';

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
  isCompleted = false;
  activitySub: Subscription;
  quiz: Quiz;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    const topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    const activityId = +this.activatedRoute.snapshot.paramMap.get('activityId');
    this.activitySub = this.coursesService.topics.subscribe(topics => {
      const currentTopic = topics.find(topic => topic.id === topicId);
      this.quiz = currentTopic.activities.find(activity => activity.id === activityId);
    });
  }

  onStartQuiz() {
    this.startAttempt(this.quiz.instance)
      .pipe(
        switchMap(attemptId => {
          return this.fetchQuiz(attemptId);
        })
      )
      .subscribe(questions => {
        console.log(questions);
        this.question = questions;
      });
  }

  private startAttempt(quizInstance: number) {
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

  private fetchQuiz(attemptId: number) {
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
