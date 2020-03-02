// tslint:disable: max-line-length
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { callUrl } from '../ajaxes';
import { DataserviceService } from "../dataservice.service";
import { Router } from '@angular/router';
import $ from 'jquery';
var check
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {
  checkdata: any;
  email: string;
  password: string;
  constructor(private router: Router, private dataService: DataserviceService) { }
  public data: any = this.dataService.getServicedata(); // Use for data service
  @ViewChild('loginmodal', { static: true }) loginmodal: ModalDirective
  @ViewChild('notificationmodal', { static: true }) notificationmodal: ModalDirective
  topBarElements = [
    {
      name: 'Features',
      class: 'nav-link waves-light',
      icon: 'ellipsis-v',
      href: '#features',
      show: true
    }, {
      name: 'Pricing / Purchase',
      class: 'nav-link waves-light',
      icon: 'hand-holding-usd',
      href: '#pricingplan',
      show: true
    }, {
      name: 'Sign In',
      icon: 'sign-in-alt',
      class: 'nav-link waves-light',
      clickFun: (_: any) => { this.clicked('showLoginModel'); },
      //clickFun: (_: any) => {this.callFunction('LOGIN'); },
      show: true
    }, {
      name: 'Login',
      class: 'nav-link waves-light',
      icon: 'ellipsis-v',
      clickFun: (_: any) => { this.callFunction('LOGIN'); },
      show: false
    }, {
      dropdown: '',
      class: 'dropdown-toggle nav-link waves-light',
      name: 'Menue',
      icon: 'ellipsis-v',
      //clickFun: (_: any) => { this.clicked('menues'); },
      show: false
    },//Backtoportal
    {
      class: 'nav-link waves-light',
      name: 'Backtoportal',
      icon: 'arrow-left',
      clickFun: (_: any) => { this.clicked('backtoportal'); },
      show: false
    },
  ];
  portalmenuDropdown = [
    { class: "dropdown-item", title: "notification", icon: 'bell', clickFun: (_: any) => { this.clicked('notificationshow') }, show: true },
    { class: "dropdown-item", title: "adminpage", icon: 'user-shield', clickFun: (_: any) => { this.clicked('adminpanel') }, show: true },
    { class: "dropdown-item", title: "setting", icon: 'cog', clickFun: (_: any) => { this.clicked('setting') }, show: true },
    { class: "dropdown-item", title: "logout", icon: 'sign-out-alt', clickFun: (_: any) => { this.clicked('logout') }, show: true },
  ]
  callFunction(mode: string) {
    switch (mode) {
      case 'LOGIN':
        callUrl({ mode, data: JSON.stringify({ email: this.email, password: this.password }) }, (_: any) => {
          this.router.navigate(['portal'])
          check = true;
        });
        break;
      default:
        break;
    }
  }

  clicked(mode: string) {
    switch (mode) {
      case 'notificationshow':
        this.notificationmodal.show();
        $('.modal-backdrop').hide();
        break;
      case 'hidenotificationModel':
        this.notificationmodal.hide();
        break;
      case 'showLoginModel':
        this.loginmodal.show();
        $('.modal-backdrop').hide();
        break;
      case 'hideLoginModel':
        this.loginmodal.hide();
        break;
      case 'adminpanel':
        this.router.navigate(['admin'])
        break;
      case 'backtoportal':
        this.router.navigate(['portal'])
        break;
      case 'logout':
        this.router.navigate(['']);
        localStorage.setItem('checklogin', 'false')
        break;
      default:
        break;
    }
  }
  passwordView(format, input, showhide_event) {
    $(showhide_event).attr('type', format);
    $('.show' + format).hide();
    $('.show' + input).show();
  }

  ngOnInit() {
    //this.portalmenuDropdown.forEach(el => { if (el.title === "adminpage") el.show = this.datainfo.admin })
    let checkurl: string = window.location.href.replace('http://localhost:4200/', '')
    if (checkurl === 'portal' || checkurl === 'admin') {
      var check = localStorage.getItem('checklogin')
      if ((check === null) || (check === 'false')) {
        this.router.navigate([''])
      }
      if (check === 'true') {
        this.router.navigate([checkurl])
        this.topBarElements.forEach(el => {
          (checkurl === 'portal') ? (el.name === 'Menue') ? el.show = true : el.show = false : '';
          (checkurl === 'admin') ? (el.name === 'Backtoportal') ? el.show = true : el.show = false : '';
        });
      }
    }
  }
}