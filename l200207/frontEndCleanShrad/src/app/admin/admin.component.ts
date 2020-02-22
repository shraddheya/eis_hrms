import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { callUrl } from '../ajaxes';

var adminpagedata;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  exportadminpagedata = { Posts: [], Documents_accesslevels: [], Accesslevels: [] }
  exportdefaultdata = { Posts: [], Documents_accesslevels: [] }
  constructor(private router: Router) { }

  clickedadmin(mode: string) {
    switch (mode) {
      case 'redirectHome':
        this.router.navigate(['portal']);
        break;
      default:
        break;
    }
  }

  ngOnInit() {
    callUrl({ mode: "ADMINDASHBOARD" }, (resp: any) => {
      adminpagedata = JSON.parse(resp)
      console.log(adminpagedata)
    })
  }

}
