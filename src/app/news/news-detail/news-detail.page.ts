import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';

import { NewsService } from '../news.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Page } from 'src/app/knowledge-room/courses/course.model';
import { CoursesService } from 'src/app/knowledge-room/courses/courses.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {
  newsSub: Subscription;
  newsPage: Page;
  errorMessage: string;
  indexHtml: SafeHtml;
  isLoading = false;

  constructor(
    private newsService: NewsService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.newsService.getNewsPageById(id).pipe(
      switchMap(page => {
        if (page.content) {
          return of(page);
        }
        return this.coursesService.downloadResources(page);
      }),
      map(page => {
        page.content = decodeURI(page.content);
        this.newsPage = page;
        if (!page.resources || page.resources.length === 0) {
          this.indexHtml = this.sanitizer.bypassSecurityTrustHtml(page.content);
          this.isLoading = false;
          return;
        }
        let i = 0;
        page.resources.forEach(resource => {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const data = fileReader.result.toString();
            page.content = page.content.replace(resource.name, data);
            i += 1;
            if (i >= page.resources.length) {
              this.indexHtml = this.sanitizer.bypassSecurityTrustHtml(page.content);
              this.isLoading = false;
            }
          };
          fileReader.readAsDataURL(resource.data);
        });
      })
    ).subscribe(news => {

    });

    // this.newsSub = this.newsService.getNewsArticleById(id).subscribe(page => {
    //   if (page === null) {
    //     this.errorMessage = 'Error getting news article';
    //     return;
    //   }
    //   this.newsService.getContent(page.content).subscribe(content => {
    //     this.indexHtml = this.sanitizer.bypassSecurityTrustHtml(content);
    //     page.content = content;
    //     this.newsPage = page;
    //   });
    // });
  }
}
