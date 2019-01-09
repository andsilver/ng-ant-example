import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from 'app/app-settings';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = '/tax_register';

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

  constructor(private http: HttpClient, private settings: AppSettings) { }

  private setHttpParams(params: Object) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (!params[key]) {
        return;
      }
      if (typeof params[key] === 'object' && params[key].length) {
        params[key].forEach(value => httpParams = httpParams.append(key, value));
      } else {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return { params: httpParams };
  }

  getActiveTaxModules() {
    const url = '/api/taxes/modules';
    return this.http.post(url, {view: 'select'});
  }

  filterTaxRegister(filter: any) {
    const url = `${this.url}/filter`;
    const params = this.setHttpParams(filter);
    return this.http.get(url, params);
  }

  getTaxRegisterDetails(code: string) {
    const url = `${this.url}/get/${code}`;
    return this.http.get(url);
  }

  createTaxRegister(register: any) {
    const url = `${this.url}/create`;
    return this.http.post(url, register);
  }

  removeTaxRegister(code: string) {
    const url = `${this.url}/remove`;
    return this.http.post(url, {code: code});
  }

  enforceTaxRegister(params: any) {
    const url = `${this.url}/enforce`;
    return this.http.post(url, params);
  }
}
