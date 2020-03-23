import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../../../courses.service';
import { Quiz } from '../../../course.model';
import { QuizService } from './quiz.service';
import { queue } from 'rxjs/internal/scheduler/queue';

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
  grade: number;
  isLoading = false;
  prevUrl: string;

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
    this.setPrevUrl(topicId);
  }

  onStartQuiz() {
    this.isLoading = true;
    this.quizService.startAttempt(this.quiz.instance)
      .pipe(
        switchMap(attemptId => {
          this.attemptId = attemptId;
          console.log(attemptId);

          return this.quizService.fetchQuiz(attemptId);
        })
      )
      .subscribe(questions => {
        console.log(questions);

        this.question = questions;
        this.isCompleted = false;
        this.isLoading = false;
      });
  }

  submitAnswers(form: NgForm) {
    if (form.status === 'INVALID') {
      return;
    }
    const data = this.sliceStr(form.value, Object.keys(form.value));

    this.isLoading = true;
    return this.quizService.submitQuiz(data, this.attemptId)
      .pipe(
        switchMap(res => {
          return this.quizService.getGrade(this.attemptId);
        })
      )
      .subscribe(quizGrade => {
        this.isCompleted = true;
        this.isLoading = false;
        this.grade = quizGrade.grade;
      });
  }

  private sliceStr(form: any, length) {
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
    return data;
  }

  private setPrevUrl(topicId: number) {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.prevUrl = `/tabs/knowledge-room/${categoryId}/courses/${courseId}/topics/${topicId}/activities`;
  }
}
