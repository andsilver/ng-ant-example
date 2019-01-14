import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../services/api.service';
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
    properties   : false,
    status       : false,
    adding       : false,
    aprDate      : false,
    approve      : false,
    specification: false
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
        this.router.navigate(['/taxes/modules', res['code']]);
      });
  }

  removeTaxModule() {
    this.api.removeTaxModule(this.taxModule.code)
      .subscribe(res => {
        this.message.success('The Tax Module is removed.');
        this.router.navigate(['/taxes/modules']);
      });
  }

  showModal(type: string) {
    this.editingStatus[type] = true;
  }

  updateProperties(properties) {
    this.editingStatus.properties = false;
    this.api.updateTaxModule(this.taxModule.code, properties)
      .subscribe((res) => {
        this.message.success('Properties are updated.');
        this.taxModule = res;
      })
  }

  lookUp() {
    this.api.getTaxModule(this.code)
      .subscribe((res: any) => {
        if (res) {
          this.router.navigate(['taxes/modules', res.code]);
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

  saveFile(res) {
    const content   = res.body;
    const filename  = res.headers.get('Content-Disposition').split('"')[1];
    const extension = filename.split('.')[1];
    const name      = filename.split('.')[0];
    const type      = `text/${extension}`;
    download(name, content, type, extension);
  }

  uploadAssessmentTemplate() {
    this.file.nativeElement.click();
  }

  downloadAssessmentTemplate() {
    this.api.downloadFile(this.taxModule.code)
      .subscribe(res => {
        this.saveFile(res);
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
        this.saveFile(res);
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

  updateSpecification(specification: string) {
    this.editingStatus.specification = false;
    this.api.updateSpecification(this.taxModule.code, specification)
      .subscribe(res => {
        this.message.success('Specification is uploaded.');
        this.taxModule = res;
      });
  }

}
