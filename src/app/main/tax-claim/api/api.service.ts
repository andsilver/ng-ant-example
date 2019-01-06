import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  url = '/tax_claim'

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

  constructor(private http: HttpClient) { }

  getActiveTaxRegisters() {
    const url = '/tax_register/list_active';
    return this.http.get(url);
  }

  loadFormData(code: string) {
    const url = `/tax_module/load_form/${code}`;
    return this.http.get(url);
  }

  getDetails(id) {
    const url = `${this.url}/get/${id}`;
    return this.http.get(url);
  }

  fetch(pagination: any) {
    const url = `${this.url}/fetch`;
    return this.http.post(url, pagination);
  }

  lookUp(reference: string) {
    const url = `${this.url}/lookup/${reference}`;
    return this.http.get(url);
  }

  create(taxClaim: any) {
    const url = `${this.url}/create`;
    return this.http.post(url, taxClaim);
  }
}
