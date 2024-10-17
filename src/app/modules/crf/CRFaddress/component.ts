import { Component, OnInit, ViewChild, AfterViewInit, NgZone, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormGroupName } from '@angular/forms';
import { ValidationService, DataService, PageService } from 'shared';
import { CRFDataService } from '../CRF.service';
import * as  jsonxml from 'jsontoxml'
import { UtilService, AuthService } from 'shared';
import { UploadFile, NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { InputMasks, InputPatterns } from 'shared';
import { CrfComponent } from '../crf.component';
import { CRFImageUploadComponent } from '../CRFimage upload/component';
import { User } from 'shared/shared';
import { Subscription } from 'rxjs';
// import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { CrfipvComponent } from '../crfipv/crfipv.component';

@Component({
  selector: 'crf-address',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})

export class CRFAddressComponent implements OnInit, AfterViewInit {
  @ViewChild(CRFImageUploadComponent) img: CRFImageUploadComponent
  @ViewChild(CrfipvComponent) ipv: CrfipvComponent
  @Input() tab: string;
  enableFacta: boolean = true;
  form: FormGroup;
  inputMasks = InputMasks;
  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  FormControlNames: any = {};
  currentPermantAddressXmlData: any;
  ipvXmlData: any;
  selectedAddress: any;
  corresLocalAddressXmlData: any;
  AdditionalcorresLocalAddressXmlData: any;
  jurisdictionsAddressXmlData: any;
  identyProofXmlData: any;
  isPemantSelected: boolean = false;
  add1: any;
  add2: any;
  add3: any;
  add4: any;
  isJudisdiction: boolean = false
  ProofDetials: any;
  totalProofDetial: any = [];
  Address1formFeilds: any = [];
  Address2formFeilds: any = [];
  Address3formFeilds: any = [];
  Address4formFeilds: any = [];
  identityProofformFeilds: any = [];
  fileListPhoto: any;
  code: any;
  PermanentAddressProofDetails: any = [];
  CorrespondanceAddressProofDetails: any = [];
  JurisdictionAddressProofDetails: any = [];
  identityProofDetails: any = [];
  citizenshipArray: any;
  countryresultArray: any = [];
  resultArray1: any = [];
  isloader: boolean = false;
  dataOfIssue1: any;
  expiryData1: any;
  dataOfIssue2: any;
  expiryData2: any;
  dataOfIssue3: any;
  expiryData3: any;
  dataOfIssue4: any;
  expiryData4: any;
  dataOfIssue5: any;
  expiryData5: any;
  DateError: boolean;

  fileType: string;
  fileList: any = [];
  fileName: string;
  document: string;
  financialDocument: any;
  filePreiewContent: any;
  filePreiewFilename: any;
  filePreiewContentType: any;
  filePreiewVisible: boolean;
  address1: FormGroupName;
  samePermanentAddress: boolean = false;
  citizenshipWithNoIndiaArray: any;
  fullAddressxml: any;
  ChangeAccounts: any;
  subscriptions: Subscription[] = [];
  PANNO: any;
  previewArray: any = [];
  dataforaprove: any = [];
  verificationstatus: any = [];
  currentUser: User;
  formdisable: boolean = false;
  IDNO: any = '';
  isSpining: boolean = false;
  readtest: boolean = true;
  disableDate: boolean = true;
  setCommunicationAddress: any;
  today = new Date();
  RiskCountry: any;
  HO: boolean = false;
  sub1: any;
  sub2: any;
  sub3: any;
  sub4: any;
  sub5: any;
  sub6: any;
  sub7: any;
  sub8: any;
  sub9: any;
  sub10: any;
  countryArray1: any = [];
  countryArray2: any;
  countryArray: any;
  countryArray3: any = [];
  selectAddress: any;
  disableCurrespondance: boolean;
  disablePermanent: boolean;
  Disablead1: boolean = false;
  Disablead2: boolean = false;
  SerialNumber: any = 0;
  saveButtonFlag: boolean;
  approveOrRejectButtonFlag: boolean;
  finalApproveOrRejectButtonFlag: boolean;
  printFlag: boolean = false;
  applicationStatus: any;
  requestID: any;
  isResPin: any = 'false';
  isCurPin: any = 'true';
  ClientAccounts = [];
  enbleCDSL: boolean = false;
  approvelRemarks: any = [];
  rejectionRemarks: any = [];
  isReport: boolean = false;
  NRI: any;
  Remks: any;
  minlength1: any = 50;
  maxlength1: any = 50;
  minlength2: any = 50;
  maxlength2: any = 50;
  editFlag: boolean = false;
  Pdistrict: any = [];
  Cdistrict: any = []
  Label = [
    { key: 'houseName', value: "Address 1" },
    { key: 'street', value: "Address 2" },
    { key: 'landmark', value: "Address 3" }
  ];
  reasonList: any = [];
  reasonsList: any = [];
  Cbox_Disabled: boolean
  checkedArray: any = [];
  nomineeDetailsxml: any;
  checkBoxSelect: boolean;
  checkboxSelected: any = []
  convertedData: any = [];
  popup: boolean = false;
  checkBoxSelected: boolean;
  checkBoxArray: any = [];
  AllcheckboxArray: any = [];
  isVisible = false;
  RequestFrom: any;

  constructor(
    private ngZone: NgZone,
    private fb: FormBuilder,
    private dataServ: DataService,
    private cmServ: CRFDataService,
    private validServ: ValidationService,
    private utilServ: UtilService,
    private notif: NzNotificationService,
    private Crf: CrfComponent,
    private authServ: AuthService,
    private modalService: NzModalService,
    private pageserve: PageService,

  ) {
    this.form = fb.group({
      idProof: [null],
      sameAsPermant: [false],
      taxOutsideIndia: [false],
      proofOfAddress: [1],
      selectedAddress: [null, [Validators.required]],
      address1: this.createAddressGroup(),
      address2: this.createAddressGroup(),
      Rejection: this.CreateRejectionForm(),
    });
    this.add1 = this.form.controls.address1
    this.add2 = this.form.controls.address2
    this.subscriptions.push(
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      })
    )
    this.cmServ.clientBasicData.subscribe((data) => {
      this.PANNO = data.PANNo ? data.PANNo : data.PanNumber;
      this.printFlag = false

    })
    this.cmServ.verificationstatus.subscribe(items => {
      this.verificationstatus = items;
      this.isOrdinary(items)
    })
    this.cmServ.saveButtonFlag.subscribe(item => {
      this.saveButtonFlag = item
    })
    this.cmServ.approveOrRejectButtonFlag.subscribe(item => {
      this.approveOrRejectButtonFlag = item
    })
    this.cmServ.finalApproveOrRejectButtonFlag.subscribe(item => {
      this.finalApproveOrRejectButtonFlag = item
    })
    this.cmServ.applicationStatus.subscribe(item => {
      this.applicationStatus = item

      if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'A' || this.applicationStatus == 'R' || this.applicationStatus == 'F') {
        this.cmServ.DataForAprooval.subscribe(item => {
          this.dataforaprove = item;
        })
      }
      if (this.applicationStatus == 'F' || this.applicationStatus == 'P' || this.applicationStatus == 'A' || this.applicationStatus == 'R') {
        this.Remks = 'Rejection Remarks'
      }
      else {
        this.Remks = 'Remarks'
      }
    })
    this.cmServ.requestID.subscribe(item => {
      this.requestID = item
    })

    this.cmServ.changeAccounts.subscribe((data) => {
      this.ClientAccounts = [];
      this.ClientAccounts = data;
      if (this.ClientAccounts) {
        this.enbleCDSL = false
        this.ClientAccounts.forEach(item => {
          if (item.AccountType == 'CDSL') {
            this.enbleCDSL = true
          }

        })
      }
    })
    this.cmServ.approvelRemarks.subscribe((data) => {
      this.approvelRemarks = data
    })
    this.cmServ.rejectionRemarks.subscribe((data) => {
      this.rejectionRemarks = data
    })
  }
  ngOnInit() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Location: "",
          EUser: ""
        }],
      "requestId": "6022",
      "outTblCount": "0"
    }).then((response) => {
      if (response.results) {
        var nrivaluetest, nritest
        nritest = this.cmServ.nriData.value
        nrivaluetest = this.cmServ.nriData.value
        console.log("nrivaluetest", nrivaluetest.value);

        console.log("nritest", nritest.value);
        this.ProofDetials = response.results[2]


        if ((nrivaluetest == 'NRE' || nrivaluetest == 'NRO' || nrivaluetest == 'NROCM' || nrivaluetest == 'NON RESIDENT INDIAN (NRI)') || (nritest == 'NRE' || nritest == 'NRO' || nritest == 'NROCM' || nritest == 'NON RESIDENT INDIAN (NRI)')) 
        {
          this.ProofDetials.forEach(element => {
            if (element.PermanentAddressProof == true) {
              this.PermanentAddressProofDetails.push(element)
            }
            if (element.CorrespondanceAddressProof == true) {
              this.CorrespondanceAddressProofDetails.push(element)
            }
          });

          this.totalProofDetial = response.results[3]
          this.countryArray = response.results[9];

          this.code = this.ProofDetials[3].Code
          this.add1.controls.proofOfAddress.patchValue(this.code)
          this.add2.controls.proofOfAddress.patchValue(this.code)
          this.form.controls.idProof.patchValue(this.code)
          // if (this.IsForAprove) {
          //   this.FillApproveData();
          // }
          // this.Address1formFeilds=this.cmServ.getControls(this.totalProofDetial,this.code);
          // this.Address2formFeilds=this.cmServ.getControls(this.totalProofDetial,this.code);
          // this.Address3formFeilds=this.cmServ.getControls(this.totalProofDetial,this.code);
          // this.Address4formFeilds=this.cmServ.getControls(this.totalProofDetial,this.code);
          // this.identityProofformFeilds=this.cmServ.getControls(this.totalProofDetial,this.code);
          // this.form=this.cmServ.getControls(this.totalProofDetial,this.code);
        }

        else if (nrivaluetest != 'NRE' || nritest != 'NRE' || nrivaluetest != 'NRO' || nritest != 'NRO' || nrivaluetest != 'NROCM' || nritest != 'NROCM' || nrivaluetest != 'NON RESIDENT INDIAN (NRI)' || nritest != 'NON RESIDENT INDIAN (NRI)' )
         {
          var removeddata = this.ProofDetials.filter(x => !(x.Code == 45));
          removeddata.forEach(element => {
            if (element.PermanentAddressProof == true) {
             this.PermanentAddressProofDetails.push(element)
            }
            if (element.CorrespondanceAddressProof == true) {
              this.CorrespondanceAddressProofDetails.push(element)
            }
            this.totalProofDetial = response.results[3]
            console.log("this.totalProofDetial ", this.totalProofDetial);
            this.countryArray = response.results[9];
            this.code = this.ProofDetials[3].Code
            this.add1.controls.proofOfAddress.patchValue(this.code)
            this.add2.controls.proofOfAddress.patchValue(this.code)
            this.form.controls.idProof.patchValue(this.code)
          });
        }
      }
      if (this.applicationStatus == 'P' || this.applicationStatus == 'T' || this.applicationStatus == 'R' || this.applicationStatus == 'A' || this.applicationStatus == 'F') {
        this.isReport = true;
        this.FillApproveData();
      }
    })
    this.ngZone.run(() => {
      this.add1.controls.proofOfAddress.valueChanges.subscribe(res => {
        //  let valuesArray=JSON.stringify(this.cmServ.getControls(this.totalProofDetial, res))
        // this.Address1formFeilds = JSON.parse(valuesArray)
        if (res == '10') {
          this.minlength1 = 12
        }
        this.Address1formFeilds = this.cmServ.getControls(this.totalProofDetial, res);

      })
      this.add2.controls.proofOfAddress.valueChanges.subscribe(res => {
        // let valuesArray=JSON.stringify(this.cmServ.getControls(this.totalProofDetial, res))
        // this.Address2formFeilds = JSON.parse(valuesArray)
        if (res == '10') {
          this.minlength2 = 12
        }
        this.Address2formFeilds = this.cmServ.getControls(this.totalProofDetial, res);
      })

      this.add1.controls.country.valueChanges.subscribe(ele => {
        console.log("this.add1.controls.country.valueChanges", ele);

        if (ele == null) {
          return
        }
        var val = ele.toUpperCase();
        if (this.countryArray) {
          this.countryArray1 = this.countryArray.filter(item => {
            return item.Country.includes(val);
          })
        }
      })
      this.add2.controls.country.valueChanges.subscribe(item => {
        console.log("this.add2.controls.country.valueChanges", item);

        if (item == null) {
          return;
        }
        var val = item.toUpperCase();
        if (this.countryArray) {
          this.countryArray2 = this.countryArray.filter(item => {
            return item.Country.includes(val);
          })
        }
      })
    })
    this.cmServ.changeAccountsXML.subscribe(item => {
      this.ChangeAccounts = item;
    })
    this.setCommunicationAddress = 'N';
    var branch = this.dataServ.branch
    if (branch == 'HO' || branch == 'HOGT') {

      this.HO = true
    }
    this.RiskCountry = this.verificationstatus.RiskCountry
    console.log("riskcountry", this.RiskCountry);

    // this.SelectedAddress="Both"
    this.form.controls.selectedAddress.setValue('Both')
    this.SetAddressFiels('Both')
    this.getData()
  }
  fetchReasons() {

    this.isVisible = true;
    this.popup = true
    this.authServ.getUser().subscribe(user => {
      this.currentUser;
    })
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          EntryType: this.tab,
          EUser: this.currentUser.userCode,
          RequestFrom: this.RequestFrom || ''
        }],
      "requestId": "7942",
      "outTblCount": "0"
    }).then((response) => {
      this.reasonsList = response.results[0];
    })
  }
  getData() {
    this.authServ.getUser().subscribe(user => {
      this.currentUser;
    })
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Request_IDNO: this.requestID,
          EUser: this.currentUser.userCode
        }],
      "requestId": "6013",
      "outTblCount": "0"
    }).then((response) => {
      this.reasonList = response.results[7];

      let applicationStatus = response.results[2][0].Status;
      if (applicationStatus == 'R') {
        this.Cbox_Disabled = true
        this.checkBoxSelect = true
      }

      let Rejremarks: any = this.form.controls.Rejection
      if (this.applicationStatus == 'R') {
        Rejremarks.controls.RejRemarks.disable();
      }

    })
  }
  popOut() {
    if (this.checkBoxArray.length != 0 || this.AllcheckboxArray.length != 0) {
      this.isVisible = false
      // this.checkBoxSelected = true
      // this.Cbox_Disabled = true
    }
    else {
      this.notif.error("You need to select at least one reason or proceed by selecting cancel button", '')
    }

  }

  changed(event, data) {
    let index = this.reasonsList.findIndex(x => x.ID === data.ID)
    if (event.target.checked == true) {
      this.checkBoxArray.push(data)
      this.checkboxSelected[index] = true

      this.checkedArray.push({ "RejectionReason": { "Reason": data.ID } })
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.checkedArray)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
      console.log('checked', this.nomineeDetailsxml);
    }
    else {
      this.checkboxSelected[index] = false
      let msg = this.reasonsList[index].Description
      let i = this.checkBoxArray.findIndex(x => x.Description === msg);
      this.checkBoxArray.splice(i, 1)

      this.checkedArray.splice(i, 1);
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.checkedArray)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
      console.log('Unchecked', this.nomineeDetailsxml);
    }
  }


  onSaveCheckBoxChanged(event) {
    if (event.target.checked == true) {
      this.checkBoxSelect = true
      for (let i = 0; i < this.reasonsList.length; i++) {
        this.AllcheckboxArray.push(this.reasonsList[i].Description)
        this.convertedData.push({ "RejectionReason": { "Reason": this.reasonsList[i].ID } })
        this.checkboxSelected[i] = true
      }
      var nomineeDetailsjson = this.utilServ.setJSONMultipleArray(this.convertedData)
      this.nomineeDetailsxml = jsonxml(nomineeDetailsjson);
      console.log('array selected', this.nomineeDetailsxml)
    }
    else {
      for (let i = 0; i < this.reasonsList.length; i++) {
        this.checkboxSelected[i] = false
      }
      this.checkBoxSelect = false
      this.AllcheckboxArray.splice(0)
      this.convertedData.splice(0)
    }
  }

  ngAfterViewInit() {
    this.img.setproofs(this.tab)
    // this.RiskCountry = this.verificationstatus.RiskCountry
  }
  patchADDProof1Data(id, obj) {
    setTimeout(() => {
      this.add1.controls.proofOfAddress.patchValue(id)
      this.Address1formFeilds = this.cmServ.getControls(this.totalProofDetial, id);
      let objKeys = Object.keys(obj);
      objKeys.forEach((o, i) => {
        if (obj[o] == null) {

        }
        else
          this.Address1formFeilds[i][o] = obj[o];
      })
    }, 500)
  }
  patchADDProof2Data(id, obj) {
    setTimeout(() => {
      this.add2.controls.proofOfAddress.patchValue(id)
      this.Address2formFeilds = this.cmServ.getControls(this.totalProofDetial, id);

      let objKeys = Object.keys(obj);
      objKeys.forEach((o, i) => {
        if (obj[o] == null) {

        }
        else
          this.Address2formFeilds[i][o] = obj[o];
      })
    }, 500)
  }
  patchADDProof3Data(id, obj) {
    setTimeout(() => {
      this.add3.controls.proofOfAddress.patchValue(id)
      this.Address3formFeilds = this.cmServ.getControls(this.totalProofDetial, id);
      let objKeys = Object.keys(obj);
      objKeys.forEach((o, i) => {
        if (obj[o] == null) {

        }
        else
          this.Address3formFeilds[i][o] = obj[o];
      })
    }, 500)
  }
  patchADDProof4Data(id, obj, flag) {


    this.form.controls.taxOutsideIndia.setValue(flag)
    if (flag == false) {
    }
    else
      setTimeout(() => {
        this.add4.controls.proofOfAddress.patchValue(id)
        this.Address4formFeilds = this.cmServ.getControls(this.totalProofDetial, id);
        let objKeys = Object.keys(obj);
        objKeys.forEach((o, i) => {
          if (obj[o] == null) {

          }
          else
            this.Address4formFeilds[i][o] = obj[o];
        })
      }, 500)

  }
  patchIdentityProofData(id, obj) {

    let objKeys = Object.keys(obj);
    objKeys.pop()
    setTimeout(() => {
      this.identityProofformFeilds = this.cmServ.getControls(this.totalProofDetial, id);
      objKeys.forEach((o, i) => {
        this.form.controls.idProof.patchValue(id)
        if (obj[o] == null) {
          return
        }
        else
          this.identityProofformFeilds[i][o] = obj[o];
      })
    }, 600)
  }

  private createAddressGroup() {
    return this.fb.group({
      houseName: [null],
      houseNumber: [null],
      street: [null,],
      landmark: [null],
      pinCode: [null],
      country: [null],
      state: [null],
      proofOfAddress: [null],
      city: [null],
      district: [null],
    });
  }



  beforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.fileList = [file];
      this.fileType = file.type;
      this.fileName = file.name
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
      this.financialDocument = {
        Docname: 'Fatca Details',
        Doctype: this.fileType,
        Docuid: file.uid,
        doc: this.document,
        Docsize: file.size
      }
    }
    reader.readAsDataURL(file);
  }

  showModal() {
    this.filePreiewContent = this.financialDocument.doc
    this.filePreiewFilename = this.financialDocument.Docname
    this.filePreiewContentType = this.financialDocument.Doctype
    this.filePreiewVisible = true;
  }

  getPinData(data, Address) {
    this.isloader = true;
    if (data == null) {
      this.isloader = false;
      return
    }
    if (data.length != 6) {
      if (Address == "address1") {
        this.Pdistrict = [];
        this.add1.controls.country.setValue(null)
        this.add1.controls.district.setValue(null)
        this.add1.controls.state.setValue(null)
      }
      if (Address == "address2") {
        this.Cdistrict = [];
        this.add2.controls.country.setValue(null)
        this.add2.controls.district.setValue(null)
        this.add2.controls.state.setValue(null)
      }
      this.isloader = false;
      return
    }
    if (!this.isReport) {
      if (data.length == 6) {
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
              if (Address == "address1") {
                if (data == '100000') {
                  this.isResPin = 'false'
                }
                else {
                  this.isResPin = 'true'
                }
                for (let i = 0; i < response.results[0].length; i++) {
                  this.Pdistrict.push(response.results[0][i].District);
                }
                this.add1.controls.district.setValue(productList.District)
                this.add1.controls.state.setValue(productList.STATENAME)
                this.add1.controls.country.setValue(productList.Country)
                //if (!this.enbleCDSL) {
                this.add1.controls.city.setValue(productList.District)
                //}
              }
              if (Address == "address2") {
                if (data == '100000') {
                  this.isCurPin = 'true'
                }
                else {
                  this.isCurPin = 'false'
                }
                // this.add2.controls.country.setValue(productList.Country)
                if (!this.isPemantSelected) {
                  for (let i = 0; i < response.results[0].length; i++) {
                    this.Cdistrict.push(response.results[0][i].District);
                  }
                  this.add2.controls.district.setValue(productList.District)
                  this.add2.controls.state.setValue(productList.STATENAME)
                  this.add2.controls.country.setValue(productList.Country)
                  //if (!this.enbleCDSL) {
                  this.add2.controls.city.setValue(productList.District)
                  //}
                }
              }
            }
          })
        this.isloader = false;
      }
    }
  }



  selectPermantADD(data) {
    let form: any = this.form.controls.address2
    let targetData: any = this.form.controls.address1

    let sub2
    if (data == true) {
      this.isPemantSelected = true;
      this.Cdistrict = this.Pdistrict
      // let pfAdd1: any = this.form.controls.address1Proof
      this.sub1 = targetData.controls.houseName.valueChanges.subscribe(item => {
        form.controls.houseName.setValue(item)
      })
      this.sub2 = targetData.controls.houseNumber.valueChanges.subscribe(item => {
        form.controls.houseNumber.setValue(item);
      })
      this.sub3 = targetData.controls.street.valueChanges.subscribe(item => {
        form.controls.street.setValue(item);
      })
      this.sub4 = targetData.controls.city.valueChanges.subscribe(item => {
        form.controls.city.setValue(item)
      })
      this.sub5 = targetData.controls.country.valueChanges.subscribe(item => {
        form.controls.country.setValue(item)
      })
      this.sub6 = targetData.controls.district.valueChanges.subscribe(item => {
        form.controls.district.setValue(item)
      })
      this.sub7 = targetData.controls.pinCode.valueChanges.subscribe(item => {
        form.controls.pinCode.setValue(item);
      })
      this.sub8 = targetData.controls.state.valueChanges.subscribe(item => {
        form.controls.state.setValue(item)
      })
      this.sub9 = targetData.controls.proofOfAddress.valueChanges.subscribe(item => {
        form.controls.proofOfAddress.setValue(item)
      })
      this.sub10 = targetData.controls.landmark.valueChanges.subscribe(item => {
        form.controls.landmark.setValue(item)
      })
      form.controls.houseName.setValue(targetData.controls.houseName.value)
      form.controls.houseNumber.setValue(targetData.controls.houseNumber.value)
      form.controls.street.setValue(targetData.controls.street.value)
      form.controls.landmark.setValue(targetData.controls.landmark.value)
      form.controls.city.setValue(targetData.controls.city.value)
      form.controls.country.setValue(targetData.controls.country.value)
      form.controls.district.setValue(targetData.controls.district.value)
      form.controls.pinCode.setValue(targetData.controls.pinCode.value)
      form.controls.state.setValue(targetData.controls.state.value)
      form.controls.proofOfAddress.setValue(targetData.controls.proofOfAddress.value)
      this.Address2formFeilds = this.Address1formFeilds
    }
    else {
      this.isPemantSelected = false
      this.sub1.unsubscribe();
      this.sub2.unsubscribe();
      this.sub3.unsubscribe();
      this.sub4.unsubscribe();
      this.sub5.unsubscribe();
      this.sub6.unsubscribe();
      this.sub7.unsubscribe();
      this.sub8.unsubscribe();
      this.sub9.unsubscribe();
      this.sub10.unsubscribe();
      form.controls.houseName.setValue(null)
      form.controls.houseNumber.setValue(null)
      form.controls.street.setValue(null)
      form.controls.city.setValue(null)
      form.controls.country.setValue(null)
      form.controls.state.setValue(null)
      form.controls.district.setValue(null)
      form.controls.pinCode.setValue(null)
      form.controls.landmark.setValue(null)
      this.add2.controls.houseName.enable();
      this.add2.controls.houseNumber.enable();
      this.add2.controls.street.enable();
      this.add2.controls.pinCode.enable();
      this.add2.controls.city.enable();
      this.add2.controls.district.enable();
      this.add2.controls.state.enable();
      this.add2.controls.country.enable();
      this.add2.controls.landmark.enable();
    }
  }
  checkSameAddressAs(data) {
    if (data == "Correspondence") {
      let form: any = this.form.controls.address4
      let targetData: any = this.form.controls.address2
      this.Address4formFeilds = this.Address2formFeilds
      form.controls.houseName.setValue(targetData.controls.houseName.value)
      form.controls.houseNumber.setValue(targetData.controls.houseNumber.value)
      form.controls.street.setValue(targetData.controls.street.value)
      form.controls.city.setValue(targetData.controls.city.value)
      form.controls.country.setValue(targetData.controls.country.value)
      form.controls.district.setValue(targetData.controls.district.value)
      form.controls.pinCode.setValue(targetData.controls.pinCode.value)
      form.controls.state.setValue(targetData.controls.state.value)
      form.controls.proofOfAddress.setValue(targetData.controls.proofOfAddress.value)
      form.controls.landmark.setValue(targetData.controls.landmark.value)
      this.Address4formFeilds = this.Address2formFeilds
    }
    if (data == "Permanent") {
      let form: any = this.form.controls.address4
      let targetData: any = this.form.controls.address1
      form.controls.houseName.setValue(targetData.controls.houseName.value)
      form.controls.houseNumber.setValue(targetData.controls.houseNumber.value)
      form.controls.street.setValue(targetData.controls.street.value)
      form.controls.city.setValue(targetData.controls.city.value)
      form.controls.country.setValue(targetData.controls.country.value)
      form.controls.district.setValue(targetData.controls.district.value)
      form.controls.pinCode.setValue(targetData.controls.pinCode.value)
      form.controls.state.setValue(targetData.controls.state.value)
      form.controls.proofOfAddress.setValue(targetData.controls.proofOfAddress.value)
      form.controls.landmark.setValue(targetData.controls.landmark.value)
      this.Address4formFeilds = this.Address1formFeilds
    }
  }
  validateDate1(field, data) {

    this.DateError = false;

    if (field == "DOI")
      this.dataOfIssue1 = data
    if (field == "Expiry Date")
      this.expiryData1 = data
    setTimeout(() => {
      if (this.dataOfIssue1 && this.expiryData1) {
        if (this.expiryData1 <= this.dataOfIssue1) {
          this.notif.error("Expiry date should be less than date of issue", '');
          this.Address1formFeilds[3].proof3 = null
        }
      }
    }, 200);


  }
  validateDate2(field, data) {

    this.DateError = false;
    if (field == "DOI")
      this.dataOfIssue2 = data
    if (field == "Expiry Date")
      this.expiryData2 = data
    setTimeout(() => {
      if (this.dataOfIssue2 && this.expiryData2) {
        if (this.expiryData2 <= this.dataOfIssue2) {
          this.notif.error("Expiry date should be less than date of issue", '');
          this.Address2formFeilds[3].proof3 = null
        }
      }
    }, 100);
  }
  validateDate3(field, data) {
    this.DateError = false;
    if (field == "DOI")
      this.dataOfIssue3 = data
    if (field == "Expiry Date")
      this.expiryData3 = data
    setTimeout(() => {
      if (this.dataOfIssue3 && this.expiryData3) {
        if (this.expiryData3 <= this.dataOfIssue3) {
          this.notif.error("Expiry date should be less than date of issue", '');
          this.Address3formFeilds[3].proof3 = null
        }
      }
    }, 100);
  }
  validateDate4(field, data) {

    this.DateError = false;
    if (field == "DOI")
      this.dataOfIssue4 = data
    if (field == "Expiry Date")
      this.expiryData4 = data
    setTimeout(() => {
      if (this.dataOfIssue4 && this.expiryData4) {
        if (this.expiryData4 <= this.dataOfIssue4) {
          this.notif.error("Expiry date should be less than date of issue", '');
          this.Address4formFeilds[3].proof3 = null
        }
      }
    }, 100);

  }
  validateDate5(field, data) {

    if (field == "DOI")
      this.dataOfIssue5 = data
    if (field == "Expiry Date")
      this.expiryData5 = data
    setTimeout(() => {
      if (this.dataOfIssue5 && this.expiryData5) {
        if (this.expiryData5 <= this.dataOfIssue5) {
          this.notif.error("Expiry date should be less than date of issue", '');
          this.identityProofformFeilds[3].proof3 = null
        }
      }
    }, 100);

  }
  isIdentityProofValid() {

    let dummydata = this.cmServ.getProofOfDetialsData(this.identityProofformFeilds, "proof")
    let isValid = this.validServ.validate(dummydata, "Proof Of Identity")
    let pfdata = this.cmServ.generateJSONfromArray(dummydata)
    if (isValid) {
      let data: any = []

      let pf =
      {
        'proofOfAddress': this.form.controls.idProof.value
      }
      let totalData = { ...pf, ...pfdata }
      data.push(totalData)
      var JSONData = this.utilServ.setJSONArray(data);
      this.identyProofXmlData = jsonxml(JSONData);
      return isValid
    }
    else {
      isValid
    }
  }
  childtestmethode() {
  }
  SaveAddress(action) {
    debugger
    var addselected = this.form.controls.selectedAddress.value
    console.log("address", addselected);

    var Permanentaddressvalid
    var isProofAddress2Valid
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure you want to save ?</b>',
      nzOnOk: () => {
        let isAddress1Valid = this.cmServ.validateForm(this.form.controls.address1, this.FormControlNames, this.Label);
        let dummydata1 = this.cmServ.getProofOfDetialsData(this.Address1formFeilds, "proof")
        if (isAddress1Valid) {
          if (addselected == 'Both' || addselected == 'Permanent') {
            Permanentaddressvalid = this.validServ.validateCRFIdentitydetails(dummydata1, "Local/Permanent address")
            if (dummydata1[0] && dummydata1[0].Code && dummydata1[0].Code == '10') {
              if (dummydata1[0].proof0.length != 12) {
                this.notif.error('Invalid Aadhaar details', '');
                return
              }
            }
          }
          else {
            Permanentaddressvalid = true
          }
          if (Permanentaddressvalid) {
            let add1pf = this.cmServ.generateJSONfromArray(dummydata1)
            let data: any = []
            let totalData = { ...this.form.controls.address1.value, ...add1pf }
            data.push(totalData)
            this.currentPermantAddressXmlData = jsonxml(data);
            let isAddress2Valid = this.cmServ.validateForm(this.form.controls.address2, this.FormControlNames, this.Label);
            let dummydata2 = this.cmServ.getProofOfDetialsData(this.Address2formFeilds, "proof")

            if (isAddress2Valid) {
              if (addselected == 'Both' || addselected == 'Currespondance') {
                // isProofAddress2Valid = this.validServ.validate(dummydata2, "Correspondence/Local Address Proof")
                isProofAddress2Valid = this.validServ.validateCRFIdentitydetails(dummydata1, "Correspondence/Foreign address")
                if (dummydata2[0] && dummydata2[0].Code && dummydata2[0].Code == '10') {
                  if (dummydata2[0].proof0.length != 12) {
                    this.notif.error('Invalid Aadhaar details', '');
                    return
                  }
                }
              } else {
                isProofAddress2Valid = true
              }
              if (isProofAddress2Valid) {
                let ipvValid = true;
                if (action == 'savefinalise') {
                  ipvValid = this.cmServ.validateForm(this.ipv.form.controls.crfIPV, this.FormControlNames, this.Label)
                  if (ipvValid) {
                    let ipvdata: any = []
                    let ipvtotalData = { ...this.ipv.form.controls.crfIPV.value }
                    ipvdata.push(ipvtotalData)
                    this.ipvXmlData = jsonxml(ipvdata);
                  }
                }
                if (ipvValid) {
                  var validproof
                  if (action == 'savefinalise') {
                    validproof = this.ValidateProof();
                  }
                  else {
                    validproof = true
                  }
                  var nriValidate
                  if (this.NRI == 'true' && this.add1.controls.country.value.toUpperCase() == 'INDIA' &&
                    this.add2.controls.country.value.toUpperCase() == 'INDIA') {
                    nriValidate = false;
                    this.notif.error('Foreign address is mandatory for NRI Clients', '');
                  }
                  else {
                    nriValidate = true
                  }
                  if (nriValidate) {
                    if (validproof) {
                      var parser = new DOMParser();

                      // this.ChangeAccounts=this.ChangeAccounts.getElementsByTagName("Account")[0];
                      let add2pf = this.cmServ.generateJSONfromArray(dummydata2)
                      let data: any = []
                      let totalData = { ...this.form.controls.address2.value, ...add2pf, ...{ "sameAsPermanentAddress": this.form.controls.sameAsPermant.value } }
                      data.push(totalData)
                      this.corresLocalAddressXmlData = jsonxml(data);
                      var proof = []
                      proof = this.img.setDataForxml();
                      this.verificationstatus.CommunicationAddressFlag = this.setCommunicationAddress;

                      var fullData = [];
                      fullData.push({ "SelectedAddress": this.form.controls.selectedAddress.value })
                      fullData.push({ "PermanentAddress": this.currentPermantAddressXmlData });
                      fullData.push({ "CurrespondaceAddress": this.corresLocalAddressXmlData });
                      fullData.push({ "ProofUpload": proof })
                      fullData.push({ "ApplicableAccounts": this.ChangeAccounts });
                      fullData.push({ "VerificationStatus": this.verificationstatus });
                      fullData.push({ "ipvData": this.ipvXmlData });
                      var fulladdressjson = this.utilServ.setJSONMultipleArray(fullData);
                      this.fullAddressxml = jsonxml(fulladdressjson);

                      if (action == 'savefinalise') {
                        var documents = [];
                        documents = this.img.reternImagefinalArray()
                        let appFormReceived: boolean = false
                        if (documents && documents.length > 0) {
                          documents.forEach(item => {
                            if (item["ProofDoc"]["DocName"].substring(0, 16) == 'Application Form') {
                              appFormReceived = true
                            }
                          })
                          if (!appFormReceived) {
                            this.notif.error('Application form not uploaded', '')
                            return
                          }
                          else {
                            var imageFulldata: any = []
                            imageFulldata.push(documents)
                            imageFulldata.push({ "ipvData": this.ipvXmlData ? this.ipvXmlData : '' });
                            var documentJson = this.utilServ.setJSONMultipleArray(imageFulldata)
                            var documentxmldata = jsonxml(documentJson)
                            var documentxml = documentxmldata.replace(/&/gi, '&amp;')
                          }
                        }
                        else {
                          this.notif.error('No documents uploaded', '')
                          return
                        }
                      }

                      var save = {
                        "batchStatus": "false",
                        "detailArray":
                          [{
                            Pan: this.PANNO,
                            EntryType: this.tab,
                            ActionType: 'P',
                            FileData: this.fullAddressxml.replace(/&/gi, '&amp;'),
                            ActionUser: this.currentUser.userCode,
                            Rejection: '',
                            IDNO: this.IDNO ? this.IDNO : '',
                            RiskCountry: '',
                            CommunicationAddress: '',
                            SMSFlag: '',
                            RequestFrom: '',
                            RejectReason: ''
                          }],
                        "requestId": "6010",
                        "outTblCount": "0"
                      }

                      var savefinalysed = {
                        "batchStatus": "false",
                        "detailArray":
                          [{
                            Pan: this.PANNO,
                            EntryType: this.tab,
                            ActionType: 'I',
                            FileData: documentxml,
                            ActionUser: this.currentUser.userCode,
                            IDNO: this.IDNO,
                            Rejection: '',
                            RiskCountry: '',
                            CommunicationAddress: '',
                            SMSFlag: '',
                            RequestFrom: '',
                            RejectReason: ''
                          }],
                        "requestId": "6010",
                        "outTblCount": "0"
                      }
                      this.isSpining = true;
                      this.dataServ.getResultArray(action == 'save' ? save : savefinalysed).then((response) => {
                        this.isSpining = false
                        if (response.errorCode == 0) {
                          if (response.results && response.results[0][0]) {
                            if (response.results[0][0].errorCode == 0) {

                              this.notif.success(response.results[0][0].errorMessage, '');
                              // this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;

                              if (action == 'savefinalise') {
                                this.BackButtonClick();
                                return
                              }
                              else {
                                this.applicationStatus = 'T';
                                this.cmServ.applicationStatus.next(this.applicationStatus);
                                this.disableFields();
                                this.IDNO = response.results[0][0].requestID;
                                this.modalService.info({
                                  nzTitle: '<i>Info</i>',
                                  nzContent: 'Please upload all CRF Documents and click <b>Save and Finalize</b> button to complete CRF Request.',

                                })
                              }
                              this.cmServ.requestID.next(Number(response.results[0][0].requestID))
                              this.printFlag = true
                              // this.Crf.onviewReset();
                              // this.img.ResetUploads();
                            }
                            else if (response.results[0][0].errorCode == 1) {
                              this.isSpining = false
                              this.notif.error(response.results[0][0].errorMessage, '');
                            }
                            else if (response.results[0][0].errorCode == -1) {
                              this.isSpining = false
                              this.notif.error(response.results[0][0].errorMessage, '');
                            }
                            else {
                              this.isSpining = false
                              this.notif.error('Error', '');
                            }
                          }
                          else {
                            this.isSpining = false
                            this.notif.error('Error', '');
                          }
                        }
                        else {
                          this.isSpining = false
                          this.notif.error(response.errorMsg, '');
                        }
                      })
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  }
  onBackClick() {
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Back button will clear the form. <br> Do you want to continue</b>',
      nzOnOk: () => {

        this.BackButtonClick();
      }
    })
  }
  ValidateProof() {
    var add: boolean = false;
    var crfFirstpage: boolean = false;
    var crfSecondpage: boolean = false;
    var PanCard: boolean = false;
    var doc1: boolean = false;
    var doc2: boolean = false;
    var samePermanentAddress = this.form.controls.sameAsPermant.value

    var proofarray = this.img.SupportFiles;
    // if (!proofarray.length) {
    //   this.notif.error("No proof Uploaded", '');
    //   return
    // }
    var notlisted: any = [];

    var mandatproofs = this.img.Mandatoryproofs;
    mandatproofs.forEach(element => {
      add = false
      proofarray.forEach(item => {

        if (element.Document == item.Docname || element.Document == item.DocName) {
          add = true;
          return

        }
      })
      if (!add) {
        if (samePermanentAddress) {
          if (element["slno"] != 15) {
            notlisted.push(Number(element["slno"]))
          }
        }
        else {
          notlisted.push(Number(element["slno"]))
        }
      }
    });
    var index: number
    if (this.form.controls.selectedAddress.value == 'Permanent') {
      index = notlisted.indexOf(15);
      notlisted.splice(index, 1);
    }
    if (this.form.controls.selectedAddress.value == 'Currespondance') {
      index = notlisted.indexOf(14);
      notlisted.splice(index, 1);
    }
    if (this.NRI == 'true') {
      if (this.add1.controls.proofOfAddress.value == '01' || this.add1.controls.proofOfAddress.value == '01') {
        index = notlisted.indexOf(99);
        notlisted.splice(index, 1);
      }
    }
    else {
      index = notlisted.indexOf(99);
      notlisted.splice(index, 1);
    }

    if (notlisted.length > 0) {
      this.notif.error('Please Upload ' + mandatproofs[mandatproofs.findIndex(o => o.slno == notlisted[0])].Document, '')
      return false
    }
    else {
      return true;
    }
  }

  FillApproveData() {
    debugger
    this.formdisable = true;
    var addressretrieve = this.dataforaprove[0];
    this.IDNO = addressretrieve.Request_IDNO;
    this.setCommunicationAddress = this.verificationstatus.CommunicationAddressFlag ? 'Y' : 'N'
    // this.samePermanentAddress = addressretrieve.sameasoffaddress == "true" ? true : false;
    this.add1.controls.houseName.setValue(addressretrieve.OffhouseName);
    this.add1.controls.houseNumber.setValue(addressretrieve.offhouseNumber);
    this.add1.controls.street.setValue(addressretrieve.Offstreet);
    this.add1.controls.pinCode.setValue(addressretrieve.offpinCode);
    this.add1.controls.city.setValue(addressretrieve.Offcity);
    this.add1.controls.district.setValue(addressretrieve.offdistrict);
    this.add1.controls.state.setValue(addressretrieve.offstate);
    this.add1.controls.country.setValue(addressretrieve.offcountry);
    this.add1.controls.proofOfAddress.setValue(addressretrieve.OffproofOfAddress);
    this.add1.controls.landmark.setValue(addressretrieve.Offlandmark);
    var add1proof = { "proof0": addressretrieve.offproof0, "proof1": addressretrieve.offproof1, "proof2": addressretrieve.offproof2, "proof3": addressretrieve.offproof3 }
    this.patchADDProof1Data(addressretrieve.OffproofOfAddress, add1proof);

    var sameaspermanent = addressretrieve.sameasoffaddress == 'true' ? true : false
    this.form.controls.sameAsPermant.patchValue(sameaspermanent);
    this.add2.controls.houseName.setValue(addressretrieve.ReshouseName);
    this.add2.controls.houseNumber.setValue(addressretrieve.ReshouseNumber);
    this.add2.controls.street.setValue(addressretrieve.Resstreet);
    this.add2.controls.pinCode.setValue(addressretrieve.RespinCode);
    this.add2.controls.city.setValue(addressretrieve.Rescity);
    this.add2.controls.district.setValue(addressretrieve.Resdistrict);
    this.add2.controls.state.setValue(addressretrieve.Resstate);
    this.add2.controls.country.setValue(addressretrieve.Rescountry);
    this.add2.controls.landmark.setValue(addressretrieve.Reslandmark);
    this.add2.controls.proofOfAddress.setValue(addressretrieve.ResproofOfAddress);
    var add2proof = { "proof0": addressretrieve.Resproof0, "proof1": addressretrieve.Resproof1, "proof2": addressretrieve.Resproof2, "proof3": addressretrieve.Resproof3 }
    this.patchADDProof2Data(addressretrieve.ResproofOfAddress, add2proof);
    this.form.controls.selectedAddress.patchValue(addressretrieve.SelectedAddress)
    let reject: any = this.form.controls.Rejection
    if (this.applicationStatus == 'A') {
      reject.controls.AppRemarks.setValue(addressretrieve.RejectedReason)
    }
    else {
      reject.controls.RejRemarks.setValue(addressretrieve.RejectedReason || '')
    }

    this.setrisccountry(this.RiskCountry)
    this.disableFields();

    this.ipv.setIPVDetails(addressretrieve.IPVDoneBy, addressretrieve.IPVDoneOn, this.applicationStatus)

  }

  disableFields() {
    if ((this.applicationStatus == 'P') || this.applicationStatus == 'T' || this.applicationStatus == 'F' || this.applicationStatus == 'A') {

      this.add1.controls.houseName.disable();
      this.add1.controls.houseNumber.disable();
      this.add1.controls.street.disable();
      this.add1.controls.pinCode.disable();
      this.add1.controls.city.disable();
      this.add1.controls.district.disable();
      this.add1.controls.state.disable();
      this.add1.controls.country.disable();
      this.add1.controls.landmark.disable();

      this.add2.controls.houseName.disable();
      this.add2.controls.houseNumber.disable();
      this.add2.controls.landmark.disable();
      this.add2.controls.pinCode.disable();
      this.add2.controls.city.disable();
      this.add2.controls.district.disable();
      this.add2.controls.state.disable();
      this.add2.controls.country.disable();
      this.form.controls.selectedAddress.disable();
      this.form.controls.sameAsPermant.disable();
    }
  }
  enableFields() {
    if (this.editFlag) {

      this.add1.controls.houseName.enable();
      this.add1.controls.houseNumber.enable();
      this.add1.controls.street.enable();
      this.add1.controls.pinCode.enable();
      this.add1.controls.city.enable();
      this.add1.controls.district.enable();
      this.add1.controls.state.enable();
      this.add1.controls.country.enable();
      this.add1.controls.landmark.enable();

      this.add2.controls.houseName.enable();
      this.add2.controls.houseNumber.enable();
      this.add2.controls.street.enable();
      this.add2.controls.pinCode.enable();
      this.add2.controls.city.enable();
      this.add2.controls.district.enable();
      this.add2.controls.state.enable();
      this.add2.controls.country.enable();
      this.add2.controls.landmark.enable();
      this.form.controls.selectedAddress.enable();
      this.form.controls.sameAsPermant.enable();
    }
    else {
      this.disableFields();
    }
  }
  Approve() {
    debugger
    console.log("apprve", this.RiskCountry);

    if (this.HO && (this.form.controls.selectedAddress.value != 'Permanent')) {
      debugger
      // if (this.RiskCountry != this.add2.controls.country.value && this.RiskCountry != this.add1.controls.country.value) {
      //   this.notif.error('Risk country should match with correspondance/local country', '')
      //   return
      // }
      if (this.RiskCountry != this.add2.controls.country.value || this.RiskCountry != this.add1.controls.country.value) {
        debugger
        console.log("apprve1", this.RiskCountry);
        this.notif.warning('Risk country selected is ' + this.RiskCountry, '', { nzDuration: 3000 })

      }
    }
    let Remarks = this.form.controls.Rejection.value.AppRemarks ? true : false
    if (Remarks) {
      let reason: any = this.form.controls.Rejection.value.AppRemarks;
      this.modalService.confirm({
        nzTitle: '<i>Confirmation</i>',
        nzContent: 'Are you sure you want to approve with Remark <br>"<b><i>' + reason + '"</i>?</b>',
        nzOnOk: () => {
          this.isSpining = true
          this.dataServ.getResultArray({
            "batchStatus": "false",
            "detailArray":
              [{
                pan: this.PANNO,
                EntryType: this.tab,
                ActionType: 'A',
                FileData: '',
                IDNO: this.requestID,
                ActionUser: this.currentUser.userCode,
                Rejection: reason ? reason : '',
                RiskCountry: this.RiskCountry ? this.RiskCountry : '',
                CommunicationAddress: this.setCommunicationAddress,
                SMSFlag: '',
                RequestFrom: '',
                RejectReason: ''
              }],
            "requestId": "6010",
            "outTblCount": "0"

          }).then((response) => {
            if (response.errorCode == 0) {
              if (response.results && response.results[0][0]) {
                if (response.results[0][0].errorCode == 0) {
                  this.isSpining = false
                  this.notif.success(response.results[0][0].errorMessage, '');
                  this.Crf.edittabtitle = "";
                  this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                  this.Crf.onviewReset();
                  this.img.ResetUploads();
                }
                else if (response.results[0][0].errorCode == 1) {
                  this.isSpining = false
                  this.notif.error(response.results[0][0].errorMessage, '');
                }
                else if (response.results[0][0].errorCode == -1) {
                  this.isSpining = false
                  this.notif.error(response.results[0][0].errorMessage, '');
                }
                else {
                  this.isSpining = false
                  this.notif.error('Error', '');
                }
              }
              else {
                this.isSpining = false
                this.notif.error('Error', '');
              }
            }
            else {
              this.isSpining = false;
              this.notif.error(response.errorMsg, '');
            }
          })
        }
      });
    }
    else {
      this.notif.error('Approval remark is required', '')
      return
    }
  }
  Reject() {
    let Rejection = this.form.controls.Rejection.value.RejRemarks ? true : false
    // if (Rejection) {
    // if (this.checkedArray.length != 0 || this.convertedData.length !== 0) {
    let reason: any = this.form.controls.Rejection.value.RejRemarks
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: 'Are you sure you want to reject ?',
      nzOnOk: () => {
        this.isSpining = true;
        this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              pan: this.PANNO,
              EntryType: this.tab,
              ActionType: 'R',
              FileData: '',
              IDNO: this.requestID,
              ActionUser: this.currentUser.userCode,
              Rejection: reason,
              RiskCountry: '',
              CommunicationAddress: '',
              SMSFlag: '',
              RequestFrom: '',
              RejectReason: this.nomineeDetailsxml
            }],
          "requestId": "6010",
          "outTblCount": "0"
        }).then((response) => {
          if (response.errorCode == 0) {
            if (response.results && response.results[0][0]) {
              if (response.results[0][0].errorCode == 0) {
                this.isSpining = false
                this.notif.success(response.results[0][0].errorMessage, '');
                this.Crf.edittabtitle = "";
                this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                this.Crf.onviewReset();
                this.img.ResetUploads();
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == 1) {
                this.isSpining = false
                this.notif.error(response.results[0][0].errorMessage, '');
                this.BackButtonClick();
              }
              else if (response.results[0][0].errorCode == -1) {
                this.isSpining = false
                this.notif.success(response.results[0][0].errorMessage, '');
                this.BackButtonClick();
              }
              else {
                this.isSpining = false
                this.notif.error('Error', '');
              }
            }
            else {
              this.isSpining = false
              this.notif.error('Error', '');
            }
          }
          else {
            this.isSpining = false;
            this.notif.error(response.errorMsg, '');
          }
        })
      }
    });
    // }
    // else {
    //   this.notif.error('Rejection reason is required, Please select any', '')
    //   return
    // }
    // }
    // else {
    //   this.notif.error('Rejection remarks is required', '')
    // }
  }
  CreateRejectionForm() {
    return this.fb.group({
      AppRemarks: [null],
      RejRemarks: [null]
    })
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
  SetPanValid(add, index) {

    this.Address1formFeilds[index].proof0
    var charindex = this.Address1formFeilds[index].proof0.length - 1
    var CharOnly = /^[a-zA-Z0-9]+$/;
    var NumberOnly = /^[0-9]+$/;
    if (charindex <= 4 && charindex >= 0) {
      if (!this.Address1formFeilds[index].proof0[charindex].match(CharOnly)) {

        var string = this.Address1formFeilds[index].proof0
        var test1 = string.slice(0, -1);
        this.Address1formFeilds[index].proof0 = test1;
      }
    }
    if (charindex > 4 && charindex < 8) {
      if (!this.Address1formFeilds[index].proof0[charindex].match(NumberOnly)) {
        var string = this.Address1formFeilds[index].proof0
        var test1 = string.slice(0, -1);
        this.Address1formFeilds[index].proof0 = test1;
      }
    }
    if (charindex == 9) {
      if (!this.Address1formFeilds[index].proof0[charindex].match(CharOnly)) {

        var string = this.Address1formFeilds[index].proof0
        var test1 = string.slice(0, -1);
        this.Address1formFeilds[index].proof0 = test1;

      }
    }

  }
  validatepAdhar(val) {
    return 1
  }
  charrestrict(val) {
    var key = val.key
    var CharOnly = /^[a-zA-Z0-9 .,/()]+$/;
    if (!key.match(CharOnly)) {
      return false
    }
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
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };
  disabledPastDate = (current: Date): boolean => {
    // Can not select days after today and today

    return differenceInCalendarDays(current, this.today) < 0;
  };
  // getcountry() {
  //   this.dataServ.getResultArray({
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{
  //         Loc: ''
  //       }],
  //     "requestId": "5052",
  //     "outTblCount": "0"
  //   }).then((response) => {
  //     if (response.results) {
  //       this.countryArray = response.results[6];
  //     }
  //   })
  // }
  SeCountryfield(a, val) {


    var value = val.toUpperCase();
    if (this.countryArray) {
      if (a == 'A1') {
        this.countryArray1 = this.countryArray.filter(item => {
          return item["Country"].includes(value)
        })
      }
      if (a == 'A2') {
        this.countryArray2 = this.countryArray.filter(item => {
          return item["Country"].includes(value)
        })
      }
    } else {
      return
    }
  }
  setrisccountry(val) {
    if (val == null) {
      return
    }
    var items = val.toUpperCase();

    this.countryArray3 = this.countryArray.filter(item => {
      return item.Country.includes(items)
    })
  }
  // maskAdharNum1(label, str) {
  //   if (label == '10') {     
  //     if (str.startsWith('********') ) {
  //       str == str
  //     }
  //     else{
  //       str = '********'
  //     }  
  //      this.Address1formFeilds[0].proof0 = str
  //   }
  // }
  // maskAdharNum2(label, str) {
  //   if (label == 'Aadhar No') {
  //     if (str.length > 4) {
  //       str = str.replace(/\d(?=\d{4})/g, '*');
  //       this.Address2formFeilds[0].proof0 = str
  //     }
  //   }
  // }
  setlength1(val) {
    var numonly = /^[0-9]+$/
    if (val.currentTarget.value.length <= 7) {
      if (numonly.test(val.key)) {
        this.Address1formFeilds[0].proof0 = '********' + val.key
        return false
      }
      else {
        return false
      }
    }
    else if (val.currentTarget.value.length > 11) {
      return false
    }
    else {
      return numonly.test(val.key)
    }
  }
  setlength2(val) {
    var numonly = /^[0-9]+$/
    if (val.currentTarget.value.length <= 7) {
      if (numonly.test(val.key)) {
        this.Address2formFeilds[0].proof0 = '********' + val.key
        return false
      }
      else {
        return false
      }
    }
    else if (val.currentTarget.value.length > 11) {
      return false
    }
    else {
      return numonly.test(val.key)
    }
  }
  SetAddressFiels(val) {

    if (val == 'Permanent') {
      this.form.controls.sameAsPermant.patchValue(false)
      this.add1.controls["houseName"].setValidators(Validators.required)
      this.add1.controls["street"].setValidators(Validators.required)
      this.add1.controls["pinCode"].setValidators(Validators.required)
      this.add1.controls["country"].setValidators(Validators.required)
      this.add1.controls["state"].setValidators(Validators.required)
      this.add1.controls["proofOfAddress"].setValidators(Validators.required)
      this.add1.controls["city"].setValidators(Validators.required)
      this.add1.controls["city"].setValidators(Validators.required)
      this.add1.controls["landmark"].setValidators(null)

      this.add2.controls["houseName"].setValidators(null)
      this.add2.controls["street"].setValidators(null)
      this.add2.controls["pinCode"].setValidators(null)
      this.add2.controls["country"].setValidators(null)
      this.add2.controls["state"].setValidators(null)
      this.add2.controls["proofOfAddress"].setValidators(null)
      this.add2.controls["city"].setValidators(null)
      this.add2.controls["city"].setValidators(null)
      this.add2.controls["landmark"].setValidators(null)

      this.add1.controls.houseName.enable();
      this.add1.controls.houseNumber.enable();
      this.add1.controls.street.enable();
      this.add1.controls.pinCode.enable();
      this.add1.controls.city.enable();
      this.add1.controls.district.enable();
      this.add1.controls.state.enable();
      this.add1.controls.country.enable();
      this.add1.controls.landmark.enable();
      this.Disablead1 = false;

      this.add2.controls.houseName.disable();
      this.add2.controls.houseNumber.disable();
      this.add2.controls.street.disable();
      this.add2.controls.pinCode.disable();
      this.add2.controls.city.disable();
      this.add2.controls.district.disable();
      this.add2.controls.state.disable();
      this.add2.controls.country.disable();
      this.add2.controls.landmark.disable();
      this.Disablead2 = true


      this.add2.controls.houseName.setValue('');
      this.add2.controls.houseNumber.setValue('');
      this.add2.controls.street.setValue('');
      this.add2.controls.pinCode.setValue('');
      this.add2.controls.city.setValue('');
      this.add2.controls.district.setValue('');
      this.add2.controls.state.setValue('');
      this.add2.controls.country.setValue('');
      this.add2.controls.proofOfAddress.setValue('');
      this.add1.controls.proofOfAddress.setValue('04');
      this.add2.controls.landmark.setValue('');
      // var add2proof = { "proof0": '', "proof1": '', "proof2": '', "proof3": '' }
      // this.patchADDProof1Data('04', add2proof)
      // this.form.controls.sameAsPermant.patchValue(false);
      this.disableCurrespondance = true
      this.disablePermanent = false
    }
    else if (val == 'Currespondance') {
      this.form.controls.sameAsPermant.patchValue(false)
      this.add2.controls["houseName"].setValidators(Validators.required)
      this.add2.controls["street"].setValidators(Validators.required)
      this.add2.controls["pinCode"].setValidators(Validators.required)
      this.add2.controls["country"].setValidators(Validators.required)
      this.add2.controls["state"].setValidators(Validators.required)
      this.add2.controls["proofOfAddress"].setValidators(Validators.required)
      this.add2.controls["city"].setValidators(Validators.required)
      this.add2.controls["city"].setValidators(Validators.required)
      this.add2.controls["landmark"].setValidators(null)

      this.add1.controls["houseName"].setValidators(null)
      this.add1.controls["street"].setValidators(null)
      this.add1.controls["pinCode"].setValidators(null)
      this.add1.controls["country"].setValidators(null)
      this.add1.controls["state"].setValidators(null)
      this.add1.controls["proofOfAddress"].setValidators(null)
      this.add1.controls["city"].setValidators(null)
      this.add1.controls["city"].setValidators(null)
      this.add1.controls["landmark"].setValidators(null)

      this.add1.controls.houseName.disable();
      this.add1.controls.houseNumber.disable();
      this.add1.controls.street.disable();
      this.add1.controls.pinCode.disable();
      this.add1.controls.city.disable();
      this.add1.controls.district.disable();
      this.add1.controls.state.disable();
      this.add1.controls.country.disable();
      this.add1.controls.landmark.disable();
      this.Disablead1 = true;

      this.add2.controls.houseName.enable();
      this.add2.controls.houseNumber.enable();
      this.add2.controls.street.enable();
      this.add2.controls.pinCode.enable();
      this.add2.controls.city.enable();
      this.add2.controls.district.enable();
      this.add2.controls.state.enable();
      this.add2.controls.country.enable();
      this.add2.controls.landmark.enable();
      this.Disablead2 = false

      this.add1.controls.houseName.setValue('');
      this.add1.controls.houseNumber.setValue('');
      this.add1.controls.street.setValue('');
      this.add1.controls.pinCode.setValue('');
      this.add1.controls.city.setValue('');
      this.add1.controls.district.setValue('');
      this.add1.controls.state.setValue('');
      this.add1.controls.country.setValue('');
      this.add1.controls.proofOfAddress.setValue('');
      this.add2.controls.proofOfAddress.setValue('04');
      this.add1.controls.landmark.setValue('');
      // var add1proof = { "proof0": '', "proof1": '', "proof2": '', "proof3": '' }
      // this.patchADDProof1Data('04', add1proof);

      this.disableCurrespondance = false
      this.disablePermanent = true
    }
    else {
      this.add1.controls["houseName"].setValidators(Validators.required)
      this.add1.controls["street"].setValidators(Validators.required)
      this.add1.controls["pinCode"].setValidators(Validators.required)
      this.add1.controls["country"].setValidators(Validators.required)
      this.add1.controls["state"].setValidators(Validators.required)
      this.add1.controls["proofOfAddress"].setValidators(Validators.required)
      this.add1.controls["city"].setValidators(Validators.required)
      this.add1.controls["city"].setValidators(Validators.required)
      this.add1.controls["landmark"].setValidators(null)

      this.add2.controls["houseName"].setValidators(Validators.required)
      this.add2.controls["street"].setValidators(Validators.required)
      this.add2.controls["pinCode"].setValidators(Validators.required)
      this.add2.controls["country"].setValidators(Validators.required)
      this.add2.controls["state"].setValidators(Validators.required)
      this.add2.controls["proofOfAddress"].setValidators(Validators.required)
      this.add2.controls["city"].setValidators(Validators.required)
      this.add2.controls["city"].setValidators(Validators.required)
      this.add2.controls["landmark"].setValidators(null)
      this.add1.controls.proofOfAddress.setValue('04');
      this.add2.controls.proofOfAddress.setValue('04');

      this.add1.controls.houseName.enable();
      this.add1.controls.houseNumber.enable();
      this.add1.controls.street.enable();
      this.add1.controls.pinCode.enable();
      this.add1.controls.city.enable();
      this.add1.controls.district.enable();
      this.add1.controls.state.enable();
      this.add1.controls.country.enable();
      this.add1.controls.landmark.enable();

      this.add2.controls.houseName.enable();
      this.add2.controls.houseNumber.enable();
      this.add2.controls.street.enable();
      this.add2.controls.pinCode.enable();
      this.add2.controls.city.enable();
      this.add2.controls.district.enable();
      this.add2.controls.state.enable();
      this.add2.controls.country.enable();
      this.add2.controls.landmark.enable();
      this.disableCurrespondance = false
      this.disablePermanent = false
    }

    this.add1.controls["houseName"].updateValueAndValidity()
    this.add1.controls["street"].updateValueAndValidity()
    this.add1.controls["pinCode"].updateValueAndValidity()
    this.add1.controls["country"].updateValueAndValidity()
    this.add1.controls["state"].updateValueAndValidity()
    this.add1.controls["proofOfAddress"].updateValueAndValidity()
    this.add1.controls["city"].updateValueAndValidity()
    this.add1.controls["city"].updateValueAndValidity()
    this.add1.controls["landmark"].updateValueAndValidity()

    this.add2.controls["houseName"].updateValueAndValidity()
    this.add2.controls["street"].updateValueAndValidity()
    this.add2.controls["pinCode"].updateValueAndValidity()
    this.add2.controls["country"].updateValueAndValidity()
    this.add2.controls["state"].updateValueAndValidity()
    this.add2.controls["proofOfAddress"].updateValueAndValidity()
    this.add2.controls["city"].updateValueAndValidity()
    this.add2.controls["city"].updateValueAndValidity()
    this.add2.controls["landmark"].updateValueAndValidity()

    this.add1.updateValueAndValidity();
    this.add2.updateValueAndValidity();
  }
  CheckCountryvalid(form, val) {
    var value = val.target.value
    if (form == 'A2') {
      var ind = this.countryArray2.findIndex(item => item.Country == value)
      if (ind == -1) {
        this.add2.controls["country"].setValue(null)
      }
    }
    if (form == 'A1') {
      var ind = this.countryArray1.findIndex(item => item.Country == value)
      if (ind == -1) {
        this.add1.controls["country"].setValue(null)
      }
    }

  }
  validateCRFIdentitydetails1(ArrayObj, Proofname: any) {
    var valid = true;
    for (var i = 0; i < ArrayObj.length; i++) {
      for (var property in ArrayObj[i]) {
        if (ArrayObj[i][property] == null || ArrayObj[i][property] == "") {
          this.notif.error("Please fill " + Proofname + " " + ArrayObj[i].label, '', {
            nzDuration: 60000
          })
          valid = false
        }
        else {
          valid = true
        }
      }
      if (!valid)
        break;
    }
    return valid
  }
  PrintForm() {
    this.isSpining = true;
    let requestParams = {
      "batchStatus": "false",
      "detailArray": [{
        "PanNo": this.PANNO,
        "SlNo": this.requestID,
        "EUser": "",
        "Type": this.tab,
        "BarcodeId": this.requestID,
        "Flag": 1,
      }],
      "requestId": "7050",
      "outTblCount": "0",
      "fileType": "2",
      "fileOptions": {
        "pageSize": "A3"
      }
    }
    let isPreview = false
    this.dataServ.generateReport(requestParams, false).then((response) => {
      this.isSpining = false;
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notif.error("No Data Found", '');
        return;
      }
      else {
        if (!isPreview) {
          this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.isSpining = false;
      this.notif.error("Server encountered an Error", '');
    });
  }

  BackButtonClick() {
    this.Crf.edittabtitle = "";
    this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
    this.img.retrieveData = [];
  }

  BranchReject() {
    let Rejection = this.form.controls.Rejection.value.RejRemarks ? true : false
    if (Rejection) {
      let reason: any = this.form.controls.Rejection.value.RejRemarks;
      this.modalService.confirm({
        nzTitle: '<i>Confirmation</i>',
        nzContent: '<b>Are you sure want to reject ?</b>',
        nzOnOk: () => {
          this.isSpining = true;
          this.dataServ.getResultArray({
            "batchStatus": "false",
            "detailArray":
              [{
                pan: this.PANNO,
                EntryType: this.tab,
                ActionType: 'R',
                FileData: '',
                IDNO: this.requestID,
                ActionUser: this.currentUser.userCode,
                Rejection: "Branch rejected-" + reason,
                RiskCountry: '',
                CommunicationAddress: '',
                SMSFlag: '',
                RequestFrom: '',
                RejectReason: ''
              }],
            "requestId": "6010",
            "outTblCount": "0"
          }).then((response) => {
            if (response.errorCode == 0) {
              if (response.results && response.results[0][0]) {
                if (response.results[0][0].errorCode == 0) {
                  this.isSpining = false
                  this.notif.success(response.results[0][0].errorMessage, '');
                  this.Crf.edittabtitle = "";
                  this.Crf.activeTabIndex = this.Crf.activeTabIndex - 1;
                  this.Crf.onviewReset();
                  this.img.ResetUploads();
                }
                else if (response.results[0][0].errorCode == 1) {
                  this.isSpining = false
                  this.notif.error(response.results[0][0].errorMessage, '');
                }
                else if (response.results[0][0].errorCode == -1) {
                  this.isSpining = false
                  this.notif.error(response.results[0][0].errorMessage, '');
                }
                else {
                  this.isSpining = false
                  this.notif.error('Error', '');
                }
              }
              else {
                this.isSpining = false
                this.notif.error('Error', '');
              }
            }
            else {
              this.isSpining = false;
              this.notif.error(response.errorMsg, '');
            }
          })
        }
      });
    }
    else {
      this.notif.error('Rejection remark is required', '')
      return
    }
  }
  changeCurDistrict(data) {
    //if (!this.enbleCDSL) {
    this.add2.controls.city.setValue(data)
    //}
  }
  changResDistrict(data) {
    //if (!this.enbleCDSL) {
    // this.add1.controls.city.setValue(data)
    //}
  }
  changResCity(data) {
    if (data != undefined) {
      if (this.add1.controls.city.value != data) {
        this.add1.controls.city.setValue(data)
      }
      this.add1.controls.district.setValue(data)
    }
  }
  changCurCity(data) {
    if (data != undefined) {
      if (this.add2.controls.city.value != data) {
        this.add2.controls.city.setValue(data)
      }
      this.add2.controls.district.setValue(data)
    }
  }

  isOrdinary(data) {
    if (data.NROClnt == 0) {
      this.NRI = 'false';
    }
    else {
      this.NRI = 'true';
    }
  }

  initialApprove() {
    let Remarks = this.form.controls.Rejection.value.AppRemarks ? true : false
    //if (Remarks) {
    let reason: any = this.form.controls.Rejection.value.AppRemarks;

    var addselected = this.form.controls.selectedAddress.value
    var Permanentaddressvalid
    var isProofAddress2Valid
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to to proceed First level approvel ?</b>',
      nzOnOk: () => {
        let isAddress1Valid = this.cmServ.validateForm(this.form.controls.address1, this.FormControlNames, this.Label);
        let dummydata1 = this.cmServ.getProofOfDetialsData(this.Address1formFeilds, "proof")
        if (isAddress1Valid) {
          if (addselected == 'Both' || addselected == 'Permanent') {
            Permanentaddressvalid = this.validServ.validateCRFIdentitydetails(dummydata1, "Local/Permanent address")
            if (dummydata1[0] && dummydata1[0].Code && dummydata1[0].Code == '10') {
              if (dummydata1[0].proof0.length != 12) {
                this.notif.error('Invalid Aadhaar details', '');
                return
              }
            }
          }
          else {
            Permanentaddressvalid = true
          }
          if (Permanentaddressvalid) {
            let add1pf = this.cmServ.generateJSONfromArray(dummydata1)
            let data: any = []
            let totalData = { ...this.form.controls.address1.value, ...add1pf }
            data.push(totalData)
            this.currentPermantAddressXmlData = jsonxml(data);
            let isAddress2Valid = this.cmServ.validateForm(this.form.controls.address2, this.FormControlNames, this.Label);
            let dummydata2 = this.cmServ.getProofOfDetialsData(this.Address2formFeilds, "proof")

            if (isAddress2Valid) {
              if (addselected == 'Both' || addselected == 'Currespondance') {
                // isProofAddress2Valid = this.validServ.validate(dummydata2, "Correspondence/Local Address Proof")
                isProofAddress2Valid = this.validServ.validateCRFIdentitydetails(dummydata1, "Correspondence/Foreign address")
                if (dummydata2[0] && dummydata2[0].Code && dummydata2[0].Code == '10') {
                  if (dummydata2[0].proof0.length != 12) {
                    this.notif.error('Invalid Aadhaar details', '');
                    return
                  }
                }
              } else {
                isProofAddress2Valid = true
              }
              if (isProofAddress2Valid) {

                var nriValidate
                if (this.NRI == 'true' && this.add1.controls.country.value.toUpperCase() == 'INDIA' &&
                  this.add2.controls.country.value.toUpperCase() == 'INDIA') {
                  nriValidate = false;
                  this.notif.error('Foreign address is mandatory for NRI Clients', '');
                }
                else {
                  nriValidate = true
                }
                if (nriValidate) {
                  var parser = new DOMParser();
                  let add2pf = this.cmServ.generateJSONfromArray(dummydata2)
                  let data: any = []
                  let totalData = { ...this.form.controls.address2.value, ...add2pf, ...{ "sameAsPermanentAddress": this.form.controls.sameAsPermant.value } }
                  data.push(totalData)
                  this.corresLocalAddressXmlData = jsonxml(data);
                  var proof = []
                  proof = this.img.setDataForxml();
                  this.verificationstatus.CommunicationAddressFlag = this.setCommunicationAddress;

                  var fullData = [];
                  fullData.push({ "SelectedAddress": this.form.controls.selectedAddress.value })
                  fullData.push({ "PermanentAddress": this.currentPermantAddressXmlData });
                  fullData.push({ "CurrespondaceAddress": this.corresLocalAddressXmlData });
                  var fulladdressjson = this.utilServ.setJSONMultipleArray(fullData);
                  this.fullAddressxml = jsonxml(fulladdressjson)

                  var approvel = {
                    "batchStatus": "false",
                    "detailArray":
                      [{
                        Pan: this.PANNO,
                        EntryType: this.tab,
                        ActionType: 'F',
                        FileData: this.fullAddressxml.replace(/&/gi, '&amp;'),
                        ActionUser: this.currentUser.userCode,
                        Rejection: reason ? reason : '',
                        IDNO: this.IDNO,
                        RiskCountry: '',
                        CommunicationAddress: '',
                        SMSFlag: '',
                        RequestFrom: '',
                        RejectReason: ''
                      }],
                    "requestId": "6010",
                    "outTblCount": "0"
                  }

                  this.isSpining = true;
                  this.dataServ.getResultArray(approvel).then((response) => {
                    this.isSpining = false
                    if (response.errorCode == 0) {
                      if (response.results && response.results[0][0]) {
                        if (response.results[0][0].errorCode == 0) {
                          this.notif.success(response.results[0][0].errorMessage, '');
                          this.BackButtonClick();
                          this.Crf.onviewReset();
                          return
                        }
                        else if (response.results[0][0].errorCode == 1) {
                          this.isSpining = false
                          this.notif.error(response.results[0][0].errorMessage, '');
                        }
                        else if (response.results[0][0].errorCode == -1) {
                          this.isSpining = false
                          this.notif.error(response.results[0][0].errorMessage, '');
                        }
                        else {
                          this.isSpining = false
                          this.notif.error('Error', '');
                        }
                      }
                      else {
                        this.isSpining = false
                        this.notif.error('Error', '');
                      }
                    }
                    else {
                      this.isSpining = false
                      this.notif.error(response.errorMsg, '');
                    }
                  })
                }
              }
            }
          }
        }
      }
    })
    //}
    // else {
    //   this.notif.error('Approval remark is required', '')
    //   return
    // }
  }
  editButton() {
    this.modalService.confirm({
      nzTitle: '<i>Confirmation</i>',
      nzContent: '<b>Are you sure want to edit this  file?</b>',
      nzOnOk: () => {
        this.editFlag = true;
        this.isReport = false;
        this.notif.success("Editing enabled..!", '');
        this.enableFields();
      }

    });
  }
}