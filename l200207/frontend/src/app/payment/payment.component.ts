import { Component, OnInit } from '@angular/core';
import { server } from "../server";
declare var swal: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  constructor() { }
  ngOnInit() {
  }
  requestdata(input){
    swal("Buy Feature will Comming Soon","","info")
  }
}
