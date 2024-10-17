import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoaserviceService {
  clientid = new BehaviorSubject<any>(1)
  dpid = new BehaviorSubject<any>(1)
  refreshflag = new BehaviorSubject<any>(1)
  id = new BehaviorSubject<any>(1)
  type = new BehaviorSubject<any>(1)
  requestvalue= new BehaviorSubject<any>(1)
  
  crfRPTStatus:any;
  fromApproveList:boolean=false;
 
  constructor() {
    this.clientid.next([]);
    this.dpid.next([]);
    this.refreshflag.next([]);
    this.id.next([]);
    this.type.next([]);
    this.requestvalue.next('')

   }
}
