import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  navMenuItems = [
    {
      title: 'People & Entities',
      subs: [
        {
          title: 'Natural Person',
          link: 'natural-person'
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
