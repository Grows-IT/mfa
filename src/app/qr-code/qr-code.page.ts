import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit {
  private options: BarcodeScannerOptions;
  data: any;

  constructor(private barcodeScanner: BarcodeScanner, private router: Router) { }

  ngOnInit() {
    this.scan();
  }

  ionViewWillEnter() {
    this.scan();
  }

  scan() {
    this.options = {
      prompt: 'สแกน QR Code ของคุณ',
    };

    this.barcodeScanner.scan(this.options).then((barcodeData) => {
      // console.log(barcodeData);
      this.data = barcodeData;
      this.router.navigate([this.data.text]);
    }, err => {
      console.log('Error occured : ' + err);
    });
  }

}
