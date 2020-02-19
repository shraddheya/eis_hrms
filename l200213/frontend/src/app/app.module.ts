import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Component1Component } from './component1/component1.component';
import { Component2Component } from './component2/component2.component';
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { TopnavbarComponent } from './topnavbar/topnavbar.component';

@NgModule({
  declarations: [
    AppComponent,
    Component1Component,
    Component2Component,
    TopnavbarComponent,
 
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    AppRoutingModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
