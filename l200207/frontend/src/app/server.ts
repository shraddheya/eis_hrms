// tslint:disable class-name
// tslint:disable prefer-const
// tslint:disable no-var-keyword
// tslint:disable no-shadowed-variable
// tslint:disable no-unused-expression
// tslint:disable max-line-length
// tslint:disable whitespace
import { HttpClient, HttpParams,HttpHeaderResponse } from '@angular/common/http';
import { AppModule } from "src/app/app.module";
import { NgModule, Injector } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
export class server {
  readonly ROOT_URL = 'https://jsonplaceholder.typeicode.com';
  posts: any;
  private http;
  constructor() { this.http = CookieService }
  //constructor() { this.http = AppModule.injector.get(HttpHeaderResponse)}
  callUrl = async (data2Post, next) => {
    $.ajax({
      type: "post",
      url: 'http://localhost/phpfuns.php',
      data: data2Post,
      crossDomain: true,
      success: (res, status, jqXHR) => {
        this.getHeader(jqXHR,res=>{console.log(res)})
        var idxFailure = res.indexOf("failure");
        var idxSuccess = res.indexOf("success");
        var responsedecode;
        var requestdecode;
        (idxFailure > -1) ? next({ record: "wrong credentials", mode: "recordissue", other: "" }) : "";
        (idxSuccess === -1) ? "" : "";
        this.responseJsonconvertor({ response: res, success: idxSuccess }, res => { responsedecode = res; });
        this.requestJsonconvertor(data2Post.data, res => { requestdecode = res; });
        var responseobject = { record: responsedecode, mode: data2Post.mode.toLowerCase(), other: { mode: data2Post.mode, data: requestdecode } };
        next(responseobject);
      },
      cache: false,
      error: (error) => { console.log(error);next({ record: "Connection Fail With Server", mode: "serverissue", other: "" }); },
    });
  }
  getHeader = async (jqXHR, next) => {
    var req =  jqXHR;
    var data = new Object();
    var headers = req.getAllResponseHeaders();
    var aHeaders = headers.split('\n');
    var i = 0;
    for (i = 0; i < aHeaders.length; i++) {
      var thisItem = aHeaders[i];
      var key = thisItem.substring(0, thisItem.indexOf(':'));
      var value = thisItem.substring(thisItem.indexOf(':') + 1);
      data[key] = value;
    }
    next(data)
  }
  responseJsonconvertor = async (data, next) => { (data.success !== -1) ? next(JSON.parse(data.response.substr(data.success + 7))) : ""; }; // responseDecode
  requestJsonconvertor = async (data, next) => { (data !== undefined) ? next(JSON.parse(data)) : ""; };
}
