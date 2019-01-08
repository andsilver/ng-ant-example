import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../api/api.service';
import { CustomDatePipe } from 'app/shared/pipes/custom-date.pipe';
import { download } from 'app/shared/helpers/utils';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [CustomDatePipe]
})
export class DetailsComponent implements OnInit {

  @ViewChild('file')
  file: any;

  @ViewChild('file_dt')
  fileDT: any;

  taxModule: any;
  code     : string;

  editingStatus = {
    properties: false,
    status    : false,
    adding    : false,
    aprDate   : false,
    approve   : false
  };

  statuses  = [];
  taxPayers = [];

  constructor(
    private route     : ActivatedRoute,
    private api: ApiService,
    private message   : NzMessageService,
    private router    : Router,
    private formatDate: CustomDatePipe
  ) { }

  ngOnInit() {
    this.statuses  = this.api.statuses;
    this.taxPayers = this.api.taxPayers;
    this.route.params.subscribe(res => {
      this.getTaxModule(res['code']);
    })
  }

  getTaxModule(code: string) {
    this.api.getTaxModule(code)
      .subscribe(res => {
        this.taxModule = res;
      });
  }

  createTaxModule(taxModule) {
    this.editingStatus.adding = false;
    this.api.createTaxModule(taxModule)
      .subscribe(res => {
        this.message.success('A new Tax Module is added.')
        this.router.navigate(['/tax-module', res['code']]);
      });
  }

  removeTaxModule() {
    this.api.removeTaxModule(this.taxModule.code)
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

    this.api.updateTaxModule(properties)
      .subscribe((res) => {
        this.message.success('Properties are updated.');
        this.taxModule = res;
      })
  }

  lookUp() {
    this.api.getTaxModule(this.code)
      .subscribe((res: any) => {
        if (res) {
          this.router.navigate(['tax-module', res.code]);
        } else {
          this.message.warning('Tax Module not found!');
        }
      });
  }

  exportList () {
    // this.api.exportNaturalTaxModules()
    //   .subscribe(res => {
    //     const filename  = `NaturalTaxModules_${formatDate(new Date(), 'yyyy_MM_dd', 'en')}`;
    //     const content   = res.body;
    //     const type      = 'text/csv';
    //     const extension = 'csv';
    //     download(filename, content, type, extension);
    //   });
  }

  approveTaxModule(date) {
    date = this.formatDate.transform(date);
    const code = this.taxModule.code;

    this.api.approveTaxModule(code, date)
      .subscribe(res => {
        this.taxModule = res;
        this.message.success('The Tax Module is approved.');
      });
  }

  reactivateTaxModule() {
    this.api.reactivateTaxModule(this.taxModule.code)
      .subscribe(res => {
        this.taxModule = res;
        this.message.success('The Tax Module is reactivated.');
      });
  }

  deactivateTaxModule() {
    this.api.deactivateTaxModule(this.taxModule.code)
      .subscribe(res => {
        this.taxModule = res;
        this.message.success('The Tax Module is deactivated.');
      });
  }

  updateApprovalDate(approvalDate) {
    this.taxModule.approvalDate = this.formatDate.transform(approvalDate);
    this.api.changeApprovalDate(this.taxModule.code, this.taxModule.approvalDate)
      .subscribe(res => {
        this.taxModule = res;
        this.editingStatus.aprDate = false;
        this.message.success('Approval date of the Tax Module is changed.');
      })
  }

  uploadAssessmentTemplate() {
    this.file.nativeElement.click();
  }

  downloadAssessmentTemplate() {
    this.api.downloadFile(this.taxModule.code)
      .subscribe(res => {
        console.log(res);
        const filename  = `TaxModule_${this.formatDate.transform(new Date())}`;
        const content   = res.body;
        // const type      = 'text/csv';
        // const extension = 'doc';
        // download(filename, content, type, extension);
      });
  }

  removeAssessmentTemplate() {
    this.api.removeFile(this.taxModule.code)
      .subscribe(res => {
        this.message.success('Assessment Template is removed.');
        this.taxModule = res;
      })
  }

  onFileSelect() {
    const files = this.file.nativeElement.files;
    if (!files || !files.length) {
      return;
    }
    const fileToRead = files[0];
    this.api.uploadFile(fileToRead, this.taxModule.code)
      .subscribe(res => {
        this.message.success('Assessment Template is uploaded.');
        this.taxModule = res;
      });
  }

  uploadDeclarationTemplate() {
    this.fileDT.nativeElement.click();
  }

  downloadDeclarationTemplate() {
    this.api.downloadFileDT(this.taxModule.code)
      .subscribe(res => {
        console.log(res);
        const filename  = `TaxModule_${this.formatDate.transform(new Date())}`;
        const content   = res.body;
        // const type      = 'text/csv';
        // const extension = 'doc';
        // download(filename, content, type, extension);
      });
  }

  removeDeclarationTemplate() {
    this.api.removeFileDT(this.taxModule.code)
      .subscribe(res => {
        this.message.success('Declaration Template is removed.');
        this.taxModule = res;
      })
  }

  onFileDTSelect() {
    const files = this.fileDT.nativeElement.files;
    if (!files || !files.length) {
      return;
    }
    const fileToRead = files[0];
    this.api.uploadFileDT(fileToRead, this.taxModule.code)
      .subscribe(res => {
        this.message.success('Declaration Template is uploaded.');
        this.taxModule = res;
      });
  }

}
