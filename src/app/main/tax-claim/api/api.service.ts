import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService as TaxRegisterApi } from '../../tax-register/api/api.service'

@Injectable()
export class ApiService {

  url = '/api/taxes/claims'

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

  constructor(private http: HttpClient, private trApi: TaxRegisterApi) { }

  protected setHttpParams(params: Object) {
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


  getActiveTaxRegisters() {
    const params = {
      view        : 'reference',
      filterStatus: 'ACTIVE',
      action      : 'next'
    }
    return this.trApi.fetch(params);
  }

  loadFormData(code: string) {
    const url = `/tax_module/load_form/${code}`;
    return this.http.get(url);
  }

  getDetails(id: string) {
    const url = `${this.url}/${id}`;
    return this.http.get(url);
  }

  create(taxClaim: any) {
    const url = `${this.url}`;
    return this.http.post(url, taxClaim);
  }

  remove(id: string) {
    const url = `${this.url}/${id}`;
    return this.http.delete(url);
  }

  fetch(pagination: any) {
    const url = this.url;
    const params = this.setHttpParams(pagination);
    return this.http.get(url, params);
  }

  lookUp(reference: string) {
    const url = `${this.url}/reference/${reference}`;
    return this.http.get(url);
  }
}
