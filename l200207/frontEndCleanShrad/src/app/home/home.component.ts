// tslint:disable: max-line-length
import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  featuresList = [
    [
      {
        icon: 'fa-user-plus',
        head: 'Add Users',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }, {
        icon: 'fa-user-plus',
        head: 'Add Users',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }, {
        icon: 'fa-user-plus',
        head: 'Add Users',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }
    ], [
      {
        icon: 'fa-user-plus',
        head: 'Add Users',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }, {
        icon: 'fa-user-plus',
        head: 'Add Users',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }, {
        icon: 'fa-user-plus',
        head: 'Add Users',
        matter: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit maiores nam, aperiam minima assumenda deleniti hic',
      }
    ]
  ];

  ngOnInit() {
  }
}
