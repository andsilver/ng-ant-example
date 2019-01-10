import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  taxClaim : any;
  reference: string;

  editingStatus = {
    properties: false,
    status    : false,
    adding    : false
  };

  constructor(
    private route     : ActivatedRoute,
    private api: ApiService,
    private message   : NzMessageService,
    private router    : Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.api.getDetails(id)
    .subscribe(res => {
      this.taxClaim = res;
    });
  }

  createTaxClaim(taxClaim) {
    this.editingStatus.adding = false;
    this.api.create(taxClaim)
      .subscribe((res) => {
        this.message.success('A new Tax Claim is added.');
        this.router.navigate(['/taxes/claim', res['id']]);
      });
  }

  typeOf(value) {
    if (value === null) {
      return 'STATIC';
    } else if (value instanceof Array) {
      return 'ARRAY';
    } else if (value instanceof Object) {
      return 'JSON';
    } else {
      return 'STATIC';
    }
  }

}
