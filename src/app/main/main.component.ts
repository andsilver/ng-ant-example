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
          link: '/taxes/modules',
          selected: false
        },
        {
          title: 'Tax Register',
          link: '/taxes/registers',
          selected: false
        },
        {
          title: 'Tax Claim',
          link: '/taxes/claims',
          selected: false
        }
      ]
    }
  ];

  breakpoint = {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1600px',
    xxl: '1600px'
  };

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
        });
      });
    });
  }

}
