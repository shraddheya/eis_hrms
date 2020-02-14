import { Component, OnInit } from '@angular/core';
import { callUrl } from '../app.component';
@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html',
  styleUrls: ['./component1.component.scss']
})
export class Component1Component implements OnInit {

  constructor() { }
  clicked(p) {
    callUrl({
      mode: 'GET SOMETHING',
      data: {
        hello: 'world',
        hmm: '!',
      }
    }, resp => {
      console.log(resp);
    });
  }
  ngOnInit() {
  }

}
