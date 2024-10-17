import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhysicalActivationkitService {
  clientid=new BehaviorSubject<any>(1);
  dpid=new BehaviorSubject<any>(1) ;
  id=new BehaviorSubject<any>(1);
  tradeCode=new BehaviorSubject<any>(1);
  loc=new BehaviorSubject<any>(1);

  constructor() {
    this.clientid.next([]);
    this.dpid.next([]);
    this.id.next([]);
    this.tradeCode.next([]);
    this.loc.next([]);
   }
}
