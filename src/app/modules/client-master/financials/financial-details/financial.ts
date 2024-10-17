import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ClientMasterService } from '../../client-master.service';
import { FindOptions, ValidationService, DataService, UtilService } from "shared";
import { BankDetailsComponent } from '../bank-details/component';
import { NzNotificationService } from 'ng-zorro-antd';
import { InputMasks, InputPatterns } from 'shared';
import { UploadFile } from 'ng-zorro-antd/upload';
import * as  jsonxml from 'jsontoxml'
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
@Component({
  selector: 'financial-details',
  templateUrl: './financial.html',
  styleUrls: ['./financial.less']
})
export class FinancialDetailsComponent implements OnInit, AfterViewInit {
  spin=false;
  inputMasks = InputMasks;
  annualincome: any = [];
  sourceoffund: any = [];
  financialForm: FormGroup
  isvisibleprof_busi: boolean = false;
  isvisiblebusi: boolean = false;
  // isShowderivativeProof:boolean=true;
  clientType: any;
  financialDetails: any = [];
  fileType: string;
  fileList: any = [];
  fileList1: any = [];
  fileList2: any = [];
  fileName: string;
  document: string;
  financialDocument: any;
  balanceSheetDocument: any;
  PandLDocument: any;
  filePreiewContent: any;
  filePreiewFilename: any;
  filePreiewContentType: any;
  filePreiewVisible: boolean;
  HolderDetails: any;
  clientSerialNumber: number;
  derivativeProofsArray: any=[];
  today=new Date();
  initialFillingDone: boolean=false;
  constructor(
    private validServ: ValidationService,
    private fb: FormBuilder,
    private cmServ: ClientMasterService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private utilServ: UtilService,

  ) {
    this.financialForm = fb.group({
      AnnualIncome: [null,[Validators.required]],
      specificAnnInc: [null],
      specificNetWorth: [null],
      networthasOn: [null],
      sourceOfFund: [null, [Validators.required]],
      prof_busi: [null],
      typeOfBusiActivity: [null],
      gst: [null],
      empName: [null],
      empAddress: [null],
      designation: [null],
      gstdate: [null],
      derivativedocuments: [null],
      gststate: [null]

    });
  }
  ngAfterViewInit() {
  }
  ngOnInit() {
    this.financialForm.controls.sourceOfFund.valueChanges.subscribe(val=>{
     
        this.financialForm.controls.prof_busi.patchValue(null)
        this.financialForm.controls.typeOfBusiActivity.patchValue(null)
      
    })
    this.cmServ.clientType.subscribe((val) => {
      this.clientType = val;
    })
    this.cmServ.hoderDetails.subscribe((val) => {
      this.HolderDetails = val
    })

    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val
    })
    this.cmServ.activeTab.subscribe(val => {
      if (val == 2 && this.initialFillingDone==false){
      this.spin=true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientSerialNo:this.clientSerialNumber,
          PAN:this.HolderDetails["FirstHolderpanNumber"]
        }],
      "requestId": "5067"
    }).then((response) => {
      if(response.errorCode==0)
      {
      if (response.results.length > 0) {
        this.annualincome = response.results[0]
        this.sourceoffund = response.results[1]
        this.financialDetails = response.results[2]
        this.initialFillingDone=true
        this.spin=false;
      }
      else{
        this.spin=false
      }
    }
    else{
      this.notif.error(response.errorMsg,'')
      this.spin=false;

    }

    });
  }
})
  }
  // beforeUpload = (file: UploadFile): boolean => {
  //   if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
  //   // this.fileList = [file];
  //     // this.fileType = file.type;
  //     // this.fileName = file.name
  //     this.encodeImageFileAsURL(file);
  //     return false;
  //   } else {
  //     this.notif.error("Please uplaod jpeg/png/pdf", '')
  //     return false
  //   }
  // }
  // beforeUpload = (file: UploadFile,filelist): boolean => {
  //   if(file.type=='application/pdf' || file.type=='image/jpeg' || file.type=='image/png'){
  //       const isLt2M = file.size / 1024 < 100
  //     if (!isLt2M) {
  //       this.notif.error('Image must smaller than 100KB!','',{nzDuration: 60000 })
  //       return false;
  //     }
  //     else{
  //     this.encodeImageFileAsURL(file);   
  //     }
  // }
  //   else{
  //     this.notif.error("Please uplaod jpeg/png/pdf",'',{nzDuration: 60000 })
  //     return false
  //   }
  // }
  beforeUpload = (file: UploadFile): boolean => { 
    if(file.type=='application/pdf' || file.type=='image/jpeg' || file.type=='image/png'){
      const isLt2M = file.size / 1024 < 1500
      if (!isLt2M) {
        this.notif.error('Image must smaller than 1500KB!','',{nzDuration: 30000 })
        return false;
      }
      this.encodeImageFileAsURL(file);
      return false;
    }else{
      this.notif.error("Please uplaod jpeg/png/pdf",'')
      return false
    }
  }
  encodeImageFileAsURL(file){
  let reader = new FileReader();
  reader.onloadend = () => {
    let dataUrl: string = reader.result.toString();
    let document= dataUrl.split(',')[1];
    let docName=''
    this.financialDetails.forEach(element => {
      if(element.Code==this.financialForm.value.derivativedocuments){
        docName=element.FinDetail
      }
    });
  let ss={
      docname:docName,
       type:file.type,
       uid:file.uid,
       size:file.size,
       url:document,
     }
     this.derivativeProofsArray.push(ss)
    }
    reader.readAsDataURL(file);
  }
  Deleterow(i) {
    this.derivativeProofsArray.splice(i, 1)
  }

  beforeUpload1 = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.fileList1 = [file];
      this.encodeImageFileAsURL1(file);
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '',{nzDuration: 60000 })
      return false
    }
  }
  beforeUpload2 = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.fileList2 = [file];
      this.encodeImageFileAsURL2(file);
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '',{nzDuration: 60000 })
      return false
    }
  }
  // encodeImageFileAsURL(file) {
  //   let reader = new FileReader();
  //   reader.onloadend = () => {
  //     let dataUrl: string = reader.result.toString();
  //     this.document = dataUrl.split(',')[1];
  //     this.financialDocument = {
  //       Docname: 'Financial Details',
  //       Doctype: this.fileType,
  //       Docuid: file.uid,
  //       doc: this.document,
  //       Docsize: file.size
  //     }
  //   }
  //   reader.readAsDataURL(file);
  // }
  // encodeImageFileAsURL(file) {
  //   let reader = new FileReader();
  //     reader.onloadend = () => {
  //     let dataUrl: string = reader.result.toString();
  //    let document= dataUrl.split(',')[1];
  //    file.doc=document       
  //   }
  //   reader.readAsDataURL(file);
  // }
  encodeImageFileAsURL1(file) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      this.balanceSheetDocument = {
        Docname: 'Two years balance sheet',
        Doctype: file.type,
        Docuid: file.uid,
        doc: document,
        Docsize: file.size
      }
    }
    reader.readAsDataURL(file);
  }
  encodeImageFileAsURL2(file) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      this.PandLDocument = {
        Docname: 'P and L document',
        Doctype: file.type,
        Docuid: file.uid,
        doc: document,
        Docsize: file.size
      }
    }
    reader.readAsDataURL(file);
  }
  // showModal() {
  //   this.filePreiewContent = this.financialDocument.doc
  //   this.filePreiewFilename = this.financialDocument.Docname
  //   this.filePreiewContentType = this.financialDocument.Doctype
  //   this.filePreiewVisible = true;
  // }
  showModal(file) {
    if(file["originFileObj"]){
         let  file1=file["originFileObj"]
        this.filePreiewContent =file1.doc
        this.filePreiewFilename = file1.name
        this.filePreiewContentType = file1.type
        this.filePreiewVisible = true;
    }
    else{
      this.filePreiewContent =file.doc
      this.filePreiewFilename = file.name
      this.filePreiewContentType = file.type
      this.filePreiewVisible = true
    }
    }

    showModalforDerivativeProof(data){
      this.filePreiewContent = data.url
      this.filePreiewFilename = data.docname
      this.filePreiewContentType = data.type
      this.filePreiewVisible = true;
    }
    getDerivativeProofDetails(){
      let docCode=this.financialForm.value.derivativedocuments;
      if(docCode==null){
        return ''
      }
      let docName=''
      this.financialDetails.forEach(element => {
        if(element.Code==docCode){
          docName=element.FinDetail
        }
      });
      var  totalData=[] 
      let data;
      this.derivativeProofsArray.forEach((element,index) => {
        data={
          docname:docName+(index+1),
          url:element.url,
          size:element.size,
          type:element.type,
          uid:element.uid
      }
        totalData.push(data)
      });
      let jsond = this.utilServ.setJSONArray(totalData);
      let imageXmlData = jsonxml(jsond);
      return imageXmlData
      }

  showModal1() {
    this.filePreiewContent = this.balanceSheetDocument.doc
    this.filePreiewFilename = this.balanceSheetDocument.Docname
    this.filePreiewContentType = this.balanceSheetDocument.Doctype
    this.filePreiewVisible = true;
  }
  showModal2() {
    this.filePreiewContent = this.PandLDocument.doc
    this.filePreiewFilename = this.PandLDocument.Docname
    this.filePreiewContentType = this.PandLDocument.Doctype
    this.filePreiewVisible = true;
  }
  showinput(data) {
    console.log(this.sourceoffund)
    let datafund = this.sourceoffund;
    datafund.forEach(element => {
      if (element.Fund == data) {
        this.isvisibleprof_busi = element.Prof_Busi
        this.isvisiblebusi = element.BusAct
      }
    });
    //   if(data == 'Business income')
    //   {
    //     this.isvisibleprof_busi = true;
    //     this.isvisiblebusi = true;
    //   }
    //   else if(data == 'Professional income'){
    //     this.isvisibleprof_busi = true;
    //     this.isvisiblebusi = false;
    //   }
    //   else
    //   {
    //     this.isvisibleprof_busi = false;
    //     this.isvisiblebusi = false;
    //   }
  }
  //  fillData(){debugger
  //   this.fileList=[]
  //   this.fileList.push(this.financialDocument)
  // }
  validateReqFields() {
    let valid = true
    if (this.isvisibleprof_busi) {
      if (this.financialForm.value.prof_busi) {
        valid = true
      }
      else {
        //  this.financialForm.controls["prof_busi"].markAsTouched()
        //  this.financialForm.controls["prof_busi"].markAsDirty()

        this.notif.error("Please Enter Professional/Business name", '',{nzDuration: 60000 })
        valid = false
      }
    }
    else {
      this.financialForm.value.prof_busi = null
    }
    if (this.isvisiblebusi) {
      if (this.financialForm.value.typeOfBusiActivity) {
        valid = true
      }
      else {
        // this.financialForm.controls["typeOfBusiActivity"].markAsTouched()
        // this.financialForm.controls["typeOfBusiActivity"].markAsDirty()
        this.notif.error("Please Enter Type of business activity", '',{nzDuration: 60000 })
        valid = false
      }
    }
    else {
      this.financialForm.value.typeOfBusiActivity = null
    }
    return valid
  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
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

  charresAndSymboltrict(val) {
    var key = val.key
    var pattern = /[0-9]+$/; 
     var pattern1 = /[.]+$/;
    if (key.match(pattern) || key.match(pattern1)) {
      return true
    }
    else {
      return false
    }
  }
} 