import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  siteUrl = 'http://mitrphol-mfa.southeastasia.cloudapp.azure.com/moodle';
  username: string;
  password: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onClick(): void {
    
  }
}