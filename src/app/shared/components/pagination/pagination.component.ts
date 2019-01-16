import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input()
  previous = false;

  @Input()
  next = false;

  @Output()
  firstPage = new EventEmitter();

  @Output()
  lastPage = new EventEmitter();

  @Output()
  previousPage = new EventEmitter();

  @Output()
  nextPage = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
