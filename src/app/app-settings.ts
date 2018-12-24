import { Injectable } from '@angular/core';

export class Settings {

  constructor(public locale = 'en', public date_format = 'yyyy-MM-dd') {}
}

@Injectable({
  providedIn: 'root'
})
export class AppSettings {

  public settings: Settings;

  constructor() { }

  public init(settings: Settings) {
    this.settings = settings;
  }

  public setLocale(locale) {
    this.settings.locale = locale;
  }

  public get locale() {
    return this.settings.locale;
  }

  public get date_format() {
    return this.settings.date_format;
  }
}
