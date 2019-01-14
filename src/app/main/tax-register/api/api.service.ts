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
      label: 'Enforceable',
      value: 'ENFORCEABLE'
    },
    {
      label: 'Closed',
      value: 'CLOSED'
    },
    {
      label: 'Draft',
      value: 'DRAFT'
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
    }
    return this.tmApi.fetch(params);
  }

  fetch(pagination: any) {
    const url = this.url;
    const params = this.setHttpParams(pagination);
    return this.http.get(url, params);
  }

  getTaxRegisterDetails(code: string) {
    const url = `${this.url}/${code}`;
    return this.http.get(url);
  }

  createTaxRegister(register: any) {
    const url = `${this.url}`;
    return this.http.post(url, register);
  }

  removeTaxRegister(code: string) {
    const url = `${this.url}/${code}`;
    return this.http.delete(url);
  }

  updateTaxRegister(code: string, register: any) {
    const url = `${this.url}/${code}/properties`;
    return this.http.post(url, register);
  }

  enforceTaxRegister(code: string, params: any) {
    const url = `${this.url}/${code}/enforceability`;
    return this.http.post(url, params);
  }
}
