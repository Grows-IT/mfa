import { Component, OnInit, OnDestroy } from '@angular/core';

import { NewsService } from './news.service';
import { Page, PageResource } from '../knowledge-room/courses/course.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit, OnDestroy {
  pages: Page[] = [];
  isLoading = false;
  private newsSub: Subscription;

  constructor(
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.newsSub = this.newsService.pages.subscribe(pages => {
      console.log(pages);
      this.pages = pages;
      // let i = 0;
      // pages.forEach(page => {
      //   const imgResource = page.resources.find(resource => resource.type.includes('image'));
      //   const fr = new FileReader();
      //   fr.onload = () => {
      //     page.img = fr.result.toString();
      //     i += 1;
      //     if (i >= pages.length) {
      //       this.isLoading = false;
      //     }
      //   };
      //   fr.readAsDataURL(imgResource.data);
      // });
    });
  }

  ngOnDestroy() {
    this.newsSub.unsubscribe();
  }

}
