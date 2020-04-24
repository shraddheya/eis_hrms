import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PortalComponent } from './portal/portal.component';
import { AdminComponent } from './admin/admin.component';
import { Four04Component } from './four04/four04.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'portal', component: PortalComponent },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
