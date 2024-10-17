import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { InputMasks, InputPatterns } from 'shared';
import { UploadFile } from 'ng-zorro-antd/upload';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

import { ClientMasterService } from '../../client-master.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'trading-third-party-poa',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class ThirdPartyPOAComponent implements OnInit {
  inputMasks = InputMasks;
  today = new Date()
  form: FormGroup;
  clientType:string
  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;
  POAidentityProof: any=[];
  fileType: string;
  fileList: any=[];
  fileName: string;
  document: string;
  POADocument:any;
  filePreiewContent: any;
  filePreiewFilename: any;
  filePreiewContentType: any;
  filePreiewVisible: boolean;
  ResolutionDocument: any;
  fileList1: any=[];

  constructor(
    private fb: FormBuilder,
    private notif: NzNotificationService,
    private cmServ: ClientMasterService,
  ) {
    this.form=fb.group({
      poa:[false],
      POAAuthorisedPersonName:[null,[Validators.required]],
      proofOfIdentity:[null,[Validators.required]],
      POAhouseName:[null,[Validators.required]],
      POAhouseNumber:[null,[Validators.required]],
      POAstreet:[null,[Validators.required]],
      POAdob:[null,[Validators.required]],
      POAMobile:[null,[Validators.required]],
      POALandline:[null],
      POAEmail:[null],
      POAdocumentNo:[null,[Validators.required]],
    })
  }

  ngOnInit() {
    this.cmServ.clientType.subscribe((val) => {
      this.clientType = val;
    })
    this.cmServ.POAidentityProof.subscribe((val) => {
      this.POAidentityProof = val;
    })
    this.form.controls.proofOfIdentity.valueChanges.subscribe((val) => {
      this.form.controls.POAdocumentNo.patchValue(null)
    })
  }

  beforeUpload = (file: UploadFile): boolean => {
    if(file.type=='application/pdf' || file.type=='image/jpeg' || file.type=='image/png'){
      this.fileList = [file];
      this.encodeImageFileAsURL(file,'Proof of ID');
      return false;
    }else{
      this.notif.error("Please uplaod jpeg/png/pdf",'')
      return false
    }
  }
  beforeUpload1 = (file: UploadFile): boolean => {
    if(file.type=='application/pdf' || file.type=='image/jpeg' || file.type=='image/png'){
      this.fileList1 = [file];
      this.encodeImageFileAsURL(file,'Resolution for Trading');
      return false;
    }else{
      this.notif.error("Please uplaod jpeg/png/pdf",'')
      return false
    }
  }

    encodeImageFileAsURL(file,type) {
      let reader = new FileReader();
        reader.onloadend = () => {
        let dataUrl: string = reader.result.toString();
        this.document= dataUrl.split(',')[1];
        if(type=='Proof of ID'){
        this.POADocument={
          Docname:'Third party poa',
          Doctype:file.type,
          Docuid:file.uid,
          doc:this.document,
          Docsize:file.size
        }
      }
      if(type=='Resolution for Trading'){
        this.ResolutionDocument={
          ResolutionDocname:'Resolution for Trading Document',
          ResolutionDoctype:file.type,
          ResolutionDocuid:file.uid,
          Resolutiondoc:this.document,
          ResolutionDocsize:file.size
        }
      }

      }
      reader.readAsDataURL(file);
    }
    ValidatePan(val) {

      var charonly = /^[a-zA-Z]+$/
      var numonly = /^[0-9]+$/
      var fullstring = val.currentTarget.value
      var text = val.key
      if (val.target.selectionStart <= 4) {
        return charonly.test(text)
  
      }
      else if (val.target.selectionStart > 4 && val.target.selectionStart <= 8) {
        return numonly.test(text)
  
      }
      else if (val.target.selectionStart == 9) {
        return charonly.test(text)
      }
      else if (fullstring.length > 9) {
        return false;
      }
    }
    charrestrict(val) {
      var key = val.key
      var pattern = /[a-zA-Z0-9]+$/;
      var pattern1 = /[-/_]+$/;
      if (key.match(pattern) || key.match(pattern1)) {
        return true
      }
      else {
        return false
      }
    }
    numberOnly(val) {
      var paterns = /^[0-9]/
      return paterns.test(val.key);
    }
    maskAdharNum( data) {
    
      debugger
      let str = data
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          this.form.controls.POAdocumentNo.patchValue(str, { emitEvent: true })
        }
    }
    showModal() {
      this.filePreiewContent = this.POADocument.doc
      this.filePreiewFilename = this.POADocument.Docname
      this.filePreiewContentType = this.POADocument.Doctype
      this.filePreiewVisible = true;
  }
  showModal1() {
    this.filePreiewContent = this.ResolutionDocument.Resolutiondoc
    this.filePreiewFilename = this.ResolutionDocument.ResolutionDocname
    this.filePreiewContentType = this.ResolutionDocument.ResolutionDoctype
    this.filePreiewVisible = true;
}
disabledFutureDate = (current: Date): boolean => {
  // Can not select days before today and today
  return differenceInCalendarDays(current, this.today) > 0;
};
}
