import { Component, OnInit, OnDestroy } from '@angular/core';
import { QaService } from './qa.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.page.html',
  styleUrls: ['./qa.page.scss'],
})
export class QaPage implements OnInit, OnDestroy {
  allDiscus;
  isLoading = false;
  errorMessage: string;
  private qasSub: Subscription;

  constructor(
    private qaService: QaService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.qasSub = this.qaService.qas.subscribe(qas => {
      this.allDiscus = qas;
    });
  }

  ngOnDestroy() {
    this.qasSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.qaService.getDiscussions().pipe(
      catchError(() => this.qaService.getQaFromStorage())
    ).subscribe((qas) => {
      if (!qas) {
        this.isLoading = false;
        this.errorMessage = 'การเชื่อมต่อล้มเหลว';
      }
    });
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }
}
