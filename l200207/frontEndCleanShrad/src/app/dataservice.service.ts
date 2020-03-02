import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  data:any = new Object
  constructor() { }
  setServicedata(option:any, value:any) {
    this.data[option] = value;
  }
  getServicedata() {
    console.log(this.data)
    return this.data
  }
}