// tslint:disable: max-line-length
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from "angular-bootstrap-md";
import { callUrl } from '../ajaxes';
import { Router } from '@angular/router';
import $ from 'jquery';
var checklogin;

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  email: string;
  password: string;
  constructor(private router: Router) { }
  @ViewChild('loginmodal', { static: true }) loginmodal: ModalDirective
  topBarElements = [
    {
      name: 'Features',
      icon: 'ellipsis-v',
      href: '#features',
      show: true
    }, {
      name: 'Pricing / Purchase',
      icon: 'hand-holding-usd',
      href: '#pricingplan',
      show: true
    }, {
      name: 'Sign In',
      icon: 'sign-in-alt',
      clickFun: (_: any) => { this.clicked('showLoginModel'); },
      //clickFun: (_: any) => {this.callFunction('LOGIN'); },
      show: true
    }, {
      name: 'Login',
      icon: 'ellipsis-v',
      clickFun: (_: any) => { this.callFunction('LOGIN'); },
      show: false
    }, {
      name: 'Menue',
      icon: 'ellipsis-v',
      clickFun: (_: any) => { this.clicked('menues'); },
      show: false
    }

  ];

  callFunction(mode: string) {
    switch (mode) {
      case 'LOGIN':
        callUrl({ mode, data: JSON.stringify({ email: this.email, password: this.password }) }, (_: any) => this.router.navigate(['portal']));
        checklogin = true
        break;
      default:
        break;
    }
  }

  clicked(mode: string) {
    switch (mode) {
      case 'showLoginModel':
        this.loginmodal.show();
        $(".modal-backdrop").hide();
        break;
      case 'hideLoginModel':
        this.loginmodal.hide();
        break;
      case 'menues':
        console.log("Admin page");
        break;
      default:
        break;
    }
  }
  passwordView(format, input, showhide_event) {
    $(showhide_event).attr("type", format);
    $(".show" + format).hide();
    $(".show" + input).show();
  }

  ngOnInit() {
    checklogin = false
    let checkurl: string = window.location.href.replace("http://localhost:4200/", "")
    if (checkurl == "portal" || checkurl == "admin") {
      this.topBarElements.forEach(el => {
        (el.name == "Menue") ? el.show = true : el.show = false; 
      });
    }

    console.log(checklogin)
    //((checkurl == "potal")||(checkurl == "admin"))?(checklogin == false)?this.router.navigate(['']):this.router.navigate([checklogin]):"";
  }
}
