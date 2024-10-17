import { Component, OnInit, ElementRef, ViewChild, NgZone, AfterViewInit, HostListener } from '@angular/core';
import { ClientMasterService } from '../client-master.service';
import { FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { ValidationService, UtilService, DataService, AuthService, User, WorkspaceService } from 'shared';
import { NzNotificationService, NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import * as  jsonxml from 'jsontoxml'
import { UploadFile } from 'ng-zorro-antd/upload';
import { element } from '@angular/core/src/render3';
import { InputMasks, InputPatterns } from 'shared';
import { interval, Subscription } from 'rxjs';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { dpValidations } from './dpValidationConfig'
@Component({
  selector: 'app-dp',
  templateUrl: './dp.component.html',
  styleUrls: ['./dp.component.less']
})

export class DpComponent implements OnInit, AfterViewInit {
  nomineeCount: number = 1;
  inputMasks = InputMasks;
  inputPatterns = InputPatterns
  confirmModal: NzModalRef;
  subscriptions: Subscription[] = [];
  sameAsTradingnominee: any;
  sameAsTradingChoosen: boolean = false;
  spin: boolean = false;
  fileList: any = [];
  fileList1: any = [];
  fileList2: any = [];
  fileList3: any = [];
  fileList4: any = [];
  fileList5: any = [];
  fileList6: any = [];
  nomineeIdfileList1: any = [];
  nomineeIdfileList2: any = [];
  nomineeIdfileList3: any = [];
  ResolutionforDematfileList: any = []
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  form: FormGroup;
  DPactiveTabIndex: number = 0
  isShowCdsl: boolean = false;
  @ViewChild('tabsContentRef') el: ElementRef;

  fileName: string;
  document: string;
  remiserDocument: any;



  clientType: string
  HolderDetails: any;
  clientSerialNumber: number;
  dpIdArray: any;
  cdslTypeArray: any=[];
  nsdlTypeArray: any;
  CDSLBOCategoryArray: any;
  nomineeRelationArray: any;
  CDSLRelationshipArray: any;
  CDSLAnnualIncomeArray: any;
  CDSLNationalityArray: any;
  CDSLEducationArray: any;
  CDSLGeographicAreaArray: any;
  CDSLOccupationArray: any;
  CDSLCurrencyArray: any;
  CDSLLanguageArray: any;
  cdslSUBTypeArray: any;
  nsdlSUBTypeArray: any;
  currentUser: User;

  nomineeIdentificationArray: any;
  FormControlNames: any = {};
  cdslSubtype: any;
  nsdlSubtype: any;
  isAutosaving: boolean = false;
  dpId: any;
  generalDetailsArray: any;
  dpOnly: boolean = false;
  showPortal3: boolean;
  previewImageData3: any;
  branch: string;
  availablenomineeDetails: any;
  EntryAccess: any;
  entryAccess: boolean = true;
  firstHolderAge: any;
  currTabIndex: number;
  wsKey: string;
  clientProfileEdit: boolean;
  clientIdDetails: any;
  autosaveTiming: any = 80000;

  SupportFiles: any = [];
  Imglist: any;
  ImgTypeDatalist = [
    // 'PAN',
    // 'Identity document',
    // 'Permanent address',
    // 'Correspondence address',
    // 'Additional Correspondence address',
    'Marriage Certificate',
    'Gazetted Notification','Nominee Id Proof']
  ImgTypeData: any;
  index: number;
  today = new Date()
  age: any;
  customValidationMsgObj = dpValidations;
  firstminorNomineeGuradianShow: boolean = false;
  secondminorNomineeGuradianShow: boolean = false;
  thirdminorNomineeGuradianShow: boolean = false;
  isTradingChoosen: boolean=true;
  isdpFetchingDone: boolean=false;
  Dpdata: any;
  TradingNomineeDetailsAvailable: boolean=false;
  isDPNomineeAndGaurdian:boolean=false
  isEntryfinalised: boolean=false;
  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private authServ: AuthService,
    private cmServ: ClientMasterService,
    private validServ: ValidationService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private wsServ: WorkspaceService,
    private modal: NzModalService,
    private msg: NzMessageService,

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
    //       tab:'DP',
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
    this.cmServ.finalize.subscribe(val=>{
      this.isEntryfinalised=val
    })
    
    this.cmServ.clientIdDetails.subscribe(val => {
      this.clientIdDetails = val
    })
    this.cmServ.autoSaveTiming.subscribe(val => {
      this.autosaveTiming = val
    })
    this.cmServ.isTradingChoosen.subscribe(val=>{
      this.isTradingChoosen=val
    })
    this.cmServ.lastActivateTabIndex.subscribe(val => {
      this.currTabIndex = val;
    })
    this.subscriptions.push(interval(this.autosaveTiming).subscribe(x => {
      if (this.EntryAccess == false || this.currTabIndex != 4 || this.clientProfileEdit) {
        return
      }
      else {
        //   this.modal.closeAll()
        // this.showConfirm()
        if(this.isdpFetchingDone)
        this.saveToTemprary()
      }
    }))

    this.form = this.fb.group({
      dpDetails: this.createDpDetails(),
      CDSLDetails: this.createCDSLDetails(),
      minorGuardianDetails: this.createminorGuardianDetails(),
      firstNomineeDetails: this.createFirstHolderDetails(),
      SecondNomineeDetails: this.createSecondHolderDetails(),
      ThirdNomineeDetails: this.createThirdHolderDetails()
    });


    this.cmServ.clientType.subscribe((val) => {
      this.clientType = val;
    })
    this.cmServ.isEntryAccess.subscribe(val => {
      this.entryAccess = val;
    })

    this.cmServ.hoderDetails.subscribe((val) => {
      this.HolderDetails = val
    })
    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val
    })
    let form: any = this.form.controls;
    form.firstNomineeDetails.controls.nomineeDOB.valueChanges.subscribe(val => {
      let age = this.calculateAge(val)

    })
    form.dpDetails.controls.Sendallcommunicationsstatementsthroughemailonly.valueChanges.subscribe(val => {
      if (val == 'YES') {
        form.dpDetails.controls.EmailIDforCommunication.setValidators(Validators.required)
        form.dpDetails.controls.EmailIDforCommunication.updateValueAndValidity()
      }
      else {
        form.dpDetails.controls.EmailIDforCommunication.setValidators(null)
        form.dpDetails.controls.EmailIDforCommunication.updateValueAndValidity()
      }
    })

    form.firstNomineeDetails.controls.nomineeEqualShareForNominess.valueChanges.subscribe(val => {
      if (val == 'YES') {
        if (this.nomineeCount == 1) {
          form.firstNomineeDetails.controls.sharePercentage.patchValue(100.00)
          form.SecondNomineeDetails.controls.sharePercentage.patchValue(null)
          form.ThirdNomineeDetails.controls.sharePercentage.patchValue(null)

        }
        if (this.nomineeCount == 2) {
          form.firstNomineeDetails.controls.sharePercentage.patchValue(50.00)
          form.SecondNomineeDetails.controls.sharePercentage.patchValue(50.00)
          form.ThirdNomineeDetails.controls.sharePercentage.patchValue(null)


        }
        if (this.nomineeCount == 3) {
          form.firstNomineeDetails.controls.sharePercentage.patchValue(33.33)
          form.SecondNomineeDetails.controls.sharePercentage.patchValue(33.33)
          form.ThirdNomineeDetails.controls.sharePercentage.patchValue(33.33)
        }
      }
      else {
        form.firstNomineeDetails.controls.sharePercentage.patchValue(null)
        form.SecondNomineeDetails.controls.sharePercentage.patchValue(null)
        form.ThirdNomineeDetails.controls.sharePercentage.patchValue(null)
      }

    })

    form.SecondNomineeDetails.controls.nomineeDOB.valueChanges.subscribe(val => {
      let age = this.calculateAge(val)

    })

    form.ThirdNomineeDetails.controls.nomineeDOB.valueChanges.subscribe(val => {
      let age = this.calculateAge(val)

    })
    form.minorGuardianDetails.controls.minorguardianIdentificaitonDetails.valueChanges.subscribe(val => {
      if (val == 'PAN') {
        form.minorGuardianDetails.controls.minorguardianPAN.setValidators(Validators.required)
        form.minorGuardianDetails.controls.minorguardianAaadhar.setValidators(null)
        form.minorGuardianDetails.updateValueAndValidity();
      }
      else if (val == 'Aadhaar') {
        form.minorGuardianDetails.controls.minorguardianPAN.setValidators(null)
        form.minorGuardianDetails.controls.minorguardianAaadhar.setValidators(Validators.required)
        form.minorGuardianDetails.updateValueAndValidity();
      }
      else {
        form.minorGuardianDetails.controls.minorguardianPAN.setValidators(null)
        form.minorGuardianDetails.controls.minorguardianAaadhar.setValidators(null)
        form.minorGuardianDetails.updateValueAndValidity();
      }
    })

    this.cmServ.clientType.subscribe((val) => {
      this.clientType = val;

    })

    this.ngZone.run(() => {
      form.dpDetails.controls.dp.valueChanges.subscribe((val) => {
        form.dpDetails.controls.dpid.patchValue(null)
        form.dpDetails.controls.dpname.patchValue(null)
        if (val == 'CDSL') {
          this.isShowCdsl = true;
          form.dpDetails.controls.SubTypeofCDSLDP.setValidators([Validators.required])
          form.dpDetails.controls.TypeofCDSLDP.setValidators([Validators.required])
          form.dpDetails.controls.TypeofNSDLDP.setValidators(null)
          form.dpDetails.controls.SubTypeofNSDLDP.setValidators(null)
          form.dpDetails.controls.TypeofNSDLDP.updateValueAndValidity();
          form.dpDetails.controls.SubTypeofNSDLDP.updateValueAndValidity();
        }
        else if (val == 'NSDL') {
          this.isShowCdsl = false;
          form.dpDetails.controls.SubTypeofCDSLDP.setValidators(null)
          form.dpDetails.controls.TypeofCDSLDP.setValidators(null)
          form.dpDetails.controls.TypeofNSDLDP.setValidators([Validators.required])
          form.dpDetails.controls.SubTypeofNSDLDP.setValidators([Validators.required])
          form.dpDetails.controls.SubTypeofCDSLDP.updateValueAndValidity();
          form.dpDetails.controls.TypeofCDSLDP.updateValueAndValidity();
        }
        else {
          this.isShowCdsl = false;
          form.dpDetails.controls.SubTypeofCDSLDP.setValidators(null)
          form.dpDetails.controls.TypeofCDSLDP.setValidators(null)
          form.dpDetails.controls.TypeofNSDLDP.setValidators(null)
          form.dpDetails.controls.SubTypeofNSDLDP.setValidators(null)
        }
      })
    })


    this.cmServ.activeTab.subscribe(val => {
      if (val == 4) {
        this.initialPopulation();
      }
    })
  }

  initialPopulation() {
    this.spin=true;
    let form: any = this.form.controls;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientSerialNo: this.clientSerialNumber,
          PAN: this.HolderDetails["FirstHolderpanNumber"],
        }],
      "requestId": "5023",
      "outTblCount": "0"
    }).then((response) => {
      if (response.results) {
        if (response.results[0].length > 0) {
          console.log("dp population",response.results)
          this.Dpdata = response.results[0][0]
          form.dpDetails.controls.KitNO.patchValue(this.Dpdata.KitNo)
          form.dpDetails.controls.NoofHolders.patchValue(this.Dpdata.NoOfHolders)
          form.dpDetails.controls.DPHolderShortName.patchValue(this.Dpdata.ClientFirstName)
          form.dpDetails.controls.Branch.patchValue(this.Dpdata.Branch)
          form.dpDetails.controls.RiskCountry.patchValue(this.Dpdata.RiskCountry)
          form.dpDetails.controls.EmailIDforCommunication.patchValue(this.Dpdata.Email)
          this.dpOnly = this.Dpdata.DPOnly
          this.firstHolderAge = this.Dpdata.Frsthldr_Age
          // if (this.dpOnly) {
          //   form.dpDetails.controls.VoucherId.setValidators(Validators.required)
          //   form.dpDetails.updateValueAndValidity()
          // }
          // else {
          //   form.dpDetails.controls.VoucherId.setValidators(null)
          //   form.dpDetails.updateValueAndValidity()
          // }
        }
        this.dpId = response.results[1]
        this.cdslTypeArray = response.results[2]
        this.cdslSUBTypeArray = response.results[3]
        this.nsdlTypeArray = response.results[4]
        this.nsdlSUBTypeArray = response.results[5]
        this.nomineeRelationArray = response.results[6]
        this.nomineeIdentificationArray = response.results[7]
        this.CDSLBOCategoryArray = response.results[8]
        this.CDSLRelationshipArray = response.results[9]
        this.CDSLNationalityArray = response.results[10]
        this.CDSLAnnualIncomeArray = response.results[11]
        this.CDSLGeographicAreaArray = response.results[12]
        this.CDSLEducationArray = response.results[13]
        this.CDSLOccupationArray = response.results[14]
        this.CDSLLanguageArray = response.results[15]
        this.CDSLCurrencyArray = response.results[16]
        this.generalDetailsArray = response.results[18]
        if(response.results[19].length){
          if(response.results[19][0].nomineeFirstName){
            this.TradingNomineeDetailsAvailable=true;
            this.availablenomineeDetails = response.results[19][0]
            }
     
        }
      }
      setTimeout(() => {
      this.spin=false;
    if(!this.isdpFetchingDone)
      this.fetchDpdetails();
    }, 100);

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

  getCdslSubtype(data) {

    if (data == null)
      return
    let type = ''
    this.cdslTypeArray.forEach(element => {
      if (element.Code == data)
        type = element.Type
    });
    this.cdslSubtype = this.cdslSUBTypeArray.filter(element => {
      return element.Type == type
    })
  }
  getNSDLSubtype(data) {

    if (data == null)
      return

    let type = ''
    this.nsdlTypeArray.forEach(element => {
      if (element.Code == data)
        type = element.Type
    });

    this.nsdlSubtype = this.nsdlSUBTypeArray.filter(element => {
      return element.Type == type
    })
  }
  getDP(data) {
    if (data == null)
      return
    this.dpIdArray = this.dpId.filter(element => {
      return element.DPType == data
    })
  }
  getDPName(data) {
    if (data == null) {
      return
    }
    let form: any = this.form.controls.dpDetails;
    let dpnameArray = this.dpId.filter(element => {
      return element.Code == data
    })
    form.controls.dpname.patchValue(dpnameArray[0].Description)

  }
  sameAsTradingnmne(data) {

    let form: any = this.form.controls.firstNomineeDetails
    if (data) {
      form.patchValue(this.availablenomineeDetails)
      console.log(this.availablenomineeDetails)
      setTimeout(() => {
        form.controls.nomineeIdNumber.patchValue(this.availablenomineeDetails.nomineeIdNumber)
        form.controls.guardianIdNumber.patchValue(this.availablenomineeDetails.guardianIdNumber)
      }, 50);
      this.sameAsTradingChoosen = true;
    }
    else {
      let count=this.nomineeCount;
    let form: any = this.form.controls.firstNomineeDetails

      form.reset()
      form.updateValueAndValidity()
      
      if(count==1){
        setTimeout(() => {
          form.controls.nomineeEqualShareForNominess.patchValue('YES')
        }, 50);
      }
      this.sameAsTradingChoosen = false;
    }
  }
  createDpDetails() {
    return this.fb.group({
      dp: [null, [Validators.required]],
      dpid: [null, [Validators.required]],
      dpname: [null, [Validators.required]],
      // clientId: [null],
      // VoucherId: [null, [Validators.required]],
      NoofHolders: [null],
      DPHolderShortName: [null],
      TypeofCDSLDP: [null],
      SubTypeofCDSLDP: [null],
      TypeofNSDLDP: [null],
      SubTypeofNSDLDP: [null],
      // DPThirdpartyHouserName: [null],
      // DPThirdpartyHouserNumber: [null],
      // DPThirdpartystreet: [null],
      Correspondeceaddressofthirdparty: [null],
      DPThirdpartyName: [null],
      KitNO: [null],
      RiskCountry: [null],
      RSDAFlag: [null, [Validators.required]],
      Branch: [null],
      receivecreditsautomatically: [null, [Validators.required]],
      EmailSharingwithRTA: [null, [Validators.required]],
      EmailIDforCommunication: [null],
      Sendallcommunicationsstatementsthroughemailonly: [null, [Validators.required]],
      Autopledgeconfirmation: [null, [Validators.required]],
      Addressforcommunication: ["Local Address/Permanent Address", [Validators.required]],

    })
  }
  createCDSLDetails() {
    return this.fb.group({
      BOCategory: [null, [Validators.required]],
      StatementCyclecode: ["End of month"],
      Relationship: [null],
      StaffCode: [null],
      Nationality: [null],
      AnnualIncome: [null],
      GeographicArea: [null],
      Education: [null],
      Occupation: [null, [Validators.required]],
      Language: [null],
      CurrencyCode: [null, [Validators.required]],
    })
  }
  createminorGuardianDetails() {
    return this.fb.group({
      minorguardianTitle: [null, [Validators.required]],
      minorguardianFirstName: [null, [Validators.required]],
      minorguardianMiddleName: [null],
      minorguardianLastName: [null, [Validators.required]],
      minorguardianRelationshipofGuardian: [null, [Validators.required]],
      minorguardianHouseName: [null, [Validators.required]],
      minorguardianHouseNumber: [null, [Validators.required]],
      minorguardianStreet: [null, [Validators.required]],
      minorguardianPin: [null, [Validators.required]],
      minorguardianCity: [null, [Validators.required]],
      minorguardianState: [null, [Validators.required]],
      minorguardianCountry: [null, [Validators.required]],
      minorguardianMobile: [null],
      minorguardianTelephoneNumber: [null],
      minorguardianEmailID: [null],
      minorguardianIdentificaitonDetails: [null, [Validators.required]],
      // minorguardianAaadhar: [null],
      // minorguardianPAN: [null],
      minorguardianProofNumber: [null],
    })
  }
  createFirstHolderDetails() {
    return this.fb.group({
      nomineeTitle: [null, [Validators.required]],
      nomineeFirstName: [null, [Validators.required]],
      nomineeMiddleName: [null],
      nomineeLastName: [null],
      nomineeEqualShareForNominess: ['YES', [Validators.required]],
      sharePercentage: [100, [Validators.required]],
      nomineeResidualshares: [null],
      nomineeRelationshipwithapplicant: [null, [Validators.required]],
      nomineeHouseName: [null, [Validators.required]],
      nomineeHouseNumber: [null, [Validators.required]],
      nomineeStreet: [null],
      nomineePin: [null, [Validators.required]],
      nomineeCity: [null, [Validators.required]],
      nomineeState: [null, [Validators.required]],
      // BOCategory: [null,[Validators.required]],
      nomineeCountry: [null, [Validators.required]],
      nomineeMobile: [null],
      nomineeTelephoneNumber: [null],
      nomineeEmailID: [null],
      nomineeNomineeIdentificaitonDetails: [null, [Validators.required]],
      nomineeIdNumber: [null],
      // nomineePAN: [null],
      // nomineeAadhar: [null],
      nomineeDOB: [null, [Validators.required]],

      guardianTitle: [null],
      guardianFirstName: [null],
      guardianMiddleName: [null],
      guardianLastName: [null],
      guardianRelationshipofGuardian: [null],
      guardianHouseName: [null],
      guardianHouseNumber: [null],
      guardianStreet: [null],
      guardianPin: [null],
      guardianCity: [null],
      guardianState: [null],
      guardianCountry: [null],
      guardianTelephoneNumber: [null],
      guardianMobile: [null],
      guardianEmailID: [null],
      guardianIdentificaitonDetails: [null],
      guardianIdNumber: [null],
      // guardianAaadhar: [null],
      // guardianPAN: [null],

    })
  }

  createSecondHolderDetails() {
    return this.fb.group({
      nomineeTitle: [null],
      nomineeFirstName: [null],
      nomineeMiddleName: [null],
      nomineeLastName: [null],
      sharePercentage: [null],
      // nomineeEqualShareForNominess: [null],
      // nomineeResidualshares: [null],
      nomineeRelationshipwithapplicant: [null],
      nomineeHouseName: [null],
      nomineeHouseNumber: [null],
      nomineeStreet: [null],
      nomineePin: [null],
      nomineeCity: [null],
      nomineeState: [null],
      // BOCategory: [null],
      nomineeCountry: [null],
      nomineeMobile: [null],
      nomineeTelephoneNumber: [null],
      nomineeEmailID: [null],
      nomineeNomineeIdentificaitonDetails: [null],
      nomineeIdNumber: [null],

      // nomineePAN: [null],
      // nomineeAadhar: [null],
      nomineeDOB: [null],



      guardianTitle: [null],
      guardianFirstName: [null],
      guardianMiddleName: [null],
      guardianLastName: [null],
      guardianRelationshipofGuardian: [null],
      guardianHouseName: [null],
      guardianHouseNumber: [null],
      guardianStreet: [null],
      guardianPin: [null],
      guardianCity: [null],
      guardianState: [null],
      guardianCountry: [null],
      guardianTelephoneNumber: [null],
      guardianMobile: [null],
      guardianEmailID: [null],
      guardianIdentificaitonDetails: [null],
      guardianIdNumber: [null],
      // guardianAaadhar: [null],
      // guardianPAN: [null],

    })
  }

  createThirdHolderDetails() {
    return this.fb.group({
      nomineeTitle: [null],
      nomineeFirstName: [null],
      nomineeMiddleName: [null],
      nomineeLastName: [null],
      sharePercentage: [null],
      // nomineeEqualShareForNominess: [null],
      // nomineeResidualshares: [null],
      nomineeRelationshipwithapplicant: [null],
      nomineeHouseName: [null],
      nomineeHouseNumber: [null],
      nomineeStreet: [null],
      nomineePin: [null],
      nomineeCity: [null],
      nomineeState: [null],
      // BOCategory: [null],
      nomineeCountry: [null],
      nomineeMobile: [null],
      nomineeTelephoneNumber: [null],
      nomineeEmailID: [null],
      nomineeNomineeIdentificaitonDetails: [null],
      nomineeIdNumber: [null],

      // nomineePAN: [null],
      // nomineeAadhar: [null],
      nomineeDOB: [null],


      guardianTitle: [null],
      guardianFirstName: [null],
      guardianMiddleName: [null],
      guardianLastName: [null],
      guardianRelationshipofGuardian: [null],
      guardianHouseName: [null],
      guardianHouseNumber: [null],
      guardianStreet: [null],
      guardianPin: [null],
      guardianCity: [null],
      guardianState: [null],
      guardianCountry: [null],
      guardianTelephoneNumber: [null],
      guardianMobile: [null],
      guardianEmailID: [null],
      guardianIdentificaitonDetails: [null],
      guardianIdNumber: [null],
      // guardianAaadhar: [null],
      guardianPAN: [null],

    })
  }
  CorAddOfThirdParty(data) {
    let dpDetails: any = this.form.controls.dpDetails
    if (data == null || data == 'NO') {
      dpDetails.controls.DPThirdpartyName.setValidators(null)
      dpDetails.controls.DPThirdpartyName.updateValueAndValidity()
    }
    if (data == 'YES') {
      dpDetails.controls.DPThirdpartyName.setValidators(Validators.required)
      dpDetails.controls.DPThirdpartyName.updateValueAndValidity()
    }
  }
  makeSecondGaurdianMandotory() {
    let secNomForm: any = this.form.controls.SecondNomineeDetails
    secNomForm.controls.nomineeTitle.setValidators([Validators.required])
    secNomForm.controls.nomineeFirstName.setValidators([Validators.required])
    secNomForm.controls.nomineeRelationshipwithapplicant.setValidators([Validators.required])
    secNomForm.controls.sharePercentage.setValidators([Validators.required])
    secNomForm.controls.nomineeHouseName.setValidators([Validators.required])
    secNomForm.controls.nomineeHouseNumber.setValidators([Validators.required])
    secNomForm.controls.nomineePin.setValidators([Validators.required])
    secNomForm.controls.nomineeCity.setValidators([Validators.required])
    secNomForm.controls.nomineeState.setValidators([Validators.required])
    secNomForm.controls.nomineeCountry.setValidators([Validators.required])
    secNomForm.controls.nomineeNomineeIdentificaitonDetails.setValidators([Validators.required])
    secNomForm.controls.nomineeIdNumber.setValidators([Validators.required])
    secNomForm.controls.nomineeDOB.setValidators([Validators.required])

    secNomForm.controls.nomineeTitle.updateValueAndValidity()
    secNomForm.controls.nomineeFirstName.updateValueAndValidity()
    secNomForm.controls.nomineeRelationshipwithapplicant.updateValueAndValidity()
    secNomForm.controls.sharePercentage.updateValueAndValidity()
    secNomForm.controls.nomineeHouseName.updateValueAndValidity()
    secNomForm.controls.nomineeHouseNumber.updateValueAndValidity()
    secNomForm.controls.nomineePin.updateValueAndValidity()
    secNomForm.controls.nomineeCity.updateValueAndValidity()
    secNomForm.controls.nomineeState.updateValueAndValidity()
    secNomForm.controls.nomineeCountry.updateValueAndValidity()
    secNomForm.controls.nomineeNomineeIdentificaitonDetails.updateValueAndValidity()
    secNomForm.controls.nomineeIdNumber.updateValueAndValidity()
    secNomForm.controls.nomineeDOB.updateValueAndValidity()
  }

  clearSecondGaurdianMandotory() {
    let form: any = this.form.controls.SecondNomineeDetails
    form.controls.nomineeTitle.setValidators(null)
    form.controls.nomineeFirstName.setValidators(null)
    form.controls.nomineeRelationshipwithapplicant.setValidators(null)
    form.controls.sharePercentage.setValidators(null)
    form.controls.nomineePin.setValidators(null)
    form.controls.nomineeCity.setValidators(null)
    form.controls.nomineeState.setValidators(null)
    form.controls.nomineeCountry.setValidators(null)
    form.controls.nomineeNomineeIdentificaitonDetails.setValidators(null)
    form.controls.nomineeIdNumber.setValidators(null)
    form.controls.nomineeDOB.setValidators(null)
   form.controls.nomineeHouseName.setValidators(null)
    form.controls.nomineeHouseNumber.setValidators(null)

    form.controls.nomineeTitle.updateValueAndValidity()
    form.controls.nomineeFirstName.updateValueAndValidity()
    form.controls.nomineeRelationshipwithapplicant.updateValueAndValidity()
    form.controls.sharePercentage.updateValueAndValidity()
    form.controls.nomineeHouseName.updateValueAndValidity()
    form.controls.nomineeHouseNumber.updateValueAndValidity()
    form.controls.nomineePin.updateValueAndValidity()
    form.controls.nomineeCity.updateValueAndValidity()
    form.controls.nomineeState.updateValueAndValidity()
    form.controls.nomineeCountry.updateValueAndValidity()
    form.controls.nomineeNomineeIdentificaitonDetails.updateValueAndValidity()
    form.controls.nomineeIdNumber.updateValueAndValidity()
    form.controls.nomineeDOB.updateValueAndValidity()

  }

  makeThirdGaurdianMandotory() {
    let form: any = this.form.controls.ThirdNomineeDetails
    form.controls.nomineeTitle.setValidators([Validators.required])
    form.controls.nomineeFirstName.setValidators([Validators.required])
    form.controls.nomineeRelationshipwithapplicant.setValidators([Validators.required])
    form.controls.sharePercentage.setValidators([Validators.required])
    form.controls.nomineeHouseName.setValidators([Validators.required])
    form.controls.nomineeHouseNumber.setValidators([Validators.required])
    form.controls.nomineePin.setValidators([Validators.required])
    form.controls.nomineeCity.setValidators([Validators.required])
    form.controls.nomineeState.setValidators([Validators.required])
    form.controls.nomineeCountry.setValidators([Validators.required])
    form.controls.nomineeNomineeIdentificaitonDetails.setValidators([Validators.required])
    form.controls.nomineeIdNumber.setValidators([Validators.required])
    form.controls.nomineeDOB.setValidators([Validators.required])
  

    form.controls.nomineeTitle.updateValueAndValidity()
    form.controls.nomineeFirstName.updateValueAndValidity()
    form.controls.nomineeRelationshipwithapplicant.updateValueAndValidity()
    form.controls.sharePercentage.updateValueAndValidity()
    form.controls.nomineePin.updateValueAndValidity()
    form.controls.nomineeCity.updateValueAndValidity()
    form.controls.nomineeState.updateValueAndValidity()
    form.controls.nomineeCountry.updateValueAndValidity()
    form.controls.nomineeHouseName.updateValueAndValidity()
    form.controls.nomineeHouseNumber.updateValueAndValidity()
    form.controls.nomineeNomineeIdentificaitonDetails.updateValueAndValidity()
    form.controls.nomineeIdNumber.updateValueAndValidity()
    form.controls.nomineeDOB.updateValueAndValidity()

  }

  clearThirdGaurdianMandotory() {
    let form: any = this.form.controls.ThirdNomineeDetails
    form.controls.nomineeTitle.setValidators(null)
    form.controls.nomineeFirstName.setValidators(null)
    form.controls.nomineeRelationshipwithapplicant.setValidators(null)
    form.controls.sharePercentage.setValidators(null)
    form.controls.nomineePin.setValidators(null)
    form.controls.nomineeCity.setValidators(null)
    form.controls.nomineeState.setValidators(null)
    form.controls.nomineeCountry.setValidators(null)
    form.controls.nomineeNomineeIdentificaitonDetails.setValidators(null)
    form.controls.nomineeIdNumber.setValidators(null)
    form.controls.nomineeDOB.setValidators(null)
    form.controls.nomineeHouseName.setValidators(null)
    form.controls.nomineeHouseNumber.setValidators(null)
    
    form.controls.nomineeTitle.updateValueAndValidity()
    form.controls.nomineeFirstName.updateValueAndValidity()
    form.controls.nomineeRelationshipwithapplicant.updateValueAndValidity()
    form.controls.sharePercentage.updateValueAndValidity()
    form.controls.nomineePin.updateValueAndValidity()
    form.controls.nomineeCity.updateValueAndValidity()
    form.controls.nomineeState.updateValueAndValidity()
    form.controls.nomineeCountry.updateValueAndValidity()
    form.controls.nomineeNomineeIdentificaitonDetails.updateValueAndValidity()
    form.controls.nomineeIdNumber.updateValueAndValidity()
    form.controls.nomineeDOB.updateValueAndValidity()
    form.controls.nomineeHouseName.updateValueAndValidity()
    form.controls.nomineeHouseNumber.updateValueAndValidity()

  }
  checkAgeAndAddValidations(val) {

    let form: any = this.form.controls.firstNomineeDetails
    if (val == null) {
      this.firstminorNomineeGuradianShow = false;
      this.age = null
      form.controls.guardianTitle.setValidators(null)
      form.controls.guardianFirstName.setValidators(null)
      form.controls.guardianRelationshipofGuardian.setValidators(null)
      form.controls.guardianHouseName.setValidators(null)
      form.controls.guardianHouseNumber.setValidators(null)
      //  form.controls.guardianStreet.setValidators(null)
      form.controls.guardianPin.setValidators(null)
      form.controls.guardianCity.setValidators(null)
      form.controls.guardianState.setValidators(null)
      form.controls.guardianCountry.setValidators(null)
      form.controls.guardianIdentificaitonDetails.setValidators(null)
      form.controls.guardianIdNumber.setValidators(null)


      form.controls.guardianTitle.updateValueAndValidity()
      form.controls.guardianFirstName.updateValueAndValidity()
      form.controls.guardianRelationshipofGuardian.updateValueAndValidity()
      form.controls.guardianPin.updateValueAndValidity()
      form.controls.guardianCity.updateValueAndValidity()
      form.controls.guardianState.updateValueAndValidity()
      form.controls.guardianHouseName.updateValueAndValidity()
      form.controls.guardianHouseNumber.updateValueAndValidity()
      form.controls.guardianCountry.updateValueAndValidity()
      form.controls.guardianIdentificaitonDetails.updateValueAndValidity()
      form.controls.guardianIdNumber.updateValueAndValidity()

      return
    }
    this.age = this.calculateAge(val)
    console.log(this.age)

    if (this.age < 18 && val != null) {
      this.firstminorNomineeGuradianShow = true;
      form.controls.guardianTitle.setValidators([Validators.required])
      form.controls.guardianFirstName.setValidators([Validators.required])
      form.controls.guardianRelationshipofGuardian.setValidators([Validators.required])
      form.controls.guardianPin.setValidators([Validators.required])
      form.controls.guardianCity.setValidators([Validators.required])
      form.controls.guardianHouseName.setValidators([Validators.required])
      form.controls.guardianHouseNumber.setValidators([Validators.required])
      form.controls.guardianState.setValidators([Validators.required])
      form.controls.guardianCountry.setValidators([Validators.required])
      form.controls.guardianIdentificaitonDetails.setValidators([Validators.required])
      form.controls.guardianIdNumber.setValidators([Validators.required])

      form.controls.guardianTitle.updateValueAndValidity()
      form.controls.guardianFirstName.updateValueAndValidity()
      form.controls.guardianRelationshipofGuardian.updateValueAndValidity()
      form.controls.guardianPin.updateValueAndValidity()
      form.controls.guardianCity.updateValueAndValidity()
      form.controls.guardianState.updateValueAndValidity()
      form.controls.guardianCountry.updateValueAndValidity()
      form.controls.guardianIdentificaitonDetails.updateValueAndValidity()
      form.controls.guardianIdNumber.updateValueAndValidity()
      form.controls.guardianHouseName.updateValueAndValidity()
      form.controls.guardianHouseNumber.updateValueAndValidity()


    }
    else {
      this.firstminorNomineeGuradianShow = false;
      form.controls.guardianTitle.setValidators(null)
      form.controls.guardianFirstName.setValidators(null)
      form.controls.guardianRelationshipofGuardian.setValidators(null)
      form.controls.guardianPin.setValidators(null)
      form.controls.guardianCity.setValidators(null)
      form.controls.guardianHouseName.setValidators(null)
      form.controls.guardianHouseNumber.setValidators(null)
      form.controls.guardianState.setValidators(null)
      form.controls.guardianCountry.setValidators(null)
      form.controls.guardianIdentificaitonDetails.setValidators(null)
      form.controls.guardianIdNumber.setValidators(null)

      form.controls.guardianTitle.updateValueAndValidity()
      form.controls.guardianFirstName.updateValueAndValidity()
      form.controls.guardianRelationshipofGuardian.updateValueAndValidity()
      form.controls.guardianPin.updateValueAndValidity()
      form.controls.guardianCity.updateValueAndValidity()
      form.controls.guardianState.updateValueAndValidity()
      form.controls.guardianHouseName.updateValueAndValidity()
      form.controls.guardianHouseNumber.updateValueAndValidity()
      form.controls.guardianCountry.updateValueAndValidity()
      form.controls.guardianIdentificaitonDetails.updateValueAndValidity()
      form.controls.guardianIdNumber.updateValueAndValidity()


    }

  }

  checkAgeAndAddValidations2(val) {
    let form: any = this.form.controls.SecondNomineeDetails
    if (val == null) {
      this.age = null
      this.secondminorNomineeGuradianShow = false;
      form.controls.guardianTitle.setValidators(null)
      form.controls.guardianFirstName.setValidators(null)
      form.controls.guardianRelationshipofGuardian.setValidators(null)
      form.controls.guardianPin.setValidators(null)
      form.controls.guardianCity.setValidators(null)
      form.controls.guardianState.setValidators(null)
      form.controls.guardianCountry.setValidators(null)
      form.controls.guardianIdentificaitonDetails.setValidators(null)
      form.controls.guardianHouseName.setValidators(null)
      form.controls.guardianHouseNumber.setValidators(null)
      form.controls.guardianHouseName.updateValueAndValidity()
      form.controls.guardianHouseNumber.updateValueAndValidity()
      form.controls.guardianTitle.updateValueAndValidity()
      form.controls.guardianFirstName.updateValueAndValidity()
      form.controls.guardianRelationshipofGuardian.updateValueAndValidity()
      form.controls.guardianPin.updateValueAndValidity()
      form.controls.guardianCity.updateValueAndValidity()
      form.controls.guardianState.updateValueAndValidity()
      form.controls.guardianCountry.updateValueAndValidity()
      form.controls.guardianIdentificaitonDetails.updateValueAndValidity()
      return
    }
    this.age = this.calculateAge(val)
    console.log(this.age)

    if (this.age < 18 && val != null) {
      this.secondminorNomineeGuradianShow = true;

      form.controls.guardianTitle.setValidators([Validators.required])
      form.controls.guardianFirstName.setValidators([Validators.required])
      form.controls.guardianRelationshipofGuardian.setValidators([Validators.required])
      form.controls.guardianPin.setValidators([Validators.required])
      form.controls.guardianCity.setValidators([Validators.required])
      form.controls.guardianState.setValidators([Validators.required])
      form.controls.guardianCountry.setValidators([Validators.required])
      form.controls.guardianIdentificaitonDetails.setValidators([Validators.required])
      form.controls.guardianHouseName.setValidators([Validators.required])
      form.controls.guardianHouseNumber.setValidators([Validators.required])
      form.controls.guardianHouseName.updateValueAndValidity()
      form.controls.guardianHouseNumber.updateValueAndValidity()
      form.controls.guardianTitle.updateValueAndValidity()
      form.controls.guardianFirstName.updateValueAndValidity()
      form.controls.guardianRelationshipofGuardian.updateValueAndValidity()
      form.controls.guardianPin.updateValueAndValidity()
      form.controls.guardianCity.updateValueAndValidity()
      form.controls.guardianState.updateValueAndValidity()
      form.controls.guardianCountry.updateValueAndValidity()
      form.controls.guardianIdentificaitonDetails.updateValueAndValidity()

    }
    else {
      this.secondminorNomineeGuradianShow = false;

      form.controls.guardianTitle.setValidators(null)
      form.controls.guardianFirstName.setValidators(null)
      form.controls.guardianRelationshipofGuardian.setValidators(null)
      form.controls.guardianPin.setValidators(null)
      form.controls.guardianCity.setValidators(null)
      form.controls.guardianState.setValidators(null)
      form.controls.guardianCountry.setValidators(null)
      form.controls.guardianIdentificaitonDetails.setValidators(null)
      form.controls.guardianHouseName.setValidators(null)
      form.controls.guardianHouseNumber.setValidators(null)
      form.controls.guardianHouseName.updateValueAndValidity()
      form.controls.guardianHouseNumber.updateValueAndValidity()
      form.controls.guardianTitle.updateValueAndValidity()
      form.controls.guardianFirstName.updateValueAndValidity()
      form.controls.guardianRelationshipofGuardian.updateValueAndValidity()
      form.controls.guardianPin.updateValueAndValidity()
      form.controls.guardianCity.updateValueAndValidity()
      form.controls.guardianState.updateValueAndValidity()
      form.controls.guardianCountry.updateValueAndValidity()
      form.controls.guardianIdentificaitonDetails.updateValueAndValidity()

    }

  }

  checkAgeAndAddValidations3(val) {

    let form: any = this.form.controls.ThirdNomineeDetails
    if (val == null) {
      this.thirdminorNomineeGuradianShow = false;

      this.age = null
      form.controls.guardianTitle.setValidators(null)
      form.controls.guardianFirstName.setValidators(null)
      form.controls.guardianRelationshipofGuardian.setValidators(null)
      form.controls.guardianPin.setValidators(null)
      form.controls.guardianCity.setValidators(null)
      form.controls.guardianState.setValidators(null)
      form.controls.guardianCountry.setValidators(null)
      form.controls.guardianIdentificaitonDetails.setValidators(null)
      form.controls.guardianHouseName.setValidators(null)
      form.controls.guardianHouseNumber.setValidators(null)
      form.controls.guardianHouseName.updateValueAndValidity()
      form.controls.guardianHouseNumber.updateValueAndValidity()
      form.controls.guardianTitle.updateValueAndValidity()
      form.controls.guardianFirstName.updateValueAndValidity()
      form.controls.guardianRelationshipofGuardian.updateValueAndValidity()
      form.controls.guardianPin.updateValueAndValidity()
      form.controls.guardianCity.updateValueAndValidity()
      form.controls.guardianState.updateValueAndValidity()
      form.controls.guardianCountry.updateValueAndValidity()
      form.controls.guardianIdentificaitonDetails.updateValueAndValidity()
      return
    }
    this.age = this.calculateAge(val)
    console.log(this.age)
    if (this.age < 18 && val != null) {
      this.thirdminorNomineeGuradianShow = true;
      form.controls.guardianTitle.setValidators([Validators.required])
      form.controls.guardianFirstName.setValidators([Validators.required])
      form.controls.guardianRelationshipofGuardian.setValidators([Validators.required])
      form.controls.guardianPin.setValidators([Validators.required])
      form.controls.guardianCity.setValidators([Validators.required])
      form.controls.guardianState.setValidators([Validators.required])
      form.controls.guardianCountry.setValidators([Validators.required])
      form.controls.guardianIdentificaitonDetails.setValidators([Validators.required])
      form.controls.guardianHouseName.setValidators([Validators.required])
      form.controls.guardianHouseNumber.setValidators([Validators.required])
      form.controls.guardianHouseName.updateValueAndValidity()
      form.controls.guardianHouseNumber.updateValueAndValidity()
      form.controls.guardianTitle.updateValueAndValidity()
      form.controls.guardianFirstName.updateValueAndValidity()
      form.controls.guardianRelationshipofGuardian.updateValueAndValidity()
      form.controls.guardianPin.updateValueAndValidity()
      form.controls.guardianCity.updateValueAndValidity()
      form.controls.guardianState.updateValueAndValidity()
      form.controls.guardianCountry.updateValueAndValidity()
      form.controls.guardianIdentificaitonDetails.updateValueAndValidity()

    }
    else {
      this.thirdminorNomineeGuradianShow = false;

      form.controls.guardianTitle.setValidators(null)
      form.controls.guardianFirstName.setValidators(null)
      form.controls.guardianRelationshipofGuardian.setValidators(null)
      form.controls.guardianPin.setValidators(null)
      form.controls.guardianCity.setValidators(null)
      form.controls.guardianState.setValidators(null)
      form.controls.guardianCountry.setValidators(null)
      form.controls.guardianIdentificaitonDetails.setValidators(null)
      form.controls.guardianHouseName.setValidators(null)
      form.controls.guardianHouseNumber.setValidators(null)
      form.controls.guardianHouseName.updateValueAndValidity()
      form.controls.guardianHouseNumber.updateValueAndValidity()
      form.controls.guardianTitle.updateValueAndValidity()
      form.controls.guardianFirstName.updateValueAndValidity()
      form.controls.guardianRelationshipofGuardian.updateValueAndValidity()
      form.controls.guardianPin.updateValueAndValidity()
      form.controls.guardianCity.updateValueAndValidity()
      form.controls.guardianState.updateValueAndValidity()
      form.controls.guardianCountry.updateValueAndValidity()
      form.controls.guardianIdentificaitonDetails.updateValueAndValidity()

    }

  }

  getNomineeCount(data) {
    console.log(data)
    let form: any = this.form.controls.firstNomineeDetails
    form.controls.nomineeEqualShareForNominess.patchValue(null)

    setTimeout(() => {
      if (data == 1) {
        this.clearSecondGaurdianMandotory()
        this.clearThirdGaurdianMandotory()
        form.controls.nomineeEqualShareForNominess.patchValue('YES')
        form.controls.sharePercentage.patchValue(100)
      }

      if (data == 2) {
        this.makeSecondGaurdianMandotory()
        this.clearThirdGaurdianMandotory()
      }
      if (data == 3) {
        this.makeSecondGaurdianMandotory()
        this.makeThirdGaurdianMandotory()
      }
    }, 100);

  }
  beforeUpload1 = (file: UploadFile, filelist): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      const isLt2M = file.size / 1024 < 1500
      if (!isLt2M) {
        this.msg.error('Document must smaller than 1500KB!')
        return false;
      }
      else {
        this.nomineeIdfileList1 = [file]
        this.encodeImageFileAsURL(file);
        return false
      }
    }
    else {
      this.msg.error("Please uplaod jpeg/png/pdf")
      return false
    }
  }

  beforeUpload2 = (file: UploadFile, filelist): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      const isLt2M = file.size / 1024 < 1500
      if (!isLt2M) {
        this.msg.error('Document must smaller than 1500KB!')
        return false;
      }
      else {
        this.nomineeIdfileList2 = [file]
        this.encodeImageFileAsURL(file);
        return false
      }
    }
    else {
      this.msg.error("Please uplaod jpeg/png/pdf")
      return false
    }
  }

  beforeUpload3 = (file: UploadFile, filelist): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      const isLt2M = file.size / 1024 < 1500
      if (!isLt2M) {
        this.msg.error('Document must smaller than 1500KB!')
        return false;
      }
      else {
        this.nomineeIdfileList3 = [file]
        this.encodeImageFileAsURL(file);
        return false
      }
    }
    else {
      this.msg.error("Please uplaod jpeg/png/pdf")
      return false
    }
  }
  encodeImageFileAsURL(file) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      file.doc = document
    }
    reader.readAsDataURL(file);
  }

  AddbeforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      const isLt2M = file.size / 1024 < 1500
      if (!isLt2M) {
        this.notif.error('Image must smaller than 1500KB!', '', { nzDuration: 60000 })
        return false;
      }
      this.AddencodeImageFileAsURL(file);
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }


  AddencodeImageFileAsURL(file) {
    let count = 0
    let notallowUpload = false
    let reader = new FileReader();
    this.ImgTypeData

    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      this.Imglist = {
        docname: this.ImgTypeData,
        //  Docfile:file.name,
        type: file.type,
        uid: file.uid,
        size: file.size,
        url: document,
      }

      setTimeout(() => {
        if (this.SupportFiles.length) {
          if (this.ImgTypeData == 'PAN' || this.ImgTypeData == 'Marriage Certificate' || this.ImgTypeData == 'Gazetted Notification') {
            for (let i = 0; i <= this.SupportFiles.length - 1; i++) {
              if (this.SupportFiles[i].docname == this.ImgTypeData) {
                count = count + 1
                this.notif.error(this.ImgTypeData + ' cannot  upload more than ' + count, '')
                notallowUpload = true
                // break;
              }
              if (notallowUpload)
                break
            }
          }
          else {
            for (let j = 0; j <= this.SupportFiles.length - 1; j++) {

              if (this.SupportFiles[j].docname == this.ImgTypeData) {
                count = count + 1
              }
              if (count == 3) {
                this.notif.error(this.ImgTypeData + ' cannot  upload more than ' + count, '')
                notallowUpload = true
                // break;
              }
              if (notallowUpload)
                break
            }
          }
        }
        if (notallowUpload) {
          this.Imglist = [];
          this.ImgTypeData = null;
          return
        }
        this.SupportFiles.push(this.Imglist)
        this.SupportFiles.sort(function (a, b) {
          var nameA = a.docname.toLowerCase(), nameB = b.docname.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0 //default return value (no sorting)
        })

        this.Imglist = [];
        this.ImgTypeData = null;
      }, 300)
    }
    reader.readAsDataURL(file);
  }
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

  showModal(file) {
    if (file["originFileObj"]) {
      let file1 = file["originFileObj"]
      this.filePreiewContent = file1.doc
      this.filePreiewFilename = file1.name
      this.filePreiewContentType = file1.type
      this.filePreiewVisible = true;
    }
    else {
      this.filePreiewContent = file.doc
      this.filePreiewFilename = file.name
      this.filePreiewContentType = file.type
      this.filePreiewVisible = true
    }
  }
  getData() {
    let details = this.getAdditionalDocuments()
    let jsond = this.utilServ.setJSONArray(details);
    let imageXmlData = jsonxml(jsond);
    console.log(imageXmlData)
  }
  formatAdditionalDocuments() {
    if (this.SupportFiles.length) {
      let docName = this.SupportFiles[0].docname
      let counter = 0;
      let finalDocuments: any = JSON.stringify(this.SupportFiles)
      finalDocuments = JSON.parse(finalDocuments)
      for (let i = 0; i < finalDocuments.length; i++) {
        if (docName == finalDocuments[i].docname) {
          counter = counter + 1;
          finalDocuments[i].panNumber = this.HolderDetails["FirstHolderpanNumber"]
          finalDocuments[i].docname = finalDocuments[i].docname + counter
        }
        else {
          docName = finalDocuments[i].docname
          counter = 1
          finalDocuments[i].docname = finalDocuments[i].docname + counter
          finalDocuments[i].panNumber = this.HolderDetails["FirstHolderpanNumber"]
        }
      }

      let jsond = this.utilServ.setJSONArray(finalDocuments);
      let imageXmlData = jsonxml(jsond);
      return imageXmlData
    }
    else {
      return this.SupportFiles
    }

  }
  Deleterow(i) {
    this.SupportFiles.splice(i, 1)
  }
  AddnlshowModal(data) {
    this.filePreiewContent = data.url
    this.filePreiewFilename = data.docname
    this.filePreiewContentType = data.type
    this.filePreiewVisible = true;
  }
  getAdditionalDocuments() {
    if (this.clientType == 'individual') {
      if (this.nomineeCount == 1 && this.isAutosaving == false && this.isDPNomineeAndGaurdian) {
        if (this.nomineeIdfileList1.length == 0) {
          this.notif.error("Please upload First nominee identification details in DP Nominee Details", '', { nzDuration: 60000 })
          this.spin = false
          return []
        }
      }

      if (this.nomineeCount == 2 && this.isAutosaving == false) {
        if (this.nomineeIdfileList1.length == 0) {
          this.notif.error("Please upload First nominee identification details in DP Nominee Details", '', { nzDuration: 60000 })
          this.DPactiveTabIndex = 0
          this.spin = false
          return []
        }

        if (this.nomineeIdfileList2.length == 0) {
          this.notif.error("Please upload Second nominee identification details in DP Nominee Details", '', { nzDuration: 60000 })
          this.DPactiveTabIndex = 1
          this.spin = false
          return []
        }

      }

      if (this.nomineeCount == 3 && this.isAutosaving == false) {
        if (this.nomineeIdfileList1.length == 0) {
          this.notif.error("Please upload First nominee identification details in DP Nominee Details", '', { nzDuration: 60000 })
          this.DPactiveTabIndex = 0
          this.spin = false
          return []
        }

        if (this.nomineeIdfileList2.length == 0) {
          this.notif.error("Please upload Second nominee identification details in DP Nominee Details", '', { nzDuration: 60000 })
          this.DPactiveTabIndex = 1
          this.spin = false
          return []
        }

        if (this.nomineeIdfileList3.length == 0) {
          this.notif.error("Please upload Third nominee identification details in DP Nominee Details", '', { nzDuration: 60000 })
          this.DPactiveTabIndex = 2
          this.spin = false
          return []
        }
      }

      return [
        { doc: this.formatAdditionalDocuments() },
        { doc: this.getObjFromArray(this.nomineeIdfileList1, 'First Nominee Identificaiton') },
        { doc: this.getObjFromArray(this.nomineeIdfileList2, 'Second Nominee Identificaiton') },
        { doc: this.getObjFromArray(this.nomineeIdfileList3, 'Third Nominee Identificaiton') },
      ]
    }
    else {
      return [
        { doc: this.getObjFromArray(this.fileList, 'Resolution for Demat') },
        { doc: this.getObjFromArray(this.fileList1, 'Booklet') },
      ]
    }
  }


  getObjFromArray(filelist, proofname) {
    var totalData = []
    let data;
    filelist.forEach((element, index) => {
      if (element["originFileObj"]) {
        let file = element.originFileObj
        data = {
          panNumber: this.HolderDetails["FirstHolderpanNumber"],
          docname: (proofname == 'PAN' || proofname == 'Signature') ? proofname : proofname + (index + 1),
          url: file.doc,
          size: file.size,
          type: file.type,
          uid: file.uid
        }
      }
      else {
        let file = element
        data = {
          panNumber: this.HolderDetails["FirstHolderpanNumber"],
          docname: (proofname == 'PAN' || proofname == 'Signature') ? proofname : proofname + (index + 1),
          url: file.doc,
          size: file.size,
          type: file.type,
          uid: file.uid
        }
      }
      totalData.push(data)
    });
    let jsond = this.utilServ.setJSONArray(totalData);
    let imageXmlData = jsonxml(jsond);
    return imageXmlData
  }
  // (ngModelChange) = "getPinData($event,ThirdNominee)"
  //   (ngModelChange) = "getPinData($event,ThirdGuardian)"
  //     (ngModelChange) = "getPinData($event,SecondGuardian)"
  //       (ngModelChange) = "getPinData($event,secondNominee)"
  //         (ngModelChange) = "getPinData($event,firstNominee)"
  //           (ngModelChange) = "getPinData($event,firstGuardian)"
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };
  disabledPastDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) < 0;
  };

  getPinData(pin, type) {
    var data = pin.target.value
    let nomineeForm1: any = this.form.controls.firstNomineeDetails;
    let nomineeForm2: any = this.form.controls.SecondNomineeDetails;
    let nomineeForm3: any = this.form.controls.ThirdNomineeDetails;
    let nomineeForm4: any = this.form.controls.minorGuardianDetails;
    if (data == null) {
      return
    }
    if (this.entryAccess == false) {
      return
    }
    if (data.length != 6) {
      if (type == "firstNominee") {
        nomineeForm1.controls.nomineeState.setValue(null)
        nomineeForm1.controls.nomineeCountry.setValue(null)
        nomineeForm1.controls.nomineeCity.setValue(null)
      }
      if (type == "firstGuardian") {
        nomineeForm1.controls.guardianState.setValue(null)
        nomineeForm1.controls.guardianCountry.setValue(null)
        nomineeForm1.controls.guardianCity.setValue(null)
      }

      if (type == "secondNominee") {
        nomineeForm2.controls.nomineeState.setValue(null)
        nomineeForm2.controls.nomineeCountry.setValue(null)
        nomineeForm2.controls.nomineeCity.setValue(null)
      }
      if (type == "SecondGuardian") {
        nomineeForm2.controls.guardianState.setValue(null)
        nomineeForm2.controls.guardianCountry.setValue(null)
        nomineeForm2.controls.guardianCity.setValue(null)
      }

      if (type == "ThirdNominee") {
        nomineeForm3.controls.nomineeState.setValue(null)
        nomineeForm3.controls.nomineeCountry.setValue(null)
        nomineeForm3.controls.nomineeCity.setValue(null)
      }
      if (type == "ThirdGuardian") {
        nomineeForm3.controls.guardianState.setValue(null)
        nomineeForm3.controls.guardianCountry.setValue(null)
        nomineeForm3.controls.guardianCity.setValue(null)
      }
      if (type == "minorguardianPin") {
        nomineeForm4.controls.minorguardianState.setValue(null)
        nomineeForm4.controls.minorguardianCountry.setValue(null)
        nomineeForm4.controls.minorguardianCity.setValue(null)
      }
      return
    }
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "Pin": data,
        }],
      "requestId": "5037"
    })
      .then((response) => {

        if (response.results[0].length > 0) {
          let productList = response.results[0][0];
          if (type == "firstNominee") {
            nomineeForm1.controls.nomineeState.setValue(productList.STATENAME)
            nomineeForm1.controls.nomineeCountry.setValue(productList.Country)
            nomineeForm1.controls.nomineeCity.setValue(productList.District)
          }
          if (type == "firstGuardian") {
            nomineeForm1.controls.guardianState.setValue(productList.STATENAME)
            nomineeForm1.controls.guardianCountry.setValue(productList.Country)
            nomineeForm1.controls.guardianCity.setValue(productList.District)
          }

          if (type == "secondNominee") {
            nomineeForm2.controls.nomineeState.setValue(productList.STATENAME)
            nomineeForm2.controls.nomineeCountry.setValue(productList.Country)
            nomineeForm2.controls.nomineeCity.setValue(productList.District)

          }
          if (type == "SecondGuardian") {
            nomineeForm2.controls.guardianState.setValue(productList.STATENAME)
            nomineeForm2.controls.guardianCountry.setValue(productList.Country)
            nomineeForm2.controls.guardianCity.setValue(productList.District)

          }

          if (type == "ThirdNominee") {
            nomineeForm3.controls.nomineeState.setValue(productList.STATENAME)
            nomineeForm3.controls.nomineeCountry.setValue(productList.Country)
            nomineeForm3.controls.nomineeCity.setValue(productList.District)

          }
          if (type == "ThirdGuardian") {
            nomineeForm3.controls.guardianState.setValue(productList.STATENAME)
            nomineeForm3.controls.guardianCountry.setValue(productList.Country)
            nomineeForm3.controls.guardianCity.setValue(productList.District)

          }
          if (type == "minorguardianPin") {
            nomineeForm4.controls.minorguardianState.setValue(productList.STATENAME)
            nomineeForm4.controls.minorguardianCountry.setValue(productList.Country)
            nomineeForm4.controls.minorguardianCity.setValue(productList.District)

          }
        }
      })
  }



  continueNext() {

    if (this.EntryAccess == false) {
      this.next1()
      return
    }
    this.isAutosaving = false;
    this.spin = true;
    let form: any = this.form.controls
    let isValid = this.validServ.validateForm(form.dpDetails, this.FormControlNames, this.customValidationMsgObj.DPDetails);
    if (!isValid) {
      this.el.nativeElement.scrollIntoView();
      this.spin = false
      return
    }
    let data = []
    data.push(form.dpDetails.value)
    var JSONData1 = this.utilServ.setJSONArray(data);
    let dpDetailsXML = jsonxml(JSONData1);
    console.log(dpDetailsXML)
    let CDSLDetailsXML = ''
    if (this.isShowCdsl) {
      let isValid1 = this.validServ.validateForm(form.CDSLDetails, this.FormControlNames, this.customValidationMsgObj.CDSLDetails);
      if (!isValid1) {
        this.el.nativeElement.scrollIntoView();
        this.spin = false
        return
      }
      let data1 = []
      data1.push(form.CDSLDetails.value)
      this.generalDetailsArray.forEach(element => {
        data1.push(element)
      });
      var JSONData2 = this.utilServ.setJSONArray(data1);
      CDSLDetailsXML = jsonxml(JSONData2);
      console.log(CDSLDetailsXML)
    }
    let minorGuardianDetailsXML = ''
    if (this.firstHolderAge < 18) {
      let isminorValid = this.validServ.validateForm(form.minorGuardianDetails, this.FormControlNames, this.customValidationMsgObj.MinorGuardian);
      if (!isminorValid) {
        this.el.nativeElement.scrollIntoView();
        this.spin = false
        return
      }
      let minordata1 = []
      minordata1.push(form.minorGuardianDetails.value)
      var minorJSONData2 = this.utilServ.setJSONArray(minordata1);
      minorGuardianDetailsXML = jsonxml(minorJSONData2);
      console.log(minorGuardianDetailsXML)
    }
    let firstNomineeDetailsXML = ''
    let SecondNomineeDetailsXML = ''
    let ThirdNomineeDetailsXML = ''
    if (this.clientType == 'individual' && this.firstHolderAge > 18 && this.isDPNomineeAndGaurdian) {
      let isValid2 = this.validServ.validateForm(form.firstNomineeDetails, this.FormControlNames, this.customValidationMsgObj.FirstNomineeDetails);
      if (!isValid2) {
        // this.el.nativeElement.scrollIntoView();
        this.spin = false
        return
      }
      let data2 = []
      let obj = { noOfNominees: this.nomineeCount }
      let totalJsonData = { ...form.firstNomineeDetails.value, ...obj }
      data2.push(totalJsonData)
      var JSONData3 = this.utilServ.setJSONArray(data2);
      firstNomineeDetailsXML = jsonxml(JSONData3);
      console.log(firstNomineeDetailsXML)
      if (this.nomineeCount == 2 || this.nomineeCount == 3) {
        let isValid2 = this.validServ.validateForm(form.SecondNomineeDetails, this.FormControlNames, this.customValidationMsgObj.SecondNomineeDetails);
        if (!isValid2) {
          // this.el.nativeElement.scrollIntoView();
          this.DPactiveTabIndex = 1
          this.spin = false
          return
        }
        let data3 = []
        data3.push(form.SecondNomineeDetails.value)
        var JSONData4 = this.utilServ.setJSONArray(data3);
        SecondNomineeDetailsXML = jsonxml(JSONData4);
        console.log(SecondNomineeDetailsXML)
      }
      if (this.nomineeCount == 3) {
        let isValid = this.validServ.validateForm(form.ThirdNomineeDetails, this.FormControlNames, this.customValidationMsgObj.ThirdNomineeDetails);
        if (!isValid) {
          // this.el.nativeElement.scrollIntoView();
          this.spin = false
          this.DPactiveTabIndex = 2
          return
        }
        let data4 = []
        data4.push(form.ThirdNomineeDetails.value)
        var JSONData5 = this.utilServ.setJSONArray(data4);
        ThirdNomineeDetailsXML = jsonxml(JSONData5);
        console.log(ThirdNomineeDetailsXML)
      }
    }
    let details = this.getAdditionalDocuments()
    if (details.length == 0) {
      this.spin = false
      return
    }
    let jsond = this.utilServ.setJSONArray(details);
    let imageXmlData = jsonxml(jsond);
    this.notif.remove()
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Pan: this.HolderDetails["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          ClientSerialNo: this.clientSerialNumber,
          XML_GeneralDetails: dpDetailsXML.replace(/&/gi, '#||'),
          XML_CDSLDetails: CDSLDetailsXML.replace(/&/gi, '#||'),
          XML_FirstNominee: form.firstNomineeDetails.value.nomineeFirstName ? firstNomineeDetailsXML.replace(/&/gi, '#||') : '',
          XML_SecondNominee: form.SecondNomineeDetails.value.nomineeFirstName ? SecondNomineeDetailsXML.replace(/&/gi, '#||') : '',
          XML_ThirdNominee: form.ThirdNomineeDetails.value.nomineeFirstName ? ThirdNomineeDetailsXML.replace(/&/gi, '#||') : '',
          XML_ImageDetails: imageXmlData,
          XML_GuardianDetails: minorGuardianDetailsXML?minorGuardianDetailsXML.replace(/&/gi, '#||'):'',
          AutoSave: 'N',
          Flag: this.clientProfileEdit ? 'P' : 'A'
        }],
      "requestId": "5026",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        let resultSet = response.results[0][0]
        if (resultSet.ErrorCode == 0) {
          this.spin = false;
          this.notif.success(resultSet.Msg, '');
          this.subscriptions.forEach(ele => {
            ele.unsubscribe()
          })
          this.previewImageData3 = []
          if (!this.clientProfileEdit) {
            
            this.cmServ.activeTabIndex.next(5);
            this.cmServ.trigerScheme.next(true)
          }
        }
        else {
          this.spin = false;
          this.notif.error(resultSet.Msg, '', { nzDuration: 60000 })
        }
      }
      else {
        this.spin = false;
        this.notif.error(response.errorMsg, '');
      }

    })
    

  }


  saveToTemprary() {
    let form: any = this.form.controls
    // let isValid = this.validServ.validateForm(form.dpDetails, this.FormControlNames);
    // if (!isValid) {
    //   this.el.nativeElement.scrollIntoView();
    //   return
    // }
    this.isAutosaving = true;
    let data = []
    data.push(form.dpDetails.value)
    var JSONData1 = this.utilServ.setJSONArray(data);
    let dpDetailsXML = jsonxml(JSONData1);
    let CDSLDetailsXML = ''
    if (this.isShowCdsl) {
      // let isValid1 = this.validServ.validateForm(form.CDSLDetails, this.FormControlNames);
      // if (!isValid1) {
      //   this.el.nativeElement.scrollIntoView();
      //   return
      // }
      let data1 = []
      data1.push(form.CDSLDetails.value)
      this.generalDetailsArray.forEach(element => {
        data1.push(element)
      });
      var JSONData2 = this.utilServ.setJSONArray(data1);
      CDSLDetailsXML = jsonxml(JSONData2);
    }
    // let isValid2 = this.validServ.validateForm(form.firstNomineeDetails, this.FormControlNames);
    // if (!isValid2) {
    //   this.el.nativeElement.scrollIntoView();
    //   return
    // }
    let minorGuardianDetailsXML = ''
    if (this.firstHolderAge < 18) {
      //  let isminorValid = this.validServ.validateForm(form.minorGuardianDetails, this.FormControlNames);
      //  if (!isminorValid) {
      //    this.el.nativeElement.scrollIntoView();
      //    this.spin=false
      //    return
      //  }
      let minordata1 = []
      minordata1.push(form.minorGuardianDetails.value)
      var minorJSONData2 = this.utilServ.setJSONArray(minordata1);
      minorGuardianDetailsXML = jsonxml(minorJSONData2);
    }

    let firstNomineeDetailsXML
    let SecondNomineeDetailsXML
    let ThirdNomineeDetailsXML
    if (this.clientType == 'individual' && this.firstHolderAge > 18 && this.isDPNomineeAndGaurdian) {
      let data2 = []
      data2.push(form.firstNomineeDetails.value)
      var JSONData3 = this.utilServ.setJSONArray(data2);
      firstNomineeDetailsXML = jsonxml(JSONData3);

      let data3 = []
      data3.push(form.SecondNomineeDetails.value)
      var JSONData4 = this.utilServ.setJSONArray(data3);
      SecondNomineeDetailsXML = jsonxml(JSONData4);

      let data4 = []
      data4.push(form.ThirdNomineeDetails.value)
      var JSONData5 = this.utilServ.setJSONArray(data4);
      ThirdNomineeDetailsXML = jsonxml(JSONData5);
    }
    let details = this.getAdditionalDocuments()
    let jsond = this.utilServ.setJSONArray(details);
    let imageXmlData = jsonxml(jsond);

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Pan: this.HolderDetails["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          ClientSerialNo: this.clientSerialNumber,
          XML_GeneralDetails: dpDetailsXML.replace(/&/gi, '#||'),
          XML_CDSLDetails: CDSLDetailsXML.replace(/&/gi, '#||'),
          XML_FirstNominee: firstNomineeDetailsXML?firstNomineeDetailsXML.replace(/&/gi, '#||'):'',
          XML_SecondNominee: SecondNomineeDetailsXML?SecondNomineeDetailsXML.replace(/&/gi, '#||'):'',
          XML_ThirdNominee: ThirdNomineeDetailsXML?ThirdNomineeDetailsXML.replace(/&/gi, '#||'):'',
          XML_ImageDetails: imageXmlData,
          XML_GuardianDetails: minorGuardianDetailsXML?minorGuardianDetailsXML.replace(/&/gi, '#||'):'',
          AutoSave: 'Y',
          Flag: this.clientProfileEdit ? 'P' : 'A'


        }],
      "requestId": "5026",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        let resultSet = response.results[0][0]
        if (resultSet.ErrorCode == 0) {
          // this.notif.success(resultSet.Msg, '');
          // this.subscriptions.forEach(ele => {
          //   ele.unsubscribe()
          // })
          // this.cmServ.activeTabIndex.next(5);
          // this.cmServ.trigerRejection.next(true)
        }
        else {
          // this.notif.error(resultSet.Msg, '',{nzDuration: 60000 })
        }
      }
      else {
        this.notif.error(response.errorMsg, '');
      }
    })

  }

  getimagedata() {

    this.showPortal3 = true;
    this.previewImageData3 = {
      ImageFrom: 'DP-ACCOP',
      PAN: this.HolderDetails["FirstHolderpanNumber"]
    }

    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       ClientSerialNo: this.clientSerialNumber,
    //       PAN: this.HolderDetails["FirstHolderpanNumber"],
    //       Euser: this.currentUser.userCode,
    //       ImageFrom: 'DP-ACCOP'
    //     }],
    //   "requestId": "6002",
    //   "outTblCount": "0"
    // }).then((response) => {
    //   if (response.errorCode == 0) {

    //     if (response.results) {
    //       if (response.results[0].length > 0) {
    //         this.showPortal3 = true;
    //         this.previewImageData3 = response.results[0]
    //       }
    //     }
    //   }
    //   else {
    //     this.notif.error(response.errorMsg, '')
    //   }
    // })
  }
  maskAdharNum1(data, type) {

    let str = data.target.value
    if (str.length > 4) {
      let form: any = this.form.controls.minorGuardianDetails
      let form1: any = this.form.controls.firstNomineeDetails
      let form2: any = this.form.controls.SecondNomineeDetails
      let form3: any = this.form.controls.ThirdNomineeDetails
      str = str.replace(/\d(?=\d{4})/g, '*');
      if (type == 'firstNominee')
        form1.controls.nomineeAadhar.patchValue(str)
      if (type == 'firstGuardian')
        form1.controls.guardianAaadhar.patchValue(str)

      if (type == 'secondNominee')
        form2.controls.nomineeAadhar.patchValue(str)
      if (type == 'secondGuardian')
        form2.controls.guardianAaadhar.patchValue(str)

      if (type == 'thirdNominee')
        form3.controls.nomineeAadhar.patchValue(str)
      if (type == 'thirdGuardian')
        form3.controls.guardianAaadhar.patchValue(str)

      if (type == 'minorGuardian')
        form.controls.guardianAaadhar.patchValue(str)

    }
  }

  ngAfterViewInit() {
      // if(this.clientProfileEdit){
      //   this.dataServ.getResultArray({
      //     "batchStatus": "false",
      //     "detailArray":
      //       [{
      //         ClientID: this.clientIdDetails["FirstHolderClientID"],
      //       }],
      //     "requestId": "5100",
      //     "outTblCount": "0"
      //   }).then((response) => {
      //     if (response.results) {
      //       let form:any=this.form.controls
      //        console.clear()
      //       console.log(response.results)
      //       setTimeout(() => {
      //       if(response.results[0].length>0){
      //         let dataset=response.results[0][0]
      //         this.getCdslSubtype(dataset.TypeofCDSLDP)
      //         this.getNSDLSubtype(dataset.TypeofNSDLDP)
      //         form.dpDetails.patchValue(dataset)
      //       }
      //       if(response.results[1].length>0){
      //         form.CDSLDetails.patchValue(response.results[1][0])
      //       }
      //       if(response.results[2].length>0){
      //         form.firstNomineeDetails.patchValue(response.results[2][0])
      //       }
      //       if(response.results[3].length>0){
      //         form.SecondNomineeDetails.patchValue(response.results[3][0])
      //       }
      //       if(response.results[4].length>0){
      //         form.ThirdNomineeDetails.patchValue(response.results[4][0])
      //       }
      //       if(response.results[5].length>0){
      //         if(response.results[5][0].doc)
      //          this.fileList=response.results[5]
      //       }
      //       if(response.results[6].length>0){
      //          if(response.results[6][0].doc)
      //          this.fileList1=response.results[6]
      //       }
      //       if(response.results[7].length>0){
      //          if(response.results[7][0].doc)
      //          this.fileList2=response.results[7]
      //       }
      //       if(response.results[8].length>0){
      //          if(response.results[8][0].doc)
      //          this.fileList3=response.results[8]
      //       }
      //       if(response.results[9].length>0){
      //          if(response.results[9][0].doc)
      //          this.fileList4=response.results[9]
      //       }
      //       if(response.results[10].length>0){
      //          if(response.results[10][0].doc)
      //          this.fileList5=response.results[10]
      //       }
      //       if(response.results[11].length>0){
      //          if(response.results[11][0].doc)
      //          this.fileList6=response.results[11]
      //       }
      //       if(response.results[12].length>0){
      //          if(response.results[12][0].doc)
      //          this.nomineeIdfileList1=response.results[12]
      //       }
      //       if(response.results[13].length>0){
      //          if(response.results[13][0].doc)
      //          this.nomineeIdfileList2=response.results[13]
      //       }
      //       if(response.results[14].length>0){
      //          if(response.results[14][0].doc)
      //          this.nomineeIdfileList3=response.results[14]
      //       }
      //       if(response.results[15].length>0){
      //         this.generalDetailsArray=response.results[15]
      //      }
      //      if(response.results[16].length>0){
      //       form.minorGuardianDetails.patchValue(response.results[16][0])
      //    }
      //   }, 1000);
      //     }
      // })
      // }
      // else{

   

    // if (this.dataServ.branch == "HO" || this.dataServ.branch == "HOGT") {
    //   this.getimagedata();

    // }

  }
  fetchDpdetails() {
    this.spin=true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          // ClientSerialNo: this.clientSerialNumber,
          // PAN: this.HolderDetails["FirstHolderpanNumber"],
          Tab: 'DP',
          PAN: this.HolderDetails["FirstHolderpanNumber"] || '',
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
          this.isdpFetchingDone=true;
          let form: any = this.form.controls
          // console.clear()
          console.log('dptab fetch data', response.results)
          setTimeout(() => {
            if (response.results[0].length > 0) {
              let dataset = response.results[0][0]
              this.getCdslSubtype(dataset.TypeofCDSLDP)
              this.getNSDLSubtype(dataset.TypeofNSDLDP)
              form.dpDetails.patchValue(dataset)
             form.dpDetails.controls.RiskCountry.patchValue(this.Dpdata.RiskCountry)
            }
            if (response.results[1].length > 0) {
              form.CDSLDetails.patchValue(response.results[1][0])
            }
            if (response.results[2].length > 0) {
              this.nomineeCount = 1
              this.isDPNomineeAndGaurdian=true;
              form.firstNomineeDetails.patchValue(response.results[2][0])
            }
            if (response.results[3].length > 0) {
              this.isDPNomineeAndGaurdian=true;
              this.nomineeCount = 2
              form.SecondNomineeDetails.patchValue(response.results[3][0])
            }
            if (response.results[4].length > 0) {
              this.isDPNomineeAndGaurdian=true;
              this.nomineeCount = 3
              form.ThirdNomineeDetails.patchValue(response.results[4][0])
            }

            if (response.results[5].length > 0) {
              this.SupportFiles = response.results[5]
            }
            // if (response.results[6].length > 0) {
            //   if (response.results[6][0].doc)
            //     this.fileList1 = response.results[6]
            // }
            // if (response.results[7].length > 0) {
            //   if (response.results[7][0].doc)
            //     this.fileList2 = response.results[7]
            // }
            // if (response.results[8].length > 0) {
            //   if (response.results[8][0].doc)
            //     this.fileList3 = response.results[8]
            // }
            // if (response.results[9].length > 0) {
            //   if (response.results[9][0].doc)
            //     this.fileList4 = response.results[9]
            // }
            // if (response.results[10].length > 0) {
            //   if (response.results[10][0].doc)
            //     this.fileList5 = response.results[10]
            // }
            // if (response.results[11].length > 0) {
            //   if (response.results[11][0].doc)
            //     this.fileList6 = response.results[11]
            // }
            if (response.results[6].length > 0) {
              if (response.results[6][0].doc)
                this.nomineeIdfileList1 = response.results[6]
            }
            if (response.results[7].length > 0) {
              if (response.results[7][0].doc)
                this.nomineeIdfileList2 = response.results[7]
            }
            if (response.results[8].length > 0) {
              if (response.results[8][0].doc)
                this.nomineeIdfileList3 = response.results[8]
            }
            if (response.results[9].length > 0) {
              this.generalDetailsArray = response.results[9]
            }
            if (response.results[10].length > 0) {
              form.minorGuardianDetails.patchValue(response.results[10][0])
            }
          });
        }
        this.spin=false
      }
      else {
        this.spin=false
        this.notif.error(response.errorMsg, '')
      }
    })

  }
  next1() {
    this.previewImageData3 = []
    this.el.nativeElement.scrollIntoView();
    this.subscriptions.forEach(ele => {
      ele.unsubscribe()
    })
    this.cmServ.activeTabIndex.next(5);
    this.cmServ.trigerScheme.next(true)
  }
  back() {
    this.previewImageData3 = []
    this.el.nativeElement.scrollIntoView();
    this.subscriptions.forEach(ele => {
      ele.unsubscribe()
    })
    if(this.isTradingChoosen)
    this.cmServ.activeTabIndex.next(3);
    else
    this.cmServ.activeTabIndex.next(2);

  }
  // @HostListener('window:keydown', ['$event'])
  // onKeyPress($event: KeyboardEvent) {
  //   if (this.currTabIndex == 4) {
  //     if ($event.altKey && $event.key === 's')
  //       this.saveToTemprary()
  //     if ($event.ctrlKey && $event.key === 's') {
  //       $event.preventDefault();
  //       $event.stopPropagation();
  //       this.continueNext()
  //     }

  //   }
  // }


  maskAdharNum(number, id, data) {

    let form: any = this.form.controls;
    let moinorGaudianForm: any = this.form.controls.minorGuardianDetails
    let nomineeForm1: any = this.form.controls.firstNomineeDetails;
    let nomineeForm2: any = this.form.controls.SecondNomineeDetails;
    let nomineeForm3: any = this.form.controls.ThirdNomineeDetails;
    if (id == 'Aadhaar') {
      if (number == 'N1') {
        let str = data
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          form.firstNomineeDetails.controls.nomineeIdNumber.setValue(str)
        }
      }
      if (number == 'G1') {
        let str = data
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          nomineeForm1.controls.guardianIdNumber.patchValue(str)
        }
      }
      if (number == 'N2') {
        let str = data
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          nomineeForm2.controls.nomineeIdNumber.patchValue(str)
        }
      }
      if (number == 'G2') {
        let str = data
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          nomineeForm2.controls.guardianIdNumber.patchValue(str)
        }
      }
      if (number == 'N3') {
        let str = data
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          nomineeForm3.controls.nomineeIdNumber.patchValue(str)
        }
      }
      if (number == 'G3') {
        let str = data
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          nomineeForm3.controls.guardianIdNumber.patchValue(str)
        }
      }
      if (number == 'MG') {
        let str = data
        if (str.length > 4) {
          str = str.replace(/\d(?=\d{4})/g, '*');
          moinorGaudianForm.controls.minorguardianProofNumber.patchValue(str)
        }
      }
    }
  }
  ValidatePan(id, val) {

    var charonly = /^[a-zA-Z]+$/
    var numonly = /^[0-9]+$/
    var fullstring = val.currentTarget.value
    if (id == 'PAN') {
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
    else if (id == 'Aadhaar') {
      if (fullstring.length < 12) {
        var paterns = /^[0-9]/
        return paterns.test(val.key);
      }
      else {
        return false
      }

    }
    else {

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

  }
  IdentificationChange(id, proofname?) {
    let form: any = this.form.controls;
    if (id == 'MG') {
      form.minorGuardianDetails.controls.minorguardianProofNumber.setValue(null)
      if (proofname == 'Photograph & Signature') {
        form.minorGuardianDetails.controls.minorguardianProofNumber.setValidators(null)
        form.minorGuardianDetails.controls.minorguardianProofNumber.updateValueAndValidity()
      }
      else {
        form.minorGuardianDetails.controls.minorguardianProofNumber.setValidators(Validators.required)
        form.minorGuardianDetails.controls.minorguardianProofNumber.updateValueAndValidity()
      }
    }
    if (id == 'N1') {
      form.firstNomineeDetails.controls.nomineeIdNumber.setValue(null)
      if (proofname == 'Photograph & Signature') {
        form.firstNomineeDetails.controls.nomineeIdNumber.setValidators(null)
        form.firstNomineeDetails.controls.nomineeIdNumber.updateValueAndValidity()
      }
      else {
        form.firstNomineeDetails.controls.nomineeIdNumber.setValidators(Validators.required)
        form.firstNomineeDetails.controls.nomineeIdNumber.updateValueAndValidity()
      }
    }
    if (id == 'G1') {
      form.firstNomineeDetails.controls.guardianIdNumber.setValue(null)
      if (proofname == 'Photograph & Signature') {
        form.firstNomineeDetails.controls.guardianIdNumber.setValidators(null)
        form.firstNomineeDetails.controls.guardianIdNumber.updateValueAndValidity()
      }
      else {
        form.firstNomineeDetails.controls.guardianIdNumber.setValidators(Validators.required)
        form.firstNomineeDetails.controls.guardianIdNumber.updateValueAndValidity()
      }
    }
    if (id == 'N2') {
      form.SecondNomineeDetails.controls.nomineeIdNumber.setValue(null)
      if (proofname == 'Photograph & Signature') {
        form.SecondNomineeDetails.controls.nomineeIdNumber.setValidators(null)
        form.SecondNomineeDetails.controls.nomineeIdNumber.updateValueAndValidity()
      }
      else {
        form.SecondNomineeDetails.controls.nomineeIdNumber.setValidators(Validators.required)
        form.SecondNomineeDetails.controls.nomineeIdNumber.updateValueAndValidity()
      }
    }
    if (id == 'G2') {
      form.SecondNomineeDetails.controls.guardianIdNumber.setValue(null)
      if (proofname == 'Photograph & Signature') {
        form.SecondNomineeDetails.controls.guardianIdNumber.setValidators(null)
        form.SecondNomineeDetails.controls.guardianIdNumber.updateValueAndValidity()
      }
      else {
        form.SecondNomineeDetails.controls.guardianIdNumber.setValidators(Validators.required)
        form.SecondNomineeDetails.controls.guardianIdNumber.updateValueAndValidity()
      }

    }
    if (id == 'N3') {
      form.ThirdNomineeDetails.controls.nomineeIdNumber.setValue(null)
      if (proofname == 'Photograph & Signature') {
        form.ThirdNomineeDetails.controls.nomineeIdNumber.setValidators(null)
        form.ThirdNomineeDetails.controls.nomineeIdNumber.updateValueAndValidity()
      }
      else {
        form.ThirdNomineeDetails.controls.nomineeIdNumber.setValidators(Validators.required)
        form.ThirdNomineeDetails.controls.nomineeIdNumber.updateValueAndValidity()
      }

    }
    if (id == 'G3') {
      form.ThirdNomineeDetails.controls.guardianIdNumber.setValue(null)
      if (proofname == 'Photograph & Signature') {
        form.ThirdNomineeDetails.controls.guardianIdNumber.setValidators(null)
        form.ThirdNomineeDetails.controls.guardianIdNumber.updateValueAndValidity()
      }
      else {
        form.ThirdNomineeDetails.controls.guardianIdNumber.setValidators(Validators.required)
        form.ThirdNomineeDetails.controls.guardianIdNumber.updateValueAndValidity()
      }


    }

  }
}
// { doc: this.getObjFromArray(this.fileList, 'PAN') },
// { doc: this.getObjFromArray(this.fileList1, 'Aadhaar Card') },
// { doc: this.getObjFromArray(this.fileList2, 'Passport') },
// { doc: this.getObjFromArray(this.fileList3, 'Driving License') },
// { doc: this.getObjFromArray(this.fileList4, 'Voters ID') },
// { doc: this.getObjFromArray(this.fileList5, 'Marriage Certificate') },
// { doc: this.getObjFromArray(this.fileList6, 'Gazetted Notification') },
// { doc: this.getObjFromArray(this.nomineeIdfileList1, 'First Nominee Identificaiton') },
// { doc: this.getObjFromArray(this.nomineeIdfileList2, 'Second Nominee Identificaiton') },
// { doc: this.getObjFromArray(this.nomineeIdfileList3, 'Third Nominee Identificaiton') },