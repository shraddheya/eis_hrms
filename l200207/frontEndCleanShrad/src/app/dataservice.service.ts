import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  public data: any = {}
  constructor() { }
  getServicedata() {
    return this.data;
  }
  setServicedata(option: any, value: any) {
    this.data[option] = value;
  }
}