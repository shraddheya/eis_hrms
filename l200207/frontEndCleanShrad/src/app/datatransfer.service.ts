import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DatatransferService {
  private message = new BehaviorSubject({ beforelogin: true, afterlogin: false });
  sharedMessage = this.message.asObservable();
  constructor() { }
  nextMessage(message: any) {
    this.message.next(message);
  }
}
