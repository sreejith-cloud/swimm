import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { AuthService, DataService, User } from 'shared';
import { FindOptions, AppConfig } from "shared";
import { formatDate } from '@angular/common'; 
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import * as moment from 'moment';
declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}

@Component({
  selector: 'app-miscellaneous',
  templateUrl: './miscellaneous.component.html',
  styleUrls: ['./miscellaneous.component.css']
})
export class MiscellaneousComponent implements OnInit {

  file: any;
  csvfile: any;
  currentUser: User;
  fileName: any;
  mockCsvData: string;
  mockHeaders: string;
  today = formatDate(new Date(), 'ddMMyyyy', 'en-US');
  fileTitle: any;
  UCC: any;
  result: any;
  uccvalueArray: any;
  responseFile: any;
  totalData: string;
  isSpining: boolean = false;
  batchNo: any;
  typevalueArray: any = [];
  type: any;

  ncdexResultSet: any = [];
  ncdexSatus: boolean = false;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  currentDay : Date = new Date();
  _today: Date = new Date();
  fileType: string = 'NCDEX';
  uploadedFileType: string;
  generatedFileType: string='PSV';
  bseNominee: boolean;
  isFileSelected: boolean;


  constructor(
    private dataServ: DataService, private authServ: AuthService, private notif: NzNotificationService
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }


  ngOnInit() {
    this.getUploadTypes();
  }

  getUploadTypes() {
    this.isSpining = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser ? this.currentUser.userCode : ''
        }],
      "requestId": "900052",
      "outTblCount": "0"
    })
      .then((response) => {
        this.isSpining = false;
        if (response && response.errorCode == 0) {
          this.result = response.results
          this.typevalueArray = Object.values(this.result[0])
          this.type = this.typevalueArray.length > 0 ? this.typevalueArray[0].DROPDOWN : ''
          this.onChangeType();
        } else {
          let errorMsg = response.errorMsg ? response.errorMsg : 'No Data Found'
          this.notif.error(errorMsg, '')
        }
      })
  }

  onChangeType() {
    this.reset()
    if (this.type && this.type === 'NCDEX- Mandating Nominee Flag in UCC') {
      this.fileType = 'NCDEX'
      this.ncdexSatus = true;
      this.fromDate = this.currentDay;
      this.toDate =this.currentDay;
      this.bseNominee = false;
      this.isFileSelected =false;
      this.file=[]
    }
    else if (this.type && this.type === 'NSE-bulk file generation for PAN-Aadhaar seeding') {
      this.fileType = 'NSE_FG'
      this.ncdexSatus = false;
      this.fromDate = this.currentDay;
      this.toDate =this.currentDay;
      this.bseNominee = false;
      this.isFileSelected =false;
      this.file=[]
    }
    else if (this.type && this.type === 'UCC bulk file for opt-out nominee updation') {
      this.fileType = 'UCC'
      this.ncdexSatus = false;
      this.fromDate = this.currentDay;
      this.toDate =this.currentDay;
      this.bseNominee = false;
      this.isFileSelected =false;
      this.file=[]
    }
    else if (this.type && this.type === 'Bulk file generation for PAN-Aadhaar seeding-NCDEX') {
      this.fileType = 'NCDEX_FG'
      this.ncdexSatus = true;
      this.fromDate = this.currentDay;
      this.toDate =this.currentDay;
      this.bseNominee = false;
      this.isFileSelected =false;
      this.file=[]
    }
    else if (this.type && this.type === 'BSE Nomination File Generation') {
      this.fileType = 'BSE_FG'
      this.bseNominee = true;
      this.fromDate = null;
      this.toDate = null;
      this.ncdexSatus = false;
      this.isFileSelected =false;
      this.file=[]
      
    }
    else if (this.type && this.type === 'BSE Bank Updation') {
      this.fileType = 'BSE_BU'
      this.bseNominee = true;
      this.fromDate = null;
      this.toDate = null;
      this.ncdexSatus = false;
      this.isFileSelected =false;
      this.file=[]
      
    }
  }

  fileChangeEvent = () => {
    return (file: UploadFile): boolean => {
      this.file = [file];
      this.uploadedFileType = file.type;
      this.isFileSelected = true;
      return false;
    };
  }

  uploadresponse() {
    if( this.bseNominee){
      if (this.file[0] && (this.uploadedFileType =='text/csv' || this.uploadedFileType =='application/vnd.ms-excel' )) {
        this.processFile(0);
      }
      else if(this.file[0]){
         
        this.notif.error('Please select CSV File', '');
        return;
      }
       else if(this.uploadedFileType =='text/csv'){
        this.notif.error('Please select Filetype', '');
        return;
      }
      else if(this.fromDate && this.toDate){
        if(this.fileType == 'BSE_FG'){
        this.fetchBSENomineeData('BSE Nomination Details')
        }
        else if(this.fileType == 'BSE_BU'){
          this.BSEBankUpdation('')
        }
      }
      else {
        this.notif.error('Please provide dates (from and to) or file', '');
      }

    }
    else if (this.file[0] && !this.bseNominee && (this.uploadedFileType =='text/csv' || this.uploadedFileType =='application/vnd.ms-excel' )) {
      this.processFile(0);
    }
    else if(this.file[0]){
      this.notif.error('Please select CSV File', '');
      return;
    }
     else if(this.uploadedFileType =='text/csv'){
      this.notif.error('Please select Filetype', '');
      return;
    }

  }

  processFile(i) {
    return new Promise((resolve, reject) => {
      let val = this.file;
      if (val) {
        val.status = "Processing";
        const formdata: FormData = new FormData();
        formdata.append('file', val[0]);
        this.isSpining = true;
        this.dataServ.ftpuploadFile(formdata).then((response: any) => {
          this.isSpining = false;
          if (response && response.errorCode == 0) {
            this.fileName = response.fileName;
            resolve(this.fileName)
            if (this.fileType == 'NCDEX') {
              this.updateNCDEXData(this.fileName)
            }
            else if (this.fileType == 'NSE_FG') {
              this.updateUNFData(this.fileName);
            }
            else if (this.fileType == 'UCC') {
              this.updateUCCData(this.fileName)
            }
            else if (this.fileType == 'NCDEX_FG') {
              this.updateNCDEXPASData(this.fileName)
            }
            else if (this.fileType == 'BSE_FG') {
              this.fetchBSENomineeData(this.fileName)
            }
            else if (this.fileType == 'BSE_BU') {
              this.BSEBankUpdation(this.fileName)
            }
            // if (this.type == 'UCC bulk file for opt-out nominee updation') {
            //   this.setHeaderAndUpdate(this.fileName, 0);
            // }
            // else if (this.type === 'NSDL-bulk file generation for PAN-Aadhaar seeding') {
            //   this.setHeaderAndUpdate(this.fileName, 0);
            // } else if (this.type === 'NCDEX- Mandating Nominee Flag in UCC') {
            //   this.setHeaderAndUpdate(this.fileName, 0);
            // }
          }
          else {
            this.notif.error(response.errorMsg, '');
          }
        });
      }
    });
  }



  private updateUCCData(fileName) {
    const today=formatDate(new Date(), 'yyyyMMdd', 'en-US');
    this.fileTitle = 'UCI_MOD_' + today ;
   this.isSpining=true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          File: fileName,
          euser: this.currentUser.userCode,
          Type: this.type
        }],
      "requestId": "900053",
      "outTblCount": "0"
    }).then((response) => {
      if (response && response.errorCode == 0) {
        this.isSpining = false;
        let obj = [];
        obj = response.results[0]
        this.totalData = obj.length.toString();
        this.mockHeaders += this.totalData
        this.responseFile = response.results[0]
        // let responseData = this.responseFile.map(obj => {
        //   const newObj = {};
        //   for (let prop in obj) {
        //     if (obj[prop] === null) {
        //       newObj[prop] = '';
        //     } else {
        //       newObj[prop] = obj[prop];
        //     }
        //   }
        // })
        if(this.responseFile.length>0){
          this.setResponseArrayForUCC();
         // this.setHeaderAndUpdate(this.fileName,this.responseFile);;
        }else{
          this.notif.error('No Data Found', '')
        }
      } else {
        let errorMSG = response.errorMsg ? response.errorMsg : 'Something Went Wrong'
        this.notif.error(errorMSG, '')
        this.isSpining = false;
      }
    })
  }
  
   setResponseArrayForUCC(){
    const newArray = this.responseFile.filter((obj) => obj.nominee_opted == 2).map((obj,index)  => {
    return { 
      A1Segment: 'C', 
      A2TradeCode: obj.Tradecode?obj.Tradecode:"",
      A3Gender:obj.Sex ? obj.Sex : '',
      A4GuardianName:obj.MCXCode == '01' || obj.MCXCode == '02' || obj.MCXCode == '11' ?obj.SpouseName:obj.SpouseNameother,
      A5MaritalStatus:obj.MaritalStatus ? obj.MaritalStatus : '',
      A6Nationality:obj.ResCountry=="INDIA" ? '1':'2',
      A7NationalityOther:obj.ResCountry !="INDIA" ? obj.ResCountry:'',
      A8ClientEmail:obj.ResEmail ? obj.ResEmail :'',
      A9CorrespondanceAdd1:obj.RESADD1+' '+obj.RESADD2,
      A10CorrespondanceCity:obj.ResAdd3,
      A11CorrespondanceState:obj.StateCode,
      A12CorrespondanceStateOthers:obj.StateCode == 99 ? obj.ResState:'',
      A13CorrespondanceCountry:obj.CountryCode ? obj.CountryCode: '',
      A14CorrespondancePincode:obj.RESPIN ? obj.RESPIN:'',
      A15AddressFlag:obj.OffADD1 && obj.OffADD1 != obj.RESADD1 ? 'N':'Y',
      A16PermanentAdd1:obj.OffADD1 && obj.OffADD1 != obj.RESADD1 ?obj.OffADD1 + ' '+obj.offADD2:'',
      A17PermanentCity:obj.OffADD1 && obj.OffADD1 != obj.RESADD1 ?obj.OffADD3:'',
      A18PermanentState:obj.OffADD1 && obj.OffADD1 != obj.RESADD1 ?obj.OffStateCode:'',
      A19PermanentStateOthers:obj.OffADD1 && obj.OffADD1 != obj.RESADD1 && obj.OffStateCode == 99? obj.OffState:'',
      A20PermanentCountry:obj.OffADD1 && obj.OffADD1 != obj.RESADD1 ? obj.OffCountryCode:'',
      A21PermanentPincode:obj.OffADD1 && obj.OffADD1 != obj.RESADD1 ? obj.OffPin:'',
      A22ISDCodeRes:'',
      A23STDCodeRes:'',
      A24TelephoneNoRes:obj.RESPHONE1,
      A25MobileNumber:obj.MobilePhone,
      A26ISDCodeOff:'',
      A27STDCodeOff:'',
      A28TelephoneNoOff:'',
      A29DOB:formatDate(obj.DOB, 'dd-MMM-yyyy', 'en-US'),
      A30BankName:obj.BANKNAME,
      A31BranchAddress:obj.BRANCHADDRESS1 + ' ' + obj.BRANCHADDRESS2+' '+obj.BRANCHADDRESS3+' '+obj.BRANCHADDRESS4+' '+obj.BRANCHADDRESS5,
      A32BankAcNo:obj.BANKAC,
      A33DepositoryName1:obj.dpnamenew,
      A34DepositoryID1:obj.dpidnew,
      A35BeneficialOwnerAccountNo1:obj.dpacnonew,
      A36CIN:obj.CIN,
      A37grossAnnualIncomeRange:obj.ExactAnnualIncome == 0 ? '0':obj.ExactAnnualIncome <= 100000?'1':obj.ExactAnnualIncome <= 500000? '2':obj.ExactAnnualIncome <= 1000000?'3':obj.ExactAnnualIncome <= 2500000?'4':obj.ExactAnnualIncome <= 10000000?'5':'6',
      A38grossAnnualIncomeDate:obj.lastkycverified!=null && obj.lastkycverified!= '1900-01-01 00:00:00.0' && obj.ExactAnnualIncome > 0 ?formatDate(obj.lastkycverified, 'dd-MMM-yyyy', 'en-US'):'',
      A39netWorth:obj.netWorth,
      A40netWorthDate:obj.networthason!=null && obj.networthason!= '1900-01-01 00:00:00.0'? formatDate(obj.networthason, 'dd-MMM-yyyy', 'en-US'):'',
      A41PoliticallyExpo:'',
      A41Occupation:'',
      A42OccupationCode:obj.OccupationCode,
      A43OccupationDetails:obj.OccupationCode == 99?obj.Occupation:'',
      A44CPCode:'',
      A45UpdationFlag:obj.UpdationFlag == true ?'Y':'N',
      A46Relation:obj.RelationShip,
      A47facilityType:obj.TypeofFacility,
      A48ClientType:'',
      A49NameofContactPerson1:obj.ContactPerson1FirstName,
      A50DesignstionofContactPerson1:obj.ContactPerson1Designation != null ? obj.ContactPerson1Designation:'',
      A51PanOfContactPerson1:obj.ContactPerson1pan,
      A52AddressofContactPerson1:obj.ContactPerson1Add1,
      A53ContactDetailsofContactPerson1:obj.ContactPerson1Phonenum,
      A54DINCntactPerson1:obj.ContactPerson1_DIN,
      A55UIDCntactPerson1:"",
      A56EmailConatctPerson1:"",
      A57NameofContactPerson2:obj.ContactPerson2FirstName,
      A58DesignstionofContactPerson2:obj.ContactPerson2Designation != null ? obj.ContactPerson2Designation:'',
      A59PanOfContactPerson2:obj.ContactPerson2pan,
      A60AddressofContactPerson2:obj.ContactPerson2Add1,
      A61ContactDetailsofContactPerson2:obj.ContactPerson2Phonenum,
      A62DINCntactPerson2:obj.ContactPerson2_DIN,
      A63UIDCntactPerson2:"",
      A64EmailConatctPerson2:"",
      A65POAfunds:obj.POAFund? 'Y':'N',
      A66POASecurities:obj.POA ? 'Y':'N',
      A67CustodianName:obj.CUSTODIAN_NAME,
      A68CustodianPAN:obj.CUSTODIAN_PANNO,
      A69CustodianEmail:obj.CUSTODIAN_EMAIL,
      A70CorrespondanceCustodianAdd1:obj.CUSTODIAN_ADDRESS_LINE1,
      A71CorrespondanceCustodianCity:obj.CUSTODIAN_CITY,
      A72CorrespondanceCustodianState:obj.CUSTODIAN_STATE,
      A73CorrespondanceCustodianStateOthers:obj.CUSTODIAN_STATE_OTHERS,
      A74CorrespondanceCustodianCountry:obj.CUSTODIAN_COUNTRY,
      A75CorrespondanceCustodianPincode:obj.CUSTODIAN_PINCODE,
      A76CustodianMobile:obj.CUSTODIAN_MOBILENO,
      A77CustodianISDCode:obj.CUSTODIAN_OFF_ISDCODE,
      A78CustodianSTDCode:obj.CUSTODIAN_OFF_STDCODE,
      A79CustodianTelephoneNo:obj.CUSTODIAN_TELNO,
      A80NomineeOption:obj.nominee_opted,
      A81EOD:'E'

     }; 
  });
     //this.processArray(newArray)    
     this.setHeaderAndUpdate(this.fileName,newArray)  
      
  
    }

    private setHeaderAndUpdate(fileName, responseArray) {
      this.batchNo=''
      this.isSpining = true;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            cat: this.fileType
          }],
        "requestId": "900051",
        "outTblCount": "0"
      }).then((response) => {
        let obj = [];
        obj = response.results[0]
        if (obj[0].errorcode == 0) {
          this.totalData = this.type ==='NSDL-bulk file generation for PAN-Aadhaar seeding' ? responseArray.length.toString().padStart(5, '0'):responseArray.length.toString()
          this.mockHeaders = obj[0].header+this.totalData;
          this.batchNo = obj[0].batchNo
          this.isSpining=false;
          if(this.batchNo>0){
          this.download(responseArray,this.mockHeaders,this.batchNo);
          }
        
        }
        else {
          this.notif.error('You have exceeded todays Limit', '')

        }
      })
    }


  updateNCDEXData(fileName: any) {
    this.fileTitle = '01243_CLI_' + this.today
    this.isSpining = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          FDate: this.fromDate ? moment(this.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
          TDate: this.toDate ? moment(this.toDate).format(AppConfig.dateFormat.apiMoment) : '',
          Mode: 'U',
          Terminated: 'N',
          MobEmailAlertFlag: 'N',
          fileFlag: 'Y',
          FILENAME: fileName
        }],
      "requestId": "900054",
      "outTblCount": "0"
    }).then((response: any) => {
      this.isSpining = false;
      if (response && response.errorCode == 0) {
        this.ncdexResultSet = response.results[0]

        if (this.ncdexResultSet.length > 0) {
          this.mockHeaders += this.ncdexResultSet.length.toString()
          this.responseFile = response.results[0]
          this.setResponseArrayForNCDEX()
         // this.download(this.responseFile);
        } else {
          this.notif.error('No Data Found', '')
        }
      } else {
        let errorMsg = response.errorMsg ? response.errorMsg : 'Something Went Wrong';
        this.notif.error(errorMsg, '');
        this.isSpining = false;
      }
    })
  }
  setResponseArrayForNCDEX(){
  const newArray = this.responseFile.map(obj => {
  return { 
    A1RecordType: obj.RecordType?obj.RecordType:"", 
    A2CName: obj.CName?obj.CName:"",
    A3TradeCode:obj.TradeCode,
    A4Constitution:obj.Constitution,
    A5clientcategory:obj.clientcategory,
    A6EFE:obj.EFE?'Y':'N',
    A7LEINo:obj.LEINo!=null ?obj.LEINo:'',
    A8NameOfIndivOrKarta:obj.NameOfIndivOrKarta,
    A9Gender:obj.Gender!=null ? obj.Gender:'',
    A10MaritalStatus:obj.MaritalStatus!=null ? obj.MaritalStatus:'',
    A11Nationality:obj.Nationality!=null ? obj.Nationality:'',
    A12DOB:formatDate(obj.DOB, 'dd-MMM-yyyy', 'en-US'),
    A13CompletedAge:obj.CompletedAge == 0 ?'':obj.CompletedAge,
    A14ageProof:'',
    A15Mobile:obj.Mobile!=null?obj.Mobile:'',
    A16MobileRelation:obj.MobileRelation!=null?obj.MobileRelation:'',
    A17AuthorisedPerson:obj.AuthorisedPerson!=null?obj.AuthorisedPerson:'',
    A18EMail:obj.EMail!=null?obj.EMail:'',
    A19FATHERNAME:obj.FatherName !=null ? obj.FatherName:'',
    A20SpouseName:obj.SpouseName !=null ? obj.SpouseName:'',
    A21PanNo:obj.PanNo !=null ? obj.PanNo:'',
    A22PanDeclaration:'',
    A23UID:obj.UID!=null?obj.UID:'',
    A24DateOfCommencementOfBusiness:obj.DateOfCommencementOfBusiness!=null?obj.DateOfCommencementOfBusiness:'',
    A25Incorporation:obj.Incorporation!=null?obj.Incorporation:'',
    A26PASSPORT:obj.PassPort!=null?obj.PassPort:'',
    A27passportPlaceOfIssue:obj.PassPortPlaceOfIssue!=null?obj.PassPortPlaceOfIssue:'',
    A28passportdateOfIssue:obj.PassPortDateOfIssue!=null && obj.PassPortDateOfIssue!= '1899-12-30 00:00:00.0' && obj.PassPortPlaceOfIssue!=null && obj.PassPortPlaceOfIssue!=''? formatDate(obj.PassPortDateOfIssue, 'dd-MMM-yyyy', 'en-US'):'',
    A29passportdateOfExpiry:obj.PassPortDateOfExpiry!=null && obj.PassPortDateOfExpiry!='1899-12-30 00:00:00.0' && obj.PassPortPlaceOfIssue!=null && obj.PassPortPlaceOfIssue!='' ?formatDate(obj.PassPortDateOfExpiry, 'dd-MMM-yyyy', 'en-US'):'',
    A30DRIVINGLICENSE:obj.DrivingLicense!=null?obj.DrivingLicense:'',
    A31DRIVINgPlaceOfIssue:obj.DrivingPlaceOfIssue!=null?obj.DrivingPlaceOfIssue:'',
    A32DRIVINGdateOfIssue:obj.DrivingDateOfIssue!=null && obj.DrivingDateOfIssue!= '1899-12-30 00:00:00.0' && obj.DrivingPlaceOfIssue!=null && obj.DrivingPlaceOfIssue!=''?formatDate(obj.DrivingDateOfIssue, 'dd-MMM-yyyy', 'en-US'):'',
    A33VOTERSIDENTITYcard:obj.VotersIdentityCard!=null?obj.VotersIdentityCard:'',
    A34VOTERSIDENTITYPlaceOfIssue:obj.VotersIdentityPlaceOfIssue!=null?obj.VotersIdentityPlaceOfIssue:'',
    A35VOTERSIDENTITYdateOfIssue:obj.VotersIdentityDateOfIssue!=null && obj.VotersIdentityDateOfIssue!= '1899-12-30 00:00:00.0' && obj.VotersIdentityCard!=null && obj.VotersIdentityCard!='' ?formatDate(obj.VotersIdentityDateOfIssue, 'dd-MMM-yyyy', 'en-US'):'',
    A36OtherId:'',
    A37OtherIDIssueAuthority:'',
    A38OtherIDIssueDate:'',
    A39RegiStrationNo:obj.RegiStrationNo !=null?obj.RegiStrationNo:'',
    A40PlaceOfRegistration:obj.PlaceOfRegistration!=null ?obj.PlaceOfRegistration:'',
    A41DateofRegistration:obj.DateofRegistration !=null && obj.DateofRegistration !='1899-12-30 00:00:00.0'?formatDate(obj.DateOfRegistration, 'dd-MMM-yyyy', 'en-US'):"",
    A42RegisterAuthority:obj.RegisterAuthority!=null ?obj.RegisterAuthority:'',
    A43OfficeAdd1:obj.OfficeAdd1!=null?obj.OfficeAdd1:'',
    A44OfficeAdd2:obj.OfficeAdd2!=null?obj.OfficeAdd2:'',
    A45OfficeAdd3:obj.OfficeAdd3!=null?obj.OfficeAdd3:'',
    A46OfficeCity:obj.OfficeCity!=null?obj.OfficeCity:'',
    A47OfficeStateCode:obj.OfficeStateCode !=null ?obj.OfficeStateCode:'',
    A48OfficeCountry:obj.OfficeCountry!=null ?obj.OfficeCountry:'',
    A49OfficePin:obj.OfficePin!=null ?obj.OfficePin:'',
    A50OfficePhone:'',
    A51OfficeEmail:'',
    A52OfficeFax:'',
    A53CorrespondanceAdd1:obj.CorrespondanceAdd1!=null?obj.CorrespondanceAdd1:'',
    A54CorrespondanceAdd2:obj.CorrespondanceAdd2!=null?obj.CorrespondanceAdd2:'',
    A55CorrespondanceAdd3:obj.CorrespondanceAdd3!=null?obj.CorrespondanceAdd3:'',
    A56CorrespondanceCity:obj.CorrespondanceCity!=null?obj.CorrespondanceCity:'',
    A57CorrespondanceStateCodes:obj.CorrespondanceStateCodes!=null?obj.CorrespondanceStateCodes:'',
    A58CorrespondanceCountry:obj.CorrespondanceCountry!=null?obj.CorrespondanceCountry:'',
    A59CorrespondancePincode:obj.CorrespondancePincode!=null?obj.CorrespondancePincode:'',
    A60CorrespondancePhone:'',
    A61CorrespondanceEmail:obj.CorrespondanceEmail!=null?obj.CorrespondanceEmail:'',
    A62CorrespondanceFax:'',
    A63PermanentAdd1:obj.PermanentAdd1!=null?obj.PermanentAdd1:'',
    A64PermanentAdd2:obj.PermanentAdd2!=null?obj.PermanentAdd2:'',
    A65PermanentAdd3:obj.PermanentAdd3!=null?obj.PermanentAdd3:'',
    A66PermanentCity:obj.PermanentCity!=null?obj.PermanentCity:'',
    A67PermanentStateCodes:obj.PermanentStateCodes!=null?obj.PermanentStateCodes:'',//!=null?:''
    A68PermanentCountry:obj.PermanentCountry!=null?obj.PermanentCountry:'',
    A69PermanentPincode:obj.PermanentPincode!=null?obj.PermanentPincode:'',
    A70PermanentTelephone:'',
    A71PermananetMobile:'',
    A72PermanentEmail:obj.PermanentEmail !=null ? obj.PermanentEmail:'',
    A73PermanentFax:'',
    A74CorrespondanceAddressProofCode:obj.CorrespondanceAddressProofCode!=null?obj.CorrespondanceAddressProofCode:'',
    A75CorresProofDetails1:obj.CorresProofDetails1!=null?obj.CorresProofDetails1:'',
    A76CorresProofDetails2:obj.CorresProofDetails2!=null?obj.CorresProofDetails2:'',
    A77CorresProofDetails3:obj.CorresProofDetails3!=null?obj.CorresProofDetails3:'',
    A78CorresProofDetails4:obj.CorresProofDetails4 !=null?obj.CorresProofDetails4:'',
    A79CorresProofDetails5:obj.CorresProofDetails5!=null?obj.CorresProofDetails5:'',
    A80CorresProofDetails6:obj.CorresProofDetails6!=null?obj.CorresProofDetails6:'',
    A81OfficeAddressProofCode:obj.OfficeAddressProofCode!=null?obj.OfficeAddressProofCode:'',
    A82OfficeProofDetails1:obj.OfficeProofDetails1!=null?obj.OfficeProofDetails1:'',
    A83OfficeProofDetails2:obj.OfficeProofDetails2!=null?obj.OfficeProofDetails2:'',
    A84OfficeProofDetails3:obj.OfficeProofDetails3!=null?obj.OfficeProofDetails3:'',
    A85OfficeProofDetails4:obj.OfficeProofDetails4!=null?obj.OfficeProofDetails4:'',
    A86OfficeProofDetails5:obj.OfficeProofDetails5!=null?obj.OfficeProofDetails5:'',
    A87OfficeProofDetails6:obj.OfficeProofDetails6!=null?obj.OfficeProofDetails6:'',
    A88PermanentAddressProofCode:obj.PermanentAddressProofCode !=null?obj.PermanentAddressProofCode:'',
    A89PProofDetails1:obj.PProofDetails1!= null?obj.PProofDetails1:'',
    A90PProofDetails2:obj.PProofDetails2!= null?obj.PProofDetails2:'',
    A91PProofDetails3:obj.PProofDetails3!= null?obj.PProofDetails3:'',
    A92PProofDetails4:obj.PProofDetails4 != null?obj.PProofDetails4:'',
    A93PProofDetails5:obj.PProofDetails5 != null? obj.PProofDetails5 :'' ,
    A94PProofDetails6:obj.PProofDetails6!= null ?obj.PProofDetails6:'',
    A95NoOfBanks:obj.NoOfBanks!=null?obj.NoOfBanks:'',
    A96BankName:obj.BankName!=null?obj.BankName:'',
    A97BranchAddress1:obj.BranchAddress1!=null?obj.BranchAddress1:'',
    A98BanktypeCode:obj.BanktypeCode!=null?obj.BanktypeCode:'',
    A99BankAcNo:obj.BankAcNo!=null?obj.BankAcNo:'',
    A100BankMICR:obj.BankMICR!=null?obj.BankMICR:'',
    A101BankIFSC:obj.BankIFSC!=null?obj.BankIFSC:'',
    A102BankName2:obj.BankName2!=null?obj.BankName2:'',
    A103BranchAddress2:obj.BranchAddress2!=null?obj.BranchAddress2:'',
    A104BanktypeCode2:obj.BanktypeCode2!=null?obj.BanktypeCode2:'',
    A105BankAcNo2:obj.BankMICR2!=null?obj.BankMICR2:'',
    A106BankMICR2:obj.BankMICR2!=null?obj.BankMICR2:'',
    A107BankIFSC2:obj.BankIFSC2!=null?obj.BankIFSC2:'',
    A108BankName3:obj.BankName3!=null?obj.BankName3:'',
    A109BranchAddress3:obj.BranchAddress3!=null?obj.BranchAddress3:'',
    A110BanktypeCode3:obj.BanktypeCode3!=null?obj.BanktypeCode3:'',
    A111BankAcNo3:obj.BankAcNo3!=null?obj.BankAcNo3:'',
    A112BankMICR3:obj.BankMICR3!=null?obj.BankMICR3:'',
    A113BankIFSC3:obj.BankIFSC3!=null?obj.BankIFSC3:'',
    A114BankName4:obj.BankName4!=null?obj.BankName4:'',
    A115BranchAddress4:obj.BranchAddress4!=null?obj.BranchAddress4:'',
    A116BanktypeCode4:obj.BanktypeCode4!=null?obj.BanktypeCode4:'',
    A117BankAcNo4:obj.BankAcNo4!=null?obj.BankAcNo4:'',
    A118BankMICR4:obj.BankMICR4!=null?obj.BankMICR4:'',
    A119BankIFSC4:obj.BankIFSC4!=null?obj.BankIFSC4:'',
    A120DepositoryIDNSDL:'',
    A121DepositoryNameNSDL:'',
    A122BeneficialOwnerAccountNoNSDL:'',
    A123DepositoryParticipantNameNSDL:'',
    A124DepositoryIDCDSL:'',
    A125DepositoryNameCDSL:'',
    A126BeneficialOwnerAccountNoCDSL:'',
    A127DepositoryParticipantNameCDSL:'',
    A128DIN:'',
    A129DPIN:'',
    A130IncomeAsOn:obj.IncomeAsOn!=null?obj.IncomeAsOn:'',
    A131AnnualIncomeCode:obj.AnnualIncomeCode!=null?obj.AnnualIncomeCode:'',
    A132NetWorthDate:obj.NetWorthDate!=null?obj.NetWorthDate:'',
    A133NetWorth:obj.NetWorth!=null?parseInt(obj.NetWorth).toFixed(parseInt(obj.NetWorth) % 1 !== 0 ? 2 : 0):'',
    A134PoliticallyExpo:obj.PoliticallyExpo,
    A135CpCode:'',
    A136IPV:obj.IPV == true?'Y':'N',
    A137NomineeFlag:obj.NomineeFlag == true?'Y':'N',
    A138NomineeName:'',
    A139DetailRecordStatus:obj.DetailRecordStatus,
    A140AnyotherTm:'',
    A141NoOfPartners:obj.NoOfPartners !=null? obj.NoOfPartners:'',
    A142CIN:obj.CIN!=null?obj.CIN:'',
    A143DesignstionofContactPerson:obj.PersonDesignation != null ? obj.PersonDesignation:'',
    A144NameOfKarta:obj.NameOfKarta != null ? obj.NameOfKarta:'',
    A145DeleteFlag:obj.DeleteFlag!= null ?obj.DeleteFlag:'',
    A146EOD:'E'

   };



});
const allowedFileSize = 199; // maximum number of data per file
const numFiles = Math.ceil(newArray.length / allowedFileSize ); // calculate number of files needed
for (let i = 0; i < numFiles; i++) {
  const newFile =newArray.slice(i * allowedFileSize , (i + 1) * allowedFileSize ); // get current chunk of data

   this.setHeaderAndUpdate(this.fileName,newFile)  
}
    

  }


  processArray(array: any) {
    const elementsToProcess = [];
    for (let i = 0; i < array.length; i += 199) {
      elementsToProcess.push("array",array[i]);
      if (elementsToProcess.length == 199) {
        this.setHeaderAndUpdate(this.fileName,elementsToProcess);
                elementsToProcess.length = 0;
      }
    }
        if (elementsToProcess.length > 0 && elementsToProcess.length < 200 ) {
          this.setHeaderAndUpdate(this.fileName,elementsToProcess);
    }
    
    // for (let j = elementsToProcess.length; j < array.length; j++) {
    //   this.download([array[j]]);
    // }
  }
  updateNCDEXPASData(fileName: any) {
    //this.today=formatDate(new Date(), 'yyyyMMdd', 'en-US');
    this.fileTitle = '01243_UPDATEPAN_' + this.today;
    this.generatedFileType='CSV'
    this.isSpining = true;
    this.dataServ.getResultArray({

      "batchStatus": "false",
      "detailArray":
        [{
          filename: fileName,
          euser: this.currentUser.userCode
        }],
      "requestId": "900049",
      "outTblCount": "0"

    }).then((response) => {
      this.isSpining = false;
      if (response && response.errorCode == 0) {
        let obj = [];
        obj = response.results[0]
        // this.totalData = obj.length.toString().padStart(5, '0');
        this.mockHeaders += this.totalData
        this.responseFile = response.results[0]
        this.responseFile.forEach(element => {
          element.PanAdharChar = element.PanAdharChar? 'Y':'N'
          
        });
        // this.setHeaderAndUpdate(this.fileName,this.responseFile);
        this.download(this.responseFile,'',1)
      } else {
        let errorMSG = response.errorMsg ? response.errorMsg : 'Something Went Wrong'
        this.notif.error(errorMSG, '')
        this.isSpining = false;
      }

    })
  }


  updateUNFData(fileName: any) {
    this.today=formatDate(new Date(), 'yyyyMMdd', 'en-US');
    this.fileTitle = 'UNF_' + this.today
    this.isSpining = true;
    this.dataServ.getResultArray({

      "batchStatus": "false",
      "detailArray":
        [{
          filename: fileName,
          Flag: 'U',
          euser: this.currentUser.userCode
        }],
      "requestId": "900050",
      "outTblCount": "0"

    }).then((response) => {
      this.isSpining = false;
      if (response && response.errorCode == 0) {
        let obj = [];
        obj = response.results[0]
        this.totalData = obj.length.toString().padStart(5, '0');
        this.mockHeaders += this.totalData
        this.responseFile = response.results[0]
         this.setHeaderAndUpdate(this.fileName,this.responseFile);
      } else {
        let errorMSG = response.errorMsg ? response.errorMsg : 'Something Went Wrong'
        this.notif.error(errorMSG, '')
        this.isSpining = false;
      }

    })
  }
 
  fetchBSENomineeData(fileName) {
    const today=formatDate(new Date(), 'yyyyMMdd', 'en-US');
    this.fileTitle = 'BSE_NOM_' + today ;
   this.isSpining=true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          FromDate: this.fromDate && !this.isFileSelected ? moment(this.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
          ToDate: this.toDate  && !this.isFileSelected? moment(this.toDate).format(AppConfig.dateFormat.apiMoment) : '',
          Flag:this.isFileSelected ? 'F':'D',
          filename:this.isFileSelected?fileName:'',
          euser: this.currentUser ? this.currentUser.userCode : ''
        }],
      "requestId": "900059",
      "outTblCount": "0"
    }).then((response) => {
      if (response && response.errorCode == 0) {
        this.isSpining = false;
        let obj = [];
        obj = response.results[0]
        //this.totalData = obj.length.toString();
       //this.mockHeaders += this.totalData
        this.responseFile = response.results[0]
        if(this.responseFile.length>0){
          this.responseFile.forEach(element=>{
            element.ActiveFlag = element.ActiveFlag ? 'Y':'N'
          })
          this.download(this.responseFile,'BSE_Nominee',1);
          //this.setHeaderAndUpdate(this.fileName,this.responseFile);;
        }else{
          this.notif.error('No Data Found', '')
        }
      } else {
        let errorMSG = response.errorMsg ? response.errorMsg : 'Something Went Wrong'
        this.notif.error(errorMSG, '')
        this.isSpining = false;
      }
    })
  }

  BSEBankUpdation(fileName){
    this.today=formatDate(new Date(), 'yyyyMMdd', 'en-US');
    this.fileTitle = 'BSEBankUpdationFile_' + this.today
    this.isSpining = true;
    this.dataServ.getResultArray({

      "batchStatus": "false",
      "detailArray":
        [{
          filename: fileName,
          FromDate: this.fromDate && !this.isFileSelected ? moment(this.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
          ToDate: this.toDate  && !this.isFileSelected? moment(this.toDate).format(AppConfig.dateFormat.apiMoment) : '',
          euser: this.currentUser.userCode
        }],
      "requestId": "900061",
      "outTblCount": "0"

    }).then((response) => {
      this.isSpining = false;
      if (response && response.errorCode == 0) {
        this.isSpining = false;
        let obj = [];
        obj = response.results[0]
        this.responseFile = response.results[0]
        this.generateTextFile(this.responseFile,this.fileTitle);
        console.log(response.results[1][0].Note)
        if(response.results.length > 1){
          this.notif.error(response.results[1][0].Note,'')
        }
      } else {
        let errorMSG = response.errorMsg ? response.errorMsg : 'Something Went Wrong'
        this.notif.error(errorMSG, '')
        this.isSpining = false;
      }

    })
  }

  convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += this.generatedFileType=='CSV'? ',':'|';
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  formatToCsvData(originalData) {
    const jsonObject = JSON.stringify(originalData);
    const data = this.convertToCSV(jsonObject);
    this.mockCsvData =this.generatedFileType =='CSV'||this.bseNominee? data+'\n': this.mockHeaders + '\n' + data;
  }

  download(response,mockHeaders,batchNo) {
     if(batchNo > 0 || this.generatedFileType == 'CSV' || this.bseNominee){
    this.formatToCsvData(response);
    const exportedFilenmae = this.generatedFileType == 'CSV' || this.bseNominee? this.fileTitle +'.csv': this.fileTitle + '.T' + batchNo;
    const blob = new Blob([this.mockCsvData], {
      // type: 'text/csv;charset=utf-8;',
    });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      const link = document.createElement('a');

      if (link.download !== undefined) {

        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);

        link.setAttribute('download', exportedFilenmae);

        link.style.visibility = 'hidden';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      }
    }
  }
    
  }

  generateTextFile(array: any[], fileName: string) {
   var textToWrite =''
   if(array.length>0)
   { 
    array.forEach(element => {
      textToWrite += element.FinalResult +'\n'
    });
    const blob = new Blob([textToWrite], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);

    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }else{
    this.notif.error("No file to generate",'')
  }
  }

  reset() {
    this.file = '';
    this.responseFile = [];
    this.mockCsvData = '';
    this.mockHeaders = '';
    this.batchNo ='';
    this.generatedFileType='PSV'

  }

  
  disabledFutureDate = (current: Date): boolean => {
    return ( differenceInCalendarDays(current, this._today) > 0)
  };

  disabledToDate = (current: Date): boolean => {
    var today:Date = new Date();
    if(this.fromDate){
    return (differenceInCalendarDays(current, this.fromDate) < 0 || differenceInCalendarDays(current, this._today) > 0)
    }else{
      return (differenceInCalendarDays(current, today) < 0 || differenceInCalendarDays(current, this._today) > 0)
    }
  };

  resetMiscellenious(){
    this.file=null;
    this.fromDate=null;
    this.toDate=null;
    this.uploadedFileType =''
    this.isFileSelected=false;
    this.getUploadTypes();
    }

    fileClosedEvent(event:any){
    if (event.type === 'removed') {
        this.file=[];
        this.fileName='';
        this.isFileSelected= false
        this.uploadedFileType=''
      }
    }
}
