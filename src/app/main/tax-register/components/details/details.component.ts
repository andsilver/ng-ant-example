import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  taxRegister: any;
  taxModules: any = [];
  code: string;

  editingStatus = {
    adding           : false,
    properties       : false,
    enforce          : false,
    assessmentLetters: false
  };

  statuses  = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.statuses  = this.api.statuses;
    this.route.params
      .pipe(
        switchMap(params => {
          const code = params['code'];
          return forkJoin([
            this.api.get(code),
            this.api.getActiveTaxModules()
          ]);
        })
      )
      .subscribe(res => {
        this.taxRegister = res[0];
        if (!this.taxRegister) {
          this.message.error('Tax register does not exist.');
          this.router.navigate(['/taxes/registers']);
          return;
        }
        this.taxModules = res[1]['items'] || [];
      });
  }

  showModal(type: string) {
    this.editingStatus[type] = true;
  }

  createTaxRegister(taxRegister) {
    this.editingStatus.adding = false;
    this.api.create(taxRegister)
      .subscribe(res => {
        this.message.success('A new tax register is added.');
        this.router.navigate(['/taxes/registers', res['code']]);
      });
  }

  removeTaxRegister() {
    this.api.remove(this.taxRegister.code)
      .subscribe(() => {
        this.message.success('The tax register is removed.');
        this.router.navigate(['/taxes/registers']);
      });
  }

  updateProperties(params: any) {
    this.editingStatus.properties = false;
    this.api.update(this.taxRegister.code, params)
      .subscribe(res => {
        this.message.success('The tax register is updated.');
        this.taxRegister = res;
      });
  }

  performEnforce(params: any) {
    this.editingStatus.enforce = false;
    this.api.enforce(this.taxRegister.code, params)
      .subscribe(res => {
        this.message.success('Tax register is declared enforceable.');
        this.taxRegister = res;
      });
  }

  lookUp() {
    this.api.get(this.code)
      .subscribe((res: any) => {
        if (res) {
          this.router.navigate(['/taxes/registers', res.code]);
        } else {
          this.message.warning('Tax register not found.');
        }
      });
  }

  generateAssessmentLetters() {

  }

}
