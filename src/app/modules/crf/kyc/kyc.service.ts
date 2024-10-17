import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KycService {

  clientPan: any;

  constructor() { }

  setPan(pan: any){
    this.clientPan = pan;
  }

  getPan(){
    return this.clientPan;
  }
}
