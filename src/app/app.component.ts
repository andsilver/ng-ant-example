import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'app/app-settings';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'malibu';

  constructor(private settings: AppSettings) {}

  ngOnInit() {
    this.settings.setLocale(environment.locale);
  }

}
