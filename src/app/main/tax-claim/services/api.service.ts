import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService as TaxRegisterApi   } from '../../tax-register/services/api.service'
import { ApiService as TaxModuleApi     } from '../../tax-module/services/api.service';
import { ApiService as NaturalPersonApi } from '../../natural-person/services/api.service';

@Injectable({providedIn: 'root'})
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

  constructor(
    private http : HttpClient,
    private trApi: TaxRegisterApi,
    private tmApi: TaxModuleApi,
    private npApi: NaturalPersonApi) { }

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
      filterStatus: 'DRAFT',
      action      : 'next'
    }
    return this.trApi.fetch(params);
  }

  getNaturalPersons () {
    const params = {
      view     : 'list',
      action   : 'next'
    };
    return this.npApi.fetch(params);
  }

  get taxPayerTypes () {
    return this.tmApi.taxPayers;
  }

  loadFormData(code: string) {
    return this.tmApi.loadFormData(code);
  }

  get(id: string) {
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
