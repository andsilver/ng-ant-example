import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Input()
  countries = [];

  form: FormGroup;
  statuses  = [];

  constructor(private filter: FilterService) { }

  ngOnInit() {
    this.form = this.filter.form;
  }

  reset() {
    this.form = this.filter.initFilterForm();
  }

  applyFilter() {
    const filter = this.form.value;
    this.filter.saveFilter(filter);
  }

  clearFilter() {
    this.reset();
    const filter = this.form.value;
    this.filter.saveFilter(filter);
  }

}
