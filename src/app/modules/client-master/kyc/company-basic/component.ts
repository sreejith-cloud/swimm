import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../../client-master.service';
import { NzNotificationService, UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'kyc-company-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class KYCCompanyBasicComponent implements OnInit {

  form: FormGroup;

  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  clientType:string;
  fileList: any=[];
  fileList1: any=[];
  KYCcompPanDocument:any;
  KYCcompRegistrationcertificateDocument:any;
  filePreiewContent: any;
  filePreiewFilename: any;
  filePreiewContentType: any;
  filePreiewVisible: boolean;
  constructor(
    private fb: FormBuilder,
    private notif: NzNotificationService,
    private cmServ: ClientMasterService,
  ) {    
  }
  
  ngOnInit() {
    this.cmServ.clientType.subscribe((val) => {
      this.clientType = val;
     this.form=this.fb.group({
      Nameofapplicant:[null],
      DateofIncorporation:[null],
      PlaceofIncorporation:[null],
      RegistrationNo:[null],
      RegistrationAuthority:[null],
      CIN:[null],
      Dateofcommencementofbusiness:[null],
      Status:[null],
      PAN:[null],
     })
  })
}
beforeUpload = (file: UploadFile): boolean => {
  if(file.type=='application/pdf' || file.type=='image/jpeg' || file.type=='image/png'){
    this.fileList = [file];
    this.encodeImageFileAsURL(file);
    return false;
  }else{
    this.notif.error("Please uplaod jpeg/png/pdf",'')
    return false
  }
}


  encodeImageFileAsURL(file) {
    let reader = new FileReader();
      reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document= dataUrl.split(',')[1];
      this.KYCcompPanDocument={
        Docname:'KYC PAN Document',
        Doctype:file.type,
        Docuid:file.uid,
        doc:document,
        Docsize:file.size
      }
    }
    reader.readAsDataURL(file);
  }

  showModal() {
    this.filePreiewContent = this.KYCcompPanDocument.doc
    this.filePreiewFilename = this.KYCcompPanDocument.Docname
    this.filePreiewContentType = this.KYCcompPanDocument.Doctype
    this.filePreiewVisible = true;
}

beforeUpload1 = (file: UploadFile): boolean => {
  if(file.type=='application/pdf' || file.type=='image/jpeg' || file.type=='image/png'){
    this.fileList1 = [file];
    this.encodeImageFileAsURL1(file);
    return false;
  }else{
    this.notif.error("Please uplaod jpeg/png/pdf",'')
    return false
  }
}


  encodeImageFileAsURL1(file) {
    let reader = new FileReader();
      reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
    let  document= dataUrl.split(',')[1];
      this.KYCcompRegistrationcertificateDocument={
        Docname:'KYC COMP Registration certificate Document',
        Doctype:file.type,
        Docuid:file.uid,
        doc:document,
        Docsize:file.size
      }
    }
    reader.readAsDataURL(file);
  }

  showModal1() {
    this.filePreiewContent = this.KYCcompRegistrationcertificateDocument.doc
    this.filePreiewFilename = this.KYCcompRegistrationcertificateDocument.Docname
    this.filePreiewContentType = this.KYCcompRegistrationcertificateDocument.Doctype
    this.filePreiewVisible = true;
}


}
