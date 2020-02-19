import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.scss']
})
export class TopnavbarComponent implements OnInit {
  menuebar=[
    {
      name:"Features",
      icon:"ellipsis-v",
      href:"#features"
    },
    {
      name:"Pricing/Purchase",
      icon:"hand-holding-usd",
      href:"#pricingplan"
    },
    {
      name:"Sign In",
      icon:"sign-in-alt",
      clickFun:"callUrl('Login')"
    },
  ]
  constructor() { }
  
  ngOnInit() {
  }

}
