import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { callUrl } from '../ajaxes';
import { DatatransferService } from '../datatransfer.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-loginregistration',
  templateUrl: './loginregistration.component.html',
  styleUrls: ['./loginregistration.component.scss']
})
export class LoginregistrationComponent implements OnInit {
  message: any;

  email: any;
  password: any;
  regUsername: any;
  regEmail: any;
  regCrpassword: any;
  regConpassword: any;

  loginviewSection = true;
  registerviewSection = false;
  socialLoginBtn = {
    google: {
      icon: 'google',
      link: 'auth/google',
    },
    github: {
      icon: 'github',
      link: 'authGithub',
    },
    faceBook: {
      icon: 'facebook-f',
      link: 'authGoogle',
    },
    linkedin: {
      icon: 'linkedin-in',
      link: 'authGoogle',
    },
    twitter: {
      icon: 'twitter',
      link: 'authGoogle',
    },
  };
  constructor(private router: Router, private dataservice: DatatransferService) { }
  callFunction(mode) {
    switch (mode) {
      case 'LOGIN':
        this.dataservice.nextMessage({ beforelogin: false, afterlogin: true });
        callUrl({ mode, data: JSON.stringify({ email: this.email, password: this.password }) }, (_: any) => {
           localStorage.setItem('login', 'true');
           this.router.navigate(['portal']);
         });
        break;
      case 'ISLOGEDIN':
        break;
      case 'SIGNUP':
        console.log(this.regUsername, this.regEmail, this.regCrpassword, this.regConpassword);
        break;
    }
  }
  clicked(mode: string) {
    switch (mode) {
      case 'signinmode':
        this.loginviewSection = true;
        this.registerviewSection = false;
        break;
      case 'signupmode':
        this.loginviewSection = false;
        this.registerviewSection = true;
        break;
    }
  }
  passwordView(format: any, input: any, showhideEvent: any) {
    console.log(format, input, showhideEvent);
    $(showhideEvent).attr('type', format);
    $('.show' + format).hide();
    $('.show' + input).show();
  }
  ngOnInit() {
    this.callFunction('ISLOGEDIN');
    this.dataservice.sharedMessage.subscribe(message => this.message = message);

  }
}
