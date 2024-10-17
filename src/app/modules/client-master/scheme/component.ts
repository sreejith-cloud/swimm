import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { InputMasks, InputPatterns, WorkspaceService } from 'shared';

import { ClientMasterService } from '../client-master.service';
import { DataService, UtilService, AuthService, User, FindOptions, ValidationService } from 'shared';
import { NzNotificationService, UploadFile } from 'ng-zorro-antd';
import * as  jsonxml from 'jsontoxml'
import { interval, Subscription } from 'rxjs';
import {schemeValidations} from './schemeValidationConfig'
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'client-master-scheme',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class schemeComponent implements OnInit,AfterViewInit {
  form: FormGroup;
  inputMasks = InputMasks;
  subscriptions: Subscription[] = [];
  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;
  clientSerialNumber: number;
  HolderDetails: any;
  currentUser: User;
  schemeData: any = [];
  scheme: any;
  filteredData: any = [];
  dpClientIdFindopt: FindOptions;
  BankFindopt: FindOptions;
  ClientBankFindopt: FindOptions;
  selectedSchemeDetails: any;
  Dpids: { DPID: string; }[];
  chequeDocument: any = [];
  fileList: any = [];
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  FormControlNames: any = {};
  wsKey: string;
  clientProfileEdit: boolean;
  EntryAccess: any;
  clientIdDetails: any;
  autosaveTiming: any;
  currTabIndex: number;
  bankDetails:any;
  bankDetails1:any;
  dpClientDetails:any;
  clientbankDetails:any;
  customValidationMsgObj=schemeValidations;
  today=new Date();
  spin: boolean;
  schemeFetchingDone: boolean=false;
  constructor(
    private fb: FormBuilder,
    private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private cmServ: ClientMasterService,
    private notif: NzNotificationService,
    private validServ: ValidationService,
    private wsServ: WorkspaceService,
  ) {
    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val
    })
    this.wsServ.activeWorkspace.subscribe((ws) => {
      this.wsKey = ws.title
      if (this.wsKey == 'Client Profile Edit') {
        this.clientProfileEdit = true
      }
    })
    this.cmServ.hoderDetails.subscribe((val) => {
      if (val != undefined) {
        if (Object.keys(val).length === 0) {
          return
        }
        else {
          this.HolderDetails = val
        }
      }
    })
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
      let branch = this.dataServ.branch
      // if(this.EntryAccess==false){
      //   this.ho=true;
      // }
      // else
      // this.ho=false;
    })
    this.form = fb.group({
      scheme: this.createScheme(),
      details: this.createDetails(),
      // cheque: this.createcheque(),
      // holding: this.createholding(),
      // cash: this.createcash(),
      // Bank: this.createBank(),
    });

    this.dpClientIdFindopt = {
      findType: 5021,
      codeColumn: 'DpClientid',
      codeLabel: 'DpClientid',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.BankFindopt = {
      findType: 5008,
      codeColumn: 'Acname',
      codeLabel: 'Acname',
      descColumn: 'Acname',
      descLabel: 'Acname',
      hasDescInput: false,
      requestId: 8,
      // whereClause: "location ='" + this.dataServ.branch + "'"
      whereClause: "1=1"

    }
    this.ClientBankFindopt = {
      findType: 5009,
      codeColumn: 'BANK_NAME',
      codeLabel: 'BANK_NAME',
      descColumn: 'BANK_NAME',
      descLabel: 'BANK_NAME',
      hasDescInput: false,
      requestId: 8,
      // whereClause: "location ='" + this.dataServ.branch + "'"
      whereClause: "1=1"

    }

    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       tab:'SCHM',
    //     }],
    //   "requestId": "5034",
    //   "outTblCount": "0"
    // }).then((response) => {
    //   if (response.results) {
    //    this.customValidationMsgObj=response.results[0]
    //   }
    // })
    
  }
  createScheme() {
    return this.fb.group({
      schemeType: [null, [Validators.required]],
      SchemeName: [null, [Validators.required]],
      SchemeCode: [null, [Validators.required]],
      schemeSubType: [null, [Validators.required]],
    })
  }
  createDetails() {
    return this.fb.group({
      ChequeNo: [null],
      ChequeDate: [null],
      Amount: [0],
      BankName: [null],
      ClientBankName: [null],
      BankAccountNumber: [null],
      ClientBankAccountNumber: [null],
      DpId: [null],
      DPClientId: [null],
      Remark: [null],
    })
  }
  // createholding() {
  //   return this.fb.group({
  //     DpId: [null, [Validators.required]],
  //     DPClientId: [null, [Validators.required]],
  //   })
  // }

  // createcash() {
  //   return this.fb.group({
  //     Amount: [null, [Validators.required]],
  //     Remark: [null, [Validators.required]],


  //   })
  // }
  // createBank() {
  //   return this.fb.group({
  //     BankName: [null, [Validators.required]],
  //     BankAccountNumber: [null, [Validators.required]],
  //     ChequeNo: [null, [Validators.required]],
  //     ChequeDate: [null, [Validators.required]],
  //     Amount: [null, [Validators.required]],
  //     Remark: [null, [Validators.required]],
  //   })
  // }
  subtypeChange(val) {
    let detailsForm: any = this.form.controls.details
    if (val == null) {
      // detailsForm.reset()
      return
    }
    if (val != null) {
      detailsForm.controls.ChequeNo.patchValue(null)
      detailsForm.controls.ChequeDate.patchValue(null)
      detailsForm.controls.Amount.patchValue(0)
      detailsForm.controls.BankName.patchValue(null)
      detailsForm.controls.BankAccountNumber.patchValue(null)
      detailsForm.controls.DpId.patchValue(null)
      detailsForm.controls.DPClientId.patchValue(null)
      detailsForm.controls.Remark.patchValue(null)
      detailsForm.controls.ClientBankName.patchValue(null)
      detailsForm.controls.ClientBankAccountNumber.patchValue(null)
      this.chequeDocument = []
      this.fileList = []
      this.bankDetails=null
      this.dpClientDetails=null
      this.bankDetails1=null
      this.clientbankDetails=null
      
      if (val == 'C') {
        detailsForm.controls.ChequeNo.setValidators(Validators.required)
        detailsForm.controls.ChequeDate.setValidators(Validators.required)
        detailsForm.controls.Amount.setValidators(Validators.required)
        detailsForm.controls.BankName.setValidators(Validators.required)
        detailsForm.controls.BankAccountNumber.setValidators(Validators.required)

        detailsForm.controls.DpId.setValidators(null)
        detailsForm.controls.DPClientId.setValidators(null)
        detailsForm.controls.Remark.setValidators(null)
         detailsForm.controls.ClientBankName.setValidators(null)
         detailsForm.controls.ClientBankAccountNumber.setValidators(null)
        detailsForm.controls.ClientBankAccountNumber.setValidators(null)

        detailsForm.controls.ChequeNo.updateValueAndValidity()
        detailsForm.controls.ChequeDate.updateValueAndValidity()
        detailsForm.controls.Amount.updateValueAndValidity()
        detailsForm.controls.BankName.updateValueAndValidity()
        detailsForm.controls.BankAccountNumber.updateValueAndValidity()
        detailsForm.controls.DpId.updateValueAndValidity()
        detailsForm.controls.DPClientId.updateValueAndValidity()
        detailsForm.controls.Remark.updateValueAndValidity()
        detailsForm.controls.ClientBankName.updateValueAndValidity()
        detailsForm.controls.ClientBankAccountNumber.updateValueAndValidity()

        // ChequeNo: [null],
        // ChequeDate: [null],
        // Amount: [null],
        // BankName: [null],
        // BankAccountNumber: [null],
        // DpId: [null],
        // DPClientId: [null],
        // Remark: [null],
      }
      if (val == 'H') {
        detailsForm.controls.ChequeNo.setValidators(null)
        detailsForm.controls.ChequeDate.setValidators(null)
        detailsForm.controls.Amount.setValidators(null)
        detailsForm.controls.BankName.setValidators(null)
        detailsForm.controls.BankAccountNumber.setValidators(null)
        detailsForm.controls.ClientBankAccountNumber.setValidators(null)
        detailsForm.controls.DPClientId.setValidators(Validators.required)
        detailsForm.controls.DpId.setValidators(Validators.required)
        detailsForm.controls.Remark.setValidators(null)
        detailsForm.controls.ClientBankName.setValidators(null)

        detailsForm.controls.ChequeNo.updateValueAndValidity()
        detailsForm.controls.ChequeDate.updateValueAndValidity()
        detailsForm.controls.Amount.updateValueAndValidity()
        detailsForm.controls.BankName.updateValueAndValidity()
        detailsForm.controls.BankAccountNumber.updateValueAndValidity()
        detailsForm.controls.DpId.updateValueAndValidity()
        detailsForm.controls.DPClientId.updateValueAndValidity()
        detailsForm.controls.Remark.updateValueAndValidity()
        detailsForm.controls.ClientBankName.updateValueAndValidity()
        detailsForm.controls.ClientBankAccountNumber.updateValueAndValidity()

      }
      if (val == 'Cash') {
        detailsForm.controls.ChequeNo.setValidators(null)
        detailsForm.controls.ChequeDate.setValidators(null)
        detailsForm.controls.Amount.setValidators(Validators.required)
        detailsForm.controls.BankName.setValidators(null)
        detailsForm.controls.BankAccountNumber.setValidators(null)
        detailsForm.controls.DpId.setValidators(null)
        detailsForm.controls.ClientBankAccountNumber.setValidators(null)
        detailsForm.controls.DPClientId.setValidators(null)
        detailsForm.controls.Remark.setValidators(Validators.required)
        detailsForm.controls.ClientBankName.setValidators(null)

        detailsForm.controls.ChequeNo.updateValueAndValidity()
        detailsForm.controls.ChequeDate.updateValueAndValidity()
        detailsForm.controls.Amount.updateValueAndValidity()
        detailsForm.controls.BankName.updateValueAndValidity()
        detailsForm.controls.BankAccountNumber.updateValueAndValidity()
        detailsForm.controls.DpId.updateValueAndValidity()
        detailsForm.controls.DPClientId.updateValueAndValidity()
        detailsForm.controls.Remark.updateValueAndValidity()
        detailsForm.controls.ClientBankName.updateValueAndValidity()
        detailsForm.controls.ClientBankAccountNumber.updateValueAndValidity()
      }
      if (val == 'B') {
        detailsForm.controls.ChequeNo.setValidators(Validators.required)
        detailsForm.controls.ChequeDate.setValidators(Validators.required)
        detailsForm.controls.Amount.setValidators(Validators.required)
        detailsForm.controls.BankName.setValidators(Validators.required)
        detailsForm.controls.ClientBankName.setValidators(Validators.required)
        detailsForm.controls.BankAccountNumber.setValidators(Validators.required)
        detailsForm.controls.ClientBankAccountNumber.setValidators(Validators.required)
        detailsForm.controls.DpId.setValidators(null)
        detailsForm.controls.DPClientId.setValidators(null)
        detailsForm.controls.Remark.setValidators(Validators.required)

        detailsForm.controls.ChequeNo.updateValueAndValidity()
        detailsForm.controls.ChequeDate.updateValueAndValidity()
        detailsForm.controls.Amount.updateValueAndValidity()
        detailsForm.controls.BankName.updateValueAndValidity()
        detailsForm.controls.BankAccountNumber.updateValueAndValidity()
        detailsForm.controls.DpId.updateValueAndValidity()
        detailsForm.controls.DPClientId.updateValueAndValidity()
        detailsForm.controls.Remark.updateValueAndValidity()
        detailsForm.controls.ClientBankName.updateValueAndValidity()
        detailsForm.controls.ClientBankAccountNumber.updateValueAndValidity()

      }
    }
  }
  ngOnInit() {
    // this.getDpid()
    this.cmServ.isEntryAccess.subscribe((val) => {
      this.EntryAccess = val
    })
    this.cmServ.clientIdDetails.subscribe(val => {
      this.clientIdDetails = val
      console.log(val)
    })
    this.cmServ.autoSaveTiming.subscribe(val => {
      this.autosaveTiming = val
    })
    this.cmServ.lastActivateTabIndex.subscribe(val => {
      this.currTabIndex = val;
    })

    this.subscriptions.push(interval(this.autosaveTiming).subscribe(x => {
      if (this.EntryAccess == false || this.currTabIndex != 5 || this.clientProfileEdit) {
        return
      }
      else {
        // this.modal.closeAll()
        // this.showConfirm()
        this.saveToTemprary()
      }
    }))

    let form: any = this.form.controls.scheme;

    form.controls.SchemeName.valueChanges.subscribe(val => {
      if (val == null) {
        this.filteredData=[]
        form.controls.SchemeCode.patchValue(null)
        return
      }
 
    
      let data = val.toUpperCase()
      this.filteredData = this.schemeData.filter((ele) => {
        return ele.SchemeName.startsWith(data)
      })
        let result=null
        result=this.schemeData.find(ele=>{
         return ele.SchemeName.toUpperCase()==val.toUpperCase()
       })
       if(result){
         form.controls.SchemeCode.patchValue(result.SchemeCode)
       }
       else{
        form.controls.SchemeCode.patchValue(null)
       }
    
    })

    form.controls.schemeType.valueChanges.subscribe(val => {
      form.controls.schemeSubType.patchValue(null)
      this.filteredData = []
      form.controls.SchemeName.patchValue(null)
      form.controls.SchemeCode.patchValue(null)
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray": [{
          SchemeID: 0,
          SchemeType: form.value.schemeType
        }],
        "requestId": "5101",
        "outTblCount": "0"
      }).then((response) => {
        if (response.results.length) {
          this.schemeData = response.results[0]
          console.log(this.schemeData)
        }
      })
      // this.fileList=[]
      // this.chequeDocument=[]
    })
  }
  
//   ss(){
//     let form: any = this.form.controls.scheme;
// form.controls.SchemeName.patchValue('ALEMBIC LTD')
//   }
  // selectScheme(val){
  //   let form: any = this.form.controls.scheme;
  //   if (val == null) {
  //     form.controls.SchemeCode.patchValue(null)
  //     return
  //   }
  //   let data = val.toUpperCase()
  //   let filteredData = this.schemeData.filter((ele) => {
  //     return ele.SchemeName.includes(data)
  //   })
  //   form.controls.SchemeCode.patchValue(filteredData[0].SchemeCode)
  // }

  //   fetchData(val){
  //     this.dataServ.getResultArray({
  //       "batchStatus": "false",
  //       "detailArray": [{
  //         SchemeID:val.SchemeCode,
  //         SchemeType :val.SchemeType
  //       }],
  //       "requestId": "5101",
  //       "outTblCount": "0"
  //     }).then((response) => {
  //     if(response.results.length){
  //       this.selectedSchemeDetails=response.results[0][0]
  //   }
  // })
  //   }
  // fetchData(val) {debugger
  //   let form: any = this.form.controls.scheme;
  //   form.controls.SchemeCode.patchValue(val.SchemeCode)
  // }
  // patchData(val) {debugger
  //   alert()
  //   let form: any = this.form.controls.scheme;
  //   form.controls.SchemeCode.patchValue(val)
  // }
  // fetchData1(val){
  //   let form:any=this.form.controls.cash;
  //   form.controls.SchemeCode.patchValue(val.SchemeCode)
  // }
  // fetchData2(val){
  //   let form:any=this.form.controls.Bank;
  //   form.controls.SchemeCode.patchValue(val.SchemeCode)
  // }
  bindDpClientid(val) {
    let form: any = this.form.controls.details;
    if (val == null || val == undefined) {
      form.controls.DpId.patchValue(null)
      return
    }
    if (typeof (val) == 'object') {
      form.controls.DPClientId.patchValue(val.DpClientid)
      form.controls.DpId.patchValue(val.dpid)
    }
  }
  getBankDetails(val) {
    let form: any = this.form.controls.details;
    if (val == null || val == undefined) {

      form.controls.BankAccountNumber.patchValue(null)
      return
    }
    if (typeof (val) == 'object') {
      form.controls.BankName.patchValue(val.Acname)
      form.controls.BankAccountNumber.patchValue(val.AccountCode)
    }
  }
  getClientBankDetails(val) {
    let form: any = this.form.controls.details;
    if (val == null || val == undefined) {
      return
    }
    if (typeof (val) == 'object') {
      form.controls.ClientBankName.patchValue(val.BANK_NAME)
    }
  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };
  getBankDetailsinChequeType(val) {
    let form1: any = this.form.controls.details;
    if (val == null || val == undefined) {

      form1.controls.BankAccountNumber.patchValue(null)
      return
    }
    if (typeof (val) == 'object') {
      form1.controls.BankName.patchValue(val.Acname)
      form1.controls.BankAccountNumber.patchValue(val.AccountCode)
    }
  }
  getDpid() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 1
        }],
      "requestId": "3"
    }).then((response) => {
      let res;
      if (response) {
        if (response[0].rows.length > 0) {
          var ar = [{ DPID: '' }];
          this.Dpids = ar.concat(this.utilServ.convertToObject(response[0]));
        }
      }
    });
  }
  getFilterdData(val) {
    if (val == null) {
      this.filteredData = []
      return
    }
    let data = val.toUpperCase()
    this.filteredData = this.schemeData.filter((ele) => {
      return ele.SchemeName.startsWith(data)
    })
  }
  beforeUpload = (file: UploadFile): boolean => {
    debugger
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.encodeImageFileAsURL(file);
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '', { nzDuration: 60000 })
      return false
    }
  }
  encodeImageFileAsURL(file) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      if (this.chequeDocument.length < 3) {
        this.chequeDocument.push({
          chequeDocname: 'Trading cheque',
          // chequeDoctype:this.fileType,file.type
          chequeDoctype: file.type,
          chequeDocuid: file.uid,
          chequeDocsize: file.size,
          chequeDocdoc: document
        })
      }
      else {
        this.notif.error('Limit exceed!', '', { nzDuration: 30000 })
      }
    }
    reader.readAsDataURL(file);
  }
  DeleteProofrow(index) {
    this.chequeDocument.splice(index, 1)
    // this.BankProofFile.splice(index, 1)
  }
  showModal(data) {
    this.filePreiewContent = data.chequeDocdoc
    this.filePreiewFilename = data.chequeDocname
    this.filePreiewContentType = data.chequeDoctype
    this.filePreiewVisible = true;
  }

  next() {
    this.spin=true;

    // this.cmServ.activeTabIndex.next(6);
    // this.cmServ.trigerIU.next(true)
    let isValid1 = this.validServ.validateForm(this.form.controls.scheme, this.FormControlNames,this.customValidationMsgObj.MasterForm);
    if (!isValid1) {
    this.spin=false;
      return
    }
    let form: any = this.form.controls.scheme;
    let type = form.value.schemeType
    let schemeSubtype = form.value.schemeSubType

    let Xmldata = ''
    var chequeDocumentXml = ''

    let isValid = this.validServ.validateForm(this.form.controls.details, this.FormControlNames,this.customValidationMsgObj.Details);
    if(!isValid){
    this.spin=false;
      return
    }
    if (isValid) {
      if(schemeSubtype == 'C'){
        if(Number(this.form.controls.details.value.Amount)<10000){
          this.notif.remove()
          this.notif.error("Please enter cheque amount 10000 or above",'',{nzDuration:60000})
          this.spin=false;
          return
        }
      }

      if (schemeSubtype == 'C' || schemeSubtype == 'B') {
        if (this.chequeDocument.length == 0) {
          this.notif.remove()
          this.notif.error("Please upload cheque", '')
        this.spin=false;
          return
        }
        else {
          console.log(this.chequeDocument)
          var chequeJsonData = this.utilServ.setJSONArray(this.chequeDocument);
          chequeDocumentXml = jsonxml(chequeJsonData);
          chequeDocumentXml = chequeDocumentXml.replace(/&/gi, '#||')
          console.log(chequeDocumentXml)
        }
      }

      let data: any = []
      let totalData = { ...this.form.controls.scheme.value, ...this.form.controls.details.value }
      data.push(totalData)
      var JSONData = this.utilServ.setJSONArray(data);
      Xmldata = jsonxml(JSONData);
      Xmldata = Xmldata.replace(/&/gi, '#||')
      console.log(Xmldata)

    }
    this.notif.remove()

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientSerialno: this.clientSerialNumber,
          Pan: this.HolderDetails["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          XML_SchemeDetails: Xmldata,
          XML_ImageDetails: chequeDocumentXml,
          AutoSave: 'N',
          Flag: this.clientProfileEdit ? 'P' : 'A'
        }],
      "requestId": "5017",
      "outTblCount": "0"
    }).then((response) => {
      if(response.errorCode==0)
      {
      let details = response.results[0][0]
      if (details.ErrorCode == 0) {
        this.notif.success(details.Msg, '',{nzDuration: 30000 });
            this.cmServ.activeTabIndex.next(6);
            this.cmServ.trigerIU.next(true)
    this.spin=false;

      }
      else {
        this.notif.error(details.Msg, '',{nzDuration: 30000 })
    this.spin=false;

      }
    }else{
      this.notif.error(response.errorMsg, '')
    this.spin=false;

    }
    })
  }

  saveToTemprary() {
    // this.cmServ.trigerIU.next(true)
    //  let isValid1 = this.validServ.validateForm(this.form.controls.scheme, this.FormControlNames);
    //  if (!isValid1) {
    //    return
    //  }
    let form: any = this.form.controls.scheme;
    let type = form.value.schemeType
    let schemeSubtype = form.value.schemeSubType

    let Xmldata = ''
    var chequeDocumentXml = ''

    //  let isValid = this.validServ.validateForm(this.form.controls.details, this.FormControlNames);
    //  if (isValid) {
    // if (schemeSubtype == 'C' || schemeSubtype == 'B') {
    //   if (this.chequeDocument.length == 0) {
    //     this.notif.error("Please upload cheque", '')
    //     return
    //   }
    //   else {
        if(this.chequeDocument.length){
        var chequeJsonData = this.utilServ.setJSONArray(this.chequeDocument);
        chequeDocumentXml = jsonxml(chequeJsonData);
        chequeDocumentXml = chequeDocumentXml.replace(/&/gi, '#||')
        console.log(chequeDocumentXml)
      }
    // }
    let data: any = []
    let totalData = { ...this.form.controls.scheme.value, ...this.form.controls.details.value }
    data.push(totalData)
    var JSONData = this.utilServ.setJSONArray(data);
    Xmldata = jsonxml(JSONData);
    Xmldata = Xmldata.replace(/&/gi, '#||')
    console.log(Xmldata)

    //  }
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientSerialno: this.clientSerialNumber,
          Pan: this.HolderDetails["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          XML_SchemeDetails: Xmldata,
          XML_ImageDetails: chequeDocumentXml,
          AutoSave: 'Y',
          Flag: this.clientProfileEdit ? 'P' : 'A'
        }],
      "requestId": "5017",
      "outTblCount": "0"
    }).then((response) => {
      if(response.errorCode==0)
      {
      let details = response.results[0][0]
      if (details.ErrorCode == 0) {
        // this.notif.success(details.Msg, '',{nzDuration: 30000 });
      }
      else {
        // this.notif.error(details.Msg, '',{nzDuration: 30000 })
      }
    }else{
      this.notif.error(response.errorMsg, '')
    }
    })
  }
  ngAfterViewInit(){
     this.cmServ.activeTab.subscribe(val => {
      if (val == 5&& this.schemeFetchingDone==false){
        this.spin=true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          // ClientSerialNo:this.clientSerialNumber,
          // PAN:this.HolderDetails.FirstHolderpanNumber
          Tab: 'SCHEME',
          PAN: this.HolderDetails.FirstHolderpanNumber || '',
          Flag: this.clientProfileEdit ? 'P' : 'A',
          Euser: this.currentUser.userCode,
          ClientSerialNo: this.clientSerialNumber || '',
          DPID: '',
          ClientID: this.clientIdDetails["FirstHolderClientID"] || ''
        }],
      "requestId": "5065"
    }).then((response) => {
      console.log('schemestabFetch',response.results)
      if (response.results.length > 0) {
        let form:any=this.form.controls;
    
        if (response.results[0].length > 0) {
          this.subtypeChange(response.results[0][0].schemeSubType)
          form.scheme.patchValue(response.results[0][0])
          setTimeout(() => {
          form.scheme.controls.SchemeCode.patchValue(response.results[0][0].SchemeCode)
          }, 100);
        }
        if (response.results[1].length > 0) {
          form.details.patchValue(response.results[1][0])
          this.bankDetails={Acname:response.results[1][0].BankName}
          this.bankDetails1={Acname:response.results[1][0].BankName}
          this.dpClientDetails={DpClientid:response.results[1][0].DPClientId}
          this.clientbankDetails={BANK_NAME:response.results[1][0].ClientBankName}
    
        }
        if (response.results[2].length > 0) {
          this.chequeDocument=response.results[2]
          // this.fileList=response.results[2]
        }
        this.spin=false
        this.schemeFetchingDone=true;
      }
      else{
        this.spin=false
      }
  })
}
})
}
    
}
