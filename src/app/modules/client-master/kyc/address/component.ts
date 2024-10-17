import { Component, OnInit, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidationService, DataService } from 'shared';
import { ClientMasterService } from '../../client-master.service';
import { IdntityProofComponent } from '../identity-proof/component';
import * as  jsonxml from 'jsontoxml'
import { UtilService } from 'shared';
import { UploadFile, NzNotificationService } from 'ng-zorro-antd';
import { InputMasks, InputPatterns } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { KYCvalidataions} from '../kycValidationConfig'


@Component({
  selector: 'kyc-address',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class AddressComponent implements OnInit, AfterViewInit {
  @ViewChild(IdntityProofComponent) IdntityProof: IdntityProofComponent
  enableFacta: boolean = false;
  form: FormGroup;
  inputMasks = InputMasks;
  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  FormControlNames: any = {};
  currentPermantAddressXmlData: any;
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
  ProofDetials: any = [];
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


  citizenshipWithNoIndiaArray: any;
  entryAccess: boolean = true;
  disableKrarelatedFields: boolean;
  today = new Date()
  isJudisdictionSameAsAny: boolean=false;
  customValidationMsgObj=KYCvalidataions;
  addressTypeArray: any=[];
  timeout=null;
  isServiceCallsAllow: boolean=false;
  clientSerialNumber: number;
  kycProofDetailsFetchingDone: boolean=false;
  constructor(
    private ngZone: NgZone,
    private fb: FormBuilder,
    private dataServ: DataService,
    private cmServ: ClientMasterService,
    private validServ: ValidationService,
    private utilServ: UtilService,
    private notif: NzNotificationService
  ) {
    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val
    })
    
    this.form = fb.group({
      idProof: [null, [Validators.required]],
      taxOutsideIndia: [false],
      proofOfAddress: [1, [Validators.required]],
      address1: this.createAddressGroup(),
      address2: this.createAddressGroup1(),
      address3: this.createAddressGroup(),
      address4: this.createAddressGroup4(),
    });
    this.add1 = this.form.controls.address1
    this.add2 = this.form.controls.address2
    this.add3 = this.form.controls.address3
    this.add4 = this.form.controls.address4
    this.add4.get('fatca').valueChanges.subscribe(ele => {

      if (ele == 'USPerson')
        this.enableFacta = true;
      else
        this.enableFacta = false;
    })
    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       tab:'KYC',
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
if(this.kycProofDetailsFetchingDone==false){
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientSerialNo:this.clientSerialNumber
        }],
      "requestId": "5052",
      "outTblCount": "0"
    }).then((response) => {
      if (response.results) {
        console.log("kyc initial dropdown fill data",response.results)
           this.cmServ.kycInitialFillingData.next(response.results)
        let citizenshiparray = JSON.stringify(response.results[6])
        this.citizenshipArray = JSON.parse(citizenshiparray)
        this.citizenshipWithNoIndiaArray = JSON.parse(citizenshiparray)
        this.addressTypeArray=response.results[11]
        this.citizenshipWithNoIndiaArray.forEach((element, index) => {
          if (element.Country == 'INDIA') {
            this.citizenshipWithNoIndiaArray.splice(index, 1)
          }
        });
        this.ProofDetials = response.results[1]
        this.ProofDetials.forEach(element => {
          if (element.PermanentAddressProof == true) {
            this.PermanentAddressProofDetails.push(element)
          }
          if (element.CorrespondanceAddressProof == true) {
            this.CorrespondanceAddressProofDetails.push(element)
          }
          if (element.JurisdictionAddressProof == true) {
            this.JurisdictionAddressProofDetails.push(element)
          }
          if (element.IdentityProof == true) {
            this.identityProofDetails.push(element)
          }
        });
        this.totalProofDetial = response.results[2]
        console.log(this.totalProofDetial)
        if (this.totalProofDetial.length > 0) {
          this.cmServ.isTotalProofDatafound.next(true)
        }

        this.code = this.ProofDetials[9].Code
        this.add1.controls.proofOfAddress.patchValue(this.code)
        this.add2.controls.proofOfAddress.patchValue(this.code)
        // this.add3.controls.proofOfAddress.patchValue(this.code)
        this.add4.controls.proofOfAddress.patchValue(this.code)
        this.form.controls.idProof.patchValue("34")
        this.Address1formFeilds = this.cmServ.getControls(this.totalProofDetial, this.code);
        this.Address2formFeilds = this.cmServ.getControls(this.totalProofDetial, this.code);
        this.Address1formFeilds.forEach(element => {
          if (element.label == "Issuing Authority") {
            element.proof1 = "UIDAI"
          }
          console.log(element)
        });
        this.Address2formFeilds.forEach(element => {
          if (element.label == "Issuing Authority") {
            element.proof1 = "UIDAI"
          }
        });
        ;
        let data = JSON.stringify(this.totalProofDetial)
        let data1 = JSON.parse(data)
        // this.Address3formFeilds = this.cmServ.getControls(data1, this.code)
                let valuesArray=JSON.stringify(this.cmServ.getControls(this.totalProofDetial, this.code))
        this.Address4formFeilds = JSON.parse(valuesArray)
        // this.Address4formFeilds = this.cmServ.getControls(this.totalProofDetial, this.code);
        this.identityProofformFeilds = this.cmServ.getControls(this.totalProofDetial,34);
        // this.form=this.cmServ.getControls(this.totalProofDetial,this.code);
      }
      this.kycProofDetailsFetchingDone=true;
    })
  }
    this.ngZone.run(() => {
      this.form.controls.taxOutsideIndia.valueChanges.subscribe(val => {
        if (val == true) {
          this.isJudisdiction = true
        }
        else {
          this.isJudisdiction = false
          this.clearJurisdictionForm()
        }
      })

      this.cmServ.isEntryAccess.subscribe(val => {
        this.entryAccess = val
      })
      this.add1.controls.proofOfAddress.valueChanges.subscribe(res => {
        //  let valuesArray=JSON.stringify(this.cmServ.getControls(this.totalProofDetial, res))
        // this.Address1formFeilds = JSON.parse(valuesArray)
        this.Address1formFeilds = this.cmServ.getControls(this.totalProofDetial, res);
      })
      this.add2.controls.proofOfAddress.valueChanges.subscribe(res => {
        // let valuesArray=JSON.stringify(this.cmServ.getControls(this.totalProofDetial, res))
        // this.Address2formFeilds = JSON.parse(valuesArray)
        this.Address2formFeilds = this.cmServ.getControls(this.totalProofDetial, res);
      })
      this.add3.controls.proofOfAddress.valueChanges.subscribe(res => {
        let data = JSON.stringify(this.totalProofDetial)
        let data1 = JSON.parse(data)
        this.Address3formFeilds = this.cmServ.getControls(data1, res)

        // this.Address3formFeilds = this.cmServ.getControls(this.totalProofDetial,res);
      })
      this.add4.controls.proofOfAddress.valueChanges.subscribe(res => {
        let valuesArray=JSON.stringify(this.cmServ.getControls(this.totalProofDetial, res))
        this.Address4formFeilds = JSON.parse(valuesArray)
        // this.Address4formFeilds = this.cmServ.getControls(this.totalProofDetial, res);
      })
      this.form.controls.idProof.valueChanges.subscribe(res => {
         
        if (res == 34) {
          this.cmServ.isPanSelected.next(true)
        }
        else {
          this.cmServ.isPanSelected.next(false)

        }
        this.identityProofformFeilds = this.cmServ.getControls(this.totalProofDetial, res);
      })
      this.add3.controls.pinCode.valueChanges.subscribe(val => {
        if (val.length == 6) {
          this.cmServ.isAdditionalAddressGiven.next(true)
        }
        else {
          this.cmServ.isAdditionalAddressGiven.next(false)
        }
      })
      this.cmServ.disableKraFields.subscribe(val => {
        // if(val!=null && val!=undefined)
        this.disableKrarelatedFields = val
        // if(val){
        //   this.add2.controls.sameAsPermant.patchValue(false)
        // }
      })
      this.add4.controls.taxCountry.valueChanges.subscribe(val => {
        if (this.form.value.taxOutsideIndia) {
          let data = val.toUpperCase();
          this.countryresultArray = this.citizenshipWithNoIndiaArray.filter(ele=>{
            return (ele["Country"].startsWith(data))
          })
        }
      })

  
      this.add4.controls.countryOfBirth.valueChanges.subscribe(val => {
        if (this.form.value.taxOutsideIndia) {
          let data = val.toUpperCase();
          this.resultArray1 = this.citizenshipArray.filter(ele=>{
            return (ele["Country"].startsWith(data))
          })
        }
      })
      this.cmServ.isServiceCallsAllow.subscribe(val => {
        this.isServiceCallsAllow = val
      })
    })
  }
  ngAfterViewInit() {
  }


  patchADDProof1Data(id, obj) {
    setTimeout(() => {
      if (id) {
        this.add1.controls.proofOfAddress.patchValue(id)
        this.Address1formFeilds = this.cmServ.getControls(this.totalProofDetial, id);
        let objKeys = Object.keys(obj);
        objKeys.forEach((o, i) => {
          if (obj[o] == null) {

          }
          else
            this.Address1formFeilds[i][o] = obj[o];
        })
      } else {
        this.add1.controls.proofOfAddress.patchValue(null)
      }

    }, 1500)

  }

  patchADDProof2Data(id, obj) {
    setTimeout(() => {
      if (id) {
        this.add2.controls.proofOfAddress.patchValue(id)
        this.Address2formFeilds = this.cmServ.getControls(this.totalProofDetial, id);
        console.log(this.totalProofDetial)
        let objKeys = Object.keys(obj);
        objKeys.forEach((o, i) => {
          if (obj[o] == null) {

          }
          else
            this.Address2formFeilds[i][o] = obj[o];
        })
      } else {
        this.add2.controls.proofOfAddress.patchValue(null)
      }
    }, 1500)

  }
  patchADDProof3Data(id, obj) {
    setTimeout(() => {
      if (id) {
        this.add3.controls.proofOfAddress.patchValue(id)
        let data = JSON.stringify(this.totalProofDetial)
        let data1 = JSON.parse(data)
        this.Address3formFeilds = this.cmServ.getControls(data1, id);
        let objKeys = Object.keys(obj);
        objKeys.forEach((o, i) => {
          if (obj[o] != null)
            this.Address3formFeilds[i][o] = obj[o];
        })

      } else {
        this.add3.controls.proofOfAddress.patchValue(null)
      }
    }, 1500)

  }
  patchADDProof4Data(id, obj) {
    setTimeout(() => {
      if (id) {
        this.add4.controls.proofOfAddress.patchValue(id)
        this.Address4formFeilds = this.cmServ.getControls(this.totalProofDetial, id);
        let objKeys = Object.keys(obj);
        objKeys.forEach((o, i) => {
          if (obj[o] == null) {
          }
          else
            this.Address4formFeilds[i][o] = obj[o];
        })
      } else {
        this.add4.controls.proofOfAddress.patchValue(null)
      }
    }, 1480)

  }
  patchIdentityProofData(id, obj) {
    let objKeys = Object.keys(obj);
     
    if (id) {
      // objKeys.pop()
      setTimeout(() => {
        this.form.controls.idProof.patchValue(id)
        this.identityProofformFeilds = this.cmServ.getControls(this.totalProofDetial, id);
        objKeys.forEach((o, i) => {
          if (obj[o] != null) {
            this.identityProofformFeilds[i][o] = obj[o];
          }
        })
      }, 1500)
    } else {
      this.form.controls.idProof.patchValue(null)
    }
  }

  private createAddressGroup() {
    return this.fb.group({
      houseName: [null,[Validators.required]],
      // houseNumber: [null],
      street: [null,[Validators.required]],
      pinCode: [null,[Validators.required]],
      country: [null,[Validators.required]],
      state: [null,[Validators.required]],
      addressType:[null,[Validators.required]],
      proofOfAddress: [null,[Validators.required]],
      city: [null,[Validators.required]],
      district: [null,[Validators.required]],
    });
  }
  private createAddressGroup1() {
    return this.fb.group({
      sameAsPermant: [false],
      houseName: [null, [Validators.required]],
      // houseNumber: [null, [Validators.required]],
      street: [null, [Validators.required]],
      pinCode: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      proofOfAddress: [null, [Validators.required]],
      city: [null, [Validators.required]],
      district: [null, [Validators.required]],
    });
  }

  private createAddressGroup4() {
    return this.fb.group({
      sameAddAs: [null],
      taxCountry: [null, [Validators.required]],
      taxIdentification: [null, [Validators.required]],
      placeOfBirth: [null, [Validators.required]],
      countryOfBirth: [null, [Validators.required]],
      fatca: ['NA', [Validators.required]],
      // document:[''],
      houseName: [null, [Validators.required]],
      // houseNumber: [null, [Validators.required]],
      street: [null, [Validators.required]],
      pinCode: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      proofOfAddress: [null, [Validators.required]],
      city: [null, [Validators.required]],
      district: [null, [Validators.required]],
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
      this.notif.error("Please uplaod jpeg/png/pdf", '', { nzDuration: 60000 })
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
  maskAdharNum(label, str) {
     
    if (label == 'Aadhar No') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.Address1formFeilds[0].proof0 = str
      }
    }
  }

  maskAdharNum2(label, str) {
    if (label == 'Aadhar No') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.Address2formFeilds[0].proof0 = str
      }
    }
  }

  maskAdharNum3(label, str) {
    if (label == 'Aadhar No') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.Address3formFeilds[0].proof0 = str
      }
    }
  }
  maskAdharNum4(label, str) {
    if (label == 'Aadhar No') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.Address4formFeilds[0].proof0 = str
      }
    }
  }

  maskAdharNum5(label, str) {
    if (label == 'Aadhar No') {
      if (str.length > 4) {
        str = str.replace(/\d(?=\d{4})/g, '*');
        this.identityProofformFeilds[0].proof0 = str
      }
    }
  }
  getCorrsAddCountryName(data){
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.cmServ.riskCountry.next(data)
    },500)
  }

  getPinData(pin, Address) {
     
    var data = pin.target.value
    // var data = pin
    if (data == null) {
      return
    }
    if (this.entryAccess == false) {
      return
    }
    if (data.length != 6) {
      if (Address == "address1") {
        this.add1.controls.country.setValue(null)
        this.add1.controls.district.setValue(null)
        this.add1.controls.state.setValue(null)
        // this.add1.controls.city.setValue(null)
      }
      if (Address == "address2") {
        this.add2.controls.country.setValue(null)
        this.add2.controls.district.setValue(null)
        this.add2.controls.state.setValue(null)
        // this.add2.controls.city.setValue(null)
      }
      if (Address == "address3") {
        this.add3.controls.country.setValue(null)
        this.add3.controls.district.setValue(null)
        this.add3.controls.state.setValue(null)
        // this.add3.controls.city.setValue(null)
      }
      if (Address == "address4") {
        this.add4.controls.country.setValue(null)
        this.add4.controls.district.setValue(null)
        this.add4.controls.state.setValue(null)
        // this.add4.controls.city.setValue(null)
      }
      return
    }

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
          if (response.results) {
            if (response.results[0].length > 0) {
              let productList = response.results[0][0];
              if (Address == "address1") {
                this.add1.controls.country.setValue(productList.Country)
                this.add1.controls.district.setValue(productList.District)
                // this.add1.controls.city.setValue(productList.District)
                this.add1.controls.state.setValue(productList.STATENAME)
              }
              if (Address == "address2") {
                this.add2.controls.country.setValue(productList.Country)
                this.add2.controls.district.setValue(productList.District)
                // this.add2.controls.city.setValue(productList.District)
                this.add2.controls.state.setValue(productList.STATENAME)
              }
              if (Address == "address3") {
                this.add3.controls.country.setValue(productList.Country)
                this.add3.controls.district.setValue(productList.District)
                // this.add3.controls.city.setValue(productList.District)
                this.add3.controls.state.setValue(productList.STATENAME)
              }
              if (Address == "address4") {
                this.add4.controls.country.setValue(productList.Country)
                this.add4.controls.district.setValue(productList.District)
                // this.add4.controls.city.setValue(productList.District)
                this.add4.controls.state.setValue(productList.STATENAME)
              }

            }
          }
        })

    }
  }

kraGetDistrictbyPincode(pin, Address){
  var data = pin
  if (data.length != 6) {
    if (Address == "Address1") {
      this.add1.controls.district.setValue(null)
    }
    if (Address == "Address2") {
      this.add2.controls.district.setValue(null)
    }
    return
  }

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
        if (response.results) {
          if (response.results[0].length > 0) {
            let productList = response.results[0][0];
            if (Address == "Address1") {
              this.add1.controls.district.setValue(productList.District)
            }
            if (Address == "Address2") {
              this.add2.controls.district.setValue(productList.District)
            }
          }
        }
      })

  }
}

  selectPermantADD(data) {
    if (data != null && data != undefined) {
      if (data == true) {
        this.cmServ.sameAsPermantAddress.next(true)
        this.isPemantSelected = true;
        let form: any = this.form.controls.address2
        let targetData: any = this.form.controls.address1
        // let pfAdd1: any = this.form.controls.address1Proof
        form.controls.houseName.setValue(targetData.controls.houseName.value)
        // form.controls.houseNumber.setValue(targetData.controls.houseNumber.value)
        form.controls.street.setValue(targetData.controls.street.value)
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
        this.cmServ.sameAsPermantAddress.next(false)

        let form: any = this.form.controls.address2
        form.controls.houseName.setValue(null)
        // form.controls.houseNumber.setValue(null)
        form.controls.street.setValue(null)
        form.controls.city.setValue(null)
        // form.controls.address.setValue(null)
        form.controls.country.setValue(null)
        form.controls.state.setValue(null)
        form.controls.district.setValue(null)
        form.controls.pinCode.setValue(null)
        if (this.ProofDetials.length)
          form.controls.proofOfAddress.setValue(this.ProofDetials[9].Code)
      }
    }
  }
  checkSameAddressAs(data) {
    if (data == null) {
      return
    }
    if (data == "Correspondence") {
    this.isJudisdictionSameAsAny=true;
      let form: any = this.form.controls.address4
      let targetData: any = this.form.controls.address2
      this.Address4formFeilds = this.Address2formFeilds
      form.controls.houseName.setValue(targetData.controls.houseName.value)
      // form.controls.houseNumber.setValue(targetData.controls.houseNumber.value)
      form.controls.street.setValue(targetData.controls.street.value)
      form.controls.city.setValue(targetData.controls.city.value)
      form.controls.country.setValue(targetData.controls.country.value)
      form.controls.district.setValue(targetData.controls.district.value)
      form.controls.pinCode.setValue(targetData.controls.pinCode.value)
      form.controls.state.setValue(targetData.controls.state.value)
      form.controls.proofOfAddress.setValue(targetData.controls.proofOfAddress.value)
      this.Address4formFeilds = this.Address2formFeilds
    }
    if (data == "Permanent") {
      this.isJudisdictionSameAsAny=true;

      let form: any = this.form.controls.address4
      let targetData: any = this.form.controls.address1
      form.controls.houseName.setValue(targetData.controls.houseName.value)
      // form.controls.houseNumber.setValue(targetData.controls.houseNumber.value)
      form.controls.street.setValue(targetData.controls.street.value)
      form.controls.city.setValue(targetData.controls.city.value)
      form.controls.country.setValue(targetData.controls.country.value)
      form.controls.district.setValue(targetData.controls.district.value)
      form.controls.pinCode.setValue(targetData.controls.pinCode.value)
      form.controls.state.setValue(targetData.controls.state.value)
      form.controls.proofOfAddress.setValue(targetData.controls.proofOfAddress.value)
      this.Address4formFeilds = this.Address1formFeilds
    }
    // if (data == 'none') {
    //   this.isJudisdictionSameAsAny=false;

    //   this.add4.controls.houseName.setValue(null)
    //   this.add4.controls.street.setValue(null)
    //   this.add4.controls.pinCode.setValue(null)
    //   this.add4.controls.country.setValue(null)
    //   this.add4.controls.state.setValue(null)
    //   this.add4.controls.proofOfAddress.patchValue(null)
    //   this.Address4formFeilds[0].proof0=null
    //   this.Address4formFeilds[1].proof1=null
    //   this.Address4formFeilds[2].proof2=null
    //   this.add4.controls.city.setValue(null)
    //   this.add4.controls.district.setValue(null)
    // }
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
          this.notif.error("Expiry date should be greater than Date of Issue", '', { nzDuration: 60000 });
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
          this.notif.error("Expiry date should be greater than Date of Issue", '', { nzDuration: 60000 });
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
          this.notif.error("Expiry date should be greater than Date of Issue", '', { nzDuration: 60000 });
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
          this.notif.error("Expiry date should be greater than Date of Issue", '', { nzDuration: 60000 });
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
          this.notif.error("Expiry date should be greater than Date of Issue", '', { nzDuration: 60000 });
          this.identityProofformFeilds[3].proof3 = null
        }
      }
    }, 100);

  }

  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  disabledPastDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) < 0;
  };


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

  identityTempsave() {
    let dummydata = this.cmServ.getProofOfDetialsData(this.identityProofformFeilds, "proof")
    let pfdata = this.cmServ.generateJSONfromArray(dummydata)
    let data: any = []
    let pf =
    {
      'proofOfAddress': this.form.controls.idProof.value
    }
    let totalData = { ...pf, ...pfdata }
    data.push(totalData)
    var JSONData = this.utilServ.setJSONArray(data);
    this.identyProofXmlData = jsonxml(JSONData);
  }

  isAddressValid() {
    let isAddress1Valid = this.validServ.validateForm(this.form.controls.address1, this.FormControlNames,this.customValidationMsgObj.CurrentAddress);
     if (isAddress1Valid ) {
      let dummydata1 = this.cmServ.getProofOfDetialsData(this.Address1formFeilds, "proof")
      let isProofAddress1Valid = this.validServ.validate(dummydata1, "Current/Permanant/Overseas  Proof of Address")
       if(!isProofAddress1Valid){
         return false
      }
      let add1pf = this.cmServ.generateJSONfromArray(dummydata1)
      let data: any = []
      let totalData = { ...this.form.controls.address1.value, ...add1pf }
      data.push(totalData)
      var JSONData = this.utilServ.setJSONArray(data);
      this.currentPermantAddressXmlData = jsonxml(JSONData);
      console.log(this.currentPermantAddressXmlData)
       
      let isAddress2Valid = this.validServ.validateForm(this.form.controls.address2, this.FormControlNames,this.customValidationMsgObj.LocalAddress);
      if (isAddress2Valid ) {
        let dummydata2 = this.cmServ.getProofOfDetialsData(this.Address2formFeilds, "proof")
        let isProofAddress2Valid = this.validServ.validate(dummydata2, "Correspondence/Local  Proof of Address")
        if(!isProofAddress2Valid){
          return false
       }
        let add2pf = this.cmServ.generateJSONfromArray(dummydata2)
        let data: any = []
        let totalData = { ...this.form.controls.address2.value, ...add2pf }
        data.push(totalData)
        var JSONData = this.utilServ.setJSONArray(data);
        this.corresLocalAddressXmlData = jsonxml(JSONData);
        console.log(this.corresLocalAddressXmlData)
    
        // let isAddress3Valid = this.validServ.validateForm(this.form.controls.address3, this.FormControlNames);
        let dummydata3 = this.cmServ.getProofOfDetialsData(this.Address3formFeilds, "proof")
        // let isProofAddress3Valid=this.validServ.validate(dummydata3,"Current/Permanant/Overseas  Proof of Address")

        //  if (isAddress3Valid && isProofAddress3Valid) {
        let add3pf = this.cmServ.generateJSONfromArray(dummydata3)
        let Addata: any = []
        let AddtotalData = { ...this.form.controls.address3.value, ...add3pf }
        Addata.push(AddtotalData)
        var JSONData = this.utilServ.setJSONArray(Addata);
        this.AdditionalcorresLocalAddressXmlData = jsonxml(JSONData);
        console.log(this.AdditionalcorresLocalAddressXmlData)

        if (this.isJudisdiction == true) {
          let isAddress4Valid = this.validServ.validateForm(this.form.controls.address4, this.FormControlNames,this.customValidationMsgObj.JurisAddress);
          if(this.form.value.address4.taxCountry.toLowerCase() =='india'){
            this.notif.error("Country of residence as per tax cannot be India", '', { nzDuration: 60000 })
            return false;
          }
          if (isAddress4Valid) {
            let dummydata4 = this.cmServ.getProofOfDetialsData(this.Address4formFeilds, "proof")
            let isProofAddress4Valid = this.validServ.validate(dummydata4, "Current/Permanant/Overseas  Proof of Address")

            if(!isProofAddress4Valid){
              return false
           }
            let add4pf = this.cmServ.generateJSONfromArray(dummydata4)
            if (this.enableFacta == true) {
              if (this.fileList.length == 0) {
                this.notif.error("Upload US declaration Form", '', { nzDuration: 60000 })
                return 
              }
            }
            let data: any = []
            let obj = {
              isJudisdiction: true
            }
            let totalData = { ...this.form.controls.address4.value, ...add4pf, ...this.financialDocument, ...obj }
            data.push(totalData)
            var JSONData = this.utilServ.setJSONArray(data);
            this.jurisdictionsAddressXmlData = jsonxml(JSONData);
            console.log(this.jurisdictionsAddressXmlData)

            return true
         
        }
          return false
        }
        return true
        // }
        // return false
      }
      return false
    }
    return false
  }

  addressTempSave() {

    let dummydata1 = this.cmServ.getProofOfDetialsData(this.Address1formFeilds, "proof")
    let add1pf = this.cmServ.generateJSONfromArray(dummydata1)
    let data: any = []
    let totalData = { ...this.form.controls.address1.value, ...add1pf }
    data.push(totalData)
    var JSONData = this.utilServ.setJSONArray(data);
    this.currentPermantAddressXmlData = jsonxml(JSONData);

    let dummydata2 = this.cmServ.getProofOfDetialsData(this.Address2formFeilds, "proof")
    let add2pf = this.cmServ.generateJSONfromArray(dummydata2)
    let data1: any = []
    let totalData1 = { ...this.form.controls.address2.value, ...add2pf }
    data1.push(totalData1)
    let jd = this.utilServ.setJSONArray(data1);
    this.corresLocalAddressXmlData = jsonxml(jd);
    console.log(this.corresLocalAddressXmlData)

    let dummydata3 = this.cmServ.getProofOfDetialsData(this.Address3formFeilds, "proof")
    let add3pf = this.cmServ.generateJSONfromArray(dummydata3)
    let data2: any = []
    let totalData2 = { ...this.form.controls.address3.value, ...add3pf }
    data2.push(totalData2)
    let JSONData2 = this.utilServ.setJSONArray(data2);
    this.AdditionalcorresLocalAddressXmlData = jsonxml(JSONData2);

    if (this.isJudisdiction == true) {
      let dummydata4 = this.cmServ.getProofOfDetialsData(this.Address4formFeilds, "proof")
      let add4pf = this.cmServ.generateJSONfromArray(dummydata4)
      let data: any = []
      let obj = {
        isJudisdiction: true
      }
      let totalData = { ...this.form.controls.address4.value, ...add4pf, ...this.financialDocument, ...obj }
      data.push(totalData)
      var JSONData = this.utilServ.setJSONArray(data);
      this.jurisdictionsAddressXmlData = jsonxml(JSONData);
      console.log(this.jurisdictionsAddressXmlData)

    }


  }
  charrestrict(val) {
    var key = val.key
    var pattern = /[a-zA-Z0-9\s]+$/;
    var pattern1 = /[-/_]+$/;
    if (key.match(pattern) || key.match(pattern1)) {
      return true
    }
    else {
      return false
    }
  }

  charrestrict1(val) {
    var key = val.key
    var pattern = /[a-zA-Z\s]+$/;
    var pattern1 = /[-/_]+$/;
    if (key.match(pattern) || key.match(pattern1)) {
      return true
    }
    else {
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
  numberOnly(val) {
    var paterns = /^[0-9]/
    return paterns.test(val.key);
  }
  clearJurisdictionForm() {
    this.add4.controls.sameAddAs.setValue('none')
    this.add4.controls.taxCountry.setValue(null)
    this.add4.controls.taxIdentification.setValue(null)
    this.add4.controls.placeOfBirth.setValue(null)
    this.add4.controls.countryOfBirth.setValue(null)
    this.add4.controls.fatca.setValue('NA')
    this.add4.controls.houseName.setValue(null)
    this.add4.controls.street.setValue(null)
    this.add4.controls.pinCode.setValue(null)
    this.add4.controls.country.setValue(null)
    this.add4.controls.state.setValue(null)
    this.add4.controls.proofOfAddress.setValue(null)
    this.add4.controls.city.setValue(null)
    this.add4.controls.district.setValue(null)
  }
}

