import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ClientMasterService } from '../../client-master.service';
import { ValidationService, DataService } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { InputMasks, InputPatterns } from 'shared';
import { UploadFile } from 'ng-zorro-antd/upload';
import { FindOptions } from 'shared';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { financialValidations } from '../financialValidationConfig'
@Component({
  selector: 'financials-bank-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class BankDetailsComponent implements OnInit {

  inputMasks = InputMasks;
  Bankname: any;
  Empcode: any;
  @Output() isBankFormValid: EventEmitter<any> = new EventEmitter();
  FormControlNames: {} = {};
  showNREdetails: boolean;
  form: FormGroup;
  bankDetails: any = [];
  isAdd: boolean = true;
  isUpdate: boolean = false;
  isvisibledpbnk: boolean = false;
  index: any;
  tradingBankAccType: any;
  dpBankAccType: any;
  debitBankAccType: any;
  ModeOfOperation: any;
  Currency: any;
  fileName: any;
  fileType: any;
  document: any;

  fileList: any = [];
  NREfileList: any = [];
  DPfileList: any = [];
  DPMICRfileList: any = []
  DirectfileList: any = [];

  SellingLetterfileList: any = []
  SellingLetterDocument: any;
  // MICRfileList:any=[]
  // FirmBankfileList:any=[]

  bankProofDocument: any = [];
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  NREfileType: string;
  NREfileName: string;
  DPfileType: string;
  DPfileName: string;
  DirectfileType: string;
  DirectfileName: string;
  NREPISletter: any = [];
  DPBankProof: any = [];
  DPMICRProof: any = [];
  DirectDebitBank: any = [];
  countryArray: any = [];
  resultArray: any = [];
  resultArray1: any = [];
  resultArray2: any = [];
  // Bankfindopt: FindOptions;
  // EmployeeFindopt: FindOptions;

  clientType: string;
  banksList: any = [];
  bankListArray: any = [];
  bankListArray2: any = [];
  entryAccess: boolean = false;
  HolderDetails: any;
  clientSerialNumber: number;
  ClientSubType: any;
  isIfscValid: boolean = false;
  today = new Date();
  BankNameList: any = [];
  DPBankNameList: any = [];
  nreBankNameList: any = [];
  BankProofFile: any = [];
  sameAsDPBankChoosen: boolean = false;
  customValidationMsgObj = financialValidations;
  ifscCodeArray: any = [];
  ifscresultArray: any = [];
  ifscresultArray1: any = [];
  ifscresultArray2: any = [];
  timeout = null;
  IsResidentInd: boolean;
  constructor(
    private fb: FormBuilder,
    private validServ: ValidationService,
    private cmServ: ClientMasterService,
    private notif: NzNotificationService,
    private dataServ: DataService,
  ) {

    // this.Bankfindopt = {
    //   findType: 5034,
    //   codeColumn: 'Bankname',
    //   codeLabel: 'Bankname',
    //   descColumn: '',
    //   descLabel: '',
    //   hasDescInput: false,
    //   requestId: 8,
    //   whereClause: "1=1"
    //   // whereClause: "R.ReportingState ='" + data.ReportingState + "'"
    // }
    // this.EmployeeFindopt = {
    //   findType: 1001,
    //   codeColumn: 'Empcode',
    //   codeLabel: 'Empcode',
    //   descColumn: '',
    //   descLabel: '',
    //   hasDescInput: false,
    //   requestId: 8,
    //   whereClause: "1=1"
    //   // whereClause: "R.ReportingState ='" + data.ReportingState + "'"
    // }
    this.form = fb.group({
      masterBank: this.createBank(),
      DpBank: this.createDPBank(),
      NREdirectDebitBank: this.createdirectDebitBank(),
    });

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
    this.cmServ.clientType.subscribe((val) => {
      this.clientType = val;
    })
    this.cmServ.isEntryAccess.subscribe(val => {
      this.entryAccess = val;
    })
    this.cmServ.clientSubType.subscribe(val=>{
      let mBank: any = this.form.controls.masterBank
      if (val != "CL") {
        this.IsResidentInd=true;
        mBank.controls.rbirefNo.setValidators(Validators.required)
        mBank.controls.rbirefNo.updateValueAndValidity()
        mBank.controls.rbiapprvldt.setValidators(Validators.required)
        mBank.controls.rbiapprvldt.updateValueAndValidity()
      }
      else {
        this.IsResidentInd=false;
        mBank.controls.rbirefNo.setValidators(null)
        mBank.controls.rbiapprvldt.setValidators(null)
        mBank.controls.rbiapprvldt.updateValueAndValidity()
        mBank.controls.rbirefNo.updateValueAndValidity()

      }
    })
    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       Loc: ''
    //     }],
    //   "requestId": "5052",
    //   "outTblCount": "0"
    // }).then((response) => {
    //   if (response.errorCode == 0) {
    //     if (response.results) {
    //       this.countryArray = response.results[6]
    //       this.banksList = response.results[9]
    //       let form1: any = this.form.controls.masterBank
    //       let form2: any = this.form.controls.DpBank
    //       let form3: any = this.form.controls.NREdirectDebitBank
    //       form1.controls.country.patchValue("INDIA")
    //       form2.controls.dpBankCountry.patchValue("INDIA")
    //       form3.controls.drbnkcountry.patchValue("INDIA")
    //     }
    //   }
    //   else {
    //     this.notif.error(response.errorMsg, '')
    //   }
    // })
    this.cmServ.isNRE.subscribe(val => {
      this.showNREdetails = val
      console.log("nre ", this.showNREdetails)
    })

    this.cmServ.hoderDetails.subscribe((val) => {
      this.HolderDetails = val
    })
    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val

    })
    this.cmServ.activeTab.subscribe(val => {
      if (val == 2 && this.ifscCodeArray.length==0){
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientSerialNo: this.clientSerialNumber,
          PAN: this.HolderDetails["FirstHolderpanNumber"]
        }],
      "requestId": "5067"
    }).then((response) => {
      console.log("finacial initial fetch", response.results)
      if (response.errorCode == 0) {
        if (response.results.length > 0) {
          this.tradingBankAccType = response.results[3]
          this.dpBankAccType = response.results[4]
          this.debitBankAccType = response.results[5]
          this.ModeOfOperation = response.results[6]
          this.Currency = response.results[7]
          let IfscTotalData = response.results[9]
          let firstLetter = IfscTotalData[0].IFSC.charAt(0).toUpperCase()
          let filteredIfscCodes = []
          for (let i = 0; i < IfscTotalData.length - 1; i++) {
            if (firstLetter == IfscTotalData[i].IFSC.charAt(0).toUpperCase()) {
              filteredIfscCodes.push(IfscTotalData[i])
            }
            else {
              this.ifscCodeArray.push(filteredIfscCodes)
              filteredIfscCodes = []
              filteredIfscCodes.push(IfscTotalData[i])
              firstLetter = IfscTotalData[i].IFSC.charAt(0).toUpperCase()
            }
          }
          this.ifscCodeArray.push(filteredIfscCodes)
          console.log(this.ifscCodeArray)
         setTimeout(() => {
          this.cmServ.isfinnacialIFSCloaded.next(true)
         },100);
          this.countryArray = response.results[10]
          this.banksList = response.results[11]
          let form1: any = this.form.controls.masterBank
          let form2: any = this.form.controls.DpBank
          let form3: any = this.form.controls.NREdirectDebitBank
          form1.controls.country.patchValue("INDIA")
          form2.controls.dpBankCountry.patchValue("INDIA")
          form3.controls.drbnkcountry.patchValue("INDIA")


          if (response.results[8].length > 0) {
            this.ClientSubType = response.results[8][0]["ClientSubType"]
            let mBank: any = this.form.controls.masterBank
            if (this.ClientSubType != "CL") {
              this.IsResidentInd=true;
              mBank.controls.rbirefNo.setValidators(Validators.required)
              mBank.controls.rbirefNo.updateValueAndValidity()
              mBank.controls.rbiapprvldt.setValidators(Validators.required)
              mBank.controls.rbiapprvldt.updateValueAndValidity()
            }
            else {
              this.IsResidentInd=false;
              mBank.controls.rbirefNo.setValidators(null)
              mBank.controls.rbiapprvldt.setValidators(null)
              mBank.controls.rbiapprvldt.updateValueAndValidity()
              mBank.controls.rbirefNo.updateValueAndValidity()

            }
          }
    
        }
      }
      else {
        this.notif.error(response.errorMsg, '')
      }

    });
  }
})
    let mBank: any = this.form.controls.masterBank
    let dbBank: any = this.form.controls.DpBank
    let nreBank: any = this.form.controls.NREdirectDebitBank

    mBank.controls.country.valueChanges.subscribe(val => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (val == null) {
          return
        }
        let data = val.toUpperCase();
        if (this.countryArray.length) {
          this.resultArray = this.countryArray.filter(ele => {
            return (ele["Country"].startsWith(data) || ele["Code"].startsWith(data))
          })
        }
      }, 300)
    })

    mBank.controls.ifscCode.valueChanges.subscribe(val => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (val == null || val.length <= 3) {
          this.ifscresultArray = []
          return
        }
        let data = val.toUpperCase();
        if (this.ifscCodeArray.length) {
          let ifscArray = []
          ifscArray = this.ifscCodeArray.find(element => {
            return (element[0].IFSC.charAt(0).toUpperCase() == val.charAt(0).toUpperCase())
          });
          if (ifscArray.length) {
            this.ifscresultArray = ifscArray.filter(ele => {
              return (ele["IFSC"].startsWith(data))
            })
          }
        }
      }, 100)
    })

    mBank.controls.bankname.valueChanges.subscribe(val => {
      if (val == null) {
        return
      }
      let data = val.toUpperCase();
      if (this.banksList.length) {
        this.bankListArray = this.banksList.filter(ele => {
          return (ele["BankName"].includes(data))
        })
      }
    })

    dbBank.controls.dpBankname.valueChanges.subscribe(val => {
      if (val == null) {
        return
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let data = val.toUpperCase();
        if (this.banksList.length) {
          this.bankListArray2 = this.banksList.filter(ele => {
            return (ele["BankName"].includes(data))
          })
        }
      }, 500)
    })
    dbBank.controls.dpBankifscCode.valueChanges.subscribe(val => {

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (val == null || val.length <= 3) {
          this.ifscresultArray1 = []
          return
        }
        let data = val.toUpperCase();
        if (this.ifscCodeArray.length) {
          let ifscArray1 = []
          ifscArray1 = this.ifscCodeArray.find(element => {
            return (element[0].IFSC.charAt(0).toUpperCase() == val.charAt(0).toUpperCase())
          });
          if (ifscArray1.length) {
            this.ifscresultArray1 = ifscArray1.filter(ele => {
              return (ele["IFSC"].startsWith(data))
            })
          }
        }
      }, 100)
    })
    dbBank.controls.dpBankCountry.valueChanges.subscribe(val => {
      if (val == null) {
        return
      }
      let data = val.toUpperCase();
      if (this.countryArray.length) {
        this.resultArray1 = this.countryArray.filter(ele => {
          return (ele["Country"].startsWith(data) || ele["Code"].startsWith(data))
        })
      }
    })

    nreBank.controls.drbnkcountry.valueChanges.subscribe(val => {
      if (val == null) {
        return
      }
      let data = val.toUpperCase();
      if (this.countryArray.length) {
        this.resultArray2 = this.countryArray.filter(ele => {
          return (ele["Country"].startsWith(data) || ele["Code"].startsWith(data))
        })
      }
    })

    nreBank.controls.drbnkifscCode.valueChanges.subscribe(val => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (val == null || val.length <= 3) {
          this.ifscresultArray2 = []
          return
          // nreBank.controls.drbnkaccntNumber.setValidators(null)
          // nreBank.controls.drbnkbankAcType.setValidators(null)
          // nreBank.controls.drbnkaccntNumber.updateValueAndValidity()
          // nreBank.controls.drbnkbankAcType.updateValueAndValidity()
        }
        else {
          let data = val.toUpperCase();
          if (this.ifscCodeArray.length) {
            let ifscArray2 = []
            ifscArray2 = this.ifscCodeArray.find(element => {
              return (element[0].IFSC.charAt(0).toUpperCase() == val.charAt(0).toUpperCase())
            });
            if (ifscArray2.length) {
              this.ifscresultArray2 = ifscArray2.filter(ele => {
                return (ele["IFSC"].startsWith(data))
              })
            }


          }
          // nreBank.controls.drbnkaccntNumber.setValidators(Validators.required)
          // nreBank.controls.drbnkbankAcType.setValidators(Validators.required)
          // nreBank.controls.drbnkaccntNumber.updateValueAndValidity()
          // nreBank.controls.drbnkbankAcType.updateValueAndValidity()

        }
      }, 100)
    })

  }
  private createBank() {
    return this.fb.group({
      // bank: [null, [Validators.required]],
      clntname: [null, [Validators.required]],
      bankAcType: [null, [Validators.required]],
      modeOfOperation: [null],
      ifscCode: [null, [Validators.required]],
      bankname: [null, [Validators.required]],
      address: [null, [Validators.required]],
      micr: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      pin: [null, [Validators.required]],
      accntNumber: [null, [Validators.required]],
      confrmAccntNumber: [null, [Validators.required]],
      oft: [null,[Validators.required]],
      rbirefNo: [null],
      rbiapprvldt: [null],
    })
  }
  private createDPBank() {
    return this.fb.group({
      sameastrading: [true],
      dpBankClientName: [null, [Validators.required]],
      dpBankAcType: [null, [Validators.required]],
      dpBankModeOfOperation: [null],
      dpBankifscCode: [null, [Validators.required]],
      dpBankname: [null, [Validators.required]],
      dpBankMicr: [null, [Validators.required]],
      dpBankAddress: [null, [Validators.required]],
      dpBankCountry: [null, [Validators.required]],
      dpBankState: [null, [Validators.required]],
      dpBankCity: [null, [Validators.required]],
      dpBankPin: [null, [Validators.required]],
      dpBankAccntNumber: [null, [Validators.required]],
      dpBankConfrmAccntNumber: [null, [Validators.required]],
      currencyCodeinDpBank: [null,[Validators.required]],
    })
  }

  private createdirectDebitBank() {
    return this.fb.group({
      sameAsDP: [false],
      drbnkbankAcType: [null, [Validators.required]],
      drbnkifscCode: [null, [Validators.required]],
      drbnkbankname: [null, [Validators.required]],
      drbnkmicr: [null, [Validators.required]],
      drbnkaddress: [null, [Validators.required]],
      drbnkcountry: [null, [Validators.required]],
      drbnkstate: [null, [Validators.required]],
      drbnkcity: [null, [Validators.required]],
      drbnkpin: [null, [Validators.required]],
      drbnkaccntNumber: [null, [Validators.required]],
      drsigned: [null],
      drsignedDate: [null]
    });
  }

  beforeUpload = (file: UploadFile): boolean => {

    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {

      // this.fileList = [file];
      // this.fileType=file.type;
      // this.fileName=file.name

      if (this.clientType == "individual") {
        this.encodeImageFileAsURL(file, 'Bank');
        return false;
      }
      if (this.clientType == 'nonIndividual') {
        this.encodeImageFileAsURL(file, 'FirmsBank');
        return false;
      }
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '', { nzDuration: 60000 })
      return false
    }
  }
  NREbeforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      // this.NREfileList = [file];
      // this.NREfileType=file.type;
      // this.NREfileName=file.name

      if (this.clientType == "individual") {
        this.encodeImageFileAsURL(file, 'NRE');
        return false;
      }
      if (this.clientType == 'nonIndividual') {
        this.encodeImageFileAsURL(file, 'MICR');
        return false;
      }

    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '', { nzDuration: 60000 })
      return false
    }
  }
  DPbeforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      // this.DPfileList = [file];
      // this.DPfileType = file.type;
      // this.DPfileName = file.name
      this.encodeImageFileAsURL(file, 'DP');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '', { nzDuration: 60000 })
      return false
    }
  }
  DPMICRbeforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.DPMICRfileList = [file];
      this.encodeImageFileAsURL(file, 'DPMICR');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '', { nzDuration: 60000 })
      return false
    }
  }
  DirectbeforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      // this.DirectfileList = [file];
      // this.DirectfileType = file.type;
      // this.DirectfileName = file.name
      this.encodeImageFileAsURL(file, 'Direct');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '', { nzDuration: 60000 })
      return false
    }
  }


  beforeUploadSellingLetter = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.SellingLetterfileList = [file];
      this.encodeImageFileAsURL(file, 'SellingLetter');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '', { nzDuration: 60000 })
      return false
    }
  }
  encodeImageFileAsURL(file, type: string) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      if (type == "Bank") {
        if (this.bankProofDocument.length < 3) {
          this.bankProofDocument.push({
            bankDocname: 'Trading bank',
            // bankDoctype:this.fileType,file.type
            bankDoctype: file.type,
            bankDocuid: file.uid,
            bankDocsize: file.size,
            bankDocdoc: document
          })
        }
        else {
          this.notif.error('Maximum 3 bank proof can be uploaded', '')
        }
      }
      if (type == "NRE") {
        if (this.NREPISletter.length < 3) {
          this.NREPISletter.push({
            nreDocname: 'NRE PIS',
            nreDoctype: file.type,
            nreDocuid: file.uid,
            nreDocsize: file.size,
            nreDocdoc: document,
          })
        }
        else {
          this.notif.error('Maximum 3 file can be uploaded', '')
        }
      }
      if (type == "FirmsBank") {
        this.bankProofDocument = {
          FirmsBankDocname: 'Firms Bank  proof',
          FirmsBankDoctype: this.fileType,
          FirmsBankDocuid: file.uid,
          FirmsBankDocsize: file.size,
          FirmsBankDocdoc: document,
        }
      }
      if (type == "MICR") {
        this.NREPISletter = {
          MICRDocname: 'MICR Proof',
          MICRDoctype: this.NREfileType,
          MICRDocuid: file.uid,
          MICRDocsize: file.size,
          MICRDocdoc: document,
        }
      }
      if (type == "DP") {
        if (this.DPBankProof.length < 3) {
          this.DPBankProof.push({
            DPDocname: 'DP bank',
            DPDoctype: file.type,
            DPDocuid: file.uid,
            DPDocsize: file.size,
            DPDocdoc: document,
          })
        }
        else {
          this.notif.error('Maximum 3 DP Bank proof can be uploaded', '')
        }
      }
      if (type == "DPMICR") {
        this.DPMICRProof = {
          DPMICRDocname: 'DP MICR proof',
          DPMICRDoctype: this.DPfileType,
          DPMICRDocuid: file.uid,
          DPMICRDocsize: file.size,
          DPMICRDocdoc: document,
        }
      }
      if (type == "Direct") {

        if (this.DirectDebitBank.length < 3) {
          this.DirectDebitBank.push({
            DirectDocname: "Direct bank",
            DirectDoctype: file.type,
            DirectDocuid: file.uid,
            DirectDocsize: file.size,
            DirectDocdoc: document,
          })
        }
        else {
          this.notif.error('Maximum 3 bank proof can be uploaded', '')
        }
      }
      if (type == "SellingLetter") {
        this.SellingLetterDocument = {
          SellingLetteDocname: "Selling Only Letter",
          SellingLetteDoctype: file.type,
          SellingLetteDocuid: file.uid,
          SellingLetteDocsize: file.size,
          SellingLetteDocdoc: document,
        }


      }
    }
    reader.readAsDataURL(file);

  }
  showModal(data) {

    if (this.clientType == 'individual' && data.bankDocdoc) {
      this.filePreiewContent = data.bankDocdoc
      this.filePreiewFilename = data.bankDocname
      this.filePreiewContentType = data.bankDoctype
      this.filePreiewVisible = true;
    }
    else if (data.FirmsBankDocdoc) {
      this.filePreiewContent = data.FirmsBankDocdoc
      this.filePreiewFilename = data.FirmsBankDocname
      this.filePreiewContentType = data.FirmsBankDoctype
      this.filePreiewVisible = true;
    }
  }

  DPshowModal(data) {
    this.filePreiewContent = data.DPDocdoc
    this.filePreiewFilename = data.DPDocname
    this.filePreiewContentType = data.DPDoctype
    this.filePreiewVisible = true;
  }

  DPMICRshowModal() {
    this.filePreiewContent = this.DPMICRProof["DPMICRDocdoc"]
    this.filePreiewFilename = this.DPMICRProof["DPMICRDocname"]
    this.filePreiewContentType = this.DPMICRProof["DPMICRDoctype"]
    this.filePreiewVisible = true;
  }

  DirectshowModal(data) {

    this.filePreiewContent = data.DirectDocdoc
    this.filePreiewFilename = data.DirectDocname
    this.filePreiewContentType = data.DirectDoctype
    this.filePreiewVisible = true;
  }
  showNREModal(data) {
    if (this.clientType == 'individual' || (data.nreDocdoc || data.MICRDocdoc)) {
      this.filePreiewContent = data.nreDocdoc
      this.filePreiewFilename = data.nreDocname
      this.filePreiewContentType = data.nreDoctype
      this.filePreiewVisible = true;
    }
    else if (data.MICRDocdoc) {
      this.filePreiewContent = data.MICRDocdoc
      this.filePreiewFilename = data.MICRDocname
      this.filePreiewContentType = data.MICRDoctype
      this.filePreiewVisible = true;
    }
  }

  SellingLetterDocumentModal() {
    this.filePreiewContent = this.SellingLetterDocument.SellingLetteDocdoc
    this.filePreiewFilename = this.SellingLetterDocument.SellingLetteDocname
    this.filePreiewContentType = this.SellingLetterDocument.SellingLetteDoctype
    this.filePreiewVisible = true;
  }

  add() {
    this.notif.remove()
    if (this.bankDetails.length == 10) {
      this.notif.error("Maximum 10 Banks can select as a tranding banks", '', { nzDuration: 60000 })
      return
    }
    if (!this.isIfscValid) {
      this.notif.error("Invalid IFSC Code", '', { nzDuration: 60000 })
      return
    }
    let form: any = this.form.controls.masterBank
    let accno = this.checkAcNumbers(form.value.accntNumber, form.value.confrmAccntNumber);
    if (!accno) {
      this.notif.error("Account number and Confirm AccNumber should be same", '', { nzDuration: 60000 })
      return
    }
    let isValid = this.validServ.validateForm(form, this.FormControlNames, this.customValidationMsgObj.TradingBank);
    if (!isValid) {
      return;
    }


    if (this.clientType == 'individual') {
      if (this.bankProofDocument.length == 0) {
        this.notif.error("Please upload bank proof document", '', { nzDuration: 60000 })
        return
      }
      if (this.showNREdetails) {
        if (this.NREPISletter.length == 0) {
          this.notif.error("Please upload NRE PIS document", '', { nzDuration: 60000 })
          return
        }
        let bankProof = JSON.stringify(this.bankProofDocument)
        let pisLetter = JSON.stringify(this.NREPISletter)
        form.value["bankProof"] = JSON.parse(bankProof)
        form.value["pisLetter"] = JSON.parse(pisLetter)

        // var totalData={...form.value} 
      }
      else {
        let bankProof = JSON.stringify(this.bankProofDocument)
        form.value["bankProof"] = JSON.parse(bankProof)
        // var totalData={...form.value,...this.bankProofDocument}
      }
      this.bankDetails = [...this.bankDetails, ...form.value]
      console.log(this.bankDetails)
    }
    else {
      var totalData = { ...form.value, ...this.bankProofDocument, ...this.NREPISletter }
      this.bankDetails = [...this.bankDetails, ...totalData]
      console.log(this.bankDetails)
    }
    form.reset();
    this.isIfscValid = false;
    this.fileList = []
    this.NREfileList = []
    this.bankProofDocument = []
    this.NREPISletter = []
  }
  edit(data, i) {
    this.index = i
    this.isAdd = false;
    this.isUpdate = true;
    let form: any = this.form.controls.masterBank;
    form.patchValue(data)
    if (data.pisLetter) {
      let pisLetter = JSON.stringify(data.pisLetter)
      this.NREPISletter = JSON.parse(pisLetter)
    }
    if (data.bankProof) {
      let bproof = JSON.stringify(data.bankProof)
      this.bankProofDocument = JSON.parse(bproof)
    }
  }
  update() {
    this.notif.remove()
    let form: any = this.form.controls.masterBank;
    let isValid = this.validServ.validateForm(form, this.FormControlNames, this.customValidationMsgObj.TradingBank);
    if (!isValid) {
      return
    }
    if (!this.isIfscValid) {
      this.notif.error("Invalid IFSC Code", '', { nzDuration: 60000 })
      return
    }
    this.isAdd = true;
    this.isUpdate = false;
    if (this.clientType == 'individual') {
      if (this.bankProofDocument.length == 0) {
        this.notif.error("Please upload bank proof document", '', { nzDuration: 60000 })
        return
      }
      if (this.showNREdetails) {
        if (this.NREPISletter.length == 0) {
          this.notif.error("Please upload NRE PIS document", '', { nzDuration: 60000 })
          return
        }


        let bankProof = JSON.stringify(this.bankProofDocument)
        let pisLetter = JSON.stringify(this.NREPISletter)
        form.value["bankProof"] = JSON.parse(bankProof)
        form.value["pisLetter"] = JSON.parse(pisLetter)

        var totalData = { ...form.value }
      }
      else {
        let bankProof = JSON.stringify(this.bankProofDocument)
        form.value["bankProof"] = JSON.parse(bankProof)
        var totalData = { ...form.value }
      }
      this.bankDetails[this.index] = totalData
      this.notif.success("Updated successfully", '', { nzDuration: 60000 })
      this.fileList = []
      this.NREfileList = []
      form.reset();
      this.isIfscValid = false
      this.bankProofDocument = []
      this.NREPISletter = [];
    }
    else {
      if (this.bankProofDocument.length == 0) {
        this.notif.error("Please upload bank proof document", '', { nzDuration: 60000 })
        return
      }
      let bankProof = JSON.stringify(this.bankProofDocument)
      form.value["bankProof"] = JSON.parse(bankProof)
      var totalData = { ...form.value, ...this.NREPISletter }
      this.bankDetails[this.index] = totalData
      this.notif.success("Updated successfully", '', { nzDuration: 60000 })
      this.fileList = []
      this.NREfileList = []
      form.reset();
      this.bankProofDocument = []
      this.NREPISletter = [];
    }
  }
  reset() {
    let form: any = this.form.controls.masterBank;
    form.reset();
    form.controls.country.patchValue("INDIA")
    this.fileList = [];
    this.bankProofDocument = [];
    this.NREPISletter = [];
  }
  getIfscdetails(data) {

    if (data != null) {
      let form: any = this.form.controls.masterBank
      if (data.length == 0) {
        form.controls.bankname.setValue(null);
        form.controls.address.setValue(null);
        form.controls.micr.setValue(null);
        form.controls.state.setValue(null);
        form.controls.city.setValue(null);
        form.controls.pin.setValue(null)
        return
      }

      if (this.entryAccess == false) {
        return
      }
      if (data.length != 11) {
        form.controls.bankname.setValue(null);
        form.controls.address.setValue(null);
        form.controls.micr.setValue(null);
        form.controls.state.setValue(null);
        form.controls.city.setValue(null);
        form.controls.pin.setValue(null)
        return
      }
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            Ifc: data
          }],
        "requestId": "5069",
        "outTblCount": "0"
      }).then((response) => {
        if (response.errorCode == 0) {
          if (response.results) {

            let data = response.results[0][0]
            this.BankNameList = [];
            this.BankNameList = response.results[0]
            console.log(response.results);
            if (data.EXIST) {
              this.isIfscValid = true;
              let form: any = this.form.controls.masterBank
              form.controls.bankname.setValue(data.BANK_NAME);
              form.controls.address.setValue(data.ADDRESS);
              form.controls.micr.setValue(data.MICR);
              form.controls.state.setValue(data.STATE);
              form.controls.city.setValue(data.BRANCH_NAME);
              form.controls.pin.setValue(data.Pincode);

            }
            else {
              this.isIfscValid = false;
              this.notif.error("Invalid IFSC Code", '')
              form.controls.bankname.setValue(null);
              form.controls.address.setValue(null);
              form.controls.micr.setValue(null);
              form.controls.state.setValue(null);
              form.controls.city.setValue(null);
              form.controls.pin.setValue(null);
            }
          }
        }
        else {
          this.notif.error(response.errorMsg, '')
        }
      })
    }
  }
  getDPbnkIfscdetails(data) {
    if (data != null) {
      let form: any = this.form.controls.DpBank
      if (data.length == 0) {
        form.controls.dpBankname.setValue(null);
        form.controls.dpBankAddress.setValue(null);
        form.controls.dpBankMicr.setValue(null);
        form.controls.dpBankState.setValue(null);
        form.controls.dpBankCity.setValue(null);
        form.controls.dpBankPin.setValue(null);

        return
      }
      if (this.entryAccess == false) {
        return
      }
      if (data.length != 11) {
        form.controls.dpBankname.setValue(null);
        form.controls.dpBankAddress.setValue(null);
        form.controls.dpBankMicr.setValue(null);
        form.controls.dpBankState.setValue(null);
        form.controls.dpBankCity.setValue(null);
        form.controls.dpBankPin.setValue(null);
        return
      }

      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            Ifc: data,
          }],
        "requestId": "5069",
        "outTblCount": "0"
      }).then((response) => {
        if (response.errorCode == 0) {
          if (response.results) {
            let data = response.results[0][0]
            this.DPBankNameList = [];
            this.DPBankNameList = response.results[0];
            let form: any = this.form.controls.DpBank
            if (data.EXIST) {
              form.controls.dpBankname.setValue(data.BANK_NAME);
              form.controls.dpBankAddress.setValue(data.ADDRESS);
              form.controls.dpBankMicr.setValue(data.MICR);
              form.controls.dpBankState.setValue(data.STATE);
              form.controls.dpBankPin.setValue(data.Pincode);
              form.controls.dpBankCity.setValue(data.BRANCH_NAME);
            }
            else {
              this.notif.error("Invalid IFSC Code", '')
              form.controls.dpBankname.setValue(null);
              form.controls.dpBankAddress.setValue(null);
              form.controls.dpBankMicr.setValue(null);
              form.controls.dpBankState.setValue(null);
              form.controls.dpBankCity.setValue(null);
              form.controls.dpBankPin.setValue(null);

            }
          }

        }
        else {
          this, this.notif.error(response.errorMsg, '');
        }
      })
    }
  }
  Deleterow(i) {
    this.bankDetails.splice(i, 1)
  }

  checkAcNumbers(accOne, accTwo) {
    if (accOne == accTwo)
      return true
    else
      return false
  }
  masterbankConfirmCheck() {
    let form: any = this.form.controls.masterBank
    let accno = this.checkAcNumbers(form.value.accntNumber, form.value.confrmAccntNumber);
    if (!accno) {
      this.notif.error("Trading Bank Account number and Confirm AccNumber should be same", '', { nzDuration: 60000 })
    }
  }

  DPbankConfirmCheck() {
    let form: any = this.form.controls.DpBank
    let accno = this.checkAcNumbers(form.value.dpBankAccntNumber, form.value.dpBankConfrmAccntNumber);
    if (!accno) {
      this.notif.error("DP Bank Account number and Confirm AccNumber should be same", '', { nzDuration: 60000 })
    }
  }

  selectsameAsDP(data) {

    if (data != null && data != undefined) {
      if (data == true) {
        let form: any = this.form.controls.NREdirectDebitBank
        let targetData: any = this.form.controls.DpBank;
        if (targetData.value.dpBankname != 'AXIS BANK LTD' && targetData.value.dpBankname != 'IDBI BANK LTD') {
          this.notif.error('You can choose AXIS/IDBI Bank same as Direct Bank', '', { nzDuration: 60000 })
          form.controls.sameAsDP.patchValue(false)
          return
        }
        this.sameAsDPBankChoosen = true;
        // form.controls.drbnkbankAcType.setValue(targetData.value.dpBankAcType)
        form.controls.drbnkifscCode.setValue(targetData.value.dpBankifscCode)
        form.controls.drbnkbankname.setValue(targetData.value.dpBankname)
        form.controls.drbnkmicr.setValue(targetData.value.dpBankMicr)
        form.controls.drbnkaddress.setValue(targetData.value.dpBankAddress)
        form.controls.drbnkcountry.setValue(targetData.value.dpBankCountry)
        form.controls.drbnkstate.setValue(targetData.value.dpBankState)
        form.controls.drbnkcity.setValue(targetData.value.dpBankCity)
        form.controls.drbnkpin.setValue(targetData.value.dpBankPin)
        form.controls.drbnkaccntNumber.setValue(targetData.value.dpBankAccntNumber)
        this.nreBankNameList=this.DPBankNameList
        this.DirectDebitBank = []

        if (this.DPBankProof.length) {
          let obj = new Object()
          this.DPBankProof.forEach(element => {
            obj = {
              DirectDocname: "Direct bank",
              DirectDocdoc: element.DPDocdoc,
              DirectDoctype: element.DPDoctype,
              DirectDocsize: element.DPDocsize,
              DirectDocuid: element.DPDocuid,
            }
            this.DirectDebitBank.push(obj)
            obj = {}

          });
        }

        // DirectDocname: "Direct bank",
        // DirectDoctype: file.type,
        // DirectDocuid: file.uid,
        // DirectDocsize: file.size,
        // DirectDocdoc: document,
        // this.DirectDebitBank=this.DPBankProof

        // this.filePreiewContent =data.DPDocdoc
        // this.filePreiewFilename =data.DPDocname 
        // this.filePreiewContentType =data.DPDoctype
        // this.filePreiewVisible = true;

        // this.filePreiewContent = data.DirectDocdoc
        // this.filePreiewFilename = data.DirectDocname
        // this.filePreiewContentType = data.DirectDoctype
        // this.filePreiewVisible = true;
      }
      else {
        this.sameAsDPBankChoosen = false
        let form: any = this.form.controls.NREdirectDebitBank
        // form.controls.drbnkbankAcType.setValue(null)
        form.controls.drbnkifscCode.setValue(null)
        form.controls.drbnkbankname.setValue(null)
        form.controls.drbnkmicr.setValue(null)
        form.controls.drbnkaddress.setValue(null)
        form.controls.drbnkcountry.setValue(null)
        form.controls.drbnkstate.setValue(null)
        form.controls.drbnkcity.setValue(null)
        form.controls.drbnkpin.setValue(null)
        form.controls.drbnkaccntNumber.setValue(null)
        this.DirectDebitBank = []
        this.nreBankNameList=[]
      }
    }

  }
  getNREIfscdetails(data) {
    // let data = val.target.value;
    if(this.sameAsDPBankChoosen){
      return
    }
    if (data != null) {
      if (data.length == 0) {
        let form: any = this.form.controls.NREdirectDebitBank
        form.controls.drbnkbankname.setValue(null);
        form.controls.drbnkaddress.setValue(null);
        form.controls.drbnkmicr.setValue(null);
        form.controls.drbnkstate.setValue(null);
        form.controls.drbnkcity.setValue(null);
        form.controls.drbnkpin.setValue(null);
        return
      }
      if (this.entryAccess == false) {
        return
      }
      if (data.length != 11) {
        let form: any = this.form.controls.NREdirectDebitBank
        form.controls.drbnkbankname.setValue(null);
        form.controls.drbnkaddress.setValue(null);
        form.controls.drbnkmicr.setValue(null);
        form.controls.drbnkstate.setValue(null);
        form.controls.drbnkcity.setValue(null);
        form.controls.drbnkpin.setValue(null);
        return
      }
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            Ifc: data,
          }],
        "requestId": "5069",
        "outTblCount": "0"
      }).then((response) => {
        if (response.errorCode == 0) {
          if (response.results) {
            let data = response.results[0][0]

            if (data.EXIST) {

              if (data.BANK_NAME == "IDBI BANK LTD" || data.BANK_NAME == "AXIS BANK LTD") {
                this.nreBankNameList = [];
                this.nreBankNameList = response.results[0];
                let form: any = this.form.controls.NREdirectDebitBank
                form.controls.drbnkbankname.setValue(data.BANK_NAME);
                form.controls.drbnkaddress.setValue(data.ADDRESS);
                form.controls.drbnkmicr.setValue(data.MICR);
                form.controls.drbnkstate.setValue(data.STATE);
                form.controls.drbnkcity.setValue(data.BRANCH_NAME);
                form.controls.drbnkpin.setValue(data.Pincode);
                // form.controls.drbnkaccntNumber.setValidators(Validators.required)
                // form.controls.drbnkbankAcType.setValidators(Validators.required)
                // form.controls.drbnkaccntNumber.updateValueAndValidity()
                // form.controls.drbnkbankAcType.updateValueAndValidity()

              }
              else {
                let form: any = this.form.controls.NREdirectDebitBank
                this.notif.error('You can choose AXIS/IDBI Bank', '', { nzDuration: 60000 })
                form.controls.drbnkbankname.setValue(null);
                form.controls.drbnkaddress.setValue(null);
                form.controls.drbnkmicr.setValue(null);
                form.controls.drbnkstate.setValue(null);
                form.controls.drbnkcity.setValue(null);
                form.controls.drbnkpin.setValue(null);

              }
            }
            else {
              let form: any = this.form.controls.NREdirectDebitBank
              this.isIfscValid = false;
              this.notif.error("Invalid IFSC Code", '')
              form.controls.drbnkbankname.setValue(null);
              form.controls.drbnkaddress.setValue(null);
              form.controls.drbnkmicr.setValue(null);
              form.controls.drbnkstate.setValue(null);
              form.controls.drbnkcity.setValue(null);
              form.controls.drbnkpin.setValue(null);

            }
          }
        }
        else {
          this.notif.error(response.errorMsg, '')
        }
      })
    }
  }
  viewdpbank(chk) {
    if (chk == true) {
      this.isvisibledpbnk = false;
    }
    else {
      this.isvisibledpbnk = true;
    }

  }

  // public validateBankForm(data:any){

  //   // if(data===true){
  //   //   let isValid = this.validServ.validateForm(this.form,this.FormControlNames);
  //   //   if(isValid){ 

  //   //     this.isBankFormValid.emit(true)
  //   //   }
  //   // else{
  //   //   this.isBankFormValid.emit(false)

  //   // }
  //   //   if(this.form.valid===true){ 

  //   //     this.isBankFormValid.emit(true)
  //   //   }
  //   // else{
  //   //   this.isBankFormValid.emit(false)
  //   // }
  // // }
  // }
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
  symbolrestrict(val) {
    var charonly = /^[a-zA-Z]+$/
    var numonly = /^[a-zA-Z0-9]+$/
    var fullstring = val.currentTarget.value
    var text = val.key
    if (val.target.selectionStart <= 3) {
      return charonly.test(text)

    }
    else {
      return numonly.test(text)

    }

  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };
  // onChangeBankName(val)
  // {
  //   let form:any=this.form.controls.masterBank
  //       form.controls.address.setValue(val.ADDRESS);
  //       form.controls.micr.setValue(val.MICR);
  //       form.controls.state.setValue(val.STATE);
  //       form.controls.city.setValue(val.BRANCH_NAME);
  // }
  // onDpBankChange(val)
  // {
  //         let form:any=this.form.controls.DpBank
  //          form.controls.dpBankAddress.setValue(val.ADDRESS);
  //          form.controls.dpBankMicr.setValue(val.MICR);
  //          form.controls.dpBankState.setValue(val.STATE);
  //          form.controls.dpBankCity.setValue(val.BRANCH_NAME);
  // }
  // onNREBankChange(val)
  // {
  //   let form:any=this.form.controls.NREdirectDebitBank
  //   form.controls.drbnkaddress.setValue(val.ADDRESS);
  //   form.controls.drbnkmicr.setValue(val.MICR);
  //   form.controls.drbnkstate.setValue(val.STATE);
  //   form.controls.drbnkcity.setValue(val.BRANCH_NAME);
  // }
  DeleteProofrow(index) {
    this.bankProofDocument.splice(index, 1)
    // this.BankProofFile.splice(index, 1)
  }
  DeletePIsLetter(index) {

    this.NREPISletter.splice(index, 1)
  }
  DeleteDpImage(index) {
    this.DPBankProof.splice(index, 1)
  }
  DirectDelete(index) {
    this.DirectDebitBank.splice(index, 1)
  }
}
