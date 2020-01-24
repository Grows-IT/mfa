import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
    this.http.get<Res>(`https://api.openweathermap.org/data/2.5/forecast?q=Bangkok&APPID=${environment.weatherApiKey}&units=metric`)
      .subscribe(res => {
        this.weathers = res.list.map(data => {
          return new Weather(res.city.name, new Date(data.dt * 1000), data.main.temp, data.weather[0].main);
        });
      });
  }
}

