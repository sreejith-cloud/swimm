import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusconversionService {
  fromreportcsc: boolean = false;
  slnocsc: number;
  status: string = ''
  modalview = new BehaviorSubject<boolean>(false)
  documentsData: any = [];
  constructor() {
    this.modalview.next(false);
   }

  openmodalview(){
    this.modalview.next(true);
  }
  closemodalview(){
    this.modalview.next(false);
  }
  // unsubscribeModelView(){
  //   this.modalview.unsubscribe()
  // }
  setDocumentsData(data: any){
    this.documentsData = data;
  }

  getDocumentsDatas(){
    return this.documentsData;
  }
}
