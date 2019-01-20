import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from 'app/app-settings';
import { ApiService as TaxModuleApi } from '../../tax-module/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = '/api/taxes/registers';

  statuses = [
    {
      label: 'Draft',
      value: 'DRAFT'
    },
    {
      label: 'Enforceable',
      value: 'ENFORCEABLE'
    },
    {
      label: 'Closed',
      value: 'CLOSED'
    }
  ];

  constructor(private http: HttpClient, private settings: AppSettings, private tmApi: TaxModuleApi) { }

  private setHttpParams(params: Object) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (!params[key]) {
        return;
      }
      if (params[key] instanceof Array) {
        params[key].forEach(value => httpParams = httpParams.append(key, value));
      } else {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return { params: httpParams };
  }

  getActiveTaxModules() {
    const params = {
      view        : 'reference',
      filterStatus: 'ACTIVE',
      action      : 'next'
    };
    return this.tmApi.fetch(params);
  }

  fetch(pagination: any) {
    const url = this.url;
    const params = this.setHttpParams(pagination);
    return this.http.get(url, params);
  }

  get(code: string) {
    const url = `${this.url}/${code}`;
    return this.http.get(url);
  }

  create(register: any) {
    const url = `${this.url}`;
    return this.http.post(url, register);
  }

  remove(code: string) {
    const url = `${this.url}/${code}`;
    return this.http.delete(url);
  }

  update(code: string, register: any) {
    const url = `${this.url}/${code}/properties`;
    return this.http.put(url, register);
  }

  enforce(code: string, params: any) {
    const url = `${this.url}/${code}/enforceability`;
    return this.http.post(url, params);
  }

  loadFormData(code: string) {
    const url = `${this.url}/${code}/form`;
    return this.http.get(url);
  }
}
