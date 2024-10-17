import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, RequiredValidator } from '@angular/forms';
import { UploadFile } from 'ng-zorro-antd/upload';

import { ClientMasterService } from '../../client-master.service';
import { DataService, ValidationService } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { InputMasks, InputPatterns } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'trading-general',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class GeneralDetailsComponent implements OnInit {
  inputMasks = InputMasks;
  form: FormGroup;
  clientType: string;
  spin:boolean=false;
  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;
  isShowFOandCDS: boolean = true;
  isShowFOandCDS1: boolean;
  clientSerialNumber: number;
  holderdetails: any;
  membershipData: any = [];
  totalData: any = [];
  newData: any = [];
  dpArray: any = [];
  dpIds: any = [];


  fileType: string;
  fileList: any = [];
  fileName: string;
  document: string;
  CMLdocument: any = [];
  filePreiewContent: any;
  filePreiewFilename: any;
  filePreiewContentType: any;
  filePreiewVisible: boolean;
  TotalDPIds1: any = [];
  depositroryForm: any;
  generalDetails: any;
  today = new Date()
  OtherDpList: any = []
  otherDPButton: any = "Add"
  otherdpindex: any;
  OutsideDpObj: any;
  spCallDone: boolean=false;
  tradingOnly: boolean;
  isGeojitEmp: boolean;

  constructor(
    private dataServ: DataService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private validServ: ValidationService,
    private notif: NzNotificationService,
    private cmServ: ClientMasterService,
  ) {

    this.form = fb.group({
      generalDetials: this.creategenralDetials(),
      depositoryDetials: this.createdpDetials()
    })
  }

  ngOnInit() {
    let depositoryForm: any = this.form.controls.depositoryDetials

    this.ngZone.run(() => {
      this.cmServ.hoderDetails.subscribe((val) => {
        this.holderdetails = val
        console.log(this.holderdetails);
      })

      this.cmServ.clientType.subscribe((val) => {
        this.clientType = val;
      })
      this.cmServ.clientSubType.subscribe(val => {
        if (val == 'NRE' || val == "NROCM")
          this.isShowFOandCDS = false;
        else {
          this.isShowFOandCDS = true
        }
      })
      
      let generalForm: any = this.form.controls.generalDetials
      generalForm.controls.declaration.valueChanges.subscribe(val=>{
        if(val==null){
          generalForm.controls.dateOfDeclaration.patchValue(null)
        }
      })
      generalForm.controls.ifGeojitEmployee.valueChanges.subscribe(res => {
        if (res == 'YES') {
          this.membershipData.forEach(element => {
            if (element.SegmentType == "CDS") {
              element.checked = false
            }
            if (element.SegmentType == "FO") {
              element.checked = false
            }
            if (element.SegmentType == "COM") {
              element.checked = false
            }
          });
        }
        else {
          this.isShowFOandCDS1 = true
        }
      })
      depositoryForm.controls.DPName.valueChanges.subscribe(res => {
        if (res == null) {
          depositoryForm.controls.DPClientID.setValidators(null)
          depositoryForm.controls.DPClientID.updateValueAndValidity()
        }
        depositoryForm.controls.DPClientID.patchValue(null)

        //  if(res=='CDSL'){
        //    depositoryForm.controls.DPClientID.patchValue(null)
        //     depositoryForm.controls.DPClientID.setValidators(Validators.maxLength(16))
        //     depositoryForm.updateValueAndValidity()
        //  }
        //  if(res=='NSDL'){
        //    depositoryForm.controls.DPClientID.patchValue(null)
        //   depositoryForm.controls.DPClientID.setValidators(Validators.maxLength(8))
        //   depositoryForm.updateValueAndValidity()

        //  }
      })

      //  generalForm.controls.isAccountThroughFreeScheme.valueChanges.subscribe(res=>{
      //   if(res=='YES'){ 
      //     generalForm.controls.RecieptNO.setValidators([Validators.required])
      //     generalForm.controls.VoucherId.setValidators(null)
      //     generalForm.controls["RecieptNO"].updateValueAndValidity();
      //     generalForm.controls["VoucherId"].updateValueAndValidity();
      //     generalForm.controls.VoucherId.patchValue(null)

      //   }
      //   else{
      //     generalForm.controls.VoucherId.setValidators([Validators.required])
      //     generalForm.controls.RecieptNO.setValidators(null)
      //     generalForm.controls["RecieptNO"].updateValueAndValidity();
      //     generalForm.controls["VoucherId"].updateValueAndValidity();
      //     generalForm.controls.RecieptNO.patchValue(null)

      //   }
      // })

      this.cmServ.clientSerialNumber.subscribe(val => {
        this.clientSerialNumber = val
      })

    })
    this.cmServ.activeTab.subscribe(val => {
      if (val == 3) {
        this.spin=true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              SerialNo: this.clientSerialNumber,
              PAN: this.holderdetails["FirstHolderpanNumber"],
            }],
          "requestId": "5019",
          "outTblCount": "0"
        }).then((response) => {
          console.log(response.results)
          if (response.results) {
            debugger
            let generalForm: any = this.form.controls.generalDetials
            let dpform: any = this.form.controls.depositoryDetials
            if (response.results[0].length > 0) {
              let generalDetails = response.results[0][0]
              this.generalDetails=response.results[0][0]
              this.tradingOnly=this.generalDetails.TradingOnlyAc
              this.isGeojitEmp=this.generalDetails.IsGeojitEmp
             
              if(this.tradingOnly){
                dpform.controls.LinkingofotherDPs.patchValue(true)
                dpform.controls.LinkingofotherDPs.updateValueAndValidity()
              }
          
              generalForm.patchValue(generalDetails)
              this.cmServ.generalDetails.next(generalDetails)
              this.cmServ.isDerivativeFinDocUploaded.next(generalDetails.DerivativeFinDoc)
            }
        
            if(this.spCallDone){
              if(this.isGeojitEmp){
                generalForm.controls.ifGeojitEmployee.patchValue("YES")
              }
              else{
                generalForm.controls.ifGeojitEmployee.patchValue("NO")
              }  
            this.spin=false;
              return 
            }
            this.membershipData = response.results[1]
            this.createMembership(response.results[1])
            this.dpArray = response.results[2]
            this.cmServ.introducerDetails.next(response.results[3])
            this.cmServ.nomineeRelation.next(response.results[4])
            this.cmServ.nomineeIdProof.next(response.results[5])
            this.cmServ.nachFrequency.next(response.results[6])
            this.cmServ.POAidentityProof.next(response.results[7])
            this.cmServ.nachType.next(response.results[9])
            this.cmServ.kycReceivedType.next(response.results[10])
            this.cmServ.nachBanks.next(response.results[11])
            this.cmServ.isTradingFetch.next(true)
            this.spCallDone=true;
            this.spin=false;

          }
          else{
        this.spin=false;
          }
        })
      }
    })

    //  this.depositroryForm=this.form.controls.depositoryDetials
    //     this.depositroryForm.controls.DPID.valueChanges.subscribe(val=>{    
    //       this.dpIds=[]
    //       if(val==null){
    //         this.depositroryForm.controls.primaryDP.patchValue(null)
    //       }
    //       if(val.length>0){
    //         this.dpIds.push(val)
    //       }
    //       this.TotalDPIds1=[...this.TotalDPIds1,...this.dpIds]

    //     })
  }

  createMembership(data) {
    let generalForm: any = this.form.controls.generalDetials
    this.totalData = data
    this.newData = []
    // for(var j=0;j<this.totalData.length;j++){    
    //   let dsData=[];
    let type = this.totalData[0].SegmentType;
    var obj = [];
    for (var i = 0; i < this.totalData.length; i++) {
      if (type == this.totalData[i].SegmentType) {
        obj.push(this.totalData[i])
      }
      else {
        this.newData.push(obj);
        obj = [];
        obj.push(this.totalData[i]);
        type = this.totalData[i].SegmentType;
      }
    }
    this.newData.push(obj)
    this.totalData = this.newData;
    console.log('membership data')
    if(this.isGeojitEmp){
      generalForm.controls.ifGeojitEmployee.patchValue("YES")
    }
    else{
      generalForm.controls.ifGeojitEmployee.patchValue("NO")
    }  

  }
  creategenralDetials() {
    return this.fb.group({
      serialNO: [null],
      tradeCode: [null],
      tradingAcHolder: [null],
      Name: [null],
      riskCountry: [null],
      AccType: [null],
      disCharge: [null],
      declaration: [null],
      dateOfDeclaration: [null],
      kitNO: [null, [Validators.required]],
      confirmKitNO: [null, [Validators.required]],
      // isAccountThroughFreeScheme:[null,[Validators.required]],
      // VoucherId:[null],
      // RecieptNO:[null],
      ifGeojitEmployee: [null]

    })

  }
  confirmCheck() {
    let val = this.checkKitNO();
    if (val == false) {
      this.notif.error("KIT NO and confirm KITNO Should exactly match", '')

    }
  }
  checkKitNO() {
    let form: any = this.form.controls.generalDetials;
    if (form.value.kitNO == form.value.confirmKitNO) {
      return true
    }
    else
      return false

  }
  beforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      // this.fileList = [file];
      // this.fileType = file.type;
      // this.fileName = file.name
      this.encodeImageFileAsURL(file);
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }


  encodeImageFileAsURL(file) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      this.document = dataUrl.split(',')[1];
      debugger
      if (this.CMLdocument.length < 3) {
        this.CMLdocument.push({
          Docname: 'cml upload',
          Doctype: file.type,
          Docuid: file.uid,
          doc: this.document,
          Docsize: file.size
        })
      }
      else {
        this.notif.error('Maximum 3 CML Document can be uploaded', '')
      }
    }
    reader.readAsDataURL(file);
  }

  showModal(data) {
    debugger
    this.filePreiewContent = data.doc
    this.filePreiewFilename = data.Docname
    this.filePreiewContentType = data.Doctype
    this.filePreiewVisible = true;
  }

  createdpDetials() {
    return this.fb.group({
      LinkingofotherDPs: [false],
      // ParticipantName: [null],
      DPName: [null],
      // ClientName: [null],
      DPID: [null],
      DPClientID: [null],
      primaryDP: [null]
    })
  }
  // getDPId(data) {
  //   this.depositroryForm = this.form.controls.depositoryDetials
  //   let index = -1;
  //   if (data == null) {
  //     this.depositroryForm.controls.primaryDP.patchValue(null)
  //   }
  //   let obj = { id: 9999, DPID: data }
  //   for (let i = 0; i < this.TotalDPIds1.length; i++) {
  //     if (this.TotalDPIds1[i].id == 9999) {
  //       this.TotalDPIds1.splice(1, i)
  //       this.depositroryForm.controls.primaryDP.patchValue(null)
  //       index = i
  //     }
  //   }
  //   if (index > -1) {
  //     this.TotalDPIds1[index] = obj
  //   }
  //   else {
  //     this.TotalDPIds1.push(obj)
  //   }
  // }
  addDP(item) {
    let index=-1;
    this.TotalDPIds1.forEach((element,i )=> {
      if(element.DPID==item)
      index=i
    });
    setTimeout(() => {
      if (index > -1) {
        if(item.DPName=='NSDL')
        this.TotalDPIds1[index]=({ id:item.DPClientID, DPID: item.DPID+'-'+item.DPClientID })
  
        if(item.DPName=='CDSL')
        this.TotalDPIds1[index]=({ id:item.DPClientID, DPID:item.DPClientID })
  
        // this.TotalDPIds1[index]=({ id: item, DPID: item })
      }
      else {
        if(item.DPName=='NSDL')
      this.TotalDPIds1.push({ id:item.DPClientID, DPID: item.DPID+'-'+item.DPClientID })

      if(item.DPName=='CDSL')
      this.TotalDPIds1.push({ id:item.DPClientID, DPID:item.DPClientID })

      } 
    });
  }
  RemoveDP(item) {debugger
    if (this.TotalDPIds1.length) {
      let index=-1;
      this.TotalDPIds1.forEach((element,i )=> {
        if(element.id == item.DPClientID)
        index=i
      });
      // let index = this.TotalDPIds1.indexOf((o) => {
      //   o.DPID == item
      // })
      setTimeout(() => {
        if (index > -1) {
          this.TotalDPIds1.splice(index, 1)
        }
      });
   
    }
    
  }
  createDpIds(element) {debugger
    let index=-1;
    let dpform: any = this.form.controls.depositoryDetials
    if (element.checked) {
      if(element.DPName=='NSDL')
      this.TotalDPIds1.push({ id:element.DPClientID, DPID: element.DPID+'-'+element.DPClientID })

      if(element.DPName=='CDSL')
      this.TotalDPIds1.push({ id:element.DPClientID, DPID:element.DPClientID })

    }
    else {
    this.TotalDPIds1.forEach((o,i )=> {
      if(o.id == element.DPClientID)
         index=i
    });
    dpform.controls.primaryDP.patchValue(null)
      if (index > -1) {
        this.TotalDPIds1.splice(index, 1)
      }

    }
  }
  depositoryData() {
    let depositoryData = [];
    if (this.dpArray.length) {
      this.dpArray.forEach(element => {
        if (element.checked) {
          depositoryData.push(element)
        }
      });
    }
    // depositoryData.push({"otherDps":this.OtherDpList})
    // depositoryData.push(this.form.controls.depositoryDetials.value)
    return depositoryData
  }
  membershipSelected(item) {
    this.cmServ.membership.next(this.membershipData)
    let isCOMselected = false;
    let isFOselected = false;
    //  debugger;
    //  if(item.SegmentType=='COM'||item.SegmentType=='CDS'||item.SegmentType=='FO'){
    //    if(!this.generalDetails.DerivativeFinDoc){
    //     this.notif.error("Please Upload Financial Details Proofs for Derivative Client in Financial Tab",'',{nzDuration: 60000 })
    //    }
    //  }
    if (item.SegmentType == 'COM') {
      this.membershipData.forEach(element => {
        if (element.SegmentType == "COM" && element.checked == true) {
          isCOMselected = true
          this.cmServ.isCOMselected.next(true)
        }
        if (element.SegmentType == "COM" && element.checked == false) {
          if (!isCOMselected)
            this.cmServ.isCOMselected.next(false)
        }
      });
    }
    if (item.SegmentType == 'FO') {
      if (item.SegmentType == 'FO') {
        this.membershipData.forEach(element => {
          if (element.SegmentType == "FO" && element.checked == true) {
            isCOMselected = true
            this.cmServ.isFOselected.next(true)
          }
          if (element.SegmentType == "FO" && element.checked == false) {
            if (!isCOMselected)
              this.cmServ.isFOselected.next(false)
          }
        });
      }
    }
  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  AddDpTOList(action) {
    debugger

    let dpform: any = this.form.controls.depositoryDetials

    // if (dpform.controls.ParticipantName.value == '' || dpform.controls.ParticipantName.value == null) {
    //   this.notif.error('Please fill participant Name', '')
    //   return
    // }
    if (dpform.controls.DPName.value == '' || dpform.controls.DPName.value == null) {
      this.notif.error('Please fill DP Name Name', '')
      return
    }
    // if (dpform.controls.ClientName.value == '' || dpform.controls.ClientName.value == null) {
    //   this.notif.error('Please fill Client Name ', '')
    //   return
    // }
    if (dpform.controls.DPID.value == '' || dpform.controls.DPID.value == null) {
      this.notif.error('Please fill DP Id ', '')
      return
    }
    if (dpform.controls.DPClientID.value == '' || dpform.controls.DPClientID.value == null) {
      this.notif.error('Please fill DP Client Id ', '')
      return
    }
    if (!this.CMLdocument.length) {
      this.notif.error('Please Upload CML DOC', '')
      return
    }

    
    if (action == 'Update') {
      let dpform: any = this.form.controls.depositoryDetials
      let item = this.OtherDpList[this.otherdpindex].DPID
      if(item==this.form.value.depositoryDetials.primaryDP)
      dpform.controls.primaryDP.patchValue(null)
      // this.TotalDPIds1.splice(this.otherdpindex, 1)
      this.OtherDpList.splice(this.otherdpindex, 1)
    }
    setTimeout(() => {
 
    this.OutsideDpObj=
    {
      // "ParticipantName": dpform.controls.ParticipantName.value,
      "DPName": dpform.controls.DPName.value,
      // "ClientName": dpform.controls.ClientName.value,
      "DPID": dpform.controls.DPID.value,
      "DPClientID": dpform.controls.DPClientID.value,
      "CMLDocument": this.CMLdocument
    }
    this.OtherDpList.push(this.OutsideDpObj)
    this.addDP(this.OutsideDpObj)
    console.log("DplList", this.OtherDpList)
    this.ClearOtherDpForm()
     
  },100);
  }
  ClearOtherDpForm() {
    let dpform: any = this.form.controls.depositoryDetials
    // dpform.controls.ParticipantName.setValue(null)
    dpform.controls.DPName.setValue(null)
    // dpform.controls.ClientName.setValue(null)
    dpform.controls.DPID.setValue(null)
    dpform.controls.DPClientID.setValue(null)
    this.CMLdocument = [];
    this.otherDPButton = "Add";
    this.otherdpindex = -1;
  }
  DeleteCML(index) {
    debugger
    let dpform: any = this.form.controls.depositoryDetials
    let item = this.OtherDpList[index].DPID
    if(item==this.form.value.depositoryDetials.primaryDP)
    dpform.controls.primaryDP.patchValue(null)
    this.RemoveDP(this.OtherDpList[index])
    // this.TotalDPIds1.splice(index, 1)
    this.OtherDpList.splice(index, 1)
  }
  EditOterdp(data, index) {
    this.CMLdocument = []
    let dpform: any = this.form.controls.depositoryDetials
    dpform.controls.primaryDP.patchValue(null)
    this.RemoveDP(data)
    // dpform.controls.ParticipantName.setValue(data.ParticipantName)
    dpform.controls.DPName.setValue(data.DPName)
    // dpform.controls.ClientName.setValue(data.ClientName)
    dpform.controls.DPID.setValue(data.DPID)
    dpform.controls.DPClientID.setValue(data.DPClientID)
    debugger
    if(data.CMLDocument!=undefined)
    this.CMLdocument = data.CMLDocument;
    this.otherdpindex = index
    this.otherDPButton = "Update";
  }
  DeleteImage(index) {
    this.CMLdocument.splice(index, 1)
  }
}
