import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class ApiService {

  url = '/api/parties/persons';

  constructor(private http: HttpClient) { }

  private setHttpParams(params: Object) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (!params[key]) {
        return;
      }
      if (params[key] instanceof Array) {
        params[key].forEach(value => httpParams = httpParams.append(key, value));
      } else {
        httpParams = httpParams.append(key, params[key] || '');
      }
    });
    return { params: httpParams };
  }

  fetch(pagination: any) {
    const url = `${this.url}`;
    const params = this.setHttpParams(pagination);
    return this.http.get(url, params);
  }

  create(person: any) {
    const url = `${this.url}`;
    return this.http.post(url, person);
  }

  get(id: number) {
    const url = `${this.url}/${id}`;
    return this.http.get(url);
  }

  update (id: string, properties: any) {
    const url = `${this.url}/${id}/properties`;
    return this.http.put(url, properties);
  }

  remove(id: number) {
    const url = `${this.url}/${id}`;
    return this.http.delete(url);
  }

  lookUp(registrationNumber: string) {
    const url = `${this.url}/registration-number/${registrationNumber}`;
    return this.http.get(url);
  }

  updateResidentialAddress (id: string, address: any) {
    const url = `${this.url}/${id}/residential-address`;
    return this.http.put(url, address);
  }

  eraseResidentialAddress (id: string) {
    const url = `${this.url}/${id}/residential-address`;
    return this.http.delete(url);
  }

  updateCorrespondenceAddress (id: string, address: any) {
    const url = `${this.url}/${id}/correspondence-address`;
    return this.http.put(url, address);
  }

  eraseCorrespondenceAddress (id: string) {
    const url = `${this.url}/${id}/correspondence-address`;
    return this.http.delete(url);
  }

  exports () {
    const url = `${this.url}/files/exports`;
    return this.http.get(url, { observe: 'response', responseType: 'blob' });
  }

  imports (file: any) {
    const url = `${this.url}/files/imports`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(url, formData);
  }
}
