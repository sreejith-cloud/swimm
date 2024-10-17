import { Component, OnInit, ViewChild, NgZone, ElementRef, AfterViewInit, HostListener, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../client-master.service';
import { DataService, UtilService, AuthService, ValidationService, User, WorkspaceService } from 'shared';
import * as  jsonxml from 'jsontoxml'
import { NzNotificationService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { interval, Subscription } from 'rxjs';
import { tradingValidations } from './tradingValidationConfig'
@Component({
  selector: 'client-master-trading',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class TradingComponent implements OnInit, AfterViewInit {
  confirmModal: NzModalRef;
  spining: boolean = false;
  fillingIsCompleted: boolean = false;
  // form: FormGroup;
  @ViewChild('generalDetials') generalDetials;
  @ViewChild('additionalDetilas') additionalDetilas;
  @ViewChild('dealings') dealings;
  @ViewChild('introducerDetails') introducerDetails;
  @ViewChild('leadConvDetails') leadConvDetails;
  @ViewChild('nomineeDetails') nomineeDetails;
  @ViewChild('agreementStatus') agreementStatus;
  @ViewChild('natchDetails') natchDetails;
  @ViewChild('thirdPartyPoa') thirdPartyPoa;
  @ViewChild('additionalDocuments') additionalDocuments;
  @ViewChild('tabsContentRef') el: ElementRef;
  @ViewChild('tabsContentRef1') el1: ElementRef;
  @ViewChild('tabsContentRef2') el2: ElementRef;
  @ViewChild('tabsContentRef3') el3: ElementRef;
  @ViewChild('tabsContentRef4') el4: ElementRef;

  isLoadingPanDetails: boolean = false;
  // isKRAVerified: boolean = false;
  // idProof: number = 1;
  subscriptions: Subscription[] = [];

  clientType: string;
  HolderDetails: any;
  currentUser: User;
  clientSerialNumber: number;
  isCatholicSyrianBankChoosen: boolean;
  FormControlNames: any = {};
  showPortal2: boolean = false;
  previewImageData2: any;
  branch: string;
  EntryAccess: any;
  allowDP: boolean = true;
  currTabIndex: number;
  isDerivativeFinDocUploaded: boolean = false;
  wsKey: string;
  clientProfileEdit: boolean = false;
  clientIdDetails: any;
  autosaveTiming: any = 120000;
  generalDetails: any;
  customValidationMsgObj = tradingValidations;
  constructor(
    private ngZone: NgZone,
    private dataServ: DataService,
    private authServ: AuthService,
    private cmServ: ClientMasterService,
    private validServ: ValidationService,
    private utilServ: UtilService,
    private wsServ: WorkspaceService,
    private notif: NzNotificationService, private modal: NzModalService,
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
      this.branch = this.dataServ.branch

    })
    this.wsServ.activeWorkspace.subscribe((ws) => {
      this.wsKey = ws.title
      if (this.wsKey == 'Client Profile Edit') {
        this.clientProfileEdit = true
      }
      else {
        this.clientProfileEdit = false
      }
    })


    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       tab:'TRD',
    //     }],
    //   "requestId": "5034",
    //   "outTblCount": "0"
    // }).then((response) => {
    //   if (response.results) {
    //     console.log(response.results)
    //    this.customValidationMsgObj=response.results[0]

    //   }
    // })


  }

  ngOnInit() {
    this.cmServ.isEntryAccess.subscribe(val => {
      this.EntryAccess = val;
    })
    this.cmServ.autoSaveTiming.subscribe(val => {
      this.autosaveTiming = val
    })

    this.cmServ.lastActivateTabIndex.subscribe(val => {
      this.currTabIndex = val;
    })
    this.cmServ.clientIdDetails.subscribe(val => {
      this.clientIdDetails = val
    })

    this.cmServ.isDPChoosen.subscribe(val => {
      this.allowDP = val;
    })
    this.cmServ.generalDetails.subscribe(val => {
      this.generalDetails = val;
    })

    this.subscriptions.push(
      interval(this.autosaveTiming).subscribe(x => {
        if (this.EntryAccess == false || this.currTabIndex != 3 || this.clientProfileEdit || this.fillingIsCompleted == false) {
          return
        }
        else {
          this.saveToTemprary()
        }
      })
    )

    this.cmServ.clientType.subscribe((val) => {
      this.clientType = val;
    })
    this.cmServ.hoderDetails.subscribe((val) => {
      this.HolderDetails = val
    })
    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val

    })
    this.cmServ.isDerivativeFinDocUploaded.subscribe(val => {
      this.isDerivativeFinDocUploaded = val
    })
    this.cmServ.isCatholicSyrianBankChoosen.subscribe(val => {
      this.isCatholicSyrianBankChoosen = val
    })
  }

  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to save these changes?',
      nzContent: 'When clicked the OK button, Data will be saved to draft. ',
      nzOnOk: () => {
        this.saveToTemprary()
      }
    });
  }
  getimagedata() {

    this.showPortal2 = true;
    this.previewImageData2 = {
      ImageFrom: 'Trading-ACCOP',
      PAN: this.HolderDetails["FirstHolderpanNumber"]
    }

    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       ClientSerialNo: this.clientSerialNumber,
    //       PAN: this.HolderDetails["FirstHolderpanNumber"],
    //       Euser: this.currentUser.userCode,
    //       ImageFrom: 'Trading-ACCOP'
    //     }],
    //   "requestId": "6002",
    //   "outTblCount": "0"
    // }).then((response) => {


    //   if (response.errorCode) {
    //     if (response.results) {
    //       if (response.results[0].length > 0) {
    //         this.showPortal2 = true;
    //         this.previewImageData2 = response.results[0]
    //       }
    //     }
    //   }
    //   else {
    //     this.notif.error(response.errorMsg, '')
    //   }
    // })
  }
  fetchTradingDetails() {
    this.spining = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          // ClientSerialNo:this.clientSerialNumber,
          // PAN:this.HolderDetails.FirstHolderpanNumber
          Tab: 'TRD',
          PAN: this.HolderDetails.FirstHolderpanNumber || '',
          Flag: this.clientProfileEdit ? 'P' : 'A',
          Euser: this.currentUser.userCode,
          ClientSerialNo: this.clientSerialNumber || '',
          DPID: '',
          ClientID: this.clientIdDetails["FirstHolderClientID"] || ''
        }],
      "requestId": "5065"
    }).then((response) => {
      debugger
      console.log(response.results)
      if (response.results.length > 0) {
        let form1: any = this.generalDetials.form.controls;
        if (response.results[0].length > 0) {
          form1.generalDetials.patchValue(response.results[0][0])
          // setTimeout(() => {
          form1.generalDetials.patchValue(this.generalDetails);
          // },100);

        }
        if (response.results[1].length > 0) {
          // setTimeout(() => {
          let data = response.results[1]
          this.generalDetials.membershipData = data
          this.generalDetials.createMembership(response.results[1])
          data.forEach(element => {
            this.generalDetials.membershipSelected(element)
          });
          // });
        }
        if (response.results[2].length > 0) {
          let dp = response.results[2]
          this.generalDetials.dpArray = dp
          dp.forEach(element => {
            this.generalDetials.createDpIds(element)
          });
        }
        if (response.results[3].length > 0) {
          let outsidedp = response.results[3]
          this.generalDetials.OtherDpList = outsidedp
          let dpform: any = this.generalDetials.form.controls.depositoryDetials.controls
          dpform.LinkingofotherDPs.setValue(response.results[3][0].LinkingofotherDPs);
          dpform.primaryDP.setValue(response.results[3][0].primaryDP);
          outsidedp.forEach(element => {
            this.generalDetials.addDP(element)
          });
          // dpform.primaryDP.setValue(response.results[3][0].primaryDP);
          //  form1.depositoryDetials.controls.LinkingofotherDPs.setValue()

          // let dpdata = response.results[3][0]
          // this.generalDetials.getDPId(dpdata.DPID)
          // form1.depositoryDetials.patchValue(dpdata)
        }
        setTimeout(() => {
          if (response.results[4].length > 0) {
            if (this.generalDetials.OtherDpList.length > 0) {
              this.generalDetials.OtherDpList.forEach(item => {
                item["CMLDocument"] = response.results[4].filter(data => {
                  return data.DP_SlNo == item.DP_SlNo
                }
                )
              })
            }

          }
        });

        if (response.results[5].length > 0) {
          setTimeout(() => {
            this.additionalDetilas.form.patchValue(response.results[5][0])
          });

        }
        let dealingForm: any = this.dealings.form.controls
        if (response.results[6].length > 0) {
          //  this.dealings.form.controls.hasSection1.patchValue(true)
          dealingForm.subBroker.patchValue(response.results[6][0])
        }
        if (response.results[7].length > 0) {
          // this.dealings.form.controls.hasSection2.patchValue(true)
          dealingForm.stockBroker.patchValue(response.results[7][0])

        }
        if (response.results[8].length > 0) {
          this.introducerDetails.form.patchValue(response.results[8][0])
        }
        if (response.results[9].length > 0) {
          if (response.results[9][0].doc) {
            this.introducerDetails.fileList = response.results[9]
            this.introducerDetails.remiserDocument = response.results[9][0]
          }
        }
        if (response.results[10].length > 0) {
          let detail = response.results[10][0]
          // this.leadConvDetails.Empcode1= {Empcode:detail.leadConverterCode}
          // this.leadConvDetails.Empcode={Empcode:detail.EmployeeCode}
          console.log(response.results[10])
          this.leadConvDetails.form.patchValue(response.results[10][0])
        }
        if (response.results[11].length > 0) {
          if(response.results[11][0].NomineeFirstName){
          this.nomineeDetails.form.patchValue(response.results[11][0])
          this.nomineeDetails.form.controls.isNominee.patchValue(true)
          }
        }
        if (response.results[12].length > 0) {
          this.natchDetails.form.patchValue(response.results[12][0])
        }
        if (response.results[13].length > 0) {
          this.thirdPartyPoa.form.patchValue(response.results[13][0])
        }

        if (response.results[14].length > 0) {
          if (response.results[14][0].doc) {
            this.thirdPartyPoa.fileList = response.results[14]
            this.thirdPartyPoa.POADocument = response.results[14][0]
          }
        }
        if (response.results[15].length > 0) {
          setTimeout(() => {
            this.agreementStatus.form.patchValue(response.results[15][0])
          }, 200);
        }
        if (response.results[16].length > 0) {
          this.additionalDocuments.SupportFiles = response.results[16];
        }
        // if(response.results[16].length>0){
        //    if (response.results[16][0].doc)
        //   this.additionalDocuments.fileList=response.results[16]
        // }
        // if(response.results[17].length>0){
        //    if (response.results[17][0].doc)
        //   this.additionalDocuments.fileList1=response.results[17]
        // }
        // if(response.results[18].length>0){
        //    if (response.results[18][0].doc)
        //   this.additionalDocuments.fileList2=response.results[18]
        // }
        // if(response.results[19].length>0){
        //    if (response.results[19][0].doc)
        //   this.additionalDocuments.fileList3=response.results[19]
        // }
        // if(response.results[20].length>0){
        //    if (response.results[20][0].doc)
        //   this.additionalDocuments.fileList4=response.results[20]
        // }
        // if(response.results[21].length>0){
        //    if (response.results[21][0].doc)
        //   this.additionalDocuments.fileList5=response.results[21]
        // }
        // if(response.results[22].length>0){
        //    if (response.results[22][0].doc)
        //   this.additionalDocuments.fileList6=response.results[22]
        // }

        setTimeout(() => {
          this.spining = false;
          this.fillingIsCompleted = true;
        }, 100);
      }
      else {
        this.spining = false
      }
    })
  }

  fetchProfileEditData() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientID: this.clientIdDetails["FirstHolderClientID"],
        }],
      "requestId": "5099"
    }).then((response) => {
      if (response.errorCode == 0) {
        console.log(response.results)
        if (response.results.length > 0) {
          this.spining = true;
          let form1: any = this.generalDetials.form.controls;
          if (response.results[0].length > 0) {
            form1.generalDetials.patchValue(response.results[0][0])
          }
          if (response.results[1].length > 0) {
            setTimeout(() => {
              let data = response.results[1]
              this.generalDetials.membershipData = data
              this.generalDetials.createMembership(response.results[1])
              data.forEach(element => {
                this.generalDetials.membershipSelected(element)
              });
            });
          }
          if (response.results[2].length > 0) {
            let dp = response.results[2]
            this.generalDetials.dpArray = dp
            dp.forEach(element => {
              this.generalDetials.createDpIds(element)
            });
          }
          if (response.results[3].length > 0) {
            let dpdata = response.results[3][0]
            form1.depositoryDetials.patchValue(dpdata)
            this.generalDetials.getDPId(dpdata.DPID)
          }
          if (response.results[4].length > 0) {
            if (response.results[4][0].doc) {
              //  this.generalDetials.fileList=response.results[4]
              //  this.generalDetials.CMLdocument=response.results[4]
            }
          }
          if (response.results[5].length > 0) {
            setTimeout(() => {
              this.additionalDetilas.form.patchValue(response.results[5][0])
            }, 300);
          }
          let dealingForm: any = this.dealings.form.controls
          if (response.results[6].length > 0) {
            //  this.dealings.form.controls.hasSection1.patchValue(true)
            dealingForm.subBroker.patchValue(response.results[6][0])
          }
          if (response.results[7].length > 0) {
            // this.dealings.form.controls.hasSection2.patchValue(true)
            dealingForm.stockBroker.patchValue(response.results[7][0])

          }
          if (response.results[8].length > 0) {
            this.introducerDetails.form.patchValue(response.results[8][0])
          }
          if (response.results[9].length > 0) {
            this.introducerDetails.fileList = response.results[9]
            this.introducerDetails.remiserDocument = response.results[9][0]
          }
          if (response.results[10].length > 0) {
            let detail = response.results[10][0]
            this.leadConvDetails.Empcode1 = { Empcode: detail.leadConverterCode }
            this.leadConvDetails.Empcode = { Empcode: detail.EmployeeCode }
            console.log(response.results[10])
            this.leadConvDetails.form.patchValue(response.results[10][0])
          }
          if (response.results[11].length > 0) {
            this.nomineeDetails.form.patchValue(response.results[11][0])
          }
          if (response.results[12].length > 0) {
            this.natchDetails.form.patchValue(response.results[12][0])
          }
          if (response.results[13].length > 0) {
            this.thirdPartyPoa.form.patchValue(response.results[13][0])
          }
          if (response.results[14].length > 0) {
            if (response.results[14][0].doc) {
              this.thirdPartyPoa.fileList = response.results[14]
              this.thirdPartyPoa.POADocument = response.results[14][0]
            }
          }
          if (response.results[15].length > 0) {
            this.agreementStatus.form.patchValue(response.results[15][0])
          }
          // if(response.results[16].length>0){
          //   this.additionalDocuments.fileList=response.results[16]
          // }
          // if(response.results[17].length>0){
          //   this.additionalDocuments.fileList1=response.results[17]
          // }
          // if(response.results[18].length>0){
          //   this.additionalDocuments.fileList2=response.results[18]
          // }
          // if(response.results[19].length>0){
          //   this.additionalDocuments.fileList3=response.results[19]
          // }
          // if(response.results[20].length>0){
          //   this.additionalDocuments.fileList4=response.results[20]
          // }
          // if(response.results[21].length>0){
          //   this.additionalDocuments.fileList5=response.results[21]
          // }
          // if(response.results[22].length>0){
          //   this.additionalDocuments.fileList6=response.results[22]
          // }
          setTimeout(() => {
            this.spining = false;
          });
        }
      }
      else {
        this.spining = true;
        this.notif.error(response.errorMsg, '')
      }
    })
  }

  ngAfterViewInit() {
    this.ngZone.run(() => {
      this.cmServ.isTradingFetch.subscribe(val => {
        if (val == true) {
          // if(this.clientProfileEdit){
          //   this.fetchProfileEditData()
          // }else{
          // this.cmServ.activeTab.subscribe(item=>{
          //   if(item==3)
          //   {
          if (!this.fillingIsCompleted)
            this.fetchTradingDetails()
          //   }
          // })

        }
      })
      if (this.dataServ.branch == "HO" || this.dataServ.branch == "HOGT") {
        // this.getimagedata();
      }

    })
  }
  // {doc:this.getObjFromArray(this.fileList,'PAN')},
  // {doc:this.getObjFromArray(this.fileList1,'Aadhaar Card')},
  // {doc:this.getObjFromArray(this.fileList2,'Passport')},
  // {doc: this.getObjFromArray(this.fileList3,'Driving License')},
  // {doc:this.getObjFromArray(this.fileList4,'Voters ID')},
  // {doc:this.getObjFromArray(this.fileList5,'Marriage Certificate')},
  // {doc:this.getObjFromArray(this.fileList6,'Gazetted Notification')}
  continueNext() {
    if (this.EntryAccess == false) {
      this.next11()
      return
    }
    this.spining = true;
    let form1: any = this.generalDetials.form.controls;
    let memDataArray = this.generalDetials.membershipData
    let memData = []
    memDataArray.forEach(element => {
      if (element.checked) {
        memData.push(element)
      }
    });
    console.log(memData)

    if (memData.length == 0) {
      this.notif.error("Memebership not selected,please check", '', { nzDuration: 60000 })
      this.el.nativeElement.scrollIntoView();
      this.spining = false;
      return
    }
    let finanicalProofs: boolean;
    let FAOexposureagainstholdingagreement = false;
    let isFoSelected=false;
    memData.forEach(element => {
      if (element.SegmentType == 'COM' || element.SegmentType == 'FO' || element.SegmentType == 'CDS') {
        FAOexposureagainstholdingagreement = true
      }
      if(element.SegmentType == 'FO'){
        isFoSelected=true;
      }
    });
    if (!this.isDerivativeFinDocUploaded) {
      finanicalProofs = true;
    }
    if (finanicalProofs) {
      this.notif.error("Please Upload Financial Details Proofs for Derivative Client in Financial Tab", '', { nzDuration: 60000 })
      this.spining = false
      return
    }
    this.notif.remove()
    var JSONData = this.utilServ.setJSONArray(memData);
    let membershipXML = jsonxml(JSONData);
    membershipXML = membershipXML.replace(/&/gi, '#||')
    console.log(membershipXML)

    let isValid = this.validServ.validateForm(form1.generalDetials, this.FormControlNames, this.customValidationMsgObj.GeneralDetails);
    if (!isValid) {
      this.el.nativeElement.scrollIntoView();
      this.spining = false;
      return
    }
    if (this.generalDetails.declaration != null && this.generalDetails.declaration != '') {
      if (this.generalDetails.declaration != form1.generalDetials.value.declaration) {
        // this.notif.error("KITNO and Confirm KITNO should be same", '', { nzDuration: 60000 })
        this.spining = false;
        return
      }
    }
    let kitno = this.generalDetials.checkKitNO();
    if (!kitno) {
      this.notif.error("KITNO and Confirm KITNO Should exactly match", '', { nzDuration: 60000 })
      this.spining = false;
      return
    }
    let data = []
    data.push(form1.generalDetials.value)
    var JSONData1 = this.utilServ.setJSONArray(data);
    let generalDetialsXML = jsonxml(JSONData1);
    generalDetialsXML = generalDetialsXML.replace(/&/gi, '#||')//added by sachin
    console.log(generalDetialsXML)
    let depositoryXML = '';
    if (form1.depositoryDetials.value.LinkingofotherDPs) {
      // let isValid1 = this.validServ.validateForm(form1.depositoryDetials, this.FormControlNames);
      if (this.generalDetials.TotalDPIds1.length == 0) {
        this.notif.error("Please link your DP accounts to this trading account", '', { nzDuration: 60000 })
        this.el.nativeElement.scrollIntoView();
        this.spining = false;
        return
      }
      if (this.generalDetials.TotalDPIds1.length > 1 && this.generalDetials.tradingOnly) {
        if (form1.depositoryDetials.value.primaryDP == null) {
          this.notif.error("Primary Dp required", '', { nzDuration: 60000 })
          this.el.nativeElement.scrollIntoView();
          this.spining = false;
          return
        }
      }

      // if (!isValid1) {
      //   this.el.nativeElement.scrollIntoView();
      //   this.spining = false;
      //   return
      // }
      // if(this.generalDetials.fileList.length==0){
      //   this.notif.error("Upload CML",'',{nzDuration: 60000 })
      //   this.spining=false;
      //   return
      // }
      debugger
      let formdata = this.generalDetials.form.controls.depositoryDetials.value;
      var otherdp1 = this.generalDetials.OtherDpList;
      var otherdp2 = JSON.stringify(otherdp1)
      var otherdp = JSON.parse(otherdp2)
      otherdp.forEach((element, index) => {
        if (element.CMLDocument.length) {
          element.CMLDocument.forEach(item => {
            item.Docname = item.Docname + (Number(index) + 1)
          })
          element.CMLDocument = this.utilServ.setJSONArray(element.CMLDocument)
        }
      });
      otherdp = this.utilServ.setJSONArray(otherdp)
      var data1 = this.generalDetials.depositoryData()
      var gddat = []
      gddat.push({ "formdata": formdata },
        { "otherDP": otherdp },
        { "geoDP": data1 })
      var dpjson = this.utilServ.setJSONMultipleArray(gddat);
      console.log("dpjson", dpjson)
      depositoryXML = jsonxml(dpjson);

      // data1.push(this.generalDetials.CMLdocument)
      // var JSONData1 = this.utilServ.setJSONArray(data1);
      // depositoryXML = jsonxml(JSONData1);
      // depositoryXML = depositoryXML.replace(/&/gi, '#||')//Added By sachin
      // console.log(depositoryXML)
    }
    console.log("after save", this.generalDetials.OtherDpList)
    let additionalDetilasValid = this.validServ.validateForm(this.additionalDetilas.form, this.FormControlNames, this.customValidationMsgObj.AddDetails);
    if (!additionalDetilasValid) {
      this.el.nativeElement.scrollIntoView();
      this.spining = false;
      return
    }
    if (this.additionalDetilas.form.value.wishtoAvailInternetTrading == 'YES') {
      if (this.additionalDetilas.form.value.electronicContractNote == 'NO' || this.additionalDetilas.form.value.emailIdforECN == null || (!this.additionalDetilas.form.value.emailIdforECN.match('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$'))) {
        this.notif.remove()
        this.notif.error("Please enter valid email Id For ECN to avail internet trading", '', { nzDuration: 60000 })
        this.el.nativeElement.scrollIntoView();
        this.spining = false;
        return
      }
    }

    let additionalDetilasdata = []
    additionalDetilasdata.push(this.additionalDetilas.form.value)
    var JSONData2 = this.utilServ.setJSONArray(additionalDetilasdata);
    let additionalDetilasdataXML = jsonxml(JSONData2);
    additionalDetilasdataXML = additionalDetilasdataXML.replace(/&/gi, '#||')//Added By sachin
    console.log(additionalDetilasdataXML)


    let form = this.dealings.form.controls
    if (this.dealings.form.value.subBroker.hasSection1) {
      let dealingsValid = this.validServ.validateForm(form.subBroker, this.FormControlNames, this.customValidationMsgObj.SubBroker);
      if (!dealingsValid) {
        this.el1.nativeElement.scrollIntoView();
        this.spining = false;
        return
      }
      let dealingsdata = []
      dealingsdata.push(form.subBroker.value)
      var JSONData3 = this.utilServ.setJSONArray(dealingsdata);
      var dealingsdataXML = jsonxml(JSONData3);
      dealingsdataXML = dealingsdataXML.replace(/&/gi, '#||')//Added By sachin

      console.log(dealingsdataXML)
    }
    else {
      form.subBroker.reset()
      form.subBroker.controls.hasSection1.patchValue(false)
      let dealingsdata = []
      dealingsdata.push(form.subBroker.value)
      var JSONData3 = this.utilServ.setJSONArray(dealingsdata);
      var dealingsdataXML = jsonxml(JSONData3);
      dealingsdataXML = dealingsdataXML.replace(/&/gi, '#||')//added By sachin
      console.log(dealingsdataXML)
    }

    if (this.dealings.form.value.stockBroker.hasSection2) {
      let dealingsValid1 = this.validServ.validateForm(form.stockBroker, this.FormControlNames, this.customValidationMsgObj.StockBroker);
      if (!dealingsValid1) {
        this.el1.nativeElement.scrollIntoView();
        this.spining = false;
        return
      }
      let dealingsdata1 = []
      dealingsdata1.push(form.stockBroker.value)
      var JSONData4 = this.utilServ.setJSONArray(dealingsdata1);
      var dealingsdataXML1 = jsonxml(JSONData4);
      dealingsdataXML1 = dealingsdataXML1.replace(/&/gi, '#||')//Added By Sachin
      console.log(dealingsdataXML1)
    }
    else {
      let dealingsdata1 = []
      form.stockBroker.reset()
      form.stockBroker.controls.hasSection2.patchValue(false)
      dealingsdata1.push(form.stockBroker.value)
      var JSONData4 = this.utilServ.setJSONArray(dealingsdata1);
      var dealingsdataXML1 = jsonxml(JSONData4);
      dealingsdataXML1 = dealingsdataXML1.replace(/&/gi, '#||')//Added by Sachin
      console.log(dealingsdataXML1)
    }

    let valid = this.validServ.validateForm(this.introducerDetails.form, this.FormControlNames,this.customValidationMsgObj.introducerDetails)
    if (!valid) {
      this.el2.nativeElement.scrollIntoView();
      this.spining = false;
      return
    }
    let introducerData = []
    if (this.introducerDetails.form.value.statusOfIntroducer == "REMISER") {
      if(!this.introducerDetails.remiserDocument){
        this.el2.nativeElement.scrollIntoView();
        this.notif.error("Please upload Remiser link in Introducer details",'',{nzDuration:60000})
        this.spining = false;
        return
      }
      let totalData = { ...this.introducerDetails.form.value, ...this.introducerDetails.remiserDocument }
      introducerData.push(totalData)
      var JSONData5 = this.utilServ.setJSONArray(introducerData);
      var introducerDataXML = jsonxml(JSONData5);
      introducerDataXML = introducerDataXML.replace(/&/gi, '#||')//added by sachin

      console.log(introducerDataXML)
    }
    else {
      introducerData.push(this.introducerDetails.form.value)
      var JSONData5 = this.utilServ.setJSONArray(introducerData);
      var introducerDataXML = jsonxml(JSONData5);
      introducerDataXML = introducerDataXML.replace(/&/gi, '#||')//added By sachin
      console.log(introducerDataXML)
    }

    let LeadConvalid = this.validServ.validateForm(this.leadConvDetails.form, this.FormControlNames, this.customValidationMsgObj.RelationWithGeojit)
    if (!LeadConvalid) {
      this.el2.nativeElement.scrollIntoView();
      this.spining = false;
      return
    }
    let LeadConvalidData = []
    LeadConvalidData.push(this.leadConvDetails.form.value)
    var JSONData6 = this.utilServ.setJSONArray(LeadConvalidData);
    let LeadConvalidDataXML = jsonxml(JSONData6);
    LeadConvalidDataXML = LeadConvalidDataXML.replace(/&/gi, '#||')//added by sachin
    console.log(LeadConvalidDataXML)
    let nomineeAndGuardianDataXML = ""
    let isNominne = this.nomineeDetails.form.value.isNominee
    if (isNominne) {
      let nomineeAndGuardianValid = this.validServ.validateForm(this.nomineeDetails.form, this.FormControlNames, this.customValidationMsgObj.NomineeDetails)
      if (!nomineeAndGuardianValid) {
        this.el3.nativeElement.scrollIntoView();
        this.spining = false;
        return
      }
      let nomineeAndGuardianData = []
      nomineeAndGuardianData.push(this.nomineeDetails.form.value)
      var JSONData7 = this.utilServ.setJSONArray(nomineeAndGuardianData);
      nomineeAndGuardianDataXML = jsonxml(JSONData7);
      nomineeAndGuardianDataXML = nomineeAndGuardianDataXML.replace(/&/gi, '#||')
      console.log(nomineeAndGuardianDataXML)
    }
    let agreementStatusValid = this.validServ.validateForm(this.agreementStatus.form, this.FormControlNames, this.customValidationMsgObj.AgreementDetails)
    if (!agreementStatusValid) {
      this.el4.nativeElement.scrollIntoView();
      this.spining = false;
      return
    }


    let poa = this.agreementStatus.form.value.POA
    let nreValue = this.agreementStatus.form.value.NREUndertaking
    let nroValue = this.agreementStatus.form.value.NROUndertaking
    let faoValue = this.agreementStatus.form.value.FAOexposureagainstholdingagreement
    if(!this.generalDetails.SMSFacility && poa=='YES'){
      this.notif.remove()
      this.notif.error("POA cannot choose YES in Agreement Signed Status if sms facility not choosen", '', { nzDuration: 60000 })
      this.el4.nativeElement.scrollIntoView();
      this.spining = false;
      return
    }
    if(isFoSelected && poa=='YES'){
      this.notif.remove()
      this.notif.error("POA cannot choose YES in Agreement Signed Status if FO membership choosen", '', { nzDuration: 60000 })
      this.el4.nativeElement.scrollIntoView();
      this.spining = false;
      return
    }
    
    if (this.generalDetails.IsNRI && faoValue == 'YES') {
      this.notif.remove()
      this.notif.error('NRI Clients are not allowed to Opt for FAO exposure against holding agreement in Agreement Signed Status', '', { nzDuration: 60000 })
      this.spining = false;
      this.el4.nativeElement.scrollIntoView();
      return
    }

    if (FAOexposureagainstholdingagreement == false && faoValue == 'YES') {
      this.notif.remove()
      this.notif.error("Only if Membership is 'FO', 'COMM', 'CDS' can Opt FAO exposure against holding agreement in Agreement Signed Status", '', { nzDuration: 60000 })
      this.spining = false;
      this.el4.nativeElement.scrollIntoView();
      return
    }
    if ((this.generalDetails.IsNRE == false && nreValue == 'YES') || (this.generalDetails.IsNRE == true && nreValue == 'NO')) {
      this.notif.remove()
      this.notif.error('NRE Clients are allowed to Opt for NRE Undertaking in Agreement Signed Status', '', { nzDuration: 60000 })
      this.spining = false;
      this.el4.nativeElement.scrollIntoView();
      return
    }
    if ((this.generalDetails.IsNRO == false && nroValue == 'YES') || (this.generalDetails.IsNRO == true && nroValue == 'false')) {
      this.notif.remove()
      this.notif.error('NRO / NROCM Clients are allowed to Opt for NRO Undertaking in Agreement Signed Status', '', { nzDuration: 60000 })
      this.spining = false;
      this.el4.nativeElement.scrollIntoView();
      return
    }



    let agreementStatusData = []
    agreementStatusData.push(this.agreementStatus.form.value)
    var JSONData8 = this.utilServ.setJSONArray(agreementStatusData);
    let agreementStatusXML = jsonxml(JSONData8);
    agreementStatusXML = agreementStatusXML.replace(/&/gi, '#||')//added by sachin
    console.log(agreementStatusXML)
    let natchDetailsDataXML = '';
    if (this.natchDetails.form.value.DebitmandatefromNACH) {
      let natchDetailsValid = this.validServ.validateForm(this.natchDetails.form, this.FormControlNames)
      if (!natchDetailsValid) {
        this.el4.nativeElement.scrollIntoView();
        this.spining = false;
        return
      }
      let natchDetailsData = []
      natchDetailsData.push(this.natchDetails.form.value)
      var JSONData9 = this.utilServ.setJSONArray(natchDetailsData);
      natchDetailsDataXML = jsonxml(JSONData9);
      natchDetailsDataXML = natchDetailsDataXML.replace(/&/gi, '#||')//added by sachin
      console.log(natchDetailsDataXML)
    }
    let thirdPartyPoaDataXML = '';
    if (this.thirdPartyPoa.form.value.poa) {
      let thirdPartyPoaValid = this.validServ.validateForm(this.thirdPartyPoa.form, this.FormControlNames, this.customValidationMsgObj.ThirdPartyPOA)
      if (!thirdPartyPoaValid) {
        this.el4.nativeElement.scrollIntoView();
        this.spining = false;
        return
      }
      if (this.thirdPartyPoa.fileList.length == 0) {
        this.notif.error("Upload Proof Of Id in third party POA", '', { nzDuration: 60000 })
        this.spining = false;
        return
      }
      let thirdPartyPoaData = []
      let totalData = { ...this.thirdPartyPoa.form.value, ...this.thirdPartyPoa.POADocument }
      thirdPartyPoaData.push(totalData)
      var JSONData9 = this.utilServ.setJSONArray(thirdPartyPoaData);
      thirdPartyPoaDataXML = jsonxml(JSONData9);
      thirdPartyPoaDataXML = thirdPartyPoaDataXML.replace(/&/gi, '#||')//Added By sachin
      console.log(thirdPartyPoaDataXML)
    }

    let details = this.additionalDocuments.getAdditionalDocuments()
    let jsond = this.utilServ.setJSONArray(details);
    let imageXmlData = jsonxml(jsond);
    imageXmlData = imageXmlData.replace(/&/gi, '#||')//Added sachin
    console.log(imageXmlData)


    this.notif.remove()
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Pan: this.HolderDetails["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          XML_GeneralDetails: generalDetialsXML,
          XML_Membership: membershipXML,
          XML_DPDetails: depositoryXML,
          XML_AdditionalDetails: additionalDetilasdataXML,
          XML_SuBrokerDetails: dealingsdataXML,
          XML_StockBrokerDetails: dealingsdataXML1,
          XML_LeadGenDetails: introducerDataXML,
          XML_LeadConverterDetails: LeadConvalidDataXML,
          XML_NomineeDetails: nomineeAndGuardianDataXML,
          XML_POADetails: agreementStatusXML,
          XML_NACHDetails: natchDetailsDataXML,
          XML_ThirdPartyPOA: thirdPartyPoaDataXML,
          XML_ImageDetails: imageXmlData,
          ClientSerialNo: this.clientSerialNumber,
          AutoSave: 'N',
          Flag: this.clientProfileEdit ? 'P' : 'A'

        }],
      "requestId": "5022",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        this.spining = false;
        let dataset = response.results[0][0]
        if (dataset.ErrorCode == 0) {
          this.notif.success(dataset.Msg, '');

          // if(this.allowDP==true){
          //   this.cmServ.trigerDp.next(true)
          //   this.cmServ.activeTabIndex.next(4)
          // }
          // if(this.allowTrading==false && this.allowDP==false){
          //   this.cmServ.trigerIU.next(true)
          //   this.cmServ.activeTabIndex.next(5)
          // }

          if (this.allowDP == true || this.isCatholicSyrianBankChoosen == true) {
            this.el.nativeElement.scrollIntoView();
            this.subscriptions.forEach(ele => {
              ele.unsubscribe()
            })
            this.cmServ.activeTabIndex.next(4);

            this.cmServ.trigerDp.next(true)
          }

          else {
            this.el.nativeElement.scrollIntoView();
            this.subscriptions.forEach(ele => {
              ele.unsubscribe()
            })
            this.previewImageData2 = []

            if (!this.clientProfileEdit) {
              this.cmServ.activeTabIndex.next(5);
              this.cmServ.trigerScheme.next(true)
            }
          }
        }

        else {
          this.notif.error(dataset.Msg, '', { nzDuration: 60000 })
        }
      }
      else {
        this.spining = false;
        this.notif.error(response.errorMsg, '')
      }


    })
  }
  saveToTemprary() {
    debugger
    let form1: any = this.generalDetials.form.controls;
    let memDataArray = this.generalDetials.membershipData
    let memData = []
    memDataArray.forEach(element => {
      if (element.checked) {
        memData.push(element)
      }
    });
    // if(memData.length==0){
    //   this.notif.error("Please choose Membership",'',{nzDuration: 60000 })
    //   return
    // }
    var JSONData = this.utilServ.setJSONArray(memData);
    let membershipXML = jsonxml(JSONData);

    // let isValid = this.validServ.validateForm(form1.generalDetials,this.FormControlNames);
    // if (!isValid) {
    //   this.el.nativeElement.scrollIntoView();
    //   return
    // }

    // let kitno=this.generalDetials.checkKitNO();
    // if(!kitno){
    //   this.notif.error("KIT no and Confirm KIT no should be same",'',{nzDuration: 60000 })
    //   return
    // }

    let data = []
    data.push(form1.generalDetials.value)
    var JSONData1 = this.utilServ.setJSONArray(data);
    let generalDetialsXML = jsonxml(JSONData1);
    let depositoryXML = '';
    if (form1.depositoryDetials.value.LinkingofotherDPs) {
      // let isValid1 = this.validServ.validateForm(form1.depositoryDetials,this.FormControlNames);
      // if (!isValid1) {
      //   this.el.nativeElement.scrollIntoView();
      //   return
      // }
      // if(this.generalDetials.fileList.length==0){
      //   this.notif.error("Upload CML",'',{nzDuration: 60000 })
      //   return
      // }
      debugger
      let formdata = this.generalDetials.form.controls.depositoryDetials.value;
      var otherdp1 = this.generalDetials.OtherDpList;
      var otherdp2 = JSON.stringify(otherdp1)
      var otherdp = JSON.parse(otherdp2)
      otherdp.forEach((element, index) => {
        if (element.CMLDocument.length) {
          element.CMLDocument.forEach(item => {
            item.Docname = item.Docname + (Number(index) + 1)
          })

          element.CMLDocument = this.utilServ.setJSONArray(element.CMLDocument)
        }
      });
      otherdp = this.utilServ.setJSONArray(otherdp)
      var data1 = this.generalDetials.depositoryData()
      var gddat = []
      gddat.push({ "formdata": formdata },
        { "otherDP": otherdp },
        { "geoDP": data1 })
      var dpjson = this.utilServ.setJSONMultipleArray(gddat);
      depositoryXML = jsonxml(dpjson);
    }

    // let additionalDetilasValid = this.validServ.validateForm(this.additionalDetilas.form,this.FormControlNames);
    // if (!additionalDetilasValid) {
    //   this.el.nativeElement.scrollIntoView();
    //   return
    // }
    let additionalDetilasdata = []
    additionalDetilasdata.push(this.additionalDetilas.form.value)
    var JSONData2 = this.utilServ.setJSONArray(additionalDetilasdata);
    let additionalDetilasdataXML = jsonxml(JSONData2);
    // let dealingsdataXML='';
    // let dealingsdataXML1="";

    // if(this.dealings.form.value.subBroker.hasSection1){
    let form = this.dealings.form.controls
    // let dealingsValid = this.validServ.validateForm(form.subBroker,this.FormControlNames);
    // if (!dealingsValid) {
    //   this.el1.nativeElement.scrollIntoView();
    //   return
    // }
    let dealingsdata = []
    dealingsdata.push(form.subBroker.value)
    var JSONData3 = this.utilServ.setJSONArray(dealingsdata);
    let dealingsdataXML = jsonxml(JSONData3);
    // if(this.dealings.form.stockBroker.value.hasSection2){
    // let dealingsValid1 = this.validServ.validateForm(form.stockBroker,this.FormControlNames);
    // if (!dealingsValid1) {
    //   this.el1.nativeElement.scrollIntoView();
    //   return
    // }
    let dealingsdata1 = []
    dealingsdata1.push(form.stockBroker.value)
    var JSONData4 = this.utilServ.setJSONArray(dealingsdata1);
    let dealingsdataXML1 = jsonxml(JSONData4);

    //   }
    // }

    // let valid=this.validServ.validateForm(this.introducerDetails.form,this.FormControlNames)
    // if(!valid){
    //   this.el2.nativeElement.scrollIntoView();
    //   return
    // }
    let introducerData = []
    if (this.introducerDetails.form.value.statusOfIntroducer == "Remiser") {
      let totalData = { ...this.introducerDetails.form.value, ...this.introducerDetails.remiserDocument }
      introducerData.push(totalData)

    }
    else
      introducerData.push(this.introducerDetails.form.value)

    var JSONData5 = this.utilServ.setJSONArray(introducerData);
    let introducerDataXML = jsonxml(JSONData5);

    // let LeadConvalid=this.validServ.validateForm(this.leadConvDetails.form,this.FormControlNames)
    // if(!LeadConvalid){
    //   this.el2.nativeElement.scrollIntoView();
    //   return
    // }
    let LeadConvalidData = []
    LeadConvalidData.push(this.leadConvDetails.form.value)
    var JSONData6 = this.utilServ.setJSONArray(LeadConvalidData);
    let LeadConvalidDataXML = jsonxml(JSONData6);

    // let nomineeAndGuardianValid=this.validServ.validateForm(this.nomineeDetails.form,this.FormControlNames)
    // if(!nomineeAndGuardianValid){
    //   this.el3.nativeElement.scrollIntoView();
    //   return
    // }
    let nomineeAndGuardianData = []
    nomineeAndGuardianData.push(this.nomineeDetails.form.value)
    var JSONData7 = this.utilServ.setJSONArray(nomineeAndGuardianData);
    let nomineeAndGuardianDataXML = jsonxml(JSONData7);

    // let agreementStatusValid=this.validServ.validateForm(this.agreementStatus.form,this.FormControlNames)
    // if(!agreementStatusValid){
    //   this.el4.nativeElement.scrollIntoView();
    //   return
    // }
    let agreementStatusData = []
    agreementStatusData.push(this.agreementStatus.form.value)
    var JSONData8 = this.utilServ.setJSONArray(agreementStatusData);
    let agreementStatusXML = jsonxml(JSONData8);
    let natchDetailsDataXML = '';
    if (this.natchDetails.form.value.DebitmandatefromNACH) {
      // let natchDetailsValid=this.validServ.validateForm(this.natchDetails.form,this.FormControlNames)
      // if(!natchDetailsValid){
      //   this.el4.nativeElement.scrollIntoView();
      //   return
      // }
      let natchDetailsData = []
      natchDetailsData.push(this.natchDetails.form.value)
      var JSONData9 = this.utilServ.setJSONArray(natchDetailsData);
      natchDetailsDataXML = jsonxml(JSONData9);
    }
    let thirdPartyPoaDataXML = '';
    if (this.thirdPartyPoa.form.value.poa) {
      //  let thirdPartyPoaValid=this.validServ.validateForm(this.thirdPartyPoa.form,this.FormControlNames)
      //   if(!thirdPartyPoaValid){
      //     this.el4.nativeElement.scrollIntoView();
      //     return
      //   }
      // if(this.thirdPartyPoa.fileList.length==0){
      //   this.notif.error("Upload Proof Of Id in third party POA",'',{nzDuration: 60000 })
      //   return
      // }
      let thirdPartyPoaData = []
      let totalData = { ...this.thirdPartyPoa.form.value, ...this.thirdPartyPoa.POADocument }
      thirdPartyPoaData.push(totalData)
      var JSONData9 = this.utilServ.setJSONArray(thirdPartyPoaData);
      thirdPartyPoaDataXML = jsonxml(JSONData9);
    }

    let details = this.additionalDocuments.getAdditionalDocuments()
    let jsond = this.utilServ.setJSONArray(details);
    let imageXmlData = jsonxml(jsond);
    imageXmlData = imageXmlData.replace(/&/gi, '#||')//Added sachin


    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Pan: this.HolderDetails["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          XML_GeneralDetails: generalDetialsXML.replace(/&/gi, '#||'),
          XML_Membership: membershipXML.replace(/&/gi, '#||'),
          XML_DPDetails: depositoryXML.replace(/&/gi, '#||'),
          XML_AdditionalDetails: additionalDetilasdataXML.replace(/&/gi, '#||'),
          XML_SuBrokerDetails: dealingsdataXML.replace(/&/gi, '#||'),
          XML_StockBrokerDetails: dealingsdataXML1.replace(/&/gi, '#||'),
          XML_LeadGenDetails: introducerDataXML.replace(/&/gi, '#||'),
          XML_LeadConverterDetails: LeadConvalidDataXML.replace(/&/gi, '#||'),
          XML_NomineeDetails: nomineeAndGuardianDataXML.replace(/&/gi, '#||'),
          XML_POADetails: agreementStatusXML.replace(/&/gi, '#||'),
          XML_NACHDetails: natchDetailsDataXML.replace(/&/gi, '#||'),
          XML_ThirdPartyPOA: thirdPartyPoaDataXML.replace(/&/gi, '#||'),
          XML_ImageDetails: imageXmlData,
          ClientSerialNo: this.clientSerialNumber,
          Flag: this.clientProfileEdit ? 'P' : 'A',
          AutoSave: 'Y',
        }],
      "requestId": "5022",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        let dataset = response.results[0][0]
        if (dataset.ErrorCode == 0) {
          // this.notif.success(dataset.Msg, ''); 
        }

        else {
          // this.notif.error(dataset.Msg, '',{nzDuration: 60000 })
        }
      }
      else {
        this.notif.error(response.errorMsg, '')
      }

    })

  }
  back() {
    this.previewImageData2 = []
    this.el.nativeElement.scrollIntoView();
    this.subscriptions.forEach(ele => {
      ele.unsubscribe()
    })
    this.cmServ.activeTabIndex.next(2);
  }

  next11() {
    this.previewImageData2 = []
    this.el.nativeElement.scrollIntoView();
    this.subscriptions.forEach(ele => {
      ele.unsubscribe()
    })

    if (this.allowDP == true || this.isCatholicSyrianBankChoosen == true) {
      this.el.nativeElement.scrollIntoView();
      this.cmServ.activeTabIndex.next(4);
      this.cmServ.trigerDp.next(true)
    }

    else {
      this.el.nativeElement.scrollIntoView();
      this.cmServ.activeTabIndex.next(5);
      this.cmServ.trigerScheme.next(true)
    }
  }
  // @HostListener('window:keydown',['$event'])
  // onKeyPress($event: KeyboardEvent) {
  //   if(this.currTabIndex==3){
  //     if($event.altKey && $event.key === 's')
  //        this.saveToTemprary()
  //     if($event.ctrlKey  && $event.key === 's'){
  //        $event.preventDefault();
  //        $event.stopPropagation();
  //        this.continueNext()
  //     }
  //   }

  // }
}

