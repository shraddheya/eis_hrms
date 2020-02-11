import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { FrontpageComponent } from './frontpage/frontpage.component';

const routes: Routes = [
  {path:'portal',component:LoginComponent},
  {path:'portal',component:HierarchyComponent},
  {path:'./',component:FrontpageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
