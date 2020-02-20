// tslint:disable: max-line-length
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from "angular-bootstrap-md";
import { callUrl } from '../ajaxes';
import { Router } from '@angular/router';
import $ from 'jquery';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {
  check   : string;
  email   : string;
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
    }

  ];

  callFunction(mode: string) {
    switch (mode) {
      case 'LOGIN':
        callUrl({ mode, data: JSON.stringify({ email: this.email, password: this.password }) }, (_: any) => this.router.navigate(['portal']));
        break;

      default:
        break;
    }
  }

  clicked(mode: string) {
    switch (mode) {
      case 'showLoginModel':
        this.loginmodal.show()
        $(".modal-backdrop").hide()
        //console.log(mode);
        break;
      case 'hideLoginModel':
        this.loginmodal.hide()
        break;
      default:
        break;
    }
  }
  passwordView(format, input,showhide_event) {
    $(showhide_event).attr("type", format);
    $(".show" + format).hide();
    $(".show" + input).show();
  }
  
  ngOnInit() {

  }
}
