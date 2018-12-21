import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingHandlerService {

  public isLoading = false;
  constructor() { }
}
