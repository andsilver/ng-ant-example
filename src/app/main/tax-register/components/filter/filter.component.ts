import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output()
  filterChanged = new EventEmitter();

  filterForm: FormGroup;

  statuses  = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.statuses  = this.api.statuses;
    this.filterForm = new FormGroup({
      status   : new FormControl(''),
      taxModule: new FormControl('')
    });
  }

  applyFilter() {
    const filter = this.filterForm.value;
    this.filterChanged.emit(filter);
  }

  clearFilter() {
    this.filterForm.reset();
    this.applyFilter();
  }

}
