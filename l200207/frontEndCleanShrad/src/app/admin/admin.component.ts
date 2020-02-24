import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { callUrl } from '../ajaxes';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  adminpagedata: any;
  //exportadminpagedata: any = { Posts: [], Documents_accesslevels: [], Accesslevels: [] }
  exportadminpagedata: any;
  constructor(private router: Router) { }

  ngOnInit() {
    callUrl({ mode: "ADMINDASHBOARD" }, (resp: any) => { 
      this.adminpagedata = JSON.parse(resp);
      this.exportadminpagedata = [
        {title:"Posts",icon:""},
        {title:"Door Accesslevels",icon:""},
        {title:"Document Accesslevels",icon:""},
      ]
    });
  }

  clicked(mode) {
   
  }

  callFunction(mode) {

  }

}
