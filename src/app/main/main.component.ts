import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  menu = [
    {
      title: 'People & Entities',
      opened: false,
      subs: [
        {
          title: 'Natural Person',
          link: '/natural-person',
          selected: false
        }
      ]
    },
    {
      title: 'Taxes',
      opened: false,
      subs: [
        {
          title: 'Tax Module',
          link: '/tax-module',
          selected: false
        },
        {
          title: 'Tax Register',
          link: '/tax-register',
          selected: false
        },
        {
          title: 'Tax Claim',
          link: '/tax-claim',
          selected: false
        }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.url.subscribe(res => {
      this.menu.forEach(item => {
        item.subs.forEach(sub => {
          if (this.router.url.indexOf(sub.link) > -1) {
            sub.selected = true;
            item.opened = true;
          } else {
            sub.selected = false;
          }
        })
      });
    });
  }

}
