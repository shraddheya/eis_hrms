import { Component,Input ,OnInit, ViewChild, AfterViewInit,Inject ,EventEmitter,Output, Injectable } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { HierarchyComponent } from 'src/app/hierarchy/hierarchy.component';
import { PaymentComponent } from "src/app/payment/payment.component";
import { server } from '../server';
import { FormControl,FormGroup } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import * as $ from 'jquery';
import { AppModule } from '../app.module';
import { session_cookies } from "../cookies";
//import { session_cookies } from "../cookies";
declare var swal: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable()
export class LoginComponent implements OnInit {
  private myservice;
  constructor(){
    this.myservice = AppModule.injector.get(CookieService)
    //this.myservice = session_cookies.injector.get(CookieService)
  }
  cookies_login; //Used for cookies
  params
  email;
  password;
  forgetpassword_email;
  createpassword;
  confirmpassword;
  gcreatepassword;
  gconfirmpassword_input;
  HierarchyComponentObject = new HierarchyComponent();
  PaymentComponentObject = new PaymentComponent();
  @ViewChild('frame', { static: true }) frame: ModalDirective;
  serverConnection = new server;
  showhidePanel(firstparam, secondparam) {
    $("#" + firstparam).show();
    $("#" + secondparam).hide();
  }
  ngOnInit() {
    $("#Genrateotp,.modal-backdrop,#Login_otpinputfield,.verifyotpbutton,#newpassword,#ui_genratepassword").hide()
  }
  logincomponent(mode, input) {
    switch (mode) {
      case 'loginuser':
        var ssid = btoa("SSID"+this.email+this.password)
        this.HierarchyComponentObject.message = ssid
        var loginobj = { email: this.email, password: this.password }
        this.serverConnection.callUrl({ mode: "LOGIN", data: JSON.stringify(loginobj)}, res => { this.responseData(res) })
        return
      case 'remberme':
        var savecred;
        ($(input).prop("checked") == false) ? savecred = true : savecred = false;
        return
      case 'forgetpassword':
        $(".loginfeature,#login,.newpassword_value").hide();
        $("#Genrateotp").show();
        return
      case 'getOpt':
        if (this.forgetpassword_email != null) {
          if (this.forgetpassword_email != "demo@edeitic.com") var getOtpObj = { email: this.forgetpassword_email };
          (this.forgetpassword_email == "demo@edeitic.com") ? swal(this.forgetpassword_email + " is not authorized", "", "warning") : this.serverConnection.callUrl({ mode: "FORGET", data: JSON.stringify(getOtpObj) }, res => { this.responseData(res) });
        }
        return
      case 'verifyotp':
        return
      case 'newpasswordmode':
        (this.createpassword == this.confirmpassword) ? $(".loginfeature,#login").show() : "";
        if (this.createpassword == this.confirmpassword) $("#newpassword,#Login_otpinputfield,.verifyotpbutton,#Genrateotp").hide();
        return
      case 'stop_otpprocess':
        $("#Genrateotp").hide();
        $("#login,.loginfeature").show();
        return
      case 'genratepassword':
        $("#ui_genratepassword").show();
        $("#Genrateotp,#login,.loginfeature").hide();
        return
      case 'sendrequest_pass':
        if (this.gcreatepassword == this.gconfirmpassword_input) var sendrequest_passObj = { email: input, password: this.gcreatepassword };
        (this.gcreatepassword == this.gconfirmpassword_input) ? this.serverConnection.callUrl({ mode: "GENRATEPASSWORD", data: JSON.stringify(sendrequest_passObj) }, res => { this.responseData(res) }) : "";
        return
    }
  }

  responseData(response) {
    switch (response.mode) {
      case 'recordissue':
        swal(response.record, "", "warning")
        return
      case 'serverissue':
        swal(response.record, "", "error")
        return
      case 'login':
        //cookies.set('logindatarecord',"sourabh") 
        // this.sessionData.setCookiesData(response.record,res=>{
        //   console.log(res)
        // });
        var data = JSON.stringify({name:"sourabh",address:[{office:"407/dfdf",home:"sdsdsd"}],experince:[{}]})
        this.myservice.set("userlogin",data);
        (response.record != undefined) ? this.HierarchyComponentObject.init(true, response.record, response.other.data.email) : "";
        return
      case 'newusers':
        var newuser_object;
        response.record.forEach(nuserel => { newuser_object = nuserel })
        if (response.record.length == 0) { swal("Email not Found in record", "", "warning") }
        if (response.record.length != 0) {
          (newuser_object.password == null) ? newuser_object["password"] = "" : "";
          (newuser_object.password == "") ? $("#genpassword").show() : $("#genpassword").hide();
          (newuser_object.password != "") ? $("#forpassword").show() : $("#forpassword").hide();
        }
        return
      case 'genratepassword':
        swal("Your password has genrated", "", "success");
        $("#ui_genratepassword,#Genrateotp,#genpassword").hide();
        $("#login,.loginfeature,#forpassword").show();
        return
      case 'forget':
        (response.record == "Email not found") ? swal("Invalid Email", "", "warning") : $(".otpbutton,.newpassword_value").hide();
        if (response.record != "Email not found") $("#Login_otpinputfield,.verifyotpbutton").show();
        return
    }
  }
  passwordView(format, input,showhide_event) {
    $(showhide_event).attr("type", format);
    $(".show" + format).hide();
    $(".show" + input).show();
  }
  checkusermail() {
    this.serverConnection.callUrl({ mode: "NEWUSERS", data: JSON.stringify({ email: this.email }) }, res => { this.responseData(res) })
  }
  payment(mode, input) {
    var dataobj = { mode: mode, data: input }
    this.PaymentComponentObject.requestdata(dataobj)
  }
}