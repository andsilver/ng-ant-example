import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filter } from './app.models';
import { AppSettings } from './app-settings';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  url          : string;
  locale       : string;
  countries    : any;
  civilStatuses: any;

  constructor( private http: HttpClient, private settings: AppSettings ) {
    this.url = '/natural_person';
    this.locale = settings.locale || 'en';
  }

  private setHttpParams(params: Object) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key]) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return { params: httpParams };
  }

  public createNaturalPerson(person: any) {
    const url = `${this.url}/create`;
    return this.http.post(url, person);
  }

  public getNaturalPerson(id: number) {
    const url = `${this.url}/get/${id}`;
    return this.http.get(url);
  }

  public removeNaturalPerson(id: number) {
    const url = `${this.url}/remove`;
    return this.http.post(url, {id: id});
  }

  public lookUpNaturalPerson(registrationNumber: string) {
    const url = `${this.url}/lookup/${registrationNumber}`;
    return this.http.get(url);
  }

  public filterNaturalPersons (filter: Filter) {
    const url = `${this.url}/filter`;
    const params = this.setHttpParams(filter);
    return this.http.get(url, params);
  }

  public updateNaturalPersonProperties (properties: any) {
    const url = `${this.url}/update_properties`;
    return this.http.post(url, properties);
  }

  public updateNaturalPersonResidentialAddress (address: any) {
    const url = `${this.url}/update_residential_address`;
    return this.http.post(url, address);
  }

  public eraseNaturalPersonResidentialAddress (id) {
    const url = `${this.url}/erase_residential_address`;
    return this.http.post(url, {id: id});
  }

  public updateNaturalPersonCorrespondenceAddress (address: any) {
    const url = `${this.url}/update_correspondence_address`;
    return this.http.post(url, address);
  }

  public eraseNaturalPersonCorrespondenceAddress (id) {
    const url = `${this.url}/erase_correspondence_address`;
    return this.http.post(url, {id: id});
  }

  public exportNaturalPersons () {
    const url = `${this.url}/export?locale=${this.locale}`;
    return this.http.get(url, { observe: 'response', responseType: 'blob' });
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
