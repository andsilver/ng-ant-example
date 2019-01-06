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

  taxClaim : any;
  reference: string;

  editingStatus = {
    properties: false,
    status    : false,
    adding    : false
  };

  constructor(
    private route     : ActivatedRoute,
    private apiService: ApiService,
    private message   : NzMessageService,
    private router    : Router,
    private formatDate: CustomDatePipe
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.apiService.getDetails(id)
    .subscribe(res => {
      this.taxClaim = res;
      console.log(res);
    });
  }

}
