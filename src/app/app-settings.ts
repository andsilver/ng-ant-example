import { Injectable } from '@angular/core';

export class Settings {

  constructor(public locale = 'en', public date_format = 'yyyy-MM-dd') {}
}

@Injectable({
  providedIn: 'root'
})
export class AppSettings {

  private settings: Settings;

  constructor() { }

  public init(locale, date_format = 'yyyy-MM-dd') {
    this.settings = new Settings(locale, date_format);
  }

  public get locale() {
    return this.settings.locale;
  }

  public get date_format() {
    return this.settings.date_format;
  }
}
