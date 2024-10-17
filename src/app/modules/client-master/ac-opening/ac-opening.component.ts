import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as  jsonxml from 'jsontoxml'
import { UtilService, AuthService, WorkspaceService } from 'shared';
import { ValidationService, DataService } from 'shared'
import { ClientMasterService } from '../client-master.service';
import { InputMasks } from 'shared';
import { FindOptions, AppConfig } from "shared";
import { User } from 'shared';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { NzNotificationService } from 'ng-zorro-antd';
import { interval, Subscription } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { accountOpeningValidations } from './accountOpeningValidationConfig'
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@AutoUnsubscribe({
  includeArrays: true,
  arrayName: 'subscriptions'
})
@Component({
  selector: 'client-master-ac-opening',
  templateUrl: './ac-opening.component.html',
  styleUrls: ['./ac-opening.component.less'],


})
export class AcOpeningComponent implements OnInit, OnChanges {
  subscriptions: Subscription[] = [];
  @ViewChild('WindowComponent') WindowComponent;
  isPanValid: boolean = true;
  holderArray: any = [[]]
  showB2Bbanks: boolean = false;
  spin: boolean = false
  // index:number;
  inputMasks = InputMasks;
  currentUser: User;
  holCount: number = 1
  MaxHolderCount = 1;
  form: FormGroup;
  defaultClientType: string = 'individual';
  defaultHolderLength: number = 1;
  noOfTabs: number = 1;
  indClientSubType: any = []
  nonIndClientSubType: any = [];
  isShwoTrading: boolean = true;
  subType: any = []
  FormControlNames: any = {};
  noOfHolders: number = 1;
  holderDetails: any;
  HoldersData: any;
  josnData: any = {}
  RegionFindopt: FindOptions;
  resultArray: any;
  PanDetails: any = [];
  isholder1Pan: boolean = false;
  holder2Pan1: boolean = false;
  holder2Pan2: boolean = false;
  holder3Pan1: boolean = false;
  holder3Pan2: boolean = false;
  holder3Pan3: boolean = false;
  hold1VarifiedPanDetails: any
  hold2VarifiedPanDetails: any
  hold3VarifiedPanDetails: any
  ClientSerialNo: any = 0;
  accountTypeOptions: any = []
  accountTypeOptions1: any = []
  TradingDPChoosen: boolean;
  accountType: any = [];
  BankNamesArray: any;
  open: boolean;
  confirmModal: NzModalRef;
  showPortal = false;
  previewImageData: any = [];
  branch: string;
  EntryAccess: boolean = true;
  isServiceblocked: boolean = false;
  autosave: boolean = true;
  currTabIndex: number;
  wsKey: string;
  autosaveTiming: any = 60000;
  clientProfileEdit: boolean = false;
  holderDataFromCmServ: any;
  globalListenFunc: Function;
  ClientIdDetails: any;
  customMsgObj = accountOpeningValidations;
  storeDetails: any = {};
  today = new Date()
  holder1NameInPanSite: string = ''
  holder2NameInPanSite: string = ''
  holder3NameInPanSite: string = ''
  isTradingsaved: boolean = false;
  isdpsaved: boolean = false;
  isfirstHolderDobValid: boolean = false;
  isSecondHolderDobValid: boolean = false;
  isThirdHolderDobValid: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authServ: AuthService,
    private cmServ: ClientMasterService,
    private utilServ: UtilService,
    private validServ: ValidationService,
    public dataServ: DataService,
    private modal: NzModalService,
    private notif: NzNotificationService,
    private wsServ: WorkspaceService,
    private renderer: Renderer2
  ) {
    this.subscriptions.push(
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
        this.branch = this.dataServ.branch
      }))
    // console.clear()
    this.wsServ.activeWorkspace.subscribe((ws) => {
      this.wsKey = ws.title
      setTimeout(() => {
        if (this.wsKey == 'Client Profile Edit') {
          this.clientProfileEdit = true
          this.cmServ.isClientProfileEdit.next(true)
        }
        else {
          this.clientProfileEdit = false
          this.cmServ.isClientProfileEdit.next(false)

        }
      });
    })
    this.cmServ.hoderDetails.subscribe(val => {
      this.holderDataFromCmServ = val
    })
    this.RegionFindopt = {
      findType: 1004,
      codeColumn: 'REGION',
      codeLabel: 'REGION',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      // whereClause: "location ='" + this.dataServ.branch + "'"
    }

    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       tab:'AcctOp',
    //     }],
    //   "requestId": "5034",
    //   "outTblCount": "0"
    // }).then((response) => {
    //   if (response.results) {
    //     console.log(response.results)
    //      
    //    this.customMsgObj=response.results[0]

    //   }
    // })

    this.spin = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Loc: ''
        }],
      "requestId": "5008",
      "outTblCount": "0"
    }).then((response) => {
      if (response.results) {
        // console.log(response.results)
        let subType = response.results[0]
        let AccountTypeOpt = response.results[1]
        this.BankNamesArray = response.results[2]
        if (response.results[3].length) {
          let autosave = response.results[3][0]
          this.autosaveTiming = autosave.Value;
          this.cmServ.autoSaveTiming.next(autosave.Value)
        }

        //  this.isServiceblocked=sb.Value
        //  this.cmServ.isServiceBlocked.next(sb.Value)
        subType.forEach(element => {
          if (element.Type == "Individual")
            this.indClientSubType.push(element)
          else
            this.nonIndClientSubType.push(element)
        });
        this.subType = this.indClientSubType

        AccountTypeOpt.forEach(element => {
          if (element.GroupID == 1)
            this.accountTypeOptions.push(element)
          else
            this.accountTypeOptions1.push(element)
        });
        this.getDataAfterAccountTypesLoaded()
        if (this.ClientSerialNo == 0)
          this.spin = false;
      }
      else {
        this.spin = false
      }

    })


  }

  getData(value) {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          PAN: value,
          Flag: 'profEdit'
        }],
      "requestId": "5064",
      "outTblCount": "0"
    }).then((response) => {
      if (response.results) {
        this.resultArray = response.results[0]
      }
    })
  }
  //   fetchProfileEditHolderData(data) {
  //     // this.spin=true;
  //      
  //     this.dataServ.getResultArray({
  //       "batchStatus": "false",
  //       "detailArray":
  //         [{
  //           ClientID:data.ClientID

  //         }],
  //       "requestId": "5068"
  //     }).then((response) => {
  //       if (response.results) {
  //         console.log(response.results)
  //        let ClientIdDetails = response.results[6][0]
  //        this.cmServ.clientIdDetails.next(ClientIdDetails)
  //         // this.EntryAccess = response.results[6][0]["EntryAccess"]
  //         // this.cmServ.finalize.next(response.results[6][0]["FinalizeFlag"])
  //         // this.cmServ.isEntryAccess.next(this.EntryAccess)
  //         let accountDetials = response.results[0][0]
  //         this.form.controls.masterForm.patchValue(accountDetials)

  //         let optionsArr = response.results[4]
  //         let optionDetails = response.results[5]
  //         this.accountType = []
  //         optionDetails.forEach(element => {
  //           if (element.checked) {
  //             if (element.label == 'B2B')
  //               this.showB2Bbanks = true
  //             element.value = element.value.replace(/\s/g, '');
  //             element.value = element.value.replace('+', '')
  //             var obj = new Object;
  //             obj[element.value] = element.checked;
  //             this.accountType.push(obj)
  //           }
  //         });
  //         //  this.accountType=optionsArr
  //         let option1 = []
  //         let option2 = []
  //         optionsArr.forEach(element => {
  //           if (element.GroupID == 1)
  //             option1.push(element)
  //           else
  //             option2.push(element)
  //         });

  //         let obj = new Object()
  //         let obj1 = new Object()
  //         let obj2 = new Object()
  //         obj = response.results[1][0]
  //         this.cmServ.hoderDetails.next(obj)
  //         obj1 = response.results[2][0] || {}
  //         obj2 = response.results[3][0] || {}
  //         // let count = Object.keys(HoldersData)
  //         this.isPanValid = true;
  //         if (accountDetials.holCount==1) {
  //           let HoldersData = { ...obj }
  //           this.checkPan(obj["FirstHolderpanNumber"])
  //           this.form.controls.oneHolder.setValue(HoldersData)
  //         }
  //         if (accountDetials.holCount==2) {
  //           let HoldersData = { ...obj, ...obj1 }
  //           this.form.controls.twoHolder.setValue(HoldersData)
  //           this.holder2checkPan1(obj["FirstHolderpanNumber"])
  //           this.holder2checkPan2(obj1["SecondHolderpanNumber"])
  //           this.holder2Pan2 = true
  //         }
  //         if (accountDetials.holCount==3) {
  //           let HoldersData = { ...obj, ...obj1, ...obj2 }
  //           this.form.controls.threeHolder.setValue(HoldersData)
  //             this.holder3checkPan1(obj["FirstHolderpanNumber"])
  //             this.holder3checkPan2(obj1["SecondHolderpanNumber"])
  //             this.holder3checkPan3(obj2["ThirdHolderpanNumber"])
  //         }

  //         // form.controls.holCount.patchValue(accountDetials.holCount)
  //         // form.controls.clientSubType.patchValue(accountDetials.clientSubType)
  //         // form.controls.clientType.patchValue(accountDetials.clientType)
  //         // form.controls.tradingAcHolder.patchValue(accountDetials.tradingAcHolder)
  //         this.accountTypeOptions = option1
  //         this.accountTypeOptions1 = option2
  //         this.cmServ.trigerRejection.next(true)
  //         setTimeout(() => {
  //   // this.spin=false
  // }, 2000);
  //       }
  //     })


  //   }

  fetchHolderData(data, flag) {
    this.spin = true;
    this.accountTypeOptions = []
    this.accountTypeOptions1 = []
    if (!data.ClientID)
      this.ClientSerialNo = data.ClientSerialNo
    this.cmServ.clientSerialNumber.next(this.ClientSerialNo)
    this.cmServ.isServiceCallsAllow.next(false)
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          // ClientSerialNo: data.ClientSerialNo,
          // Euser: this.currentUser.userCode
          Tab: 'AcctOp',
          PAN: data.PAN || '',
          Flag: flag,
          Euser: this.currentUser.userCode,
          ClientSerialNo: data.ClientSerialNo || '',
          DPID: '',
          ClientID: data.ClientID || ''
        }],
      "requestId": "5065"
    }).then((response) => {
      this.spin = true
      console.log(response.results)
      if (response.results) {
        if (flag == "A") {
          this.EntryAccess = response.results[6][0]["EntryAccess"]
          this.cmServ.finalize.next(response.results[6][0]["FinalizeFlag"])
          this.cmServ.isEntryAccess.next(this.EntryAccess)
        }
        else {
          this.ClientIdDetails = response.results[6][0]
          this.cmServ.clientIdDetails.next(this.ClientIdDetails)
        }
        let accountDetials = response.results[0][0]
        let optionsArr = response.results[4]
        let optionDetails = response.results[5]
        this.accountType = []
        let option1 = []
        let option2 = []

        optionDetails.forEach(element => {
          if (element.checked) {
            if (element.label == "Trading") {
              this.cmServ.isTradingChoosen.next(true)
            }
            if (element.label == "DP") {
              this.cmServ.isDPChoosen.next(true)
            }
            if (element.label == "PMSTradingDP") {
              this.cmServ.isTradingChoosen.next(true)
              this.cmServ.isDPChoosen.next(true)
            }
            if (element.label == "PMSDP") {
              this.cmServ.isDPChoosen.next(true)
            }
            if (element.label == 'B2B')
              this.showB2Bbanks = true
            element.value = element.value.replace(/\s/g, '');
            element.value = element.value.replace('+', '')
            var obj = new Object;
            obj[element.value] = element.checked;
            this.accountType.push(obj)
            if (response.results[7].length) {
              this.storeDetails = response.results[7][0]
            }
          }
        });
        //  this.accountType=optionsArr

        optionsArr.forEach(element => {
          if (element.GroupID == 1)
            option1.push(element)
          else
            option2.push(element)
        });

        let obj = new Object()
        let obj1 = new Object()
        let obj2 = new Object()
        obj = response.results[1][0]
        this.cmServ.hoderDetails.next(obj)
        obj1 = response.results[2][0] || {}
        obj2 = response.results[3][0] || {}
        let HoldersData = { ...obj, ...obj1, ...obj2 }
        let count = Object.keys(HoldersData)
        this.isPanValid = true;

        if (accountDetials.holCount == 1) {
          let HoldersData = { ...obj }
          // this.checkPan(obj["FirstHolderpanNumber"])
          this.form.controls.oneHolder.setValue(HoldersData)
        }
        if (accountDetials.holCount == 2) {
          let HoldersData = { ...obj, ...obj1 }
          this.form.controls.twoHolder.setValue(HoldersData)
          // this.holder2checkPan1(obj["FirstHolderpanNumber"])
          // this.holder2checkPan2(obj1["SecondHolderpanNumber"])
          this.holder2Pan2 = true
        }
        if (accountDetials.holCount == 3) {
          let HoldersData = { ...obj, ...obj1, ...obj2 }
          this.form.controls.threeHolder.setValue(HoldersData)
          // this.holder3checkPan1(obj["FirstHolderpanNumber"])
          // this.holder3checkPan2(obj1["SecondHolderpanNumber"])
          // this.holder3checkPan3(obj2["ThirdHolderpanNumber"])
        }

        this.form.controls.masterForm.patchValue(accountDetials)

        // form.controls.holCount.patchValue(accountDetials.holCount)
        // form.controls.clientSubType.patchValue(accountDetials.clientSubType)
        // form.controls.clientType.patchValue(accountDetials.clientType)
        // form.controls.tradingAcHolder.patchValue(accountDetials.tradingAcHolder)
        this.accountTypeOptions = option1
        this.accountTypeOptions1 = option2
        if (!this.clientProfileEdit)
          this.cmServ.trigerRejection.next(false)

        //   setTimeout(() => {
        // }, 2000);
        if (response.results[7]) {
          var tabarray = response.results[7];
          tabarray.forEach(item => {
            if (item.TabIndex == 1) {
              this.cmServ.trigerKYC.next(true)
            }
            if (item.TabIndex == 2) {
              this.cmServ.trigerFinancial.next(true);
            }
            if (item.TabIndex == 3) {
              this.cmServ.trigerTrading.next(true);
              this.isTradingsaved = true;
            }
            if (item.TabIndex == 4) {
              this.isdpsaved = true;
              this.cmServ.trigerDp.next(true);
            }
            if (item.TabIndex == 5) {
              this.cmServ.trigerScheme.next(true)
            }
            if (item.TabIndex == 6) {
              this.cmServ.trigerIU.next(true);
            }
            if (item.TabIndex == 7) {
              this.cmServ.trigerRejection.next(true);
            }
          })
        }
        if (response.results[8]) {
          this.holder1NameInPanSite = response.results[8][0].holder1NameInPanSite
          this.holder2NameInPanSite = response.results[8][0].holder2NameInPanSite
          this.holder3NameInPanSite = response.results[8][0].holder3NameInPanSite
        }
        this.cmServ.hoderDetails.next(this.holderDetails.value)
        this.spin = false

      }
      else {
        this.spin = false
      }
    })


  }

  // this.form.controls.masterForm.patchValue({
  //   accountTypeOptions: [
  //     { label: 'Tradng', value: 'Tradng', checked: true },
  //     { label: 'DP', value: 'DP', checked: false },
  //     { label: 'PMS DP', value: 'PMS DP', checked: false },
  //     { label: 'PMS Investment + DP', value: 'PMS Investment + DP', checked: false },
  //     { label: 'B2B', value: 'B2B', checked: false },
  //     { label: 'Insurance', value: 'Insurance', checked: false },
  //     { label: 'Mutual Fund', value: 'Mutual Fund', checked: false },
  //   ]
  // });
  setJSONArray(jsonArray: any) {
    let array = [];
    array.push({ "Document": [] });
    for (let i = 0; i < jsonArray.length; i++) {
      array[0].Document.push({ "Data": [] });
      array[0].Document[i].Data[0] = jsonArray[i];
    }
    return array;
  }
  disableOptions(val, item, index) {
    let form: any = this.form.controls.masterForm

    if (item.label == "Trading") {
      this.accountTypeOptions.forEach(element => {
        if (element.label == "DP") {
          if (element.checked == true) {
            this.MaxHolderCount = element.MaxHolderCount
            let form: any = this.form.controls.masterForm
            form.controls.holCount.patchValue(1)
          }
          else {
            this.MaxHolderCount = this.accountTypeOptions[index].MaxHolderCount
            let form: any = this.form.controls.masterForm
            form.controls.holCount.patchValue(1)
          }
        }

      });
    }
    if (item.label == "DP") {
      if (val == true) {
        this.MaxHolderCount = item.MaxHolderCount
        let form: any = this.form.controls.masterForm
        form.controls.holCount.patchValue(1)
      }
      else {
        this.MaxHolderCount = 1
        let form: any = this.form.controls.masterForm
        form.controls.holCount.patchValue(1)
      }
    }
    this.showB2Bbanks = false;
    form.controls.B2BBankName.setValidators(null)
    form.controls.B2BBankName.updateValueAndValidity()
    this.cmServ.isCatholicSyrianBankChoosen.next(false)
    this.accountTypeOptions1.forEach(element => {
      element.checked = false
    });
    this.accountType = []
    this.accountTypeOptions.forEach(element => {
      if (element.checked) {
        element.value = element.value.replace(/\s/g, '');
        element.value = element.value.replace('+', '')
        var obj = new Object;
        obj[element.value] = element.checked;
        this.accountType.push(obj)
      }
    });
  }
  disableOptions1(val, index) {
    this.MaxHolderCount = this.accountTypeOptions1[index].MaxHolderCount
    let form: any = this.form.controls.masterForm
    form.controls.holCount.patchValue(1)
    this.showB2Bbanks = false;
    form.controls.B2BBankName.setValidators(null)
    form.controls.B2BBankName.updateValueAndValidity()
    this.accountTypeOptions.forEach(element => {
      element.checked = false
    });
    this.accountTypeOptions1.forEach(element => {
      element.checked = false
    });
    this.accountType = []
    this.accountTypeOptions1[index].checked = val
    this.accountTypeOptions1.forEach(element => {
      if (element.checked) {
        element.value = element.value.replace(/\s/g, '');
        element.value = element.value.replace('+', '')
        var obj = new Object;
        obj[element.value] = element.checked;
        this.accountType.push(obj)
      }
    })
    this.accountTypeOptions1.forEach(element => {
      if (element.label == "B2B") {
        if (element.checked) {
          this.showB2Bbanks = true;
          form.controls.B2BBankName.setValidators([Validators.required])
          form.controls.B2BBankName.updateValueAndValidity()

        }
        else {
          this.showB2Bbanks = false;
          form.controls.B2BBankName.setValidators(null)
          form.controls.B2BBankName.updateValueAndValidity()
        }
      }
    })
  }

  // showConfirm(): void {
  //   this.confirmModal = this.modal.confirm({
  //     nzTitle: 'Do you Want to save these changes?',
  //     nzContent: 'When clicked the OK button, Data will be saved to draft. ',
  //     nzOnOk: () => {
  //       this.saveToTemprary()
  //     }
  //   });
  // }
  handleDateOpenChange(data) {
    if (data) {
      let form: any = this.form.controls.oneHolder
      form.controls.FirstHolderdob.patchValue(null)
    }
  }



  ngOnInit() {

    this.form = this.fb.group({
      masterForm: this.mainFormGropup(),
      oneHolder: this.oneHolderGroup(),
      twoHolder: this.twoHolderGroup(),
      threeHolder: this.threeHolderGroup(),
    });

    // this.subscriptions.push(
    //   interval(90000).subscribe(x => {
    //     if (this.EntryAccess == false || this.autosave==false || this.currTabIndex!=0 || this.clientProfileEdit) {
    //       return
    //     }
    //     else if (this.form.value.oneHolder.FirstHolderpanNumber != null || this.form.value.twoHolder.FirstHolderpanNumber != null || this.form.value.threeHolder.FirstHolderpanNumber != null) {
    //      this.saveToTemprary()
    //     }
    //   })
    // )
    // this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
    //   if(e.ctrlKey  && e.key === 's'){
    //            e.preventDefault();
    //            e.stopImmediatePropagation();
    //            this.form.updateValueAndValidity()
    //            e.stopPropagation();
    //              this.continueNext()
    //         }
    // });
    this.cmServ.kraAccountOpeiningFirstHolderData.subscribe(val => {
      let form1: any = this.form.controls.oneHolder
      let form2: any = this.form.controls.twoHolder
      let form3: any = this.form.controls.threeHolder

      if (val != null) {
        let applicantName = val
        let index = applicantName.lastIndexOf(" ");
        if (index >= 0) {
          let firstname = applicantName.substring(0, index)
          let lastname = applicantName.substring(index, applicantName.length)

          form1.controls.FirstHolderfirstName.patchValue(firstname)
          form1.controls.FirstHoldermiddleName.patchValue(null)
          form1.controls.FirstHolderlastName.patchValue(lastname)

          form2.controls.FirstHolderfirstName.patchValue(firstname)
          form2.controls.FirstHoldermiddleName.patchValue(null)
          form2.controls.FirstHolderlastName.patchValue(lastname)


          form3.controls.FirstHolderfirstName.patchValue(firstname)
          form3.controls.FirstHoldermiddleName.patchValue(null)
          form3.controls.FirstHolderlastName.patchValue(lastname)
        }
        else {
          form1.controls.FirstHolderfirstName.patchValue(val)
          form1.controls.FirstHoldermiddleName.patchValue(null)
          form1.controls.FirstHolderlastName.patchValue(null)

          form2.controls.FirstHolderfirstName.patchValue(val)
          form2.controls.FirstHoldermiddleName.patchValue(null)
          form2.controls.FirstHolderlastName.patchValue(null)


          form3.controls.FirstHolderfirstName.patchValue(val)
          form3.controls.FirstHoldermiddleName.patchValue(null)
          form3.controls.FirstHolderlastName.patchValue(null)

        }
      }

      else {

        let length = Object.keys(this.holderDataFromCmServ).length;
        if (length > 0) {

          form1.controls.FirstHolderfirstName.patchValue(this.holderDataFromCmServ.FirstHolderfirstName)
          form1.controls.FirstHoldermiddleName.patchValue(this.holderDataFromCmServ.FirstHoldermiddleName)
          form1.controls.FirstHolderlastName.patchValue(this.holderDataFromCmServ.FirstHolderlastName)
          if (length > 5) {
            form2.controls.FirstHolderfirstName.patchValue(this.holderDataFromCmServ.FirstHolderfirstName)
            form2.controls.FirstHoldermiddleName.patchValue(this.holderDataFromCmServ.FirstHoldermiddleName)
            form2.controls.FirstHolderlastName.patchValue(this.holderDataFromCmServ.FirstHolderlastName)
          }
          if (length > 10) {
            form3.controls.FirstHolderfirstName.patchValue(this.holderDataFromCmServ.FirstHolderfirstName)
            form3.controls.FirstHoldermiddleName.patchValue(this.holderDataFromCmServ.FirstHoldermiddleName)
            form3.controls.FirstHolderlastName.patchValue(this.holderDataFromCmServ.FirstHolderlastName)

          }
        }
      }
    })


    this.cmServ.kraAccountOpeiningSecondHolderData.subscribe(val => {
      let form1: any = this.form.controls.oneHolder
      let form2: any = this.form.controls.twoHolder
      let form3: any = this.form.controls.threeHolder

      if (val != null) {
        let applicantName = val
        let index = applicantName.lastIndexOf(" ");
        if (index >= 0) {
          let firstname = applicantName.substring(0, index)
          let lastname = applicantName.substring(index, applicantName.length)

          form2.controls.SecondHolderfirstName.patchValue(firstname)
          form2.controls.SecondHoldermiddleName.patchValue(null)
          form2.controls.SecondHolderlastName.patchValue(lastname)


          form3.controls.SecondHolderfirstName.patchValue(firstname)
          form3.controls.SecondHoldermiddleName.patchValue(null)
          form3.controls.SecondHolderlastName.patchValue(lastname)

        }
        else {
          form2.controls.SecondHolderfirstName.patchValue(val)
          form2.controls.SecondHoldermiddleName.patchValue(null)
          form2.controls.SecondHolderlastName.patchValue(null)


          form3.controls.SecondHolderfirstName.patchValue(val)
          form3.controls.SecondHoldermiddleName.patchValue(null)
          form3.controls.SecondHolderlastName.patchValue(null)

        }
      }

      else {

        if (Object.keys(this.holderDataFromCmServ).length > 6) {
          form2.controls.SecondHolderfirstName.patchValue(this.holderDataFromCmServ.SecondHolderfirstName)
          form2.controls.SecondHoldermiddleName.patchValue(this.holderDataFromCmServ.SecondHoldermiddleName)
          form2.controls.SecondHolderlastName.patchValue(this.holderDataFromCmServ.SecondHolderlastName)
          if (Object.keys(this.holderDataFromCmServ).length > 11) {
            form3.controls.SecondHolderfirstName.patchValue(this.holderDataFromCmServ.SecondHolderfirstName)
            form3.controls.SecondHoldermiddleName.patchValue(this.holderDataFromCmServ.SecondHoldermiddleName)
            form3.controls.SecondHolderlastName.patchValue(this.holderDataFromCmServ.SecondHolderlastName)
          }
        }
      }
    })


    this.cmServ.kraAccountOpeiningThirdHolderData.subscribe(val => {

      let form1: any = this.form.controls.oneHolder
      let form2: any = this.form.controls.twoHolder
      let form3: any = this.form.controls.threeHolder
      if (val != null) {
        let applicantName = val
        let index = applicantName.lastIndexOf(" ");
        if (index >= 0) {
          let firstname = applicantName.substring(0, index)
          let lastname = applicantName.substring(index, applicantName.length)

          form3.controls.ThirdHolderfirstName.patchValue(firstname)
          form3.controls.ThirdHoldermiddleName.patchValue(null)
          form3.controls.ThirdHolderlastName.patchValue(lastname)
        }
        else {
          form3.controls.ThirdHolderfirstName.patchValue(val)
          form3.controls.ThirdHoldermiddleName.patchValue(null)
          form3.controls.ThirdHolderlastName.patchValue(null)
        }
      }
      else {

        if (Object.keys(this.holderDataFromCmServ).length > 0) {
          form3.controls.ThirdHolderfirstName.patchValue(this.holderDataFromCmServ.ThirdHolderfirstName)
          form3.controls.ThirdHoldermiddleName.patchValue(this.holderDataFromCmServ.ThirdHoldermiddleName)
          form3.controls.ThirdHolderlastName.patchValue(this.holderDataFromCmServ.ThirdHolderlastName)
        }
      }
    })
    this.form.controls.masterForm.get('clientType').valueChanges.subscribe(val => {
      this.cmServ.clientType.next(val);
      if (val == "nonIndividual") {
        this.isShwoTrading = false;
        this.subType = this.nonIndClientSubType
      }
      else {
        this.isShwoTrading = true;
        this.subType = this.indClientSubType

      }
    });

    this.subscriptions.push(
      this.form.controls.masterForm.get('clientSubType').valueChanges.subscribe(val => {
        let val1 = val.trim()
        if (val1 == 'NRE') {
          this.cmServ.isNRE.next(true);
        }
        else {
          this.cmServ.isNRE.next(false);
        }
        this.cmServ.clientSubType.next(val)
      }))
    this.cmServ.lastActivateTabIndex.subscribe(val => {
      this.currTabIndex = val;
    })
    this.form.controls.masterForm.get('holCount').valueChanges.subscribe(val => {
      if (val == 1) {
        this.holderDetails = this.form.controls.oneHolder
      }
      if (val == 2)
        this.holderDetails = this.form.controls.twoHolder
      if (val == 3)
        this.holderDetails = this.form.controls.threeHolder

      this.cmServ.holderLength.next(val);
      this.noOfTabs = val;
    })


    this.form.controls.masterForm.get('B2BBankName').valueChanges.subscribe(val => {
      if (val == "Catholic Syrian Bank") {
        this.cmServ.isCatholicSyrianBankChoosen.next(true)
      }
      else {
        this.cmServ.isCatholicSyrianBankChoosen.next(false)
      }
    })

    this.holderDetails = this.form.controls.oneHolder;

    // this.holderDetails.get('FirstHolderdob').valueChanges.subscribe(val=>{
    //   this.isfirstHolderDobValid=false
    // })
    // this.holderDetails.get('FirstHolderdob').valueChanges.subscribe(val=>{
    //   this.isSecondHolderDobValid=false
    // })
    // this.holderDetails.get('FirstHolderdob').valueChanges.subscribe(val=>{
    //   this.isThirdHolderDobValid=false
    // })

  }
  getDataAfterAccountTypesLoaded() {
    if (this.dataServ.fromreport == true) {

      var data = { ClientSerialNo: this.dataServ.slno };
      this.fetchHolderData(data, 'A')
      this.dataServ.fromreport = false;
    }
  }
  checkPan(pan) {
    if (this.isServiceblocked || this.ClientSerialNo != 0) {
      return
    }
    let form1: any = this.form.controls.oneHolder
    form1.controls.FirstHolderdob.patchValue(null)
    this.hold1VarifiedPanDetails = {}
    this.isPanValid = false
    if (pan.length == 10) {
      this.dataServ.varifyPan(pan).
        then(result => {
          this.PanDetails = result
          if (this.isPanValid) {
            this.isholder1Pan = true
            this.hold1VarifiedPanDetails = this.PanDetails[0]
            console.log(this.hold1VarifiedPanDetails)
            return
          }
          if (this.PanDetails.length > 0) {
            this.isholder1Pan = true
            this.hold1VarifiedPanDetails = this.PanDetails[0]
            this.isPanValid = true
            this.notif.success("Valid Pan", '', { nzDuration: 60000 })
            // let form2:any=this.form.controls.twoHolder
            // let form3:any=this.form.controls.threeHolder
            if (this.hold1VarifiedPanDetails && this.ClientSerialNo == 0) {
              form1.controls.FirstHolderfirstName.patchValue(this.hold1VarifiedPanDetails.FirstName)
              form1.controls.FirstHoldermiddleName.patchValue(this.hold1VarifiedPanDetails.MiddleName)
              form1.controls.FirstHolderlastName.patchValue(this.hold1VarifiedPanDetails.LastName)
              form1.controls.FirstHoldertitle.patchValue(this.hold1VarifiedPanDetails.SurName == 'Shri' ? 'Mr' : this.hold1VarifiedPanDetails.SurName == 'Kumari' ? 'Ms' : 'Mrs')
            }
            return
          }
          else {
            this.notif.error("Invalid Pan", '', { nzDuration: 60000 })
            this.isPanValid = false
            this.isholder1Pan = false

          }
        })


    }

  }
  holder2checkPan1(pan) {
    if (this.isServiceblocked || this.ClientSerialNo != 0) {
      return
    }
    let form2: any = this.form.controls.twoHolder
    form2.controls.FirstHolderdob.patchValue(null)
    this.isPanValid = false
    if (pan.length == 10) {
      this.dataServ.varifyPan(pan).

        then(result => {
          this.PanDetails = result
          if (this.isPanValid) {
            this.holder2Pan1 = true
            this.hold1VarifiedPanDetails = this.PanDetails[0]
            return
          }
          if (this.PanDetails.length > 0) {
            this.hold1VarifiedPanDetails = this.PanDetails[0]
            this.notif.success("Valid Pan", '')
            this.holder2Pan1 = true
            this.isPanValid = true
            if (this.hold1VarifiedPanDetails && this.ClientSerialNo == 0) {
              form2.controls.FirstHolderfirstName.patchValue(this.hold1VarifiedPanDetails.FirstName)
              form2.controls.FirstHoldermiddleName.patchValue(this.hold1VarifiedPanDetails.MiddleName)
              form2.controls.FirstHolderlastName.patchValue(this.hold1VarifiedPanDetails.LastName)
              form2.controls.FirstHoldertitle.patchValue(this.hold1VarifiedPanDetails.SurName == 'Shri' ? 'Mr' : this.hold1VarifiedPanDetails.SurName == 'Kumari' ? 'Ms' : 'Mrs')
            }
          }
          else {
            this.notif.error("Invalid Pan", '', { nzDuration: 60000 })
            this.isPanValid = false
            this.holder2Pan1 = false

          }
        })


    }
  }
  holder2checkPan2(pan) {
    if (this.isServiceblocked || this.ClientSerialNo != 0) {
      return
    }
    let form2: any = this.form.controls.twoHolder
    form2.controls.SecondHolderdob.patchValue(null)

    this.isPanValid = false
    if (pan.length == 10) {
      this.dataServ.varifyPan(pan).
        then(result => {
          this.PanDetails = result
          if (this.isPanValid) {
            this.holder2Pan2 = true
            this.hold2VarifiedPanDetails = this.PanDetails[0]

            return
          }
          if (this.PanDetails.length > 0) {
            this.hold2VarifiedPanDetails = this.PanDetails[0]
            this.notif.success("Valid Pan", '')
            this.isPanValid = true
            this.holder2Pan2 = true
            if (this.hold2VarifiedPanDetails && this.ClientSerialNo == 0) {
              form2.controls.SecondHolderfirstName.patchValue(this.hold2VarifiedPanDetails.FirstName)
              form2.controls.SecondHoldermiddleName.patchValue(this.hold2VarifiedPanDetails.MiddleName)
              form2.controls.SecondHolderlastName.patchValue(this.hold2VarifiedPanDetails.LastName)
              form2.controls.SecondHoldertitle.patchValue(this.hold2VarifiedPanDetails.SurName == 'Shri' ? 'Mr' : this.hold1VarifiedPanDetails.SurName == 'Kumari' ? 'Ms' : 'Mrs')
            }
          }
          else {
            this.notif.error("Invalid Pan", '', { nzDuration: 60000 })
            this.isPanValid = false
            this.holder2Pan2 = false
          }
        })


    }
  }
  holder3checkPan1(pan) {
    if (this.isServiceblocked || this.ClientSerialNo != 0) {
      return
    }
    let form3: any = this.form.controls.threeHolder
    form3.controls.FirstHolderdob.patchValue(null)

    this.isPanValid = false
    if (pan.length == 10) {
      this.dataServ.varifyPan(pan).
        then(result => {
          this.PanDetails = result
          if (this.isPanValid) {
            this.holder3Pan1 = true
            this.hold1VarifiedPanDetails = this.PanDetails[0]
            // alert("1"+this.holder3Pan1 )

            return
          }
          if (this.PanDetails.length > 0) {
            this.notif.success("Valid Pan", '')
            this.hold1VarifiedPanDetails = this.PanDetails[0]
            this.holder3Pan1 = true
            this.isPanValid = true
            if (this.hold1VarifiedPanDetails && this.ClientSerialNo == 0) {
              form3.controls.FirstHolderfirstName.patchValue(this.hold1VarifiedPanDetails.FirstName)
              form3.controls.FirstHoldermiddleName.patchValue(this.hold1VarifiedPanDetails.MiddleName)
              form3.controls.FirstHolderlastName.patchValue(this.hold1VarifiedPanDetails.LastName)
              form3.controls.FirstHoldertitle.patchValue(this.hold1VarifiedPanDetails.SurName == 'Shri' ? 'Mr' : this.hold1VarifiedPanDetails.SurName == 'Kumari' ? 'Ms' : 'Mrs')
            }
          }
          else {
            this.notif.error("Invalid Pan", '', { nzDuration: 60000 })
            this.isPanValid = false
            this.holder3Pan1 = false

          }
        })


    }
  }
  holder3checkPan2(pan) {
    if (this.isServiceblocked || this.ClientSerialNo != 0) {
      return
    }
    let form3: any = this.form.controls.threeHolder
    form3.controls.SecondHolderdob.patchValue(null)

    this.isPanValid = false
    if (pan.length == 10) {
      this.dataServ.varifyPan(pan).
        then(result => {
          this.PanDetails = result
          if (this.isPanValid) {
            this.holder3Pan2 = true
            // alert("2"+this.holder3Pan2)
            this.hold2VarifiedPanDetails = this.PanDetails[0]

            return
          }
          if (this.PanDetails.length > 0) {
            this.isPanValid = true
            this.notif.success("Valid Pan", '')
            this.hold2VarifiedPanDetails = this.PanDetails[0]
            this.holder3Pan2 = true
            this.isPanValid = true
            if (this.hold2VarifiedPanDetails && this.ClientSerialNo == 0) {
              form3.controls.SecondHolderfirstName.patchValue(this.hold2VarifiedPanDetails.FirstName)
              form3.controls.SecondHoldermiddleName.patchValue(this.hold2VarifiedPanDetails.MiddleName)
              form3.controls.SecondHolderlastName.patchValue(this.hold2VarifiedPanDetails.LastName)
              form3.controls.SecondHoldertitle.patchValue(this.hold2VarifiedPanDetails.SurName == 'Shri' ? 'Mr' : this.hold1VarifiedPanDetails.SurName == 'Kumari' ? 'Ms' : 'Mrs')
            }
          }
          else {
            this.notif.error("Invalid Pan", '', { nzDuration: 60000 })
            this.isPanValid = false
            this.holder3Pan2 = false

          }
        })


    }
  }
  holder3checkPan3(pan) {
    if (this.isServiceblocked || this.ClientSerialNo != 0) {
      return
    }
    let form3: any = this.form.controls.threeHolder
    form3.controls.ThirdHolderdob.patchValue(null)

    this.isPanValid = false
    if (pan.length == 10) {
      this.dataServ.varifyPan(pan).
        then(result => {
          this.PanDetails = result
          if (this.isPanValid) {
            this.holder3Pan3 = true
            // alert("3")
            this.hold3VarifiedPanDetails = this.PanDetails[0]

            return
          }

          if (this.PanDetails.length > 0) {
            this.isPanValid = true
            this.notif.success("Valid Pan", '')
            this.holder3Pan3 = true
            this.hold3VarifiedPanDetails = this.PanDetails[0]
            if (this.hold3VarifiedPanDetails && this.ClientSerialNo == 0) {
              form3.controls.ThirdHolderfirstName.patchValue(this.hold3VarifiedPanDetails.FirstName)
              form3.controls.ThirdHoldermiddleName.patchValue(this.hold3VarifiedPanDetails.MiddleName)
              form3.controls.ThirdHolderlastName.patchValue(this.hold3VarifiedPanDetails.LastName)
              form3.controls.ThirdHoldertitle.patchValue(this.hold3VarifiedPanDetails.SurName == 'Shri' ? 'Mr' : this.hold1VarifiedPanDetails.SurName == 'Kumari' ? 'Ms' : 'Mrs')
            }
          }
          else {
            this.notif.error("Invalid Pan", '', { nzDuration: 60000 })
            this.isPanValid = false
            this.holder3Pan3 = false

          }
        })


    }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }
  private mainFormGropup() {
    return this.fb.group({
      accountTypeOptions: [null],
      clientType: [this.defaultClientType, [Validators.required]],
      clientSubType: [null, [Validators.required]],
      tradingAcHolder: ["first holder", [Validators.required]],
      // tradingAsHolder: [null],
      B2BBankName: [null],
      holCount: [1, [Validators.required]],
    })
  }
  private oneHolderGroup() {
    return this.fb.group({
      FirstHolderpanNumber: [null],
      FirstHoldertitle: [null],
      FirstHolderfirstName: [null],
      FirstHoldermiddleName: [null],
      FirstHolderlastName: [null],
      FirstHolderdob: [null],


    })
  }
  private twoHolderGroup() {
    return this.fb.group({
      FirstHolderpanNumber: [null],
      FirstHoldertitle: [null],
      FirstHolderfirstName: [null],
      FirstHoldermiddleName: [null],
      FirstHolderlastName: [null],
      FirstHolderdob: [null],


      SecondHolderpanNumber: [null],
      SecondHoldertitle: [null],
      SecondHolderfirstName: [null],
      SecondHoldermiddleName: [null],
      SecondHolderlastName: [null],
      SecondHolderdob: [null],


    })
  }
  private threeHolderGroup() {
    return this.fb.group({
      FirstHolderpanNumber: [null],
      FirstHoldertitle: [null],
      FirstHolderfirstName: [null],
      FirstHoldermiddleName: [null],
      FirstHolderlastName: [null],
      FirstHolderdob: [null],

      SecondHolderpanNumber: [null],
      SecondHoldertitle: [null],
      SecondHolderfirstName: [null],
      SecondHoldermiddleName: [null],
      SecondHolderlastName: [null],
      SecondHolderdob: [null],

      ThirdHolderpanNumber: [null],
      ThirdHoldertitle: [null],
      ThirdHolderfirstName: [null],
      ThirdHoldermiddleName: [null],
      ThirdHolderlastName: [null],
      ThirdHolderdob: [null]

    })
  }

  // private createHoldersArray() {
  //   return this.fb.group({
  //     title: null,
  //     firstName: null,
  //     middleName: null,
  //     lastName: null,
  //   });
  // }

  // addHolder() {

  //  const controls = <FormArray>this.form.get('holders');
  //   if (controls.length > 2)
  //     return;
  //    this.controls.push(this.createHoldersArray());
  //   this.cmServ.holderLength.next(this.controls.length);
  //  this.noOfTabs+=1;
  // }

  // removeHolder(i) {
  //   const controls = <FormArray>this.form.get('holders');
  //   controls.removeAt(i);
  //   this.cmServ.holderLength.next(controls.length);
  //   this.noOfTabs-=1;

  // }

  // get holderArray(): FormArray {
  //   return this.form.get('holders') as FormArray;
  // }

  // dropHolder(event: CdkDragDrop<string[]>) {
  //   const dir = event.currentIndex > event.previousIndex ? 1 : -1;

  //   const from = event.previousIndex;
  //   const to = event.currentIndex;

  //   const temp = this.holderArray.at(from);
  //   for (let i = from; i * dir < to * dir; i = i + dir) {
  //     const current = this.holderArray.at(i + dir);
  //     this.holderArray.setControl(i, current);
  //   }
  //   this.holderArray.setControl(to, temp);
  // }
  calculateAge(birthDate) {
    birthDate = new Date(birthDate);
    let otherDate = new Date()
    var years = (otherDate.getFullYear() - birthDate.getFullYear());
    if (otherDate.getMonth() < birthDate.getMonth() ||
      otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
      years--;
    }
    return years;
  }
  continueNext() {
    // this.cmServ.isDPChoosen.next(false)
    // this.cmServ.isTradingChoosen.next(false)
    let timer = 0;
    if (this.EntryAccess == false || this.clientProfileEdit) {
      this.nextKyc()
      return
    }
    if (this.ClientSerialNo != 0) {
      timer = 1000
    }
    console.log(this.accountType)

    setTimeout(() => {
      if (this.accountType.length == 0) {
        this.notif.error("Please choose your account type", '', { nzDuration: 60000 })
        this.spin = false;
        return
      }
      //   
      //   let x=this.customMsgObj[1].FormValues
      //   console.log(x)
      //   console.log(JSON.parse(x))
      //   
      let main: any = this.form.controls.masterForm
      let isValid = this.validServ.validateForm(this.form.controls.masterForm, this.FormControlNames, this.customMsgObj.MasterForm);
      if (isValid) {
        let isValid1 = this.validServ.validateForm(this.holderDetails, this.FormControlNames, this.customMsgObj.HolderDetails);
        if (isValid1) {
          let count = main.value.holCount
          if (!this.isServiceblocked && this.ClientSerialNo == 0) {
            if (count == 1) {
              if (!this.isholder1Pan) {
                this.notif.error("Invalid first Holder Pan", '', { nzDuration: 60000 })
                this.spin = false;
                return
              }
              else {
                if (!this.isfirstHolderDobValid) {
                  this.notif.error("Invalid first Holder DOB", '', { nzDuration: 60000 })
                  this.spin = false;
                  return
                }
              }
              // this.cmServ.hoder1PanDetails.next(this.hold1VarifiedPanDetails)
            }
            if (count == 2) {
              if (!this.holder2Pan1) {
                this.notif.error("Invalid first Holder Pan", '', { nzDuration: 60000 })
                this.spin = false;
                return
              }
              else {
                if (!this.isfirstHolderDobValid) {
                  this.notif.error("Invalid first Holder DOB", '', { nzDuration: 60000 })
                  this.spin = false;
                  return
                }
              }
              if (!this.holder2Pan2) {
                this.notif.error("Invalid second Holder Pan", '', { nzDuration: 60000 })
                this.spin = false;
                return
              }
              else {
                if (!this.isSecondHolderDobValid) {
                  this.notif.error("Invalid Second Holder DOB", '', { nzDuration: 60000 })
                  this.spin = false;
                  return
                }
              }

              // this.cmServ.hoder1PanDetails.next(this.hold1VarifiedPanDetails)
              // this.cmServ.hoder2PanDetails.next(this.hold2VarifiedPanDetails)
            }
            if (count == 3) {
              if (!this.holder3Pan1) {
                this.notif.error("Invalid first Holder Pan", '', { nzDuration: 60000 })
                this.spin = false;
                return
              }
              else {
                if (!this.isfirstHolderDobValid) {
                  this.notif.error("Invalid first Holder DOB", '', { nzDuration: 60000 })
                  this.spin = false;
                  return
                }
              }


              if (!this.holder3Pan2) {
                this.notif.error("Invalid second Holder Pan", '', { nzDuration: 60000 })
                this.spin = false;
                return
              }
              else {
                if (!this.isSecondHolderDobValid) {
                  this.notif.error("Invalid Second Holder DOB", '', { nzDuration: 60000 })
                  this.spin = false;
                  return
                }
              }

              if (!this.holder3Pan3) {
                this.notif.error("Invalid third Holder Pan", '', { nzDuration: 60000 })
                this.spin = false;
                return
              }
              else {
                if (!this.isThirdHolderDobValid) {
                  this.notif.error("Invalid Third Holder DOB", '', { nzDuration: 60000 })
                  this.spin = false;
                  return
                }
              }

              // this.cmServ.hoder1PanDetails.next(this.hold1VarifiedPanDetails)
              // this.cmServ.hoder2PanDetails.next(this.hold2VarifiedPanDetails)
              // this.cmServ.hoder3PanDetails.next(this.hold3VarifiedPanDetails)
            }
          }
          let tradingHolder = main.value.tradingAcHolder
          if (tradingHolder == 'first holder') {
            let age1 = this.calculateAge(this.holderDetails.value.FirstHolderdob)
            if (age1 < 17) {
              this.notif.remove()
              this.notif.error("Trading Ac Holder cannot be minor", '', { nzDuration: 60000 })
              this.spin = false;
              return
            }
          }

          if (tradingHolder == 'second holder') {
            let age2 = this.calculateAge(this.holderDetails.value.SecondHolderdob)
            if (age2 < 17) {
              this.notif.remove()
              this.notif.error("Trading Ac Holder cannot be minor", '', { nzDuration: 60000 })
              this.spin = false;
              return
            }
          }

          if (tradingHolder == 'third holder') {
            let age3 = this.calculateAge(this.holderDetails.value.ThirdHolderdob)
            if (age3 < 17) {
              this.notif.remove()
              this.notif.error("Trading Ac Holder cannot be minor", '', { nzDuration: 60000 })
              this.spin = false;
              return
            }
          }
       

          let holdData = this.holderDetails.value
          let Hold1obj = new Object()
          let Hold2obj = new Object()
          let Hold3obj = new Object()
          Hold1obj = {}
          Hold2obj = {}
          Hold3obj = {}
          for (var item in holdData) {
            if (item.startsWith('First')) {
              Hold1obj[item] = holdData[item]
            }
            if (item.startsWith('Second')) {
              Hold2obj[item] = holdData[item]
            }
            if (item.startsWith('Third')) {
              Hold3obj[item] = holdData[item]
            }
          }
          let data = [];
          let data1 = [];
          let data2 = [];
          let data3 = [];
          if (this.hold1VarifiedPanDetails != null) {
            if (Object.keys(this.hold1VarifiedPanDetails).length) {
              this.holder1NameInPanSite = this.hold1VarifiedPanDetails.SurName + ' ' +
                this.hold1VarifiedPanDetails.FirstName + ' ' +
                this.hold1VarifiedPanDetails.MiddleName + ' ' +
                this.hold1VarifiedPanDetails.LastName
            }
          }
          if (this.hold2VarifiedPanDetails != null) {
            if (Object.keys(this.hold2VarifiedPanDetails).length) {
              this.holder2NameInPanSite = this.hold2VarifiedPanDetails.SurName + ' ' +
                this.hold2VarifiedPanDetails.FirstName + ' ' +
                this.hold2VarifiedPanDetails.MiddleName + ' ' +
                this.hold2VarifiedPanDetails.LastName
            }
          }
          if (this.hold3VarifiedPanDetails != null) {
            if (Object.keys(this.hold3VarifiedPanDetails).length) {
              this.holder3NameInPanSite = this.hold3VarifiedPanDetails.SurName + ' ' +
                this.hold3VarifiedPanDetails.FirstName + ' ' +
                this.hold3VarifiedPanDetails.MiddleName + ' ' +
                this.hold3VarifiedPanDetails.LastName
            }
          }
          Hold1obj["holder1NameInPanSite"] = this.holder1NameInPanSite
          Hold2obj["holder2NameInPanSite"] = this.holder2NameInPanSite
          Hold3obj["holder3NameInPanSite"] = this.holder3NameInPanSite
          data1.push(Hold1obj)
          data2.push(Hold2obj)
          data3.push(Hold3obj)
          var JSONData = this.utilServ.setJSONArray(data);
          var JSONData1 = this.utilServ.setJSONArray(data1);
          var JSONData2 = this.utilServ.setJSONArray(data2);
          var JSONData3 = this.utilServ.setJSONArray(data3);
          var xmlData = jsonxml(JSONData);
          var xmlData1 = jsonxml(JSONData1);
          var xmlData2 = jsonxml(JSONData2);
          var xmlData3 = jsonxml(JSONData3);
          xmlData1 = xmlData1.replace(/&/gi, '#||')//Added by Sachin
          xmlData2 = xmlData2.replace(/&/gi, '#||')//Added by Sachin
          xmlData3 = xmlData3.replace(/&/gi, '#||')//Added by Sachin

          this.form.controls.masterForm.value.accountTypeOptions = this.accountType
          // var JSONOptionsData = this.cmServ.generateJSONfromArray(this.accountType);
          // let totalData = {...this.form.controls.masterForm.value,...JSONOptionsData}
          data.push(this.form.controls.masterForm.value)
          var JSONData = this.utilServ.setJSONArray(data);
          var xmlData = jsonxml(JSONData);
          this.spin = true;
          console.log(xmlData)
          // if (this.ClientSerialNo != 0) {
            this.cmServ.trigerTrading.next(false);
            this.cmServ.trigerDp.next(false);
            this.cmServ.isTradingChoosen.next(false)
            this.cmServ.isDPChoosen.next(false)

            this.accountType.forEach(element => {
              if (element.Trading) {
                this.cmServ.isTradingChoosen.next(true)
                if(this.isTradingsaved)
                this.cmServ.trigerTrading.next(true);
              }
              if (element.DP) {
                this.cmServ.isDPChoosen.next(true)
                if(this.isdpsaved)
                 this.cmServ.trigerDp.next(true);

              }
              if (element.PMSTradingDP) {
                this.cmServ.isTradingChoosen.next(true)
                this.cmServ.isDPChoosen.next(true)
                if(this.isTradingsaved)
                this.cmServ.trigerTrading.next(true);
                if(this.isdpsaved)
                this.cmServ.trigerDp.next(true);
              }
              if (element.PMSDP) {
                this.cmServ.isDPChoosen.next(true)
                if(this.isdpsaved)
               this.cmServ.trigerDp.next(true);
              }
            });
          
          // }
          this.notif.remove()
          this.autosave = false;
          this.dataServ.getResultArray({
            "batchStatus": "false",
            "detailArray":
              [{
                Euser: this.currentUser.userCode,
                Pan: Hold1obj["FirstHolderpanNumber"],
                KycXML_AccountDetails: xmlData,
                KycXML_Holder_1: xmlData1,
                KycXML_Holder_2: Hold2obj["SecondHolderpanNumber"] ? xmlData2 : '',
                KycXML_Holder_3: Hold3obj["ThirdHolderpanNumber"] ? xmlData3 : '',
                ClientSerialNo: this.ClientSerialNo || 0,
                AutoSave: 'N',
                Flag: this.clientProfileEdit ? 'P' : 'A',
                DPID: this.ClientIdDetails ? this.ClientIdDetails.FirstHolderDPID : '',
                ClientID: this.ClientIdDetails ? this.ClientIdDetails.FirstHolderClientID : ''
              }],
            "requestId": "5062",
            "outTblCount": "0"
          }).then((response) => {
            console.log(response)
            if (response.errorCode == 0) {
              let result = response.results[0][0]
              if (result.ErrorCode == 0) {
                this.notif.success(result.Msg, '')
                if (!this.ClientSerialNo) {
                  this.cmServ.clientSerialNumber.next(result.ClientSerialNo)
                }
                this.spin = false;
                this.cmServ.hoderDetails.next(this.holderDetails.value)
                this.cmServ.activeTabIndex.next(1);
                this.cmServ.trigerKYC.next(true)

              }
              else {
                this.spin = false;
                this.notif.error(result.Msg, '', { nzDuration: 60000 })
              }
            }
            else {
              this.spin = false;
              this.notif.error(response.errorMsg, '', { nzDuration: 60000 })
            }
          })

          // this.subscriptions.forEach(ele => {
          //   ele.unsubscribe()
          // })

        }
      }
    }, timer);
  }
  saveToTemprary() {
    let main: any = this.form.controls.masterForm
    let count = main.value.holCount
    // if(count==1){
    //   if(!this.isholder1Pan){
    //     this.notif.error("Invalid first Holder Pan",'')
    //     return
    //   }
    //   this.cmServ.hoder1PanDetails.next(this.hold1VarifiedPanDetails)
    // }
    // if(count==2){
    //   if(!this.holder2Pan1){
    //     this.notif.error("Invalid first Holder Pan",'')
    //     return
    //   }
    //    if(!this.holder2Pan2){
    //     this.notif.error("Invalid second Holder Pan",'')
    //     return
    //   }
    //   this.cmServ.hoder1PanDetails.next(this.hold1VarifiedPanDetails)
    //   this.cmServ.hoder2PanDetails.next(this.hold2VarifiedPanDetails)

    // }
    // if(count==3){    
    //   if(!this.holder3Pan1) {
    //     this.notif.error("Invalid first Holder Pan",'')
    //     return
    //   }

    //   if(!this.holder3Pan2){
    //     this.notif.error("Invalid second Holder Pan",'')
    //     return
    //   }

    //   if(!this.holder3Pan3){
    //     this.notif.error("Invalid third Holder Pan",'')
    //     return
    //   }
    //   this.cmServ.hoder1PanDetails.next(this.hold1VarifiedPanDetails)
    //   this.cmServ.hoder2PanDetails.next(this.hold2VarifiedPanDetails)
    //   this.cmServ.hoder3PanDetails.next(this.hold3VarifiedPanDetails)
    // }

    let holdData = this.holderDetails.value
    let Hold1obj = new Object()
    let Hold2obj = new Object()
    let Hold3obj = new Object()
    Hold1obj = {}
    Hold2obj = {}
    Hold3obj = {}
    for (var item in holdData) {
      if (item.startsWith('First')) {
        Hold1obj[item] = holdData[item]
      }
      if (item.startsWith('Second')) {
        Hold2obj[item] = holdData[item]
      }
      if (item.startsWith('Third')) {
        Hold3obj[item] = holdData[item]
      }
    }
    let data = [];
    let data1 = [];
    let data2 = [];
    let data3 = [];
    if (!Hold1obj["FirstHolderpanNumber"]) {
      return
    }

    if (this.hold1VarifiedPanDetails != null) {
      if (Object.keys(this.hold1VarifiedPanDetails).length) {
        this.holder1NameInPanSite = this.hold1VarifiedPanDetails.SurName + ' ' +
          this.hold1VarifiedPanDetails.FirstName + ' ' +
          this.hold1VarifiedPanDetails.MiddleName + ' ' +
          this.hold1VarifiedPanDetails.LastName
      }
    }
    if (this.hold2VarifiedPanDetails != null) {
      if (Object.keys(this.hold2VarifiedPanDetails).length) {
        this.holder2NameInPanSite = this.hold2VarifiedPanDetails.SurName + ' ' +
          this.hold2VarifiedPanDetails.FirstName + ' ' +
          this.hold2VarifiedPanDetails.MiddleName + ' ' +
          this.hold2VarifiedPanDetails.LastName
      }
    }
    if (this.hold3VarifiedPanDetails != null) {
      if (Object.keys(this.hold3VarifiedPanDetails).length) {
        this.holder3NameInPanSite = this.hold3VarifiedPanDetails.SurName + ' ' +
          this.hold3VarifiedPanDetails.FirstName + ' ' +
          this.hold3VarifiedPanDetails.MiddleName + ' ' +
          this.hold3VarifiedPanDetails.LastName
      }
    }
    Hold1obj["holder1NameInPanSite"] = this.holder1NameInPanSite
    Hold2obj["holder2NameInPanSite"] = this.holder2NameInPanSite
    Hold3obj["holder3NameInPanSite"] = this.holder3NameInPanSite
    data1.push(Hold1obj)
    data2.push(Hold2obj)
    data3.push(Hold3obj)
    var JSONData = this.utilServ.setJSONArray(data);
    var JSONData1 = this.utilServ.setJSONArray(data1);
    var JSONData2 = this.utilServ.setJSONArray(data2);
    var JSONData3 = this.utilServ.setJSONArray(data3);
    var xmlData = jsonxml(JSONData);
    var xmlData1 = jsonxml(JSONData1);
    var xmlData2 = jsonxml(JSONData2);
    var xmlData3 = jsonxml(JSONData3);

    xmlData1 = xmlData1.replace(/&/gi, '#||')//added By sachin
    xmlData2 = xmlData2.replace(/&/gi, '#||')//Added By Sachin
    xmlData3 = xmlData3.replace(/&/gi, '#||')//Added By sachin
    this.form.controls.masterForm.value.accountTypeOptions = this.accountType
    // var JSONOptionsData = this.cmServ.generateJSONfromArray(this.accountType);
    // let totalData = {...this.form.controls.masterForm.value,...JSONOptionsData}
    data.push(this.form.controls.masterForm.value)
    var JSONData = this.utilServ.setJSONArray(data);
    var xmlData = jsonxml(JSONData);
    // console.log(xmlData)

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
          Pan: Hold1obj["FirstHolderpanNumber"] || '',
          KycXML_AccountDetails: xmlData,
          KycXML_Holder_1: xmlData1 || '',
          KycXML_Holder_2: Hold2obj["SecondHolderpanNumber"] ? xmlData2 : '',
          KycXML_Holder_3: Hold3obj["ThirdHolderpanNumber"] ? xmlData3 : '',
          ClientSerialNo: this.ClientSerialNo || 0,
          AutoSave: 'Y',

        }],
      "requestId": "5062",
      "outTblCount": "0"
    }).then((response) => {
      // console.log(response)
      if (response.errorCode == 0) {
        let result = response.results[0][0]
        if (result.ErrorCode == 0) {
          this.notif.success(result.Msg, '', { nzDuration: 60000 })
        }
        else
          this.notif.error(result.Msg, '', { nzDuration: 60000 })
      }
      else {
        this.notif.error(response.errorMsg, '', { nzDuration: 60000 })
      }
    })



  }
  next1() {
    // this.form.controls.masterForm.value.accountTypeOptions=this.accountType
    // let data=[];
    // data.push(this.form.controls.masterForm.value)
    // var JSONData = this.utilServ.setJSONArray(data);
    // var xmlData = jsonxml(JSONData);
    // console.log(xmlData)
    this.accountType.forEach(element => {
      if (element.Trading) {
        this.cmServ.isTradingChoosen.next(true)
      }
      if (element.DP) {
        this.cmServ.isDPChoosen.next(true)
      }
      if (element.PMSTradingDP) {
        this.cmServ.isTradingChoosen.next(true)
        this.cmServ.isDPChoosen.next(true)
      }
      if (element.PMSDP) {
        this.cmServ.isDPChoosen.next(true)
      }
    });
    this.cmServ.hoderDetails.next(this.holderDetails.value)
    this.cmServ.activeTabIndex.next(3);
    this.cmServ.trigerTrading.next(true)
  }
  nextKyc() {
    this.accountType.forEach(element => {
      if (element.Trading) {
        this.cmServ.isTradingChoosen.next(true)
      }
      if (element.DP) {
        this.cmServ.isDPChoosen.next(true)
      }
      if (element.PMSTradingDP) {
        this.cmServ.isTradingChoosen.next(true)
        this.cmServ.isDPChoosen.next(true)
      }
      if (element.PMSDP) {
        this.cmServ.isDPChoosen.next(true)
      }
    });

    this.cmServ.hoder1PanDetails.next(this.hold1VarifiedPanDetails)
    this.cmServ.hoder2PanDetails.next(this.hold2VarifiedPanDetails)
    this.cmServ.hoder3PanDetails.next(this.hold3VarifiedPanDetails)

    this.cmServ.hoderDetails.next(this.holderDetails.value)
    this.cmServ.activeTabIndex.next(1);
    this.cmServ.trigerKYC.next(true)



  }
  disabledFutureDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  };
  fin() {
    // this.form.controls.masterForm.value.accountTypeOptions=this.accountType
    // let data=[];
    // data.push(this.form.controls.masterForm.value)
    // var JSONData = this.utilServ.setJSONArray(data);
    // var xmlData = jsonxml(JSONData);
    // console.log(xmlData)


    this.cmServ.hoderDetails.next(this.holderDetails.value)
    this.cmServ.activeTabIndex.next(2);
    this.cmServ.trigerFinancial.next(true)


  }
  dp() {
    this.cmServ.hoderDetails.next(this.holderDetails.value)
    this.cmServ.activeTabIndex.next(4);
    this.cmServ.trigerDp.next(true)
  }
  sceme() {
    this.cmServ.hoderDetails.next(this.holderDetails.value)
    this.cmServ.activeTabIndex.next(5);
    this.cmServ.trigerScheme.next(true)
  }
  IU() {
    this.cmServ.hoderDetails.next(this.holderDetails.value)
    this.cmServ.activeTabIndex.next(6);
    this.cmServ.trigerIU.next(true)
  }
  rej() {
    this.cmServ.hoderDetails.next(this.holderDetails.value)
    this.cmServ.activeTabIndex.next(7);
    this.cmServ.trigerRejection.next(true)
  }

  CheckFirstHolderDobWithKRADetails() {
    if (this.ClientSerialNo != 0) {
      return
    }
    setTimeout(() => {
      debugger
      let pan = this.holderDetails.value.FirstHolderpanNumber
      let dt = this.holderDetails.value.FirstHolderdob
      if (dt == null) {
        this.isfirstHolderDobValid = false;
        return
      }
      if (!this.hold1VarifiedPanDetails) {
        this.notif.remove()
        this.notif.error("Please enter Valid First Holder PAN Number", '', { nzDuration: 60000 })
        return
      }
      this.spin = true;
      let d = false
      this.dataServ.checkKRA(pan).then(res => {
        let error = res['Error']
        if (error[0].ErrorCode == 0) {
          let response1 = res['Response']
          console.log(response1)
          if (response1[0].Status == "Submitted" || response1[0].Status == "KRA Verified") {
            let Agency = response1[0].Agency
            let date = dt.getDate() + "-" + (dt.getMonth() + 1) + "-" + dt.getFullYear()
            let data1: string = pan + "," + date + "," + Agency
            this.dataServ.getKRA(data1).then(res => {
              let data = Object.keys(res)
              if (data.length == 2) {
                let error = res['Error']
                if (error[0].ErrorCode == 0) {
                  let response = res['Response']
                  console.log(response)
                  this.notif.success("First Holder DOB is valid", '', { nzDuration: 60000 })
                  this.isfirstHolderDobValid = true;
                  this.spin = false
                }
              }
              else {
                this.notif.remove()
                this.notif.error("Invalid First Holder DOB", '', { nzDuration: 60000 })
                this.isfirstHolderDobValid = false;
                this.spin = false

              }
            })
          }
          else {
            
            this.isfirstHolderDobValid = false;
            this.notif.remove();
            this.notif.error(response1[0].Status,'',{ nzDuration: 60000 })
            this.spin = false
          }
        }
        else {
          this.notif.remove()
          this.notif.error("Invalid First Holder DOB", '', { nzDuration: 60000 })
          this.isfirstHolderDobValid = false;
          this.spin = false

        }
      })
    }, 300);
  }


  CheckSecondHolderDobWithKRADetails() {
    if (this.ClientSerialNo != 0) {
      return
    }
    setTimeout(() => {

      let pan = this.holderDetails.value.SecondHolderpanNumber
      let dt = this.holderDetails.value.SecondHolderdob
      if (dt == null) {
        this.isSecondHolderDobValid = false;
        return
      }
      if (!this.hold2VarifiedPanDetails) {
        this.notif.remove()
        this.notif.error("Please enter Valid Second Holder PAN Number", '', { nzDuration: 60000 })
        return
      }
      this.spin = true;
      let d = false
      this.dataServ.checkKRA(pan).then(res => {
        let error = res['Error']
        if (error[0].ErrorCode == 0) {
          let response1 = res['Response']
          console.log(response1)
          if (response1[0].Status == "Submitted" || response1[0].Status == "KRA Verified") {
            let Agency = response1[0].Agency
            let date = dt.getDate() + "-" + (dt.getMonth() + 1) + "-" + dt.getFullYear()
            let data1: string = pan + "," + date + "," + Agency
            this.dataServ.getKRA(data1).then(res => {
              let data = Object.keys(res)
              if (data.length == 2) {
                let error = res['Error']
                if (error[0].ErrorCode == 0) {
                  let response = res['Response']
                  console.log(response)
                  this.notif.remove()
                  this.notif.success("Second Holder DOB is valid", '', { nzDuration: 60000 })
                  this.isSecondHolderDobValid = true;
                  this.spin = false
                }
           
              }
              else {
                this.notif.remove()
                this.notif.error("Invalid Second Holder DOB", '', { nzDuration: 60000 })
                this.isSecondHolderDobValid = false;
                this.spin = false

              }
            })
          }
          else {
            this.isfirstHolderDobValid = false;
            this.notif.remove();
            this.notif.error(response1[0].Status,'',{ nzDuration: 60000 })
            this.spin = false
          }
        }
        else {
          this.notif.remove()
          this.notif.error("Invalid Second Holder DOB", '', { nzDuration: 60000 })
          this.isSecondHolderDobValid = false;
          this.spin = false

        }
      })


    }, 300);
  }

  CheckThirdDobWithKRADetails() {
    if (this.ClientSerialNo != 0) {
      return
    }
    setTimeout(() => {
      debugger
      let pan = this.holderDetails.value.ThirdHolderpanNumber
      let dt = this.holderDetails.value.ThirdHolderdob
      if (dt == null) {
        this.isThirdHolderDobValid = false;
        return
      }
      if (!this.hold3VarifiedPanDetails) {
        this.notif.remove()
        this.notif.error("Please enter Valid Third Holder PAN Number", '', { nzDuration: 60000 })
        return
      }
      this.spin = true;
      let d = false
      this.dataServ.checkKRA(pan).then(res => {
        let error = res['Error']
        if (error[0].ErrorCode == 0) {
          let response1 = res['Response']
          console.log(response1)
          if (response1[0].Status == "Submitted" || response1[0].Status == "KRA Verified") {
            let Agency = response1[0].Agency
            let date = dt.getDate() + "-" + (dt.getMonth() + 1) + "-" + dt.getFullYear()
            let data1: string = pan + "," + date + "," + Agency
            this.dataServ.getKRA(data1).then(res => {
              let data = Object.keys(res)
              if (data.length == 2) {
                let error = res['Error']
                if (error[0].ErrorCode == 0) {
                  let response = res['Response']
                  console.log(response)
                  this.notif.remove()
                  this.notif.success("Third Holder DOB is valid", '', { nzDuration: 60000 })
                  this.isThirdHolderDobValid = true;
                  this.spin = false
                }
              }
              else {
                this.notif.remove()
                this.notif.error("Invalid Third Holder DOB", '', { nzDuration: 60000 })
                this.isThirdHolderDobValid = false;
                this.spin = false

              }
            })
          }
          else {
            this.isfirstHolderDobValid = false;
            this.notif.remove();
            this.notif.error(response1[0].Status,'',{ nzDuration: 60000 })
            this.spin = false
          }
        }
        else {
          this.notif.remove()
          this.notif.error("Invalid Third Holder DOB", '', { nzDuration: 60000 })
          this.isThirdHolderDobValid = false;
          this.spin = false

        }
      })

    }, 300);
  }

  //   @HostListener('window:keydown',['$event'])
  //   onKeyPress($event: KeyboardEvent) {
  //     this.cmServ.lastActivateTabIndex.subscribe(val=>{
  //       this.currTabIndex=val;
  //     })
  //     if(this.currTabIndex==0){
  //       if($event.altKey && $event.key === 's')
  //          this.saveToTemprary()
  //       if($event.ctrlKey  && $event.key === 's'){
  //          $event.preventDefault();
  //            this.continueNext()
  //            $event.stopPropagation();
  //            $event.stopImmediatePropagation();
  //       }
  //     }
  //   }

  //   onKeyUp(event){ 
  //     let charCode = String.fromCharCode(event.which).toLowerCase();
  //     if (event.altKey && event.key === 's') {
  //       event.preventDefault();
  //      alert()
  //   }
  // }

  // @HostListener('document:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   // console.log(event)
  //   if(event.key === 'Save')
  //   {
  //     event.preventDefault()
  //     alert("save")
  //   }
  // }
  ngOnDistroy() {
    this.subscriptions.forEach(ele => {
      ele.unsubscribe()
    })
  }
}
