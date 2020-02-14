import { Component,Injector,OnInit} from '@angular/core';
import { AppModule } from './app.module';
import { CookieService } from "ngx-cookie-service";
import { LoginComponent } from "./login/login.component";
import { HierarchyComponent } from "./hierarchy/hierarchy.component";
import { AdminpageComponent } from "./adminpage/adminpage.component";
export class session_cookies{
  private service;
  logincookies     = new LoginComponent
  hierarchycookies = new HierarchyComponent
  adminpagecookies = new AdminpageComponent
  constructor(){
    this.service = AppModule.injector.get(CookieService)
    this.logincookies.cookies_login = this.service;
    this.hierarchycookies.cookies_hierarchy = this.service
  }
}

