import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface Res {
  city: {
    name: string;
  };
  list: [{
    dt: number
    main: {
      temp: number;
    };
    weather: [{
      main: string;
    }];
  }];
}

class Weather {
  constructor(
    public city: string,
    public date: Date,
    public temperature: number,
    public description: string
  ) { }
}

// class Todaywea {
//   constructor(
//     public city: string,
//     public description: string,
//     public temperature: string
//   ) { }
// }

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})

export class WeatherPage implements OnInit {
  name = 'Angular';
  weathers: Weather[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Res>('https://api.openweathermap.org/data/2.5/forecast?q=Bangkok&APPID=d1ce964032d54e762e9496e1f4e8eda8&units=metric')
      .subscribe(res => {
        this.weathers = res.list.map(data => {
          // console.log(data.weather[0].main);

          return new Weather(res.city.name, new Date(data.dt * 1000), data.main.temp, data.weather[0].main);
        });
      });

    //   const d = {
    //     lat: 13.7073963,
    //     lon: 100.3890854,
    //     model: 'gfs',
    //     parameters: ['temp'],
    //     levels: ['surface'],
    //     unit: 'F',
    //     key: 'JVCfmZiyg9cVEQ26zWh4On9uHQKxOvEs'
    //   };

    //   this.http.post<any>('https://api.windy.com/api/point-forecast/v2', d).pipe(
    //     map(res => {
    //       console.log(res);
    //       this.weathers = res.ts.map((r, i) => {
    //         // console.log(r);
    //         // console.log(i);

    //         return new Weather(null, new Date(res.ts[i]), res['temp-surface'][i] - 273.15, null);
    //       });
    //     })
    //   ).subscribe();
  }
}

