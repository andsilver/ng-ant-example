import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AppService } from 'app/app.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppResolve implements Resolve<any> {

  constructor(private api: AppService) { }

  resolve(): Observable<boolean> | Promise<any> | Boolean {

    if (this.api.countries) {
      return true;
    }

    return new Promise((resolve, reject) => {
      return forkJoin([
          this.api.getCoutries(),
          this.api.getCivilStates()
        ]).subscribe(res => {
          this.api.countries     = res[0];
          this.api.civilStatuses = res[1];
          resolve(res);
        }, error => {
          reject(error);
        });
    });
  }
}
