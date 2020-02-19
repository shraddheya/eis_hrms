import { Component, OnInit } from '@angular/core';
import { callUrl } from '../ajaxes';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    callUrl({mode: 'GETINITDATA'}, (resp: string) => {
      // resp = JSON.parse(resp);
      console.log(resp);
    });
  }

}
