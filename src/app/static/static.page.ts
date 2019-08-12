import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { pages } from '../pages';

@Component({
  selector: 'app-static',
  templateUrl: './static.page.html',
  styleUrls: ['./static.page.scss'],
})
export class StaticPage implements OnInit {
  page: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.page = pages[+params.get('pageId')];
    });
  }

}
