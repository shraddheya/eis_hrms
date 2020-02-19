import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PortalComponent } from './portal/portal.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'portal', component: PortalComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
