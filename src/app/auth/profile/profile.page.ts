import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import fixOrientation from 'fix-orientation-capacitor';

import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  private userSub: Subscription;
  user: User;
  usePicker = false;

  constructor(
    private platform: Platform,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  async onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    try {
      const image = await Plugins.Camera.getPhoto({
        quality: 60,
        correctOrientation: false,
        source: CameraSource.Prompt,
        resultType: CameraResultType.DataUrl
      });
      this.user.imgUrl = await fixOrientation(image);
    } catch (error) {
      console.log(error);
      if (this.usePicker) {
        this.filePickerRef.nativeElement.click();
      }
    }
  }

  onFileChosen(event: Event) {
    console.log(event);
  }
}
