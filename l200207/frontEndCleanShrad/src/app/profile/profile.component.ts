import { Component, OnInit } from '@angular/core';
import { DatatransferService } from '../datatransfer.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // usrIcon = 'U';
  message: any;
  profilePic = '../../assets/images/main_9.png';
  userdata: any = {
    isLoggedIn: false,
    username: null
  };
  constructor(private route: Router, private dataservice: DatatransferService) { }
  doAjax(mode: string) {
    switch (mode) {
      case 'LOGOUT':
        localStorage.setItem('login', 'false');
        this.dataservice.nextMessage({ beforelogin: true, afterlogin: false });
        this.route.navigate(['']);
        break;
    }
  }
  ngOnInit() {
    this.dataservice.sharedMessage.subscribe(message => this.message = message);
  }

}
