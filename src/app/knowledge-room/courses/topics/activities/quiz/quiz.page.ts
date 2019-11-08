import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { map, first, switchMap } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../../courses.service';
import { Quiz } from '../../../course.model';
import { QuizService } from './quiz.service';
import { environment } from 'src/environments/environment';

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
  activitySub: Subscription;
  quiz: Quiz;
  isCompleted = true;
  attemptId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
    private quizService: QuizService,
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
    this.quizService.startAttempt(this.quiz.instance)
      .pipe(
        switchMap(attemptId => {
          this.attemptId = attemptId;
          return this.quizService.fetchQuiz(attemptId);
        })
      )
      .subscribe(questions => {
        this.question = questions;
        this.isCompleted = false;
      });
  }

  public submitAnswers(form: NgForm) {
    if (form.status === 'INVALID') {
      return;
    }
    this.isCompleted = false;
    let data;
    data = this.sliceStr(form.value, Object.keys(form.value));

    return this.quizService.submitQuiz(data, this.attemptId)
      .pipe(
        switchMap(res => {
          return this.quizService.getGrade(this.attemptId);
        })
      )
      .subscribe(quizGrade => {
        console.log(quizGrade);
        this.isCompleted = true;
      });
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
}
