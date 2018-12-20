import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filter, NaturalPerson } from './app.models';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl;
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
    const url = `${this.url}/natural_person/create`;
    return this.http.post(url, person);
  }

  public getNaturalPerson(id: number) {
    const url = `${this.url}/natural_person/get/${id}`;
    return this.http.get(url);
  }

  public filterNaturalPersons (filter: Filter) {
    const url = `${this.url}/natural_person/filter`;
    const params = this.setHttpParams(filter);
    return this.http.get(url, params);
  }
}
