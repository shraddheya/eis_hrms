import { Component, OnInit} from '@angular/core';
import { LoginComponent } from "src/app/login/login.component";
import { PaymentComponent } from "../payment/payment.component";
import { CookiesGetSet } from "../cookies";
import { CookieService } from "ngx-cookie-service";
@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.scss']
})
export class FrontpageComponent implements OnInit {
  constructor(private cookieService: CookieService){}
  logincObject = new LoginComponent();
  cookiesResp = new CookiesGetSet
  PaymentComponentObject = new PaymentComponent
  ngOnInit() {
    var object = {users:[{id:12,name:"sourabh"}]}
    //this.cookieService.set('login',JSON.stringify(object))
    console.log(JSON.parse(this.cookieService.get('login')))
    //this.cookiesResp.checkcookiesData("check",res=>{ this.sessionResponse(res)})
  }
  sessionResponse(data){

  }
  cookiesGetter(param){
    console.log(param)

  }
  openlogin(){
    this.logincObject.showhidePanel("loginModal","frontpage")
  }
  payment(mode, input) {
    var dataobj = { mode: mode, data: input }
    this.PaymentComponentObject.requestdata(dataobj)
  }
  
}
