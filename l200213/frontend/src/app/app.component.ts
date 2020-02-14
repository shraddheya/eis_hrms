import { Component } from '@angular/core';
import {  } from "src/app/component1/component1.component";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

}
export function callUrl(p, next) {
  console.log(p);
  $.ajax({
    method: 'post',
    url: 'http://localhost/phpfuns.php',
    data: p,
    xhrFields: {
       withCredentials: true
    },
    success: (res, status, data) => {
      next(data);
    },
    error:  (res, status, data) => { }
  });
}
