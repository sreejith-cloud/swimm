import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  clientnetID: any;
  constructor() { }

  setClientNetID(id: any){
    this.clientnetID = id;
  }

  getClientNetID(){
    if (this.clientnetID){
      return atob(this.clientnetID);
    }else{
      return (null);
    }
  }
}
