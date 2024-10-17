import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ClientMasterService } from '../client-master.service';
import { FindOptions, ValidationService, DataService, UtilService, AuthService, User, WorkspaceService } from "shared";
import { BankDetailsComponent } from './bank-details/component';
import { FinancialDetailsComponent } from './financial-details/financial';
import * as  jsonxml from 'jsontoxml'
import { interval, Subscription } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { financialValidations } from './financialValidationConfig'
@Component({
  selector: 'client-master-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.less']
})
export class FinancialsComponent implements OnInit, AfterViewInit {
  FormControlNames: {} = {};
  spining: boolean = false;
  confirmModal: NzModalRef;
  //@ViewChild('validateBankDetailsForm') private bankDetailsCom:BankDetailsComponent;
  // @ViewChild('validateFinancialDetailsForm') private financialdetails:FinancialDetailsComponent;
  @ViewChild('financails1') financails1;
  @ViewChild('financails2') financails2;
  @ViewChild('financails3') financails3;
  @ViewChild('bankdetails') bankdetails;

  @ViewChild('tabsContentRef') el: ElementRef;
  subscriptions: Subscription[] = [];
  checked: boolean = false;
  currentUser: User;
  indTabs: any[] = [];
  clientFindOpt: FindOptions;
  financialForm: FormGroup
  tabs: any[] = [];
  clientType: string
  bankDetailsform: boolean;
  numberOfHolders: number;
  activeTabIndex: number = 0
  holderdetails: any[];
  clientSerialNumber: number;
  previewImageData1: any;
  showPortal1: boolean = false;
  branch: string;
  EntryAccess: any;
  allowTrading: boolean = false;
  allowDP: boolean = false;
  currTabIndex: number;
  clientProfileEdit: boolean;
  wsKey: any;
  clientIdDetails: any;
  autosaveTiming: any;
  bankProofImages: any;
  pisLetterproof: any;
  customValidationMsgObj = financialValidations;
  isfinancialIFSCloaded: boolean = false;
  financialFetchingDone: boolean = false;
  constructor(
    private validServ: ValidationService,
    private authServ: AuthService,
    private fb: FormBuilder,
    private dataServ: DataService,
    private cmServ: ClientMasterService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private modal: NzModalService,
    private wsServ: WorkspaceService,

  ) {
    this.cmServ.holderLength.subscribe((val) => {
      this.tabs = Array(val);
      this.numberOfHolders = val
    })
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
      this.branch = this.dataServ.branch

    })
    this.wsServ.activeWorkspace.subscribe((ws) => {
      this.wsKey = ws.title
      if (this.wsKey == 'Client Profile Edit') {
        this.clientProfileEdit = true
      }
    })
    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       tab:'FIN',
    //     }],
    //   "requestId": "5034",
    //   "outTblCount": "0"
    // }).then((response) => {
    //   if (response.results) {
    //    this.customValidationMsgObj=response.results[0]
    //   }
    // })

  }

  ngOnInit() {
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
      if (this.EntryAccess == false || this.currTabIndex != 2 || this.clientProfileEdit || this.isfinancialIFSCloaded == false) {
        return
      }
      else {
        // this.modal.closeAll()
        // this.showConfirm()
        this.saveToTemprary()
      }
    }))
    this.cmServ.clientType.subscribe((val) => {

      this.clientType = val;

    })
    this.cmServ.isTradingChoosen.subscribe((val) => {
      this.allowTrading = val;
    })
    this.cmServ.isDPChoosen.subscribe((val) => {
      this.allowDP = val;
    })

    this.cmServ.holderLength.subscribe(val => {
      this.indTabs = Array(val);
    })
    this.cmServ.hoderDetails.subscribe((val) => {
      this.holderdetails = Array(val);
      console.clear()
      console.log(this.holderdetails)
    })
    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val
    })

  }
  getimagedata() {

    let pan = ''
    if (this.activeTabIndex == 0) {
      pan = this.holderdetails[0]["FirstHolderpanNumber"]
    }
    if (this.activeTabIndex == 1) {
      pan = this.holderdetails[0]["SecondHolderpanNumber"]
    }
    if (this.activeTabIndex == 2) {
      pan = this.holderdetails[0]["ThirdHolderpanNumber"]
    }

    this.showPortal1 = true;
    this.previewImageData1 = {
      ImageFrom: 'FIN-ACCOP',
      PAN: pan
    }

  }
  ngAfterViewInit() {
    this.el.nativeElement.scrollIntoView();
    if (this.numberOfHolders > 1) {
      this.financails2.isShowderivativeProof = false
    }
    if (this.numberOfHolders > 2) {
      this.financails3.isShowderivativeProof = false
    }
    // if(this.clientProfileEdit){
    //   setTimeout(() => {
    //     this.fetchProfileEditData(0)
    //   });
    // }else{

    // }

    setTimeout(() => {
      if (this.dataServ.branch == "HO" || this.dataServ.branch == "HOGT") {
        // this.getimagedata();
      }
    }, 500);
    this.cmServ.isfinnacialIFSCloaded.subscribe(val => {debugger
      if (val) {
        this.isfinancialIFSCloaded = val
        this.fetchData(0)
      }
    })
    // this.cmServ.activeTab.subscribe(val => {
    //   if (val == 2 && this.financialFetchingDone == false) {
    //     this.fetchData(0)
    //   }
    // })
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


  // tabChange(data) {
  //   // if(this.clientProfileEdit){
  //   //   this.fetchProfileEditData(data)
  //   // }else{
  //   this.fetchData(data)
  //   // }
  // }
  fetchData(tabIndex) {

    if (tabIndex == 0) {
       this.spining = true;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            // Pan: this.holderdetails[0]["FirstHolderpanNumber"],
            // ClientSerialNo:this.clientSerialNumber,

            Tab: 'FIN',
            PAN: this.holderdetails[0]["FirstHolderpanNumber"] || '',
            Flag: this.clientProfileEdit ? 'P' : 'A',
            Euser: this.currentUser.userCode,
            ClientSerialNo: this.clientSerialNumber || '',
            DPID: '',
            ClientID: this.clientIdDetails["FirstHolderClientID"] || ''

          }],
        "requestId": "5065",
        "outTblCount": "0"
      }).then((response) => {

        if (response.errorCode == 0) {
          if (response.results) {

            let finacialDetails = response.results
            console.log('financial data', finacialDetails)
            if (finacialDetails[0].length > 0)
              this.financails1.financialForm.patchValue(finacialDetails[0][0])
            if (finacialDetails[1].length > 0) {
              this.financails1.derivativeProofsArray = finacialDetails[1]
            }

            if (finacialDetails[2].length > 0) {
              // finacialDetails[2][0].oft= finacialDetails[2][0].oft==true?'Y':'N'
              finacialDetails[2].forEach(item => {
                item.oft = item.oft == true ? 'Y' : 'N'
                // item["bankProof"]=this.bankProofImages.filter(o=>{
                //   return o.SlNo==item.SlNo
                // })
                // item["pisLetter"]=this.pisLetterproof.filter(pis=>{
                //   return pis.SlNo==item.SlNo
                // })

              });
              this.bankdetails.bankDetails = finacialDetails[2]
            }
            let form: any = this.bankdetails.form;
            if (finacialDetails[3].length > 0) {
              form.controls.DpBank.patchValue(finacialDetails[3][0])
              setTimeout(() => {
                let bank: any = this.bankdetails.form.controls.DpBank
                bank.controls.dpBankifscCode.patchValue(finacialDetails[3][0].dpBankifscCode)
                setTimeout(() => {
                  bank.controls.dpBankPin.patchValue(finacialDetails[3][0].dpBankPin)
                }, 200);
              },200);
            }
            if (finacialDetails[4].length > 0) {
              if (finacialDetails[4][0]["DPDocdoc"]) {

                // this.bankdetails.DPfileList.push(finacialDetails[4][0])
                this.bankdetails.DPBankProof = finacialDetails[4]
              }
            }
            if (finacialDetails[5].length > 0) {
              let bank: any = this.bankdetails.form.controls.NREdirectDebitBank

              // drbnkaccntNumber: "1234"
              // drbnkaddress: "UNIVERSAL INSURANCE BLDG, GROUND FLOOR, SIR P.M. ROAD, MUMBAI - 400 001"
              // drbnkbankAcType: "NRE Current"
              // drbnkbankname: "AXIS BANK LTD"
              // drbnkcity: "MUMBAI"
              // drbnkcountry: "INDIA"
              // drbnkifscCode: "UTIB0000004"
              // drbnkmicr: "400211002"
              // drbnkpin: "400001"
              // drbnkstate: "MAHARASHTRA"
              // drsigned: "true"
              // drsignedDate: "2020-02-04"
              bank.setValue(finacialDetails[5][0])
              setTimeout(() => {
                bank.controls.drbnkifscCode.patchValue(finacialDetails[5][0].drbnkifscCode)
                bank.controls.drbnkcountry.patchValue(finacialDetails[5][0].drbnkcountry)
                bank.controls.drbnkaccntNumber.patchValue(finacialDetails[5][0].drbnkaccntNumber)
                setTimeout(() => {
                  bank.controls.drbnkpin.patchValue(finacialDetails[5][0].drbnkpin)
                }, 100);
              }, 100);

            }
            if (finacialDetails[6].length) {
              this.bankdetails.DirectDebitBank = finacialDetails[6];
            }
            // if (finacialDetails[6].length > 0) {
            //   if (finacialDetails[6][0]["DirectDocdoc"]) {
            //     this.bankdetails.DirectfileList = finacialDetails[6]
            //     this.bankdetails.DirectDebitBank = finacialDetails[6][0]
            //   }
            // }

            if (finacialDetails[7].length > 0) {
              this.financails2.financialForm.patchValue(finacialDetails[7][0])

            }
            if (finacialDetails[8].length > 0) {
              this.financails3.financialForm.patchValue(finacialDetails[8][0])

            }
            if (finacialDetails[9].length) {

              this.bankProofImages = finacialDetails[9]
              this.bankdetails.bankDetails.forEach(item => {
                item["bankProof"] = this.bankProofImages.filter(o => {
                  return o.SlNo == item.SlNo
                })
              })
            }
            if (finacialDetails[10].length) {

              this.pisLetterproof = finacialDetails[10]
              this.bankdetails.bankDetails.forEach(item => {
                item["pisLetter"] = this.pisLetterproof.filter(o => {
                  return o.SlNo == item.SlNo
                })
              })
            }

             this.spining = false;
            this.financialFetchingDone = true;
          }
          else {
             this.spining = false;
          }
        }
        else {
           this.spining = false;
          this.notif.error(response.errorMsg, '')
        }
      })


    }
    // if(tabIndex==1){
    //   this.dataServ.getResultArray({
    //     "batchStatus": "false",
    //     "detailArray":
    //       [{
    //         Pan: this.holderdetails[0]["SecondHolderpanNumber"],
    //         ClientSerialNo:this.clientSerialNumber
    //       }],
    //     "requestId": "5017",
    //     "outTblCount": "0"
    //   }).then((response) => {
    //   let finacialDetails=response.results
    //   this.financails2.financialForm.patchValue(finacialDetails[7][0])
    // })
    // }
    // if(tabIndex==2){
    //   this.dataServ.getResultArray({
    //     "batchStatus": "false",
    //     "detailArray":
    //       [{
    //         Pan: this.holderdetails[0]["ThirdHolderpanNumber"],
    //         ClientSerialNo:this.clientSerialNumber
    //       }],
    //     "requestId": "5017",
    //     "outTblCount": "0"
    //   }).then((response) => {
    //    let finacialDetails=response.results
    //    this.financails3.financialForm.patchValue(finacialDetails[8][0])
    // })
    // }
  }

  fetchProfileEditData(tabIndex) {
    if (tabIndex == 0) {
      this.spining = true;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            ClientID: this.clientIdDetails["FirstHolderClientID"],
          }],
        "requestId": "5087",
        "outTblCount": "0"
      }).then((response) => {
        if (response.errorCode == 0) {
          if (response.results) {
            let finacialDetails = response.results
            console.log("fianancial data",finacialDetails)
            if (finacialDetails[0].length > 0)
              this.financails1.financialForm.patchValue(finacialDetails[0][0])
            if (finacialDetails[1].length > 0) {
              finacialDetails[1].forEach(element => {
                if (element.doc)
                  this.financails1.fileList.push(element)
              });
            }
            if (finacialDetails[2].length > 0)
              this.bankdetails.bankDetails = finacialDetails[2]

            let form: any = this.bankdetails.form;

            if (finacialDetails[3].length > 0)
              form.controls.DpBank.patchValue(finacialDetails[3][0])
            if (finacialDetails[4].length > 0) {
              if (finacialDetails[6][0]["DPDocdoc"]) {
                this.bankdetails.DPfileList.push(finacialDetails[4][0])
                this.bankdetails.DPBankProof = finacialDetails[4][0]
              }
            }
            
            if (finacialDetails[5].length > 0) {
              form.controls.NREdirectDebitBank.patchValue(finacialDetails[5][0])

            }

            if (finacialDetails[6].length > 0) {
              if (finacialDetails[6][0]["DirectDocdoc"]) {
                this.bankdetails.DirectfileList = finacialDetails[6]
                this.bankdetails.DirectDebitBank = finacialDetails[6][0]
              }
            }

            if (finacialDetails[7].length > 0) {
              this.financails2.financialForm.patchValue(finacialDetails[7][0])

            }
            if (finacialDetails[8].length > 0) {
              this.financails3.financialForm.patchValue(finacialDetails[8][0])

            }
          }
        }
        else {
          this.spining = false;
          this.notif.error(response.errorMsg, '')
        }
      })
      this.spining = false;

    }

  }


  continueNext() {
    if (this.EntryAccess == false) {
      this.next1()
      return
    }
    setTimeout(() => {
      if (this.indTabs.length > 1) {
        if (this.activeTabIndex < this.indTabs.length) {
          if (this.activeTabIndex == 0) {
            this.spining = true;

            // if(this.financails1.financialForm.value.AnnualIncome==null && this.financails1.financialForm.value.specificNetWorth==null){
            //   this.notif.error("Please fill the Annual Income or Net Worth",'',{nzDuration: 60000 })
            //       this.el.nativeElement.scrollIntoView();
            //       this.spining=false;
            //   return
            // }
            // else{
            //   if(this.financails1.financialForm.value.AnnualIncome!=null){
            //       if(this.financails1.financialForm.value.specificAnnInc==null){
            //         this.notif.error("Please fill the Specify annual income",'',{nzDuration: 60000 })
            //       this.el.nativeElement.scrollIntoView();
            //       this.spining=false;
            //         return
            //       }
            //   }

            if (this.financails1.financialForm.value.specificNetWorth > 0) {
              if (this.financails1.financialForm.value.networthasOn == null || this.financails1.financialForm.value.networthasOn == '') {
                this.notif.error("Please fill the Networth as on", '', { nzDuration: 60000 })
                this.el.nativeElement.scrollIntoView();
                this.spining = false;
                return
              }
            }
            // }

            let isValid = this.validServ.validateForm(this.financails1.financialForm, this.FormControlNames, this.customValidationMsgObj.IncomeDetails);
            if (!isValid) {
              this.spining = false;
              return
            }
            // if(this.financails1.financialForm.value.derivativedocuments==null){
            //   this.notif.error("Please fill Financial details for derivative Client",'',{nzDuration: 60000 })
            //   this.el.nativeElement.scrollIntoView();
            //   this.spining=false;
            //   return
            // }
            let isValid1 = this.financails1.validateReqFields()
            if (!isValid1) {
              this.spining = false;
              return
            }
            //   if(this.financails1.fileList.length==0){
            //    this.notif.error("Upload Financial details for derivative client",'',{nzDuration: 60000 })
            //    this.spining=false;
            //    return
            //  }
            let derivativeXmlData=''
            derivativeXmlData = this.financails1.getDerivativeProofDetails()
            if(derivativeXmlData.length==0){
                this.notif.error('Please Enter financial Details for Derivative Client','',{nzDuration: 60000 })
                this.spining = false;
                return
            }
            // if(derivativeXmlData!=undefined){
            //   if(derivativeXmlData.length<18)
            //   this.financails1.financialForm.controls.derivativedocuments.patchValue(null)
            // }
            debugger
            let data = [];
            let totlaData = { ...this.financails1.financialForm.value }
            totlaData["specificAnnInc"] = totlaData.specificAnnInc == '' || totlaData.specificAnnInc == null ? 0 : totlaData.specificAnnInc
            totlaData["specificNetWorth"] = totlaData.specificNetWorth == '' || totlaData.specificNetWorth == null ? 0 : totlaData.specificNetWorth
            data.push(totlaData);
            var JSONData1 = this.utilServ.setJSONArray(data);
            let financialdetailsXml = jsonxml(JSONData1);

            console.log(financialdetailsXml);

            let bankDataOriginal = JSON.stringify(this.bankdetails.bankDetails)
            let bankData=JSON.parse(bankDataOriginal)
            if (bankData.length < 1) {
              this.notif.error("Please add the Trading Banks to continue", '', { nzDuration: 60000 })
              this.spining = false;
              return
            }

            bankData.forEach((item, index) => {//Added by sachin
              item.bankProof.forEach(element => {
                element.bankDocname = element.bankDocname + (Number(index) + 1)
              });
              if (item.pisLetter) {
                item.pisLetter.forEach(element => {
                  element.nreDocname = element.nreDocname + (Number(index) + 1)
                });
              }
              item.bankProof = this.utilServ.setJSONArray(item.bankProof);
              if (item.pisLetter) {
                item.pisLetter = this.utilServ.setJSONArray(item.pisLetter);
              }
            })
            // bankData.forEach(element => {
            //   element.bankProof=this.utilServ.setJSONArray(element.bankProof)

            // });
            var JSONData2 = this.utilServ.setJSONArray(bankData);
            let tradingBankXml = jsonxml(JSONData2);

            console.log(tradingBankXml);
            let sameAsDPBank = this.bankdetails.isvisibledpbnk
            let DPBankXml = ''
            if (sameAsDPBank) {
              let form: any = this.bankdetails.form.controls.DpBank
              let isValid = this.validServ.validateForm(form, this.FormControlNames, this.customValidationMsgObj.DPBank);
              if (!isValid) {
                this.spining = false;
                return
              }
              let accno = this.bankdetails.checkAcNumbers(form.value.dpBankAccntNumber, form.value.dpBankConfrmAccntNumber);
              if (!accno) {
                this.notif.error("Dp Bank Account number and Confirm AccNumber should be same", '', { nzDuration: 60000 })
                this.spining = false;
                return
              }
              if (this.bankdetails.DPBankProof.length == 0) {
                this.notif.error("Upload DP Bank Proof", '', { nzDuration: 60000 })
                this.spining = false;
                return
              }
              form.value["dpBankProof"] = this.utilServ.setJSONArray(this.bankdetails.DPBankProof)
              let DPData = { ...form.value }
              let data1 = [];
              data1.push(DPData);
              let JSONData = this.utilServ.setJSONArray(data1);
              DPBankXml = jsonxml(JSONData);

            }
            console.log(DPBankXml);
            let showNREdetails = this.bankdetails.showNREdetails
            let NREDataXml = ''
            if (showNREdetails) {
              let form: any = this.bankdetails.form.controls.NREdirectDebitBank
              let isValid = this.validServ.validateForm(form, this.FormControlNames, this.customValidationMsgObj.DebitBank);
              if (!isValid) {
                this.spining = false;
                return
              }
              debugger;
              if (this.bankdetails.DirectDebitBank.length == 0) {
                this.notif.error("Upload Direct Debit Bank Mandate", '', { nzDuration: 60000 })
                this.spining = false;
                return
              }

              form.value["NREDirectBank"] = this.utilServ.setJSONArray(this.bankdetails.DirectDebitBank)
              let DirectData = { ...form.value }
              let data2 = [];
              data2.push(DirectData)
              let JSONData = this.utilServ.setJSONArray(data2);
              NREDataXml = jsonxml(JSONData);

            }
            this.notif.remove()
            this.dataServ.getResultArray({
              "batchStatus": "false",
              "detailArray":
                [{
                  Pan: this.holderdetails[0]["FirstHolderpanNumber"],
                  Euser: this.currentUser.userCode,
                  XML_FinancialDetails: financialdetailsXml.replace(/&/gi, '#||'),
                  XML_TradingBankDetails: tradingBankXml.replace(/&/gi, '#||'),
                  XML_DPBankDetails: DPBankXml.replace(/&/gi, '#||'),
                  XML_DirectBankDetails: NREDataXml.replace(/&/gi, '#||'),
                  ClientSerialNo: this.clientSerialNumber,
                  XML_FinancialImages: derivativeXmlData || '',
                  AutoSave: 'N',
                  Flag: this.clientProfileEdit ? 'P' : 'A'
                }],
              "requestId": "5016",
              "outTblCount": "0"
            }).then((response) => {

              if (response.errorCode == 0) {
                let details = response.results[0][0]
                if (details.ErrorCode == 0) {
                  this.notif.success(details.Msg, '');
                  this.spining = false;
                  this.activeTabIndex++;
                }
                else {
                  this.notif.error(details.Msg, '', { nzDuration: 60000 })
            this.spining = false;

                }
              }
              else {
                this.spining = false;
                this.notif.error(response.errorMsg, '')
              }
            })





          }
          if (this.activeTabIndex == 1) {
            this.spining = true;

            // if(this.financails2.financialForm.value.AnnualIncome==null && this.financails2.financialForm.value.specificNetWorth==null){
            //   this.notif.error("Please fill the Annual Income or Net Worth",'',{nzDuration: 60000 })
            //       this.el.nativeElement.scrollIntoView();
            //       this.spining=false;
            //   return
            // }
            // else{
            //   if(this.financails2.financialForm.value.AnnualIncome!=null){
            //       if(this.financails2.financialForm.value.specificAnnInc==null){
            //         this.notif.error("Please fill the Specify annual income",'',{nzDuration: 60000 })
            //       this.el.nativeElement.scrollIntoView();
            //       this.spining=false;
            //         return
            //       }
            //   }
            if (this.financails2.financialForm.value.specificNetWorth > 0) {
              if (this.financails2.financialForm.value.networthasOn == null || this.financails2.financialForm.value.networthasOn == '') {
                this.notif.error("Please fill the Networth as on", '', { nzDuration: 60000 })
                this.el.nativeElement.scrollIntoView();
                this.spining = false;
                return
              }
            }
            // }

            let isValid = this.validServ.validateForm(this.financails2.financialForm, this.FormControlNames, this.customValidationMsgObj.IncomeDetails);
            if (!isValid) {
              this.spining = false;
              return
            }

            let isValid1 = this.financails2.validateReqFields()
            if (!isValid1) {
              this.spining = false;
              return
            }
            // if(this.financails2.fileList.length==0){
            //   this.notif.error("Upload Financial details for derivative client",'',{nzDuration: 60000 })
            //    this.spining=false;
            //   return
            // }
            let data = [];

            let totlaData1 = { ...this.financails2.financialForm.value }
            totlaData1["specificAnnInc"] = totlaData1.specificAnnInc == '' || totlaData1.specificAnnInc == null ? 0 : totlaData1.specificAnnInc
            totlaData1["specificNetWorth"] = totlaData1.specificNetWorth == '' || totlaData1.specificNetWorth == null ? 0 : totlaData1.specificNetWorth

            data.push(totlaData1);
            let JSONData1 = this.utilServ.setJSONArray(data);
            let financialdetailsXml = jsonxml(JSONData1);
            console.log(financialdetailsXml);
            this.notif.remove()
            this.dataServ.getResultArray({
              "batchStatus": "false",
              "detailArray":
                [{

                  Pan: this.holderdetails[0]["SecondHolderpanNumber"],
                  Euser: this.currentUser.userCode,
                  XML_FinancialDetails: financialdetailsXml.replace(/&/gi, '#||'),
                  XML_TradingBankDetails: '',
                  XML_DPBankDetails: '',
                  XML_DirectBankDetails: '',
                  XML_FinancialImages: '',
                  ClientSerialNo: this.clientSerialNumber,
                  AutoSave: 'N',
                  Flag: this.clientProfileEdit ? 'P' : 'A',
                  
                  
                }],
              "requestId": "5016",
              "outTblCount": "0"
            }).then((response) => {
              if (response.errorCode == 0) {
                let details = response.results[0][0]
                if (details.ErrorCode == 0) {
                  this.notif.success(details.Msg, '');
                  this.spining = false;
                  this.activeTabIndex++;
                }
                else {
                  this.notif.error(details.Msg, '', { nzDuration: 60000 })
                this.spining = false;

                }
              }
              else {
                this.spining = false;
                this.notif.error(response.errorCode, '')
              }
            })

          }
          if (this.activeTabIndex == 2) {
            this.spining = true;

            // if(this.financails3.financialForm.value.AnnualIncome==null && this.financails3.financialForm.value.specificNetWorth==null){
            //   this.notif.error("Please fill the Annual Income or Net Worth",'',{nzDuration: 60000 })
            //       this.el.nativeElement.scrollIntoView();
            //       this.spining=false;
            //   return
            // }
            // else{
            //   if(this.financails3.financialForm.value.AnnualIncome!=null){
            //       if(this.financails3.financialForm.value.specificAnnInc==null){
            //         this.notif.error("Please fill the Specify annual income",'',{nzDuration: 60000 })
            //       this.el.nativeElement.scrollIntoView();
            //       this.spining=false;
            //         return
            //       }
            //   }
            if (this.financails3.financialForm.value.specificNetWorth > 0) {
              if (this.financails3.financialForm.value.networthasOn == null || this.financails3.financialForm.value.networthasOn == '') {
                this.notif.error("Please fill the Networth as on", '', { nzDuration: 60000 })
                this.el.nativeElement.scrollIntoView();
                this.spining = false;
                return
              }
            }
            // }


            let isValid = this.validServ.validateForm(this.financails3.financialForm, this.FormControlNames, this.customValidationMsgObj.IncomeDetails);
            if (!isValid) {
              this.spining = false;
              return
            }
            let isValid1 = this.financails3.validateReqFields()
            if (!isValid1) {
              this.spining = false;
              return
            }
            // if(this.financails2.fileList.length==0){
            //   this.notif.error("Upload Financial details for derivative client",'',{nzDuration: 60000 })
            //    this.spining=false;
            //   return
            // }
            let totlaData3 = { ...this.financails3.financialForm.value }
            totlaData3["specificAnnInc"] = totlaData3.specificAnnInc == '' || totlaData3.specificAnnInc == null ? 0 : totlaData3.specificAnnInc
            totlaData3["specificNetWorth"] = totlaData3.specificNetWorth == '' || totlaData3.specificNetWorth == null ? 0 : totlaData3.specificNetWorth
            let data = [];
            data.push(totlaData3);
            let JSONData2 = this.utilServ.setJSONArray(data);
            let financialdetailsXml = jsonxml(JSONData2);
            this.notif.remove()
            console.log(financialdetailsXml);
            this.dataServ.getResultArray({
              "batchStatus": "false",
              "detailArray":
                [{

                  Pan: this.holderdetails[0]["ThirdHolderpanNumber"],
                  Euser: this.currentUser.userCode,
                  XML_FinancialDetails: financialdetailsXml.replace(/&/gi, '#||'),
                  XML_TradingBankDetails: '',
                  XML_DPBankDetails: '',
                  XML_DirectBankDetails: '',
                  XML_FinancialImages: '',
                  ClientSerialNo: this.clientSerialNumber,
                  AutoSave: 'N',
                  Flag: this.clientProfileEdit ? 'P' : 'A'
                }],
              "requestId": "5016",
              "outTblCount": "0"
            }).then((response) => {
              if (response.errorCode == 0) {
                this.notif.remove()
                
                let details = response.results[0][0]
                if (details.ErrorCode == 0) {
                  this.notif.success(details.Msg, '');
                  this.spining = false;
                  this.activeTabIndex++;
                }
                else {
                  this.notif.error(details.Msg, '', { nzDuration: 60000 })
                  this.spining = false;
                }
              }
              else {
                this.spining = false;
                this.notif.error(response.errorMsg, '')
              }
            })

          }

        }
        else {
          this.el.nativeElement.scrollIntoView();
          this.subscriptions.forEach(ele => {
            ele.unsubscribe()
          })
          if (this.allowTrading && this.allowDP) {
            this.previewImageData1 = []

            this.cmServ.trigerTrading.next(true)
            this.cmServ.activeTabIndex.next(3)
          }
          if (this.allowTrading == true && this.allowDP == false) {
            this.cmServ.trigerTrading.next(true)

            this.previewImageData1 = []

            this.cmServ.activeTabIndex.next(3)
          }
          if (this.allowTrading == false && this.allowDP == true) {
            this.cmServ.trigerDp.next(true)

            this.previewImageData1 = []
            this.cmServ.activeTabIndex.next(4)
          }
          if (this.allowTrading == false && this.allowDP == false) {
            if (!this.clientProfileEdit) {
              this.cmServ.trigerIU.next(true)

              this.previewImageData1 = []
              this.cmServ.activeTabIndex.next(5)
            }
          }
        }
      }
      else {
        this.spining = true;

        // if(this.financails1.financialForm.value.AnnualIncome==null && this.financails1.financialForm.value.specificNetWorth==null){
        //   this.notif.error("Please fill the Annual Income or Net Worth",'',{nzDuration: 60000 })
        //       this.el.nativeElement.scrollIntoView();
        //       this.spining=false;
        //   return
        // }
        // else{
        //   if(this.financails1.financialForm.value.AnnualIncome!=null){
        //       if(this.financails1.financialForm.value.specificAnnInc==null){
        //         this.notif.error("Please fill the Specify annual income",'',{nzDuration: 60000 })
        //       this.el.nativeElement.scrollIntoView();
        //       this.spining=false;
        //         return
        //       }
        //   }
        if (this.financails1.financialForm.value.specificNetWorth > 0) {
          if (this.financails1.financialForm.value.networthasOn == null || this.financails1.financialForm.value.networthasOn == '') {
            this.notif.error("Please Select Networth as on date", '', { nzDuration: 60000 })
            this.el.nativeElement.scrollIntoView();
            this.spining = false;
            return
          }
        }
        // }

        let isValid = this.validServ.validateForm(this.financails1.financialForm, this.FormControlNames, this.customValidationMsgObj.IncomeDetails);
        if (!isValid) {
          this.el.nativeElement.scrollIntoView();
          this.spining = false;
          return
        }
        //  if(this.financails1.financialForm.value.derivativedocuments==null){
        //   this.notif.error("Please fill Financial details for derivative Client",'',{nzDuration: 60000 })
        //   this.el.nativeElement.scrollIntoView();
        //   this.spining=false;
        //   return
        // }
        let isValid1 = this.financails1.validateReqFields()
        if (!isValid1) {
          this.el.nativeElement.scrollIntoView();
          this.spining = false;
          return
        }
        //  if(this.financails1.fileList.length==0){
        //   this.notif.error("Upload Financial details for derivative client",'',{nzDuration: 60000 })
        //         this.el.nativeElement.scrollIntoView();
        //         this.spining=false;
        //   return
        // }
        let derivativeXmlData=''
        derivativeXmlData = this.financails1.getDerivativeProofDetails()
        // if(derivativeXmlData!=undefined){
        //   if(derivativeXmlData.length<18)
        //   this.financails1.financialForm.controls.derivativedocuments.patchValue(null)
        // }
        let data = [];

        let totlaData = { ...this.financails1.financialForm.value }
        totlaData["specificAnnInc"] = totlaData.specificAnnInc == '' || totlaData.specificAnnInc == null ? 0 : totlaData.specificAnnInc
        totlaData["specificNetWorth"] = totlaData.specificNetWorth == '' || totlaData.specificNetWorth == null ? 0 : totlaData.specificNetWorth
        data.push(totlaData);
        var JSONData1 = this.utilServ.setJSONArray(data);
        let financialdetailsXml = jsonxml(JSONData1);
    
        let bankDataOriginal = JSON.stringify(this.bankdetails.bankDetails)
         let bankData=JSON.parse(bankDataOriginal)
        if (bankData.length < 1) {
          this.notif.error("Please add the Trading Banks to continue", '', { nzDuration: 60000 })
          this.spining = false;
          return
        }
        // bankData.forEach(element => {
        //   element.bankProof={"Data":element.bankProof}

        // });
        bankData.forEach((item, index) => {//Added by sachin
          item.bankProof.forEach(element => {
            element.bankDocname = element.bankDocname + (Number(index) + 1)
          });
          if (item.pisLetter) {
            item.pisLetter.forEach(element => {
              element.nreDocname = element.nreDocname + (Number(index) + 1)
            });
          }
          item.bankProof = this.utilServ.setJSONArray(item.bankProof);
          if (item.pisLetter) {
            item.pisLetter = this.utilServ.setJSONArray(item.pisLetter);
          }
        })
        console.log("Bank 2", bankData)
        var JSONData2 = this.utilServ.setJSONArray(bankData);
        let tradingBankXml = jsonxml(JSONData2);

        let sameAsDPBank = this.bankdetails.isvisibledpbnk
        let DPBankXml = ''
        if (sameAsDPBank) {
          let form: any = this.bankdetails.form.controls.DpBank
          let isValid = this.validServ.validateForm(form, this.FormControlNames, this.customValidationMsgObj.DPBank);
          if (!isValid) {
            this.spining = false;
            return
          }
          let accno = this.bankdetails.checkAcNumbers(form.value.dpBankAccntNumber, form.value.dpBankConfrmAccntNumber);
          if (!accno) {
            this.notif.error("Dp Bank Account number and Conf.AccNumber should be same", '', { nzDuration: 60000 })
            this.spining = false;
            return
          }
          if (this.bankdetails.DPBankProof.length == 0) {
            this.notif.error("Upload DP Bank Proof", '', { nzDuration: 60000 })
            this.spining = false;
            return
          }

          form.value["dpBankProof"] = this.utilServ.setJSONArray(this.bankdetails.DPBankProof)
          let DPData = { ...form.value }
          let data1 = []
          data1.push(DPData);
          // data1.push(DPData);
          let JSONData = this.utilServ.setJSONArray(data1);
          DPBankXml = jsonxml(JSONData);

        }
        let showNREdetails = this.bankdetails.showNREdetails
        let NREDataXml = ''
        if (showNREdetails) {
          let form: any = this.bankdetails.form.controls.NREdirectDebitBank
          let isValid = this.validServ.validateForm(form, this.FormControlNames, this.customValidationMsgObj.DebitBank);
          if (!isValid) {
            this.spining = false;
            return
          }
          if (this.bankdetails.DirectDebitBank.length == 0) {
            this.notif.error("Upload Direct Debit Bank Mandate", '', { nzDuration: 60000 })
            this.spining = false;
            return
          }

          form.value["NREDirectBank"] = this.utilServ.setJSONArray(this.bankdetails.DirectDebitBank)
          let DirectData = { ...form.value }
          let data2 = [];
          data2.push(DirectData)
          let JSONData = this.utilServ.setJSONArray(data2);
          NREDataXml = jsonxml(JSONData);
        }
        this.notif.remove()
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: this.holderdetails[0]["FirstHolderpanNumber"],
              Euser: this.currentUser.userCode,
              XML_FinancialDetails: financialdetailsXml.replace(/&/gi, '#||'),
              XML_TradingBankDetails: tradingBankXml.replace(/&/gi, '#||'),
              XML_DPBankDetails: DPBankXml.replace(/&/gi, '#||'),
              XML_DirectBankDetails: NREDataXml.replace(/&/gi, '#||'),
              XML_FinancialImages: derivativeXmlData || '',
              ClientSerialNo: this.clientSerialNumber,
              AutoSave: 'N',
              Flag: this.clientProfileEdit ? 'P' : 'A'
            }],
          "requestId": "5016",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            this.spining = false
            let details = response.results[0][0]
            if (details.ErrorCode == 0) {
              this.el.nativeElement.scrollIntoView();
              this.subscriptions.forEach(ele => {
                ele.unsubscribe()
              })
              this.notif.success(details.Msg, '');

              if (this.allowTrading && this.allowDP) {
                this.cmServ.trigerTrading.next(true)
                this.previewImageData1 = []
                this.notif.remove()

                this.cmServ.activeTabIndex.next(3)
              }
              if (this.allowTrading == true && this.allowDP == false) {
                this.cmServ.trigerTrading.next(true)
                this.previewImageData1 = []


                this.cmServ.activeTabIndex.next(3)
              }
              if (this.allowTrading == false && this.allowDP == true) {
                this.cmServ.trigerDp.next(true)
                this.previewImageData1 = []


                this.cmServ.activeTabIndex.next(4)
              }
              if (this.allowTrading == false && this.allowDP == false) {
                if (!this.clientProfileEdit) {
                  this.cmServ.trigerScheme.next(true)
                  this.previewImageData1 = []

                  this.cmServ.activeTabIndex.next(5)
                }
              }

            }
            else {
              this.notif.error(details.Msg, '', { nzDuration: 60000 })
            }
            this.spining = false;
          } else {
            this.spining = false;
            this.notif.error(response.errorMsg, '')
          }
        })

      }
    }, 300)
  }

  saveToTemprary() {
    if (this.activeTabIndex < this.indTabs.length) {
      if (this.activeTabIndex == 0) {
        let data = [];
        let totlaData = { ...this.financails1.financialForm.value }
        totlaData["specificAnnInc"] = totlaData.specificAnnInc == '' || totlaData.specificAnnInc == null || totlaData.specificAnnInc == null ? 0 : totlaData.specificAnnInc
        totlaData["specificNetWorth"] = totlaData.specificNetWorth == '' || totlaData.specificNetWorth == null || totlaData.specificNetWorth == null ? 0 : totlaData.specificNetWorth
        data.push(totlaData);
        var JSONData1 = this.utilServ.setJSONArray(data);
        let financialdetailsXml = jsonxml(JSONData1);

        let derivativeXmlData=''
        derivativeXmlData = this.financails1.getDerivativeProofDetails()
        // if(derivativeXmlData!=undefined){
        //   if(derivativeXmlData.length<18)
        //   this.financails1.financialForm.controls.derivativedocuments.patchValue(null)
        // }

        let bankDataOriginal = JSON.stringify(this.bankdetails.bankDetails)
        let bankData=JSON.parse(bankDataOriginal)

        if (bankData.length > 0) {
        bankData.forEach((item, index) => {//Added by sachin
          item.bankProof.forEach(element => {
            element.bankDocname = element.bankDocname + (Number(index) + 1)
          });
          if (item.pisLetter) {
            item.pisLetter.forEach(element => {
              element.nreDocname = element.nreDocname + (Number(index) + 1)
            });
          }
          item.bankProof = this.utilServ.setJSONArray(item.bankProof);
          if (item.pisLetter) {
            item.pisLetter = this.utilServ.setJSONArray(item.pisLetter);
          }
        })
      }
        var JSONData2 = this.utilServ.setJSONArray(bankData);
        let tradingBankXml = jsonxml(JSONData2);

        let sameAsDPBank = this.bankdetails.isvisibledpbnk
        let DPBankXml = ''
        if (sameAsDPBank) {
          let form: any = this.bankdetails.form.controls.DpBank
          // let isValid = this.validServ.validateForm(form, this.FormControlNames);
          let accno = this.bankdetails.checkAcNumbers(form.value.dpBankAccntNumber, form.value.dpBankConfrmAccntNumber);
          form.value["dpBankProof"] = this.utilServ.setJSONArray(this.bankdetails.DPBankProof)
          let DPData = { ...form.value }
          let data1 = [];
          data1.push(DPData);
          let JSONData = this.utilServ.setJSONArray(data1);
          DPBankXml = jsonxml(JSONData);

        }
        let showNREdetails = this.bankdetails.showNREdetails
        let NREDataXml = ''
        if (showNREdetails) {
          let form: any = this.bankdetails.form.controls.NREdirectDebitBank
          form.value["NREDirectBank"] = this.utilServ.setJSONArray(this.bankdetails.DirectDebitBank)
          let DirectData = { ...form.value }
          let data2 = [];
          data2.push(DirectData)
          let JSONData = this.utilServ.setJSONArray(data2);
          NREDataXml = jsonxml(JSONData);

        }
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              Pan: this.holderdetails[0]["FirstHolderpanNumber"],
              Euser: this.currentUser.userCode,
              XML_FinancialDetails: financialdetailsXml.replace(/&/gi, '#||'),
              XML_TradingBankDetails: tradingBankXml.replace(/&/gi, '#||'),
              XML_DPBankDetails: DPBankXml.replace(/&/gi, '#||'),
              XML_DirectBankDetails: NREDataXml.replace(/&/gi, '#||'),
              XML_FinancialImages: derivativeXmlData || '',
              ClientSerialNo: this.clientSerialNumber,
              AutoSave: 'Y',
              Flag: this.clientProfileEdit ? 'P' : 'A'
            }],
          "requestId": "5016",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            let details = response.results[0][0]
            if (details.ErrorCode == 0) {
              // this.notif.success(details.Msg, '');
            }
            else {
              // this.notif.error(details.Msg, '',{nzDuration: 60000 })
            }
          } else {
            this.spining = false;
            this.notif.error(response.errorMsg, '')
          }
        })
      }
      if (this.activeTabIndex == 1) {
        // let isValid = this.validServ.validateForm(this.financails2.financialForm, this.FormControlNames);
        let data = [];
        let totlaData1 = { ...this.financails2.financialForm.value, ...this.financails2.financialDocument }
        totlaData1["specificAnnInc"] = totlaData1.specificAnnInc == '' || totlaData1.specificAnnInc == null ? 0 : totlaData1.specificAnnInc
        totlaData1["specificNetWorth"] = totlaData1.specificNetWorth == '' || totlaData1.specificNetWorth == null ? 0 : totlaData1.specificNetWorth
        data.push(totlaData1);
        let JSONData1 = this.utilServ.setJSONArray(data);
        let financialdetailsXml = jsonxml(JSONData1);

        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{

              Pan: this.holderdetails[0]["SecondHolderpanNumber"],
              Euser: this.currentUser.userCode,
              XML_FinancialDetails: financialdetailsXml.replace(/&/gi, '#||'),
              XML_TradingBankDetails: '',
              XML_DPBankDetails: '',
              XML_DirectBankDetails: '',
              ClientSerialNo: this.clientSerialNumber,
              AutoSave: 'Y',
              Flag: this.clientProfileEdit ? 'P' : 'A',
              XML_FinancialImages: '',
            }],
          "requestId": "5016",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            let details = response.results[0][0]
            if (details.ErrorCode == 0) {
              // this.notif.success(details.Msg, '');
            }
            else {
              // this.notif.error(details.Msg, '',{nzDuration: 60000 })
            }
          }
          else {
            this.spining = false;
            this.notif.error(response.errorMsg, '')
          }
        })

      }
      if (this.activeTabIndex == 2) {
        let totlaData3 = { ...this.financails3.financialForm.value, ...this.financails3.financialDocument }
        totlaData3["specificAnnInc"] = totlaData3.specificAnnInc == '' || totlaData3.specificAnnInc == null ? 0 : totlaData3.specificAnnInc
        totlaData3["specificNetWorth"] = totlaData3.specificNetWorth == '' || totlaData3.specificNetWorth == null ? 0 : totlaData3.specificNetWorth
        let data = [];
        data.push(totlaData3);
        let JSONData2 = this.utilServ.setJSONArray(data);
        let financialdetailsXml = jsonxml(JSONData2);

        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{

              Pan: this.holderdetails[0]["ThirdHolderpanNumber"],
              Euser: this.currentUser.userCode,
              XML_FinancialDetails: financialdetailsXml.replace(/&/gi, '#||'),
              XML_TradingBankDetails: '',
              XML_DPBankDetails: '',
              XML_DirectBankDetails: '',
              XML_FinancialImages: '',
              ClientSerialNo: this.clientSerialNumber,
              Flag: this.clientProfileEdit ? 'P' : 'A',
              AutoSave: 'Y',
            }],
          "requestId": "5016",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            let details = response.results[0][0]
            if (details.ErrorCode == 0) {
              // this.notif.success(details.Msg, '');
            }
            else {
              // this.notif.error(details.Msg, '',{nzDuration: 60000 })
            }
          }
          else { 
          this.spining = false;
          this.notif.error(response.errorMsg, '')
        }
        })
      }

    }
    else {
      this.el.nativeElement.scrollIntoView();

      let data = [];
      let totlaData = { ...this.financails1.financialForm.value, ...this.financails1.financialDocument }
      totlaData["specificAnnInc"] = totlaData.specificAnnInc == '' || totlaData.specificAnnInc == null ? 0 : totlaData.specificAnnInc
      totlaData["specificNetWorth"] = totlaData.specificNetWorth == '' || totlaData.specificNetWorth == null ? 0 : totlaData.specificNetWorth
      data.push(totlaData);
      var JSONData1 = this.utilServ.setJSONArray(data);
      let financialdetailsXml = jsonxml(JSONData1);

      
      let bankDataOriginal = JSON.stringify(this.bankdetails.bankDetails)
      let bankData=JSON.parse(bankDataOriginal)
      
      bankData.forEach((item, index) => {//Added by sachin
        item.bankProof.forEach(element => {
          element.bankDocname = element.bankDocname + (Number(index) + 1)
        });
        if (item.pisLetter) {
          item.pisLetter.forEach(element => {
            element.nreDocname = element.nreDocname + (Number(index) + 1)
          });
        }
        item.bankProof = this.utilServ.setJSONArray(item.bankProof);
        if (item.pisLetter) {
          item.pisLetter = this.utilServ.setJSONArray(item.pisLetter);
        }
      })
      let derivativeXmlData=''
      derivativeXmlData = this.financails1.getDerivativeProofDetails()


      // if(derivativeXmlData!=undefined){
      //   if(derivativeXmlData.length<18)
      //   this.financails1.financialForm.controls.derivativedocuments.patchValue(null)
      // }

      var JSONData2 = this.utilServ.setJSONArray(bankData);
      let tradingBankXml = jsonxml(JSONData2);

      let sameAsDPBank = this.bankdetails.isvisibledpbnk
      let DPBankXml = ''
      if (sameAsDPBank) {
        let form: any = this.bankdetails.form.controls.DpBank
        form.value["dpBankProof"] = this.utilServ.setJSONArray(this.bankdetails.DPBankProof)
        let DPData = { ...form.value }
        let data1 = [];
        data1.push(DPData);
        let JSONData = this.utilServ.setJSONArray(data1);
        DPBankXml = jsonxml(JSONData);

      }
      let showNREdetails = this.bankdetails.showNREdetails
      let NREDataXml = ''
      if (showNREdetails) {
        let form: any = this.bankdetails.form.controls.NREdirectDebitBank
        form.value["NREDirectBank"] = this.utilServ.setJSONArray(this.bankdetails.DirectDebitBank)
        let DirectData = { ...form.value }
        let data2 = [];
        data2.push(DirectData)
        let JSONData = this.utilServ.setJSONArray(data2);
        NREDataXml = jsonxml(JSONData);

      }

      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            Pan: this.holderdetails[0]["FirstHolderpanNumber"],
            Euser: this.currentUser.userCode,
            XML_FinancialDetails: financialdetailsXml.replace(/&/gi, '#||'),
            XML_TradingBankDetails: tradingBankXml.replace(/&/gi, '#||'),
            XML_DPBankDetails: DPBankXml.replace(/&/gi, '#||'),
            XML_DirectBankDetails: NREDataXml.replace(/&/gi, '#||'),
            XML_FinancialImages: derivativeXmlData || '',
            ClientSerialNo: this.clientSerialNumber,
            AutoSave: 'Y',
          }],
        "requestId": "5016",
        "outTblCount": "0"
      }).then((response) => {
        if (response.errorCode == 0) {
          let details = response.results[0][0]
          if (details.ErrorCode == 0) {
            // this.notif.success(details.Msg, '');
          }
          else {
            // this.notif.error(details.Msg, '',{nzDuration: 60000 })
          }
        }
        else {
          this.spining = false;
          this.notif.error(response.errorMsg, '')
        }
      })

    }
  }

  continueNonIndividualNext() {

    if (this.financails1.financialForm.value.AnnualIncome == null && this.financails1.financialForm.value.specificNetWorth == null) {
      this.notif.error("Please fill the Annual Income or Net Worth", '', { nzDuration: 60000 })
      this.el.nativeElement.scrollIntoView();

      return
    }
    else {
      if (this.financails1.financialForm.value.AnnualIncome != null) {
        if (this.financails1.financialForm.value.specificAnnInc == null) {
          this.notif.error("Please fill the Specify annual income", '', { nzDuration: 60000 })
          this.el.nativeElement.scrollIntoView();

          return
        }
      }
      if (this.financails1.financialForm.value.specificNetWorth > 0) {
        if (this.financails1.financialForm.value.networthasOn == null || this.financails1.financialForm.value.networthasOn == '') {
          this.notif.error("Please fill the Networth as on", '', { nzDuration: 60000 })
          this.el.nativeElement.scrollIntoView();

          return
        }
      }
    }

    let isValid = this.validServ.validateForm(this.financails1.financialForm, this.FormControlNames);
    if (!isValid) {
      this.el.nativeElement.scrollIntoView();
      return
    }

    let isValid1 = this.financails1.validateReqFields()
    if (!isValid1) {
      this.el.nativeElement.scrollIntoView();
      return
    }

    if (this.financails1.fileList.length == 0) {
      this.notif.error("Upload Financial details for derivative client", '', { nzDuration: 60000 })
      this.el.nativeElement.scrollIntoView();
      return
    }
    if (this.financails1.fileList1.length == 0) {
      this.notif.error("Upload 2 Year balace sheet", '', { nzDuration: 60000 })
      this.el.nativeElement.scrollIntoView();
      return
    }
    if (this.financails1.fileList2.length == 0) {
      this.notif.error("Upload 2 years P & L", '', { nzDuration: 60000 })
      this.el.nativeElement.scrollIntoView();
      return
    }
    let data = [];
    let totlaData = { ...this.financails1.financialForm.value, ...this.financails1.financialDocument, ...this.financails1.balanceSheetDocument, ...this.financails1.PandLDocument }
    totlaData["specificAnnInc"] = totlaData.specificAnnInc == '' ? 0 : totlaData.specificAnnInc
    totlaData["specificNetWorth"] = totlaData.specificNetWorth == '' ? 0 : totlaData.specificNetWorth
    data.push(totlaData);
    var JSONData1 = this.utilServ.setJSONArray(data);
    let financialdetailsXml = jsonxml(JSONData1);


    console.log(financialdetailsXml);
    let bankDataOriginal = JSON.stringify(this.bankdetails.bankDetails)
     let bankData=JSON.parse(bankDataOriginal)
    if (bankData.length < 1) {
      this.notif.error("Please add the Trading Banks to continue", '', { nzDuration: 60000 })
      return
    }
    bankData.forEach((item, index) => {//Added by sachin
      item.bankProof.forEach(element => {
        element.bankDocname = element.bankDocname + (Number(index) + 1)
      });
      if (item.pisLetter) {
        item.pisLetter.forEach(element => {
          element.nreDocname = element.nreDocname + (Number(index) + 1)
        });
      }
      item.bankProof = this.utilServ.setJSONArray(item.bankProof);
      item.pisLetter = this.utilServ.setJSONArray(item.pisLetter);
    })

    console.log("Bank data", bankData)
    var JSONData2 = this.utilServ.setJSONArray(bankData);
    let tradingBankXml = jsonxml(JSONData2);
    console.log(tradingBankXml);
    let sameAsDPBank = this.bankdetails.isvisibledpbnk
    let DPBankXml = ''
    if (sameAsDPBank) {
      let form: any = this.bankdetails.form.controls.DpBank
      let isValid = this.validServ.validateForm(form, this.FormControlNames);
      if (!isValid) {
        return
      }
      let accno = this.bankdetails.checkAcNumbers(form.value.dpBankAccntNumber, form.value.dpBankConfrmAccntNumber);
      if (!accno) {
        this.notif.error("Dp Bank Account number and Conf.AccNumber should be same", '', { nzDuration: 60000 })
        return
      }
      if (this.bankdetails.DPfileList.length == 0) {
        this.notif.error("Upload DP Bank Proof", '', { nzDuration: 60000 })
        return
      }
      form.value["dpBankProof"] = this.utilServ.setJSONArray(this.bankdetails.DPBankProof)
      let DPData = { ...form.value }
      let data1 = [];
      data1.push(DPData);
      let JSONData = this.utilServ.setJSONArray(data1);
      DPBankXml = jsonxml(JSONData);

    }
    console.log(DPBankXml);
    let showNREdetails = this.bankdetails.showNREdetails
    let NREDataXml = ''
    if (showNREdetails) {
      let form: any = this.bankdetails.form.controls.NREdirectDebitBank
      let isValid = this.validServ.validateForm(form, this.FormControlNames);
      if (!isValid) {
        return
      }
      if (this.bankdetails.DirectDebitBank.length == 0) {
        this.notif.error("Upload Direct Debit Bank Mandate", '', { nzDuration: 60000 })
        return
      }
      form.value["NREDirectBank"] = this.utilServ.setJSONArray(this.bankdetails.DirectDebitBank)
      let DirectData = { ...form.value }
      let data2 = [];
      data2.push(DirectData)
      let JSONData = this.utilServ.setJSONArray(data2);
      NREDataXml = jsonxml(JSONData);

    }
    console.log(NREDataXml);
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Pan: this.holderdetails[0]["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          XML_FinancialDetails: financialdetailsXml.replace(/&/gi, '#||'),
          XML_TradingBankDetails: tradingBankXml.replace(/&/gi, '#||'),
          XML_DPBankDetails: DPBankXml.replace(/&/gi, '#||'),
          XML_DirectBankDetails: NREDataXml.replace(/&/gi, '#||'),
          ClientSerialNo: this.clientSerialNumber,
          AutoSave: 'N',
          Flag: this.clientProfileEdit ? 'P' : 'A'
        }],
      "requestId": "5016",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        let details = response.results[0][0]
        if (details.ErrorCode == 0) {
          this.el.nativeElement.scrollIntoView();
          this.subscriptions.forEach(ele => {
            ele.unsubscribe()
          })
          this.notif.success(details.Msg, '');


        }
        else {
          this.notif.error(details.Msg, '', { nzDuration: 60000 })
        }
      }
      else {
        this.spining = false;
        this.notif.error(response.errorMsg, '')
      }
    })


  }
  next1() {

    this.previewImageData1 = []
    this.el.nativeElement.scrollIntoView();
    this.subscriptions.forEach(ele => {
      ele.unsubscribe()
    })
    if (this.allowTrading && this.allowDP) {
      this.cmServ.trigerTrading.next(true)
      this.cmServ.activeTabIndex.next(3)
    }
    if (this.allowTrading == true && this.allowDP == false) {
      this.cmServ.trigerTrading.next(true)
      this.cmServ.activeTabIndex.next(3)
    }
    if (this.allowTrading == false && this.allowDP == true) {
      this.cmServ.trigerDp.next(true)
      this.cmServ.activeTabIndex.next(4)
    }
    if (this.allowTrading == false && this.allowDP == false) {
      if (!this.clientProfileEdit) {
        this.cmServ.trigerScheme.next(true)
        this.cmServ.activeTabIndex.next(5)
      }
    }
  }
  back() {
    this.previewImageData1 = []
    this.el.nativeElement.scrollIntoView();
    this.subscriptions.forEach(ele => {
      ele.unsubscribe()
    })
    this.cmServ.activeTabIndex.next(1)
  }
  //  @HostListener('window:keydown',['$event'])
  //  onKeyPress($event: KeyboardEvent) {
  //   if(this.currTabIndex==2){
  //      if($event.altKey && $event.key === 's')
  //         this.saveToTemprary()
  //      if($event.ctrlKey  && $event.key === 's'){
  //         $event.preventDefault();
  //         $event.stopPropagation();
  //         this.continueNext()
  //      }
  //     }
  //  }
}
