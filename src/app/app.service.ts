import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filter } from './app.models';
import { AppSettings } from './app-settings';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  locale: string;
  countries: any;
  civilStatuses: any;

  constructor( private http: HttpClient, private settings: AppSettings ) {
    this.locale = settings.locale || 'en';
  }

  public getCoutries () {
    const url = `/context/countries?locale=${this.locale}`;
    return this.http.get(url);
  }

  public getCivilStates () {
    const url = `/context/civil_statuses?locale=${this.locale}`;
    return this.http.get(url);
  }
}
