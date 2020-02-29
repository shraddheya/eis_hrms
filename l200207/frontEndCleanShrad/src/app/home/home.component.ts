// tslint:disable: max-line-length
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import $ from 'jquery';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  featuresList = [
    [
      {
        icon: 'fa-user-plus',
        head: 'Add Users',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }, {
        icon: 'fa-user-times',
        head: 'Remove Users',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }, {
        icon: 'fa-user-edit',
        head: 'Edit Users',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }
    ], [
      {
        icon: 'fa-money-bill-alt',
        head: 'Salary Slip',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }, {
        icon: 'fa-calendar-check',
        head: 'Attendance',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }, {
        icon: 'fa-id-card-alt',
        head: 'Card Allot',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }
    ]
  ];
  pricingList = [
    {
      head:"Basic",
      prize:"$50",
      duration:"3 month",
      icon:"fa-chalkboard",
      matter:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      head:"Express",
      prize:"$90",
      duration:"6 month",
      icon:"fa-briefcase ",
      matter:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      head:"Super",
      prize:"$120",
      duration:"1 year",
      icon:"fa-gem",
      matter:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ];
  ngOnInit() {
  }
}
