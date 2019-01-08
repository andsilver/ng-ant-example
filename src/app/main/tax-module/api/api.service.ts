import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettings } from 'app/app-settings';

@Injectable()
export class ApiService {

  url = '/api/taxes/modules';

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

  declarationModes = [
    {
      label: 'No Declaration',
      value: 'NO_DECLARATION'
    },
    {
      label: 'Request Declaration',
      value: 'REQUEST_DECLARATION'
    },
    {
      label: 'Propose Declaration',
      value: 'PROPOSE_DECLARATION'
    },
    {
      label: 'Unprompted Declaration',
      value: 'UNPROMPTED_DECLARATION'
    }
  ]

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
    const url = `${this.url}/${code}`;
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

  fetch(pagination: any) {
    const url = this.url;
    return this.http.post(url, pagination);
  }

  changeApprovalDate(code, approvalDate) {
    const url = `${this.url}/change_approval_date`;
    return this.http.post(url, {code: code, approvalDate: approvalDate});
  }

  lookupTaxModule(code: string) {

  }

  uploadFile(file: any, code: string) {
    const url = `${this.url}/${code}/assessment-template`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(url, formData);
  }

  removeFile(code: string) {
    const url = `${this.url}/${code}/assessment-template`;
    return this.http.delete(url);
  }

  downloadFile(code: string) {
    const url = `${this.url}/${code}/assessment-template`;
    return this.http.get(url, { observe: 'response', responseType: 'blob' });
  }

  uploadFileDT(file: any, code: string) {
    const url = `${this.url}/${code}/declaration-template`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(url, formData);
  }

  removeFileDT(code: string) {
    const url = `${this.url}/${code}/declaration-template`;
    return this.http.delete(url);
  }

  downloadFileDT(code: string) {
    const url = `${this.url}/${code}/declaration-template`;
    return this.http.get(url, { observe: 'response', responseType: 'blob' });
  }

}
