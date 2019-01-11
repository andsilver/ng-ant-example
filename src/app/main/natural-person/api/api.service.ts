import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
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

  createNaturalPerson(person: any) {
    const url = `${this.url}`;
    return this.http.post(url, person);
  }

  getNaturalPerson(id: number) {
    const url = `${this.url}/${id}`;
    return this.http.get(url);
  }

  removeNaturalPerson(id: number) {
    const url = `${this.url}/${id}`;
    return this.http.delete(url);
  }

  lookUpNaturalPerson(registrationNumber: string) {
    const url = `${this.url}/registration-number/${registrationNumber}`;
    return this.http.get(url);
  }

  updateNaturalPersonProperties (id: string, properties: any) {
    const url = `${this.url}/${id}/properties`;
    return this.http.put(url, properties);
  }

  updateNaturalPersonResidentialAddress (id: string, address: any) {
    const url = `${this.url}/${id}/residential-address`;
    return this.http.put(url, address);
  }

  eraseNaturalPersonResidentialAddress (id: string) {
    const url = `${this.url}/${id}/residential-address`;
    return this.http.delete(url);
  }

  updateNaturalPersonCorrespondenceAddress (id: string, address: any) {
    const url = `${this.url}/${id}/correspondence-address`;
    return this.http.put(url, address);
  }

  eraseNaturalPersonCorrespondenceAddress (id: string) {
    const url = `${this.url}/${id}/correspondence-address`;
    return this.http.delete(url);
  }

  exportNaturalPersons () {
    const url = `${this.url}/files`;
    return this.http.get(url, { observe: 'response', responseType: 'blob' });
  }

  importNaturalPersons (file: any) {
    const url = `${this.url}/import`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(url, formData);
  }

  getNaturalPersons(pagination: any) {
    const url = `${this.url}`;
    const params = this.setHttpParams(pagination);
    return this.http.get(url, params);
  }
}
