import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSettings {

  public locale = 'en';

  constructor() { }

  setLocale(code) {
    this.locale = code;
  }
}
