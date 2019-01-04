import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ApiService {

  url = '/natural_person';

  constructor(private http: HttpClient) { }

  importFile(file) {
    const url = `${this.url}/import`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(url, formData);
  }
}
