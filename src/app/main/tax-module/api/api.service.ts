import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from 'app/app-settings';

@Injectable()
export class ApiService {

  url = '/tax_module';

  taxPayers = [
    {
      label: 'Natural Person',
      value: 'NATURAL_PERSON'
    },
    {
      label: 'Legal Entity',
      value: 'LEGAL_ENTITY'
    },
    {
      label: 'Both',
      value: 'ANY'
    }
  ];

  statuses = [
    {
      label: 'Active',
      value: 'ACTIVE'
    },
    {
      label: 'Inactive',
      value: 'INACTIVE'
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

  createTaxModule(module: any) {
    const url = `${this.url}/create`;
    return this.http.post(url, module);
  }

  getTaxModule(code: string) {
    const url = `${this.url}/get/${code}`;
    return this.http.get(url);
  }

  removeTaxModule(code: string) {
    const url = `${this.url}/remove`;
    return this.http.post(url, {code: code});
  }

  updateTaxModule(module: any) {
    const url = `${this.url}/update_properties`;
    return this.http.post(url, module);
  }

  approveTaxModule(code: string, approvalDate: string) {
    const url = `${this.url}/approve`;
    return this.http.post(url, {code: code, approvalDate: approvalDate});
  }

  reactivateTaxModule(code: string) {
    const url = `${this.url}/reactivate`;
    return this.http.post(url, {code: code});
  }

  deactivateTaxModule(code: string) {
    const url = `${this.url}/deactivate`;
    return this.http.post(url, {code: code});
  }

  filterTaxModules(filter: any) {
    const url = `${this.url}/filter`;
    const params = this.setHttpParams(filter);
    return this.http.get(url, params);
  }

  changeApprovalDate(code, approvalDate) {
    const url = `${this.url}/change_approval_date`;
    return this.http.post(url, {code: code, approvalDate: approvalDate});
  }

  lookupTaxModule(code: string) {

  }

}
