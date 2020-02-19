// tslint:disable: max-line-length
import { Component, OnInit } from '@angular/core';
import { callUrl } from '../ajaxes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  constructor(private router: Router) { }

  topBarElements = [
    {
      name: 'Features',
      icon: 'ellipsis-v',
      href: '#Features',
      show: true
    }, {
      name: 'Pricing/Purchase',
      icon: 'ellipsis-v',
      href: '#Pricing',
      show: true
    }, {
      name: 'Sign In',
      icon: 'ellipsis-v',
      // clickFun: (_: any) => {this.clicked('showLoginModel'); },
      clickFun: (_: any) => {this.callFunction('LOGIN'); },
      show: true
    }, {
      name: 'Login',
      icon: 'ellipsis-v',
      clickFun: (_: any) => {this.callFunction('LOGIN'); },
      show: false
    }

  ];

  callFunction(mode: string) {
    switch (mode) {
      case 'LOGIN':
        callUrl({mode, data: JSON.stringify({email: 'demo@edeitic.com', password: 'demo@edeitic.com'})}, (_: any) => this.router.navigate(['portal']));
        break;

      default:
        break;
    }
  }

  clicked(mode: string) {
    console.log('clicked : ', mode);
    switch (mode) {
      case 'showLoginModel':
        console.log(mode);
        break;
      default:
        break;
    }
  }

  ngOnInit() {
  }
}
