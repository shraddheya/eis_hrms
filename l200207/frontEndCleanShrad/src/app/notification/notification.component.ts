import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notification: any = [];
  notifcount: any;
  constructor() { }
  notifFunction() {
    this.notification.push(
      { when: '2020-03-23', why: 'Birthday', what: 'Wishing you many happy birthday', whom: '4' }
    );
    this.notifcount = this.notification.length;
  }
  ngOnInit() {
    this.notifFunction();
  }

}
