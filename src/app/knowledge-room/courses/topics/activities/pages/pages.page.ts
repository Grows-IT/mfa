import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { CoursesService } from '../../../courses.service';
import { Page } from '../../../course.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit, OnDestroy {
  isLoading = false;
  page: Page;
  slideContents: SafeHtml[];
  prevUrl: string;
  isSlideMode: boolean;
  imgUrl = [];
  youtubeUrl = [];
  allUrl = [];
  controllerSrc;

  private activitySub: Subscription;
  private topicId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
    private sanitizer: DomSanitizer,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.isSlideMode = true;
    this.topicId = +this.activatedRoute.snapshot.paramMap.get('topicId');
    const activityId = +this.activatedRoute.snapshot.paramMap.get('activityId');
    this.activitySub = this.coursesService.topics.subscribe(topics => {
      const currentTopic = topics.find(topic => topic.id === this.topicId);
      this.page = currentTopic.activities.find(activity => activity.id === activityId);
      const htmlResource = this.page.resources.find(resource => resource.name === 'index.html');
      let htmlContent = decodeURI(htmlResource.data);
      const otherResources = this.page.resources.filter(resource => resource.type);
      const regex: RegExp = /(\?time=.+?")/;
      const regexYoutube: RegExp = /<iframe.+?src="https?:\/\/www.youtube.com\/embed\/(?<url>[a-zA-Z0-9_-]{11})"[^>]+?><\/iframe>/;
      const allTag = htmlResource.data.match(/<img|<iframe/g);

      // console.log(otherResources);
      htmlResource.data.split(regexYoutube).map(str => {
        if (str.length === 11) {
          // console.log(str);
          this.youtubeUrl.push(str);
        }
      });

      otherResources.forEach((resource, i) => {
        this.imgUrl.push({ url: resource.url, data: resource.data });
        htmlContent = htmlContent.replace(regex, '"');
        // htmlContent = htmlContent.replace(resource.name, resource.data);
      });

      let j = 0;
      for (let i = 0; i < allTag.length; i++) {
        if (allTag[i] === '<iframe' && j === 0) {
          this.allUrl.push('https://www.youtube.com/embed/' + this.youtubeUrl[i]);
          j++;
        } else if (allTag[i] === '<img' && j === 0) {
          this.allUrl.push(this.imgUrl[i]);
        } else if (allTag[i] === '<iframe' && j !== 0) {
          this.allUrl.push('https://www.youtube.com/embed/' + this.youtubeUrl[j]);
          j++;
        } else if (allTag[i] === '<img' && j !== 0) {
          this.allUrl.push(this.imgUrl[i - j]);
        }
      }

      this.page.content = htmlContent;
      // console.log(this.page.content);
      // this.slideContents = htmlContent.split('<p></p>').map(str => this.sanitizer.bypassSecurityTrustHtml(str));
      this.isLoading = false;
    });
    this.setPrevUrl();
  }

  ngOnDestroy() {
    this.activitySub.unsubscribe();
  }

  getSafeUrl(url) {
    this.controllerSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return this.controllerSrc;
  }

  private setPrevUrl() {
    const categoryId = +this.activatedRoute.snapshot.paramMap.get('categoryId');
    const courseId = +this.activatedRoute.snapshot.paramMap.get('courseId');
    this.prevUrl = `/tabs/knowledge-room/${categoryId}/courses/${courseId}/topics/${this.topicId}/activities`;
  }

  async openViewer(e) {
    // console.log(e);

    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: e.target.src,
        swipeToClose: false
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }

  setMode(mode) {
    this.isSlideMode = mode;
    // console.log(mode);
  }
}
