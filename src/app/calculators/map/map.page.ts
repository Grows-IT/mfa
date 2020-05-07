import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';

import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

const { Geolocation } = Plugins;
declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  lat: number;
  lng: number;
  drawingManager: any;
  area: any;
  map: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();

    this.lat = coordinates.coords.latitude;
    this.lng = coordinates.coords.longitude;
    // console.log('getCurrentLocation ', this.lat, this.lng);

    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.lng}&key=AIzaSyBAjkv0Xdfnxgj479POHG-akwgXD9zyLmM`
      );
  }

  onMapReady(map) {
    this.map = map;
    this.initDrawingManager(map);
    this.getCurrentLocation();
  }

  initDrawingManager(map: any) {
    // console.log(map);

    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        draggable: true,
        editable: true
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };

    const drawingManager = new google.maps.drawing.DrawingManager(options);
    drawingManager.setMap(map);

    // console.log(drawingManager);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
      // console.log(event);

      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        this.area = google.maps.geometry.spherical.computeArea(event.overlay.getPath());
      }

      google.maps.event.addDomListener(document.getElementById('removeSharp'), 'click', () => {
        this.area = null;
        event.overlay.setMap(null);
      });

      // google.maps.event.addListener(event.overlay.getPath(), 'set_at', () => {
      //   console.log('set at');
      //   this.area = google.maps.geometry.spherical.computeArea(event.overlay.getPath());
      // });

      // google.maps.event.addListener(event.overlay.getPath(), 'insert_at', () => {
      //   console.log('insert at');
      //   this.area = google.maps.geometry.spherical.computeArea(event.overlay.getPath());
      // });

    });

    // re center
    google.maps.event.addDomListener(document.getElementById('currentLocation'), 'click', () => {

      this.getCurrentLocation().then(
        data => {
          data.subscribe(map => {
            console.log(map.results[0].geometry.location);
            this.map.panTo({ lat: map.results[0].geometry.location.lat, lng: map.results[0].geometry.location.lng });
            this.map.setZoom(18);
          });
        }
      );

      // this.getCurrentLocation()
      // this.map.panTo({ lat: this.lat, lng: this.lng });
      // this.map.setZoom(18);
      // console.log('button ', this.lat, this.lng);
    });
  }

  calculate(area) {
    this.router.navigate(['/tabs/calculators/assess-sugar'], { queryParams: { areaWidth: area } });
  }
}
