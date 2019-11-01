import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { from, BehaviorSubject, throwError, Observable, of } from 'rxjs';
import { timeout, map, switchMap, first, withLatestFrom, catchError, concatMap } from 'rxjs/operators';

class PriceSugar {
  constructor(
    public date: string,
    public nowPrice: number,
    public heightPrice: number,
    public lowPrice: number,
    public averagePrice: number
  ) { }

}
@Component({
  selector: 'app-sugar-price',
  templateUrl: './sugar-price.page.html',
  styleUrls: ['./sugar-price.page.scss'],
})
export class SugarPricePage implements OnInit {

  data: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get<any>('https://www.quandl.com/api/v3/datasets/CHRIS/ICE_SB1/data.json?start_date=2019-10-29&api_key=ai-bz1DwAQYdXnfBW5v2').pipe(
      map(val => {
        const price: any = new PriceSugar(val.dataset_data.data[0][0], val.dataset_data.data[0][1], val.dataset_data.data[0][2],
          val.dataset_data.data[0][3], val.dataset_data.data[0][4]);

        return price;
      }),
      catchError(err => throwError('Error sugar price = ' + err)),
    ).subscribe(data => {
      this.data = data;
    });
  }

}
