import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,Injector} from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { HttpClientModule ,HttpParams,HttpHeaderResponse} from "@angular/common/http";
import { AdminpageComponent } from './adminpage/adminpage.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { PaymentComponent } from './payment/payment.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { CookieService } from "ngx-cookie-service";
import { RouterModule, Routes } from "@angular/router";
const testVar = 'some value';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HierarchyComponent,
    AdminpageComponent,
    PaymentComponent,
    FrontpageComponent,
 ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
  providers: [ CookieService,HttpParams,HttpHeaderResponse],
  bootstrap: [AppComponent]
})
export class AppModule {
  static injector: Injector;
  constructor(injector: Injector) {
      AppModule.injector = injector;
  }
 }
