import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../api/api.service';
import { CustomDatePipe } from 'app/shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [CustomDatePipe]
})
export class DetailsComponent implements OnInit {

  taxModule: any;
  code     : string;

  editingStatus = {
    properties: false,
    status    : false,
    adding    : false,
    aprDate   : false
  };

  statuses  = [];
  taxPayers = [];

  constructor(
    private route     : ActivatedRoute,
    private apiService: ApiService,
    private message   : NzMessageService,
    private router    : Router,
    private formatDate: CustomDatePipe
  ) { }

  ngOnInit() {
    this.statuses  = this.apiService.statuses;
    this.taxPayers = this.apiService.taxPayers;
    this.route.params.subscribe(res => {
      this.apiService.getTaxModule(res['code'])
      .subscribe(res => {
        this.taxModule = res;
      });
    })
  }

  createTaxModule(taxModule) {
    this.editingStatus.adding = false;
    this.apiService.createTaxModule(taxModule)
      .subscribe(res => {
        this.message.success('A new Tax Module is added.')
        this.router.navigate(['/tax-module', res['code']]);
      });
  }

  removeTaxModule() {
    this.apiService.removeTaxModule(this.taxModule.code)
      .subscribe(res => {
        this.message.success('The Tax Module is removed.');
        this.router.navigate(['/tax-module']);
      });
  }

  showModal(type: string) {
    this.editingStatus[type] = true;
  }

  updateProperties(properties) {
    this.editingStatus.properties = false;
    properties['oldCode'] = this.taxModule.code;
    properties['newCode'] = properties['code'];
    delete properties['code'];

    this.apiService.updateTaxModule(properties)
      .subscribe((res) => {
        this.message.success('Properties are updated.');
        this.taxModule = res;
      })
  }

  lookUp() {
    // this.apiService.lookUpNaturalTaxModule(this.code)
    //   .subscribe(res => {
    //     this.router.navigate(['/natural-taxModule', res['id']]);
    //   });
  }

  exportList () {
    // this.apiService.exportNaturalTaxModules()
    //   .subscribe(res => {
    //     const filename  = `NaturalTaxModules_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
    //     const content   = res.body;
    //     const type      = 'text/csv';
    //     const extension = 'csv';
    //     download(filename, content, type, extension);
    //   });
  }

  approveTaxModule() {
    const date = this.formatDate.transform(new Date());
    const code = this.taxModule.code;

    this.apiService.approveTaxModule(code, date)
      .subscribe(res => {
        this.taxModule = res;
        this.message.success('The Tax Module is approved.');
      });
  }

  reactivateTaxModule() {
    this.apiService.reactivateTaxModule(this.taxModule.code)
      .subscribe(res => {
        this.taxModule = res;
        this.message.success('The Tax Module is reactivated.');
      });
  }

  deactivateTaxModule() {
    this.apiService.deactivateTaxModule(this.taxModule.code)
      .subscribe(res => {
        this.taxModule = res;
        this.message.success('The Tax Module is deactivated.');
      });
  }

  updateApprovalDate() {
    this.taxModule.approvalDate = this.formatDate.transform(this.taxModule.approvalDate);
    this.apiService.changeApprovalDate(this.taxModule.code, this.taxModule.approvalDate)
      .subscribe(res => {
        this.taxModule = res;
        this.editingStatus.aprDate = false;
        this.message.success('Approval date of the Tax Module is changed.');
      })
  }

}
