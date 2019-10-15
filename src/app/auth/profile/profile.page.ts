import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import fixOrientation from 'fix-orientation-capacitor';

import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

function base64toBlob(base64Data: string, contentType: string) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  private userSub: Subscription;
  private imgUpdateSub: Subscription;
  isEditing = false;
  user: User;
  profileForm: FormGroup;
  usePicker = false;
  isLoading = false;
  errorMessage: string;
  successMessage: string;

  constructor(
    private platform: Platform,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
      this.profileForm = new FormGroup({
        username: new FormControl(this.user.username),
        email: new FormControl(this.user.username),
        password: new FormControl(''),
        rePassword: new FormControl('')
      });
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.imgUpdateSub) {
      this.imgUpdateSub.unsubscribe();
    }
  }

  onToggleEdit() {
    this.isEditing = !this.isEditing;
  }

  onCancelEdit() {
    this.isEditing = false;
    this.errorMessage = null;
    this.successMessage = null;
  }

  onSubmitProfileChange() {
    if (!this.profileForm.valid) {
      return;
    }
    if (this.profileForm.value.password !== this.profileForm.value.rePassword) {
      this.errorMessage = 'Password กับ ยืนยันPassword ไม่เหมือนกัน โปรดลองใหม่อีกครั้ง';
      return;
    }
    this.authService.updateUserProfile(this.profileForm.value).subscribe(isSuccessful => {
      if (isSuccessful) {
        this.successMessage = 'แก้ไขโปรไฟล์สำเร็จแล้ว';
        this.errorMessage = null;
        this.isEditing = false;
      } else {
        this.errorMessage = 'Password ต้องมีความยาวไม่น้อยกว่า 8 ตัวอักษร, มีอักษรตัวเล็กและตัวใหญ่, \
                             และมีเครื่องหมายที่ไม่ใช่ตัวอักษร';
        this.successMessage = null;
      }
    });
  }

  async onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    const image = await Plugins.Camera.getPhoto({
      quality: 50,
      width: 200,
      correctOrientation: false,
      source: CameraSource.Prompt,
      resultType: CameraResultType.DataUrl
    });
    const fixed = await fixOrientation(image);
    const blob = base64toBlob(fixed.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
    this.updateProfilePicture(blob);
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    this.updateProfilePicture(pickedFile);
  }

  private updateProfilePicture(file: Blob | File) {
    this.isLoading = true;
    if (this.imgUpdateSub) {
      this.imgUpdateSub.unsubscribe();
    }
    this.imgUpdateSub = this.authService.updateProfilePicture(file).subscribe(
      () => {
        this.errorMessage = null;
        this.isLoading = false;
      },
      error => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    );
  }
}
