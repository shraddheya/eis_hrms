import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DatatransferService } from '../datatransfer.service';
import { callUrl } from '../ajaxes';
import { Router } from '@angular/router';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  // socket: SocketIOClient.Socket;
  message: any;
  status: string;
  topBarElements = [
    {
      name: 'Features',
      icon: 'ellipsis-v',
      href: '#features',
    }, {
      name: 'Pricing / Purchase',
      icon: 'hand-holding-usd',
      href: '#pricingplan',
    }];
  constructor(private route: Router, private dataservice: DatatransferService) {
    // this.socket = io.connect('http://localhost:3000');
    // socketDatasService.socket = this.socket;
  }

  ngOnInit() {
    this.dataservice.sharedMessage.subscribe(message => this.message = message);
    this.doAjax('ISLOGGEDIN');
  }
  doAjax(mode: string) {
    switch (mode) {
      case 'ISLOGGEDIN':
        // callUrl({ mode }, (res: any) => {
        //   res = JSON.parse(res);
        //   this.userdata.isLoggedIn = res.username !== false;
        //   if (this.userdata.isLoggedIn) {
        //     this.userdata.username = res.username;
        //     // this.usrIcon = res.username[0].toUpperCase();
        //     // this.socket.emit('LOGIN');
        //   }
        // });
        this.status = localStorage.getItem('login');
        if (this.status === 'true') {
          this.message = { afterlogin: true, beforelogin: false };
        }
        if (this.status !== 'true') {
          this.message = { afterlogin: false, beforelogin: true };
        }
        break;
     }
  }
}
