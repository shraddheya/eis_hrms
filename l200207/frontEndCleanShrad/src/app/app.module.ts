import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { TopbarComponent } from './topbar/topbar.component';
import { PortalComponent } from './portal/portal.component';
import { AdminComponent } from './admin/admin.component';
import { NotificationComponent } from './notification/notification.component';
import { LoginregistrationComponent } from './loginregistration/loginregistration.component';
import { Four04Component } from './four04/four04.component';
import { ProfileComponent } from './profile/profile.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopbarComponent,
    PortalComponent,
    AdminComponent,
    Four04Component,
    NotificationComponent,
    LoginregistrationComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
