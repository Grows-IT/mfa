import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { map, first, switchMap } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../../courses.service';
import { Quiz } from '../../../course.model';
import { QuizService } from './quiz.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
    private quizService: QuizService
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
          return this.quizService.fetchQuiz(attemptId);
        })
      )
      .subscribe(questions => {
        console.log(questions);
        this.question = questions;
        this.isCompleted = false;
      });
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
