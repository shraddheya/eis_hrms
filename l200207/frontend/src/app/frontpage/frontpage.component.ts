import { Component, OnInit} from '@angular/core';
import { LoginComponent } from "src/app/login/login.component";
import { PaymentComponent } from "../payment/payment.component";
import { CookieService } from "ngx-cookie-service";
import { AppModule } from '../app.module';
@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.scss']
})
export class FrontpageComponent implements OnInit {
  private myservice;
  constructor(){
    this.myservice = AppModule.injector.get(CookieService)
  }
  logincObject = new LoginComponent();
  PaymentComponentObject = new PaymentComponent
  ngOnInit() {
    var object = {users:[{id:12,name:"sourabh"}]}
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
