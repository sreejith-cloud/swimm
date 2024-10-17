import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, DataService, FormHandlerComponent, User, UtilService } from 'shared';
import { AppConfig } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions } from "shared";
import * as moment from 'moment';
import { educationqualificationmodel } from './educationalqualificationtable';
import { industryqualificationmodel } from './industryqualificationtable';
import { experiencedetailsmodel } from './experiencedetailstable';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

export interface franchiseestaff {
  empcode: any;
  loccode: any;
  locname: any;
  gender: any;
  rollno: any;
  designation: any;
  name: any;
  fathername: any;
  pan: any;
  joindate: Date;
  dob: any;
  resadd1: any;
  resadd2: any;
  resadd3: any;
  resadd4: any;
  rescity: any;
  resstate: any;
  respin: any;
  resemail: any;
  resmobile: any;
  reslandline: any;
  curadd1: any;
  curadd2: any;
  curadd3: any;
  curadd4: any;
  curcity: any;
  curstate: any;
  curpin: any;
  curemail: any;
  curmobile: any;
  curlandline: any;
  remarks: any;
  edu: any;
  ind: any;
  capital: any;
  ter: any;
  terdate: any;
  termode: any;
  terreason: any;
  terrem: any;
  pfmembership: any;
  esimembership: any;
  salary: any;
  pfamount: any;
  esiamount: any;
  emprollcode: any;
  kycname: any;
  kycflag: any;
  basicamount: any;
  hraamount: any;
  otherallownc: any;

}

@Component({
  selector: 'app-franchiseestaffcontrol',
  templateUrl: './franchiseestaffcontrol.component.html',
  styleUrls: ['./franchiseestaffcontrol.component.less']
})
export class FranchiseestaffcontrolComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  model: franchiseestaff
  currentUser: User;
  locationFindOpt: FindOptions;
  empcodeFindOpt: FindOptions;
  tablerow: any = [];
  tablecontent: any = [];
  totqty: any;
  tablerow2: any = [];
  tablecontent2: any = [];
  totqty2: any;
  detailstablerow: any = [];
  detailstablecontent: any = [];
  detailstotqty: any;
  activeTabIndex: number = 0;
  isSpinningVisible: boolean = false;
  responsearray: any = [];
  responsearray1: any = [];
  responsearray2: any = [];
  responsearray3: any = [];
  responsearray4: any = [];
  empcodearray: any = [];
  empcodearray1: any = [];
  empheader: any = [];
  showstatus: boolean = false;
  disablebutton: boolean = true;
  disableapprovebtn: boolean = true;
  disabletersavebtn: boolean = false;
  disablefinalizebtn: boolean = true;
  viewLocation: boolean = false;
  disablepdfbtn: boolean = true;
  disableinput: boolean = false;
  disableplusbtn: boolean = false;
  disableupdatebtn: boolean = true;
  enableupdatebtn: boolean = false;
  currentdate = new Date();

  approved: boolean = false;
  hoapproved: boolean = false;
  hoverified: boolean = false;
  terminated: boolean = false;
  terminationapproved: boolean = false;

  age: any;
  dob: any;
  cdate: any;
  empname: any;
  emprollno: any;
  savemessage: boolean = false;
  finalisemessage: boolean = false;
  terminationmsg: boolean = false;
  locCode: any

  constructor(private dataServ: DataService, private notification: NzNotificationService, private authServ: AuthService, private utilServ: UtilService) {
    this.model = <franchiseestaff>{
    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.locationFindOpt = {
      findType: 6026,
      // findType: 6162,
      codeColumn: 'Location',
      codeLabel: '',
      descColumn: 'Description',
      descLabel: '',
      hasDescInput: true,
      requestId: 8,
      whereClause: '1=1'
    }

    this.empcodeFindOpt = {
      findType: 6159,
      codeColumn: 'Empcode',
      codeLabel: '',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: true,
      requestId: 8,
      whereClause: '1=1'
    }
  }

  ngOnInit() {

    this.hoapproved = true;
    this.formHdlr.config.showCancelBtn = true;
    this.formHdlr.config.disableSaveBtn = true;
    this.formHdlr.config.showFindBtn = true;

    this.disablebutton = true;
    this.disablefinalizebtn = true;
    this.disablepdfbtn = true;
    this.disabletersavebtn = false;
    this.disableinput = true;
    this.disableupdatebtn = true;
    this.enableupdatebtn = true;

    this.model.terdate = new Date();
    this.tablecontent = new educationqualificationmodel();
    this.tablerow.push(new educationqualificationmodel());
    this.tablecontent2 = new industryqualificationmodel();
    this.tablerow2.push(new industryqualificationmodel());
    this.detailstablecontent = new experiencedetailsmodel();
    this.detailstablerow.push(new experiencedetailsmodel());
    this.activeTabIndex = 0;


    if (!((this.dataServ.branch == 'HO') || (this.dataServ.branch == 'HOGT'))) {

      this.model.loccode = { Location: this.dataServ.branch, Description: this.dataServ.branchDesc }
      this.viewLocation = true;
      this.getLocationData(this.model.loccode);
      this.disableapprovebtn = true;
    }
    else {
      this.disableapprovebtn = false;
    }

    this.getDataOfempCodeArray()

  }

  getLocationData(data) {

    if (data == null) {
      return
    }

    if (!((this.dataServ.branch == 'HO') || (this.dataServ.branch == 'HOGT'))) {
      this.locationFindOpt = {
        // findType: 6162,
        findType: 6026,
        codeColumn: 'Location',
        codeLabel: '',
        descColumn: 'Description',
        descLabel: '',
        hasDescInput: true,
        requestId: 8,
        whereClause: "Location ='" + data.Location + "'"
      }

      this.empcodeFindOpt = {
        findType: 6159,
        codeColumn: 'Empcode',
        codeLabel: '',
        descColumn: 'Name',
        descLabel: '',
        hasDescInput: true,
        requestId: 8,
        whereClause: "f.Location ='" + data.Location + "'"
      }
    }
    else {
      this.locationFindOpt = {
        // findType: 6162,
        findType: 6026,
        codeColumn: 'Location',
        codeLabel: '',
        descColumn: 'Description',
        descLabel: '',
        hasDescInput: true,
        requestId: 8,
        whereClause: '1=1'
      }
      this.empcodeFindOpt = {
        findType: 6159,
        codeColumn: 'Empcode',
        codeLabel: '',
        descColumn: 'Name',
        descLabel: '',
        hasDescInput: true,
        requestId: 8,
        whereClause: '1=1'
      }

    }
  }

  disabledFutureDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, new Date()) > 0)
  };

  onChange(result: Date): void { }

  qtySum(last) {
    var qty = 0;
    var i = 0;
    while (i < last + 1) {
      qty = qty + this.tablerow[i].Qty
      i++
    }
    this.totqty = qty;
  }

  Addrow() {
    this.tablecontent = new educationqualificationmodel();
    this.tablerow.push(new educationqualificationmodel())
  }

  delete(index) {
    if (this.tablerow.length > 1) {
      this.tablerow.splice(index, 1);
      this.qtySum(this.tablerow.length - 1)
    }
  }

  qtySum2(last) {
    var qty2 = 0;
    var i = 0;
    while (i < last + 1) {
      qty2 = qty2 + this.tablerow2[i].Qty2
      i++
    }
    this.totqty2 = qty2;
  }

  Addrow2() {
    this.tablecontent2 = new industryqualificationmodel();
    this.tablerow2.push(new industryqualificationmodel())
  }

  delete2(index) {
    if (this.tablerow2.length > 1) {
      this.tablerow2.splice(index, 1);
      this.qtySum2(this.tablerow2.length - 1)
    }
  }

  qtySum3(last) {
    var qty3 = 0;
    var i = 0;
    while (i < last + 1) {
      qty3 = qty3 + this.detailstablerow[i].Qty3
      // this.tablerow[i].Qty = value[i].Qty ? value[i].Qty : ''
      i++
    }
    this.detailstotqty = qty3;
  }

  Addrow3() {
    this.detailstablecontent = new experiencedetailsmodel();
    this.detailstablerow.push(new experiencedetailsmodel())
  }

  delete3(index) {
    if (this.detailstablerow.length > 1) {
      this.detailstablerow.splice(index, 1);
      this.qtySum3(this.detailstablerow.length - 1)
    }
  }

  namevalidation(val) {
    var key = val.key
    var CharOnly = /^[A-Z a-z]+$/;
    if (!key.match(CharOnly)) {
      return false
    }
  }

  numberValidate(val) {
    var inp = String.fromCharCode(val.keyCode);
    if (/^[0-9]+$/.test(inp)) {
      return true;
    } else {
      val.preventDefault();
      return false;
    }
  }

  // emailValidate(val) {
  //   var inp = String.fromCharCode(val.keyCode);
  //   if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(inp)) {
  //     return true;
  //   } else {
  //     val.preventDefault();
  //     return false;
  //   }
  // }

  amountValidate(val) {
    var inp = String.fromCharCode(val.keyCode);
    if (/^[0-9.,]+$/.test(inp)) {
      return true;
    } else {
      val.preventDefault();
      return false;
    }
  }

  ValidatePan(val) {

    var charonly = /^[A-Za-z]+$/
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

  ValidatePFaccount(val) {

    var charonly = /^[A-Za-z]+$/
    var numonly = /^[0-9]+$/
    var fullstring = val.currentTarget.value
    var text = val.key

    if (val.target.selectionStart <= 4) {
      return charonly.test(text)
    }
    else if (val.target.selectionStart > 4 && val.target.selectionStart <= 21) {
      return numonly.test(text)
    }

    else if (fullstring.length > 21) {
      return false;
    }
  }


  ValidateEmpCode(val) {

    var charonly = /^[A-Za-z]+$/
    var numonly = /^[0-9]+$/
    var fullstring = val.currentTarget.value
    var text = val.key

    if (val.target.selectionStart <= 1) {
      return charonly.test(text)
    }
    else if (val.target.selectionStart > 1 && val.target.selectionStart <= 7) {
      return numonly.test(text)
    }

    else if (fullstring.length > 9) {
      return false;
    }
  }


  addressbtn() {

    this.model.curadd1 = this.model.resadd1;
    this.model.curadd2 = this.model.resadd2;
    this.model.curadd3 = this.model.resadd3;
    this.model.curadd4 = this.model.resadd4;
    this.model.curcity = this.model.rescity;
    this.model.curstate = this.model.resstate;
    this.model.curpin = this.model.respin;
    this.model.curemail = this.model.resemail;
    this.model.curmobile = this.model.resmobile;
    this.model.curlandline = this.model.reslandline;
  }

  adddetails() {

    this.formHdlr.config.disableSaveBtn = false;
    this.disableinput = false;
    this.disabletersavebtn = true;
    this.disableapprovebtn = true;
  }

  updatebtn() {
    this.disableinput = false;
    this.disableupdatebtn = false;
  }

  viewdetails(data) {

    this.showstatus = false;
    this.tablerow.splice(0)
    this.tablerow.push(new educationqualificationmodel())
    this.tablerow2.splice(0)
    this.tablerow2.push(new industryqualificationmodel())
    this.detailstablerow.splice(0)
    this.detailstablerow.push(new experiencedetailsmodel())

    this.isSpinningVisible = true;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Empcode: data.Empcode ? data.Empcode : '',
          Euser: this.currentUser.userCode,
          Flag: 'V',
        }],
      "requestId": "200096",
      "outTblCount": "0"
    }).then((response) => {

      this.activeTabIndex = 0
      this.isSpinningVisible = false;
      this.disablepdfbtn = true;
      this.responsearray = this.utilServ.convertToObject(response[0])
      this.responsearray1 = this.utilServ.convertToObject(response[1])
      this.responsearray2 = this.utilServ.convertToObject(response[2])
      this.responsearray3 = this.utilServ.convertToObject(response[3])
      this.responsearray4 = this.utilServ.convertToObject(response[4])

      console.log('responsearray4',this.responsearray4);
      console.log('responsearray',this.responsearray);
      this.responsearray.forEach(item => {
        if (item.GeojitKYCFlag == true) {
          item.GeojitKYCFlag = 'Y'
        }
        else {
          item.GeojitKYCFlag = 'N'
        }
      })

      this.formHdlr.config.disableSaveBtn = true;
      this.disableinput = true;

      // Approved mesages from BO
      this.approved = this.responsearray[0].Approved;
      this.hoapproved = this.responsearray[0].HOApproved;
      this.hoverified = this.responsearray[0].HOVerified;
      this.terminated = this.responsearray[0].Terminated;

      this.disableplusbtn = true;
      // this.enableupdatebtn = false;
      this.disableupdatebtn = true;
      this.disablefinalizebtn = this.responsearray[0].Approved
      // this.disablefinalizebtn = true;
      this.enableupdatebtn = this.responsearray[0].Approved;
      this.disablepdfbtn = this.responsearray[0].Approved;
      this.disablepdfbtn == false ? this.disablepdfbtn = true : this.disablepdfbtn = false;
      this.model.empcode = this.responsearray[0].Empcode;
      this.model.name = this.responsearray[0].Name;
      this.model.rollno = this.responsearray[0].Rollno;
      this.model.joindate = this.responsearray[0].DateOfJoin;
      this.model.gender = this.responsearray[0].Gender;
      this.model.fathername = this.responsearray[0].Father_name;
      this.model.pan = this.responsearray[0].PAN;
      this.model.dob = this.responsearray[0].DOB;
      this.model.loccode = { "Location": this.responsearray[0].Location, "Description": this.responsearray[0].locname };
      this.model.designation = this.responsearray[0].Designation;
      this.model.emprollcode = this.responsearray[0].EmployeeRollCode;
      this.model.kycflag = this.responsearray[0].GeojitKYCFlag;
      this.model.kycname = this.responsearray[0].GeojitKYCName;
      this.model.pfmembership = this.responsearray[0].Pf_Acno;
      this.model.esimembership = this.responsearray[0].Esi_acno;
      this.model.salary = this.responsearray[0].TotalSalaryPaid;
      this.model.otherallownc = this.responsearray[0].OtherAllowancesAmount;
      this.model.hraamount = this.responsearray[0].HRAAmount;
      this.model.basicamount = this.responsearray[0].BasicAmount;
      this.model.esiamount = this.responsearray[0].Esi_amount;
      this.model.pfamount = this.responsearray[0].Pf_amount;

      this.model.resadd1 = this.responsearray[0].ResAdd1;
      this.model.resadd2 = this.responsearray[0].ResAdd2;
      this.model.resadd3 = this.responsearray[0].ResAdd3;
      this.model.resadd4 = this.responsearray[0].ResAdd4;
      this.model.rescity = this.responsearray[0].Rescity;
      this.model.resstate = this.responsearray[0].Resstate;
      this.model.respin = this.responsearray[0].ResPIN;
      this.model.resemail = this.responsearray[0].ResEmail;
      this.model.resmobile = this.responsearray[0].ResMobile;
      this.model.reslandline = this.responsearray[0].ResLandLine;

      this.model.curadd1 = this.responsearray[0].CurAdd1;
      this.model.curadd2 = this.responsearray[0].CurAdd2;
      this.model.curadd3 = this.responsearray[0].CurAdd3;
      this.model.curadd4 = this.responsearray[0].CurAdd4;
      this.model.curcity = this.responsearray[0].Curcity;
      this.model.curstate = this.responsearray[0].Curstate;
      this.model.curpin = this.responsearray[0].CurPIN;
      this.model.curemail = this.responsearray[0].CurEmail;
      this.model.curmobile = this.responsearray[0].CurMobile;
      this.model.curlandline = this.responsearray[0].CurLandLine;
      this.model.remarks = this.responsearray[0].Remark;

      for (let i = 0; i < this.responsearray1.length; i++) {
        this.tablerow[i].educationalQualification = this.responsearray1[i].Qualification;
        this.tablerow[i].educationalInstitution = this.responsearray1[i].Institution;;
        this.tablerow[i].educationalPercentage = this.responsearray1[i].Percentage;
        this.tablerow[i].educationalYearofPassing = String(this.responsearray1[i].YearOfPassing);
        this.tablerow[i].educationalRemarks = this.responsearray1[i].Remarks;
        if (i != this.responsearray1.length - 1) {
          this.Addrow()
        }
      }

      for (let i = 0; i < this.responsearray2.length; i++) {
        this.tablerow2[i].industryQualification = this.responsearray2[i].Qualification;
        this.tablerow2[i].industryInstitution = this.responsearray2[i].Institution;;
        this.tablerow2[i].industryPercentage = this.responsearray2[i].Percentage;
        this.tablerow2[i].industryYearofPassing = String(this.responsearray2[i].YearOfPassing);
        this.tablerow2[i].industryRemarks = this.responsearray2[i].Remarks;
        if (i != this.responsearray2.length - 1) {
          this.Addrow2()
        }
      }

      for (let i = 0; i < this.responsearray3.length; i++) {
        this.detailstablerow[i].fromYeartoYear = this.responsearray3[i].Period;
        this.detailstablerow[i].Firm = this.responsearray3[i].FirmName;
        this.detailstablerow[i].designation = this.responsearray3[i].Designation;
        this.detailstablerow[i].remarks = this.responsearray3[i].Remarks;
        if (i != this.responsearray3.length - 1) {
          this.Addrow3()
        }
      }
      if(this.responsearray4.length > 0){
      this.model.terdate = this.responsearray4[0].DateOfTermination;
      this.model.termode = this.responsearray4[0].ModeofTer;
      this.model.terreason = this.responsearray4[0].Reason;
      this.model.terrem = this.responsearray4[0].Remarks;
      this.terminationapproved = this.responsearray4[0].Approved;
      this.disabletersavebtn = this.responsearray4[0].Approved;
      this.disableapprovebtn = this.responsearray4[0].Approved;
      this.model.ter = 'Y';
    }
    else{
      this.model.terdate = new Date();
      this.model.termode = null;
      this.model.terreason = '';
      this.model.terrem = '';
      this.terminationapproved = false;
      this.disabletersavebtn = false;
      this.disableapprovebtn = false;
      this.model.ter = null;
    }
    })

  }

  save() {

    let validation: boolean
    validation = this.validate()
    if (!validation) {
      return
    }
    this.disabletersavebtn = true;

    this.model.edu = ''
    this.tablerow.forEach(item => {
      this.model.edu = this.model.edu + '<REC>' + '<FLD>' + item.educationalQualification + '</FLD>' + '<FLD>' + item.educationalInstitution + '</FLD>'
        + '<FLD>' + item.educationalPercentage + '</FLD>' + '<FLD>' + moment(item.educationalYearofPassing).format('YYYY') + '</FLD>' +
        '<FLD>' + item.educationalRemarks + '</FLD>' + '</REC>'
    })


    this.tablerow2.forEach(item => {
      let item1 = item.industryQualification
      let item2 = item.industryInstitution
      let item3 = item.industryPercentage
      let item4 = moment(item.industryYearofPassing).format('YYYY')
      let item5 = item.industryRemarks

      if (item1 == '' && item2 == '' && item3 == '' && item4 == 'Invalid date' && item5 == '') {
        this.model.ind = null
      }

      else {
        this.model.ind = ''
        this.tablerow2.forEach(item => {
          this.model.ind = this.model.ind + '<REC>' + '<FLD>' + item.industryQualification + '</FLD>' + '<FLD>' + item.industryInstitution + '</FLD>'
            + '<FLD>' + item.industryPercentage + '</FLD>' + '<FLD>' + moment(item.industryYearofPassing).format('YYYY') + '</FLD>' +
            '<FLD>' + item.industryRemarks + '</FLD>' + '</REC>'
        })
      }
    })

    this.detailstablerow.forEach(item => {
      let item1 = item.fromYeartoYear
      let item2 = item.Firm
      let item3 = item.designation
      let item4 = item.remarks

      if (item1 == '' && item2 == '' && item3 == '' && item4 == '') {
        this.model.capital = null
      }

      else {
        this.model.capital = ''
        this.detailstablerow.forEach(item => {
          this.model.capital = this.model.capital + '<REC>' + '<FLD>' + item.fromYeartoYear + '</FLD>' + '<FLD>' + item.Firm + '</FLD>'
            + '<FLD>' + item.designation + '</FLD>' +
            '<FLD>' + item.remarks + '</FLD>' + '</REC>'
        })
      }

    })

    if (this.model.ter == "N") {
      this.model.terdate = null;
    }

    this.isSpinningVisible = true;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          ModuleID: 0,
          Flag: 'A',
          IP: '',
          Guser: this.currentUser.userCode,
          Empcode: '',
          Loccode: this.model.loccode.Location ? this.model.loccode.Location : '',
          LocName: this.model.loccode.Description ? this.model.loccode.Description : '',
          Gender: this.model.gender ? this.model.gender : '',
          RollNo: this.model.rollno ? this.model.rollno : '',
          Designation: this.model.designation ? this.model.designation : '',
          Name: this.model.name ? this.model.name : '',
          FatherName: this.model.fathername ? this.model.fathername : '',
          PAN: this.model.pan ? this.model.pan : '',
          JoinDate: this.model.joindate ? moment(this.model.joindate).format(AppConfig.dateFormat.apiMoment) : '',
          DOB: this.model.dob ? moment(this.model.dob).format(AppConfig.dateFormat.apiMoment) : '',
          ResAdd1: this.model.resadd1 ? this.model.resadd1 : '',
          ResAdd2: this.model.resadd2 ? this.model.resadd2 : '',
          ResAdd3: this.model.resadd3 ? this.model.resadd3 : '',
          ResAdd4: this.model.resadd4 ? this.model.resadd4 : '',
          Rescity: this.model.rescity ? this.model.rescity : '',
          Resstate: this.model.resstate ? this.model.resstate : '',
          ResPIN: this.model.respin ? this.model.respin : '',
          ResEmail: this.model.resemail ? this.model.resemail : '',
          ResMobile: this.model.resmobile ? this.model.resmobile : '',
          ResLandLine: this.model.reslandline ? this.model.reslandline : '',
          CurAdd1: this.model.curadd1 ? this.model.curadd1 : '',
          CurAdd2: this.model.curadd2 ? this.model.curadd2 : '',
          CurAdd3: this.model.curadd3 ? this.model.curadd3 : '',
          CurAdd4: this.model.curadd4 ? this.model.curadd4 : '',
          Curcity: this.model.curcity ? this.model.curcity : '',
          Curstate: this.model.curstate ? this.model.curstate : '',
          CurPIN: this.model.curpin ? this.model.curpin : '',
          CurEmail: this.model.curemail ? this.model.curemail : '',
          CurMobile: this.model.curmobile ? this.model.curmobile : '',
          CurLandLine: this.model.curlandline ? this.model.curlandline : '',
          Remarks: this.model.remarks ? this.model.remarks : '',
          Edu: this.model.edu ? this.model.edu : '',
          Ind: this.model.ind ? this.model.ind : '',
          Capital: this.model.capital ? this.model.capital : '',
          Ter: this.model.ter ? this.model.ter : '',
          TerDate: this.model.terdate ? moment(this.model.terdate).format(AppConfig.dateFormat.apiMoment) : '',
          TerMode: this.model.termode ? this.model.termode : '',
          TerReason: this.model.terreason ? this.model.terreason : '',
          TerRem: this.model.terrem ? this.model.terrem : '',
          PFmembership: this.model.pfmembership ? this.model.pfmembership : '',
          ESImembership: this.model.esimembership ? this.model.esimembership : '',
          TotalSalary: this.model.salary ? this.model.salary : '',
          PFAmount: this.model.pfamount ? this.model.pfamount : '',
          ESIAmount: this.model.esiamount ? this.model.esiamount : '',
          EmpRollCode: this.model.emprollcode ? this.model.emprollcode : '',
          KYCName: this.model.kycname ? this.model.kycname : ' ',
          KYCFlag: this.model.kycflag ? this.model.kycflag : '',
          BasicAmt: this.model.basicamount ? this.model.basicamount : 0,
          HRAAmt: this.model.hraamount ? this.model.hraamount : 0,
          OtherAllownc: this.model.otherallownc ? this.model.otherallownc : 0,
        }],
      "requestId": "700170",
      "outTblCount": "0"
    }).then((response) => {

      this.responsearray = this.utilServ.convertToObject(response[0])
      this.isSpinningVisible = false;

      if (response[1]) {

        let successArray = this.utilServ.convertToObject(response[1]);
        if (successArray[0].Status == 1) {
          this.isSpinningVisible = false;
          this.notification.success(successArray[0].Msg, '')
          this.model.empcode = successArray[0].Employeecode;
          this.disablebutton = true;
          this.formHdlr.config.disableSaveBtn = true;
          this.disablefinalizebtn = false;
          this.disablepdfbtn = false;
          this.savemessage = true;
          // approved messages from BO
          this.approved = this.responsearray[0].Approved;
          this.hoapproved = this.responsearray[0].HOApproved;
          this.hoverified = this.responsearray[0].HOVerified;
          this.terminated = this.responsearray[0].Terminated;

        }

      }

      else if (this.responsearray[0].Status == 0) {
        this.isSpinningVisible = false;
        this.notification.error(this.responsearray[0].Msg, '')
      }

      else if (this.responsearray[0].Status == 5) {
        this.isSpinningVisible = false;
        this.notification.error(this.responsearray[0].Msg, '')
      }

      else {

        this.isSpinningVisible = false;
        this.notification.error('Franchisee Staff Data Not Saved', '')
      }

    })
  }

  update() {

    // this.disableinput = false;

    let validation: boolean
    validation = this.validate()
    if (!validation) {
      return
    }

    this.model.edu = ''
    this.tablerow.forEach(item => {
      this.model.edu = this.model.edu + '<REC>' + '<FLD>' + item.educationalQualification + '</FLD>' + '<FLD>' + item.educationalInstitution + '</FLD>'
        + '<FLD>' + item.educationalPercentage + '</FLD>' + '<FLD>' + moment(item.educationalYearofPassing).format('YYYY') + '</FLD>' +
        '<FLD>' + item.educationalRemarks + '</FLD>' + '</REC>'
    })

    this.tablerow2.forEach(item => {
      let item1 = item.industryQualification
      let item2 = item.industryInstitution
      let item3 = item.industryPercentage
      let item4 = moment(item.industryYearofPassing).format('YYYY')
      let item5 = item.industryRemarks

      if (item1 == '' && item2 == '' && item3 == '' && item4 == 'Invalid date' && item5 == '') {
        this.model.ind = null
      }

      else {
        this.model.ind = ''
        this.tablerow2.forEach(item => {
          this.model.ind = this.model.ind + '<REC>' + '<FLD>' + item.industryQualification + '</FLD>' + '<FLD>' + item.industryInstitution + '</FLD>'
            + '<FLD>' + item.industryPercentage + '</FLD>' + '<FLD>' + moment(item.industryYearofPassing).format('YYYY') + '</FLD>' +
            '<FLD>' + item.industryRemarks + '</FLD>' + '</REC>'
        })
      }
    })

    this.detailstablerow.forEach(item => {
      let item1 = item.fromYeartoYear
      let item2 = item.Firm
      let item3 = item.designation
      let item4 = item.remarks

      if (item1 == '' && item2 == '' && item3 == '' && item4 == '') {
        this.model.capital = null
      }

      else {
        this.model.capital = ''
        this.detailstablerow.forEach(item => {
          this.model.capital = this.model.capital + '<REC>' + '<FLD>' + item.fromYeartoYear + '</FLD>' + '<FLD>' + item.Firm + '</FLD>'
            + '<FLD>' + item.designation + '</FLD>' +
            '<FLD>' + item.remarks + '</FLD>' + '</REC>'
        })
      }
    })

    this.isSpinningVisible = true;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          ModuleID: 0,
          Flag: 'U',
          IP: '',
          Guser: this.currentUser.userCode,
          Empcode: this.model.empcode ? this.model.empcode : '',
          Loccode: this.model.loccode.Location ? this.model.loccode.Location : '',
          LocName: this.model.loccode.Description ? this.model.loccode.Description : '',
          Gender: this.model.gender ? this.model.gender : '',
          RollNo: this.model.rollno ? this.model.rollno : '',
          Designation: this.model.designation ? this.model.designation : '',
          Name: this.model.name ? this.model.name : '',
          FatherName: this.model.fathername ? this.model.fathername : '',
          PAN: this.model.pan ? this.model.pan : '',
          JoinDate: this.model.joindate ? moment(this.model.joindate).format(AppConfig.dateFormat.apiMoment) : '',
          DOB: this.model.dob ? moment(this.model.dob).format(AppConfig.dateFormat.apiMoment) : '',
          ResAdd1: this.model.resadd1 ? this.model.resadd1 : '',
          ResAdd2: this.model.resadd2 ? this.model.resadd2 : '',
          ResAdd3: this.model.resadd3 ? this.model.resadd3 : '',
          ResAdd4: this.model.resadd4 ? this.model.resadd4 : '',
          Rescity: this.model.rescity ? this.model.rescity : '',
          Resstate: this.model.resstate ? this.model.resstate : '',
          ResPIN: this.model.respin ? this.model.respin : '',
          ResEmail: this.model.resemail ? this.model.resemail : '',
          ResMobile: this.model.resmobile ? this.model.resmobile : '',
          ResLandLine: this.model.reslandline ? this.model.reslandline : '',
          CurAdd1: this.model.curadd1 ? this.model.curadd1 : '',
          CurAdd2: this.model.curadd2 ? this.model.curadd2 : '',
          CurAdd3: this.model.curadd3 ? this.model.curadd3 : '',
          CurAdd4: this.model.curadd4 ? this.model.curadd4 : '',
          Curcity: this.model.curcity ? this.model.curcity : '',
          Curstate: this.model.curstate ? this.model.curstate : '',
          CurPIN: this.model.curpin ? this.model.curpin : '',
          CurEmail: this.model.curemail ? this.model.curemail : '',
          CurMobile: this.model.curmobile ? this.model.curmobile : '',
          CurLandLine: this.model.curlandline ? this.model.curlandline : '',
          Remarks: this.model.remarks ? this.model.remarks : '',
          Edu: this.model.edu ? this.model.edu : ' ',
          Ind: this.model.ind ? this.model.ind : ' ',
          Capital: this.model.capital ? this.model.capital : ' ',
          Ter: this.model.ter ? this.model.ter : '',
          TerDate: this.model.terdate ? moment(this.model.terdate).format(AppConfig.dateFormat.apiMoment) : '',
          TerMode: this.model.termode ? this.model.termode : '',
          TerReason: this.model.terreason ? this.model.terreason : '',
          TerRem: this.model.terrem ? this.model.terrem : '',
          PFmembership: this.model.pfmembership ? this.model.pfmembership : '',
          ESImembership: this.model.esimembership ? this.model.esimembership : '',
          TotalSalary: this.model.salary ? this.model.salary : '',
          PFAmount: this.model.pfamount ? this.model.pfamount : '',
          ESIAmount: this.model.esiamount ? this.model.esiamount : '',
          EmpRollCode: this.model.emprollcode ? this.model.emprollcode : '',
          KYCName: this.model.kycname ? this.model.kycname : '',
          KYCFlag: this.model.kycflag ? this.model.kycflag : '',
          BasicAmt: this.model.basicamount ? this.model.basicamount : 0,
          HRAAmt: this.model.hraamount ? this.model.hraamount : 0,
          OtherAllownc: this.model.otherallownc ? this.model.otherallownc : 0,
        }],
      "requestId": "700170",
      "outTblCount": "0"
    }).then((response) => {

      this.responsearray = this.utilServ.convertToObject(response[0])
      this.isSpinningVisible = false;

      if (this.responsearray[0].Status == 2) {
        this.isSpinningVisible = false;
        this.disableupdatebtn = false;

        this.disablefinalizebtn = false;
        this.disablepdfbtn = true;
        this.notification.success(this.responsearray[0].Msg, '')
        this.model.empcode = this.responsearray[0].Employeecode;
        this.disablebutton = false;
        this.enableupdatebtn = true;
        // this.disablefinalizebtn == true ? this.disablefinalizebtn = 'Y' : this.disablefinalizebtn = 'N';

      }
      else if (this.responsearray[0].Status == 5) {
        this.isSpinningVisible = false;
        this.notification.error(this.responsearray[0].Msg, '')
      }

      else if (this.responsearray[0].Status == 0) {
        this.isSpinningVisible = false;
        this.notification.error(this.responsearray[0].Msg, '')
      }

      else {

        this.isSpinningVisible = false;
        this.notification.error('Data Not Updtated', '')
      }
    })
  }

  finalize() {
    let validation: boolean
    validation = this.validate()
    if (!validation) {
      return
    }

    this.isSpinningVisible = true;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          ModuleID: 0,
          Flag: 'F',
          IP: '',
          Guser: this.currentUser.userCode,
          Empcode: this.model.empcode ? this.model.empcode : '',
          Loccode: this.model.loccode.Location ? this.model.loccode.Location : '',
          LocName: this.model.loccode.Description ? this.model.loccode.Description : '',
          Gender: this.model.gender ? this.model.gender : '',
          RollNo: this.model.rollno ? this.model.rollno : '',
          Designation: this.model.designation ? this.model.designation : '',
          Name: this.model.name ? this.model.name : '',
          FatherName: this.model.fathername ? this.model.fathername : '',
          PAN: this.model.pan ? this.model.pan : '',
          JoinDate: this.model.joindate ? moment(this.model.joindate).format(AppConfig.dateFormat.apiMoment) : '',
          DOB: this.model.dob ? moment(this.model.dob).format(AppConfig.dateFormat.apiMoment) : '',
          ResAdd1: this.model.resadd1 ? this.model.resadd1 : '',
          ResAdd2: this.model.resadd2 ? this.model.resadd2 : '',
          ResAdd3: this.model.resadd3 ? this.model.resadd3 : '',
          ResAdd4: this.model.resadd4 ? this.model.resadd4 : '',
          Rescity: this.model.rescity ? this.model.rescity : '',
          Resstate: this.model.resstate ? this.model.resstate : '',
          ResPIN: this.model.respin ? this.model.respin : '',
          ResEmail: this.model.resemail ? this.model.resemail : '',
          ResMobile: this.model.resmobile ? this.model.resmobile : '',
          ResLandLine: this.model.reslandline ? this.model.reslandline : '',
          CurAdd1: this.model.curadd1 ? this.model.curadd1 : '',
          CurAdd2: this.model.curadd2 ? this.model.curadd2 : '',
          CurAdd3: this.model.curadd3 ? this.model.curadd3 : '',
          CurAdd4: this.model.curadd4 ? this.model.curadd4 : '',
          Curcity: this.model.curcity ? this.model.curcity : '',
          Curstate: this.model.curstate ? this.model.curstate : '',
          CurPIN: this.model.curpin ? this.model.curpin : '',
          CurEmail: this.model.curemail ? this.model.curemail : '',
          CurMobile: this.model.curmobile ? this.model.curmobile : '',
          CurLandLine: this.model.curlandline ? this.model.curlandline : '',
          Remarks: this.model.remarks ? this.model.remarks : '',
          Edu: this.model.edu ? this.model.edu : '',
          Ind: this.model.ind ? this.model.ind : '',
          Capital: this.model.capital ? this.model.capital : '',
          Ter: this.model.ter ? this.model.ter : '',
          TerDate: this.model.terdate ? moment(this.model.terdate).format(AppConfig.dateFormat.apiMoment) : '',
          TerMode: this.model.termode ? this.model.termode : '',
          TerReason: this.model.terreason ? this.model.terreason : '',
          TerRem: this.model.terrem ? this.model.terrem : '',
          PFmembership: this.model.pfmembership ? this.model.pfmembership : '',
          ESImembership: this.model.esimembership ? this.model.esimembership : '',
          TotalSalary: this.model.salary ? this.model.salary : '',
          PFAmount: this.model.pfamount ? this.model.pfamount : '',
          ESIAmount: this.model.esiamount ? this.model.esiamount : '',
          EmpRollCode: this.model.emprollcode ? this.model.emprollcode : '',
          KYCName: this.model.kycname ? this.model.kycname : '',
          KYCFlag: this.model.kycflag ? this.model.kycflag : '',
          BasicAmt: this.model.basicamount ? this.model.basicamount : 0,
          HRAAmt: this.model.hraamount ? this.model.hraamount : 0,
          OtherAllownc: this.model.otherallownc ? this.model.otherallownc : 0,
        }],
      "requestId": "700170",
      "outTblCount": "0"
    }).then((response) => {
      this.responsearray = this.utilServ.convertToObject(response[0])
      this.isSpinningVisible = false;

      if (this.responsearray[0].Status == 3) {
        this.isSpinningVisible = false;
        this.disablefinalizebtn = true;
        this.disableupdatebtn = true;
        this.disablebutton = false;
        this.disableinput = true;
        this.finalisemessage = true;
        this.savemessage = false;
        this.disablepdfbtn = false;
        // approved messages from BO
        this.approved = this.responsearray[0].Approved;
        this.hoapproved = this.responsearray[0].HOApproved;
        this.hoverified = this.responsearray[0].HOVerified;
        this.terminated = this.responsearray[0].Terminated;

        this.notification.success(this.responsearray[0].Msg, '')
        let empcode = {'Empcode': this.model.empcode}
        this.viewdetails(empcode)
      }
      else if (this.responsearray[0].Status == 5) {
        this.isSpinningVisible = false;
        this.notification.error(this.responsearray[0].Msg, '')
      }

      else if (this.responsearray[0].Status == 0) {
        this.isSpinningVisible = false;
        this.notification.error(this.responsearray[0].Msg, '')
      }

      else {
        this.isSpinningVisible = false;
        this.notification.error('Data Not Finalized', '')
      }

    })
  }

  validate() {

    this.dob = moment(this.model.dob).format('YYYY');
    this.cdate = moment(this.currentdate).format('YYYY');
    this.age = this.cdate - this.dob;

    if (!this.model.loccode) { this.notification.error('Please Select a Location', ''); return false }
    else if (!this.model.name) { this.notification.error('Please enter Name', ''); return false }
    else if (!this.model.rollno) { this.notification.error('Please enter Roll No', ''); return false }
    else if (!this.model.pan) { this.notification.error('Please enter PAN NO', ''); return false }
    else if (this.model.pan.length != 10) { this.notification.error('PAN No should be 10 in length', ''); return false }
    else if (!this.model.designation) { this.notification.error('Please select a Designation', ''); return false }
    else if (!this.model.joindate) { this.notification.error('Please choose a Join Date', ''); return false }
    else if (!this.model.dob) { this.notification.error('Please choose Date of Birth', ''); return false }
    else if (this.age < 18) { this.notification.error('Minimum Age must be above 18', ''); return false }
    else if (!this.model.gender) { this.notification.error('Please choose a Gender ', ''); return false }
    else if (!this.model.fathername) { this.notification.error('Please enter Father Name', ''); return false }
    // else if (!this.model.pfmembership) { this.notification.error('Please enter PF Account No', ''); return false }
    // else if (this.model.pfmembership.length != 22) { this.notification.error('PF Account No should be 22 in length', ''); return false }
    else if (!this.model.pfamount) { this.notification.error('Please enter PF Amount', ''); return false }
    // else if (!this.model.esimembership) { this.notification.error('Please enter ESI Account No', ''); return false }
    // else if (this.model.esimembership.length != 17) { this.notification.error('ESI Account No should be 17 in length', ''); return false }
    else if (!this.model.esiamount) { this.notification.error('Please enter ESI Amount ', ''); return false }
    else if (!this.model.salary) { this.notification.error('Please enter Total Salary Paid', ''); return false }

    else if (!this.model.resadd1) { this.notification.error('Please enter Residential Address 1', ''); return false }
    else if (!this.model.resadd2) { this.notification.error('Please enter Residential Address 2', ''); return false }
    else if (!this.model.resadd3) { this.notification.error('Please enter Residential Address 3', ''); return false }
    else if (!this.model.resadd4) { this.notification.error('Please enter Residential Address 4', ''); return false }
    else if (!this.model.rescity) { this.notification.error('Please enter Residential City', ''); return false }
    else if (!this.model.resstate) { this.notification.error('Please enter Residential State', ''); return false }
    else if (!this.model.respin) { this.notification.error('Please enter Residential PIN Code', ''); return false }
    else if (this.model.respin.length != 6) { this.notification.error('Invalid PIN Code', ''); return false }
    else if (!this.model.resemail) { this.notification.error('Please enter your Email', ''); return false }
    else if (!this.model.resmobile) { this.notification.error('Please enter Residential Mobile No', ''); return false }
    else if (this.model.resmobile.length != 10) { this.notification.error('Invalid Mobile Number', ''); return false }

    else if (!this.model.curadd1) { this.notification.error('Please enter Correspondance Address 1', ''); return false }
    else if (!this.model.curadd2) { this.notification.error('Please enter Correspondance Address 2', ''); return false }
    else if (!this.model.curadd3) { this.notification.error('Please enter Correspondance Address 3', ''); return false }
    else if (!this.model.curadd4) { this.notification.error('Please enter Correspondance Address 4', ''); return false }
    else if (!this.model.curcity) { this.notification.error('Please enter City', ''); return false }
    else if (!this.model.curstate) { this.notification.error('Please enter State', ''); return false }
    else if (!this.model.curpin) { this.notification.error('Please enter PIN Code', ''); return false }
    else if (this.model.curpin.length != 6) { this.notification.error('Invalid PIN Code', ''); return false }
    else if (!this.model.curemail) { this.notification.error('Please enter your Email', ''); return }
    else if (!this.model.curmobile) { this.notification.error('Please enter Residential Mobile No', ''); return false }
    else if (this.model.curmobile.length != 10) { this.notification.error('Invalid Mobile Number', ''); return false }

    for (let i = 0; i < this.tablerow.length; i++) {
      if (this.tablerow[i].educationalQualification == '') {
        this.activeTabIndex = 1
        this.notification.error('Please enter your Educational Qualification', '');
        return false
      }
      else if (this.tablerow[i].educationalInstitution == '') {
        this.notification.error('Please enter your Educational Institution', '');
        return false
      }
      else if (this.tablerow[i].educationalPercentage == '') {
        this.notification.error('Please enter Your Percentage(%)', '');
        return false
      }
      else if (this.tablerow[i].educationalPercentage <= 0) {
        this.notification.error('Enter correct Percentage', '');
        return false
      }
      else if (this.tablerow[i].educationalYearofPassing == '') {
        this.notification.error('Please enter your Year of Passing', '');
        return false
      }

    }

    return true;
  }

  getDataOfempCodeArray() {

    this.isSpinningVisible = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
          loc: this.model.loccode ? this.model.loccode.Location : '',
        }],
      "requestId": "200098",
      "outTblCount": "0"
    }).then((response) => {

      this.isSpinningVisible = false;

      if (response[0].rows.length == 0) {
        this.isSpinningVisible = false;
      }
      else {
        this.isSpinningVisible = false;
        this.empcodearray = this.utilServ.convertToObject(response[0]);
        this.empheader = Object.keys(this.empcodearray[0])
        this.empcodearray1 = this.empcodearray
      }
    })
  }

  modal() {
    this.showstatus = true;
    this.enableupdatebtn = true;
  }

  modalvalues(data1, data2) {
    if (data2 == '') {
      this.empcodearray1 = this.empcodearray;
    }
    else {
      this.empcodearray1 = this.empcodearray.filter(data => data[data1].toLowerCase().includes(data2.toLowerCase()))
    }
  }

  handleOk()
  {
    this.showstatus = false;
    this.empname = '';
    this.emprollno = '';
    this.empcodearray1 = this.empcodearray;
  }
  handleCancel() {
    this.showstatus = false;
    this.empname = '';
    this.emprollno = '';
    this.model.empcode = null;
    this.empcodearray1 = this.empcodearray;
  }

  savetermination() {

    if (!this.model.loccode || !this.model.name || !this.model.rollno || !this.model.pan || !this.model.designation ||
      !this.model.joindate || !this.model.dob || !this.model.gender || !this.model.fathername || !this.model.pfamount ||
      !this.model.esiamount || !this.model.salary || !this.model.resadd1 || !this.model.resadd2 || !this.model.resadd3 ||
      !this.model.resadd4 || !this.model.rescity || !this.model.resstate || !this.model.respin || !this.model.resemail ||
      !this.model.resmobile || !this.model.curadd1 || !this.model.curadd2 || !this.model.curadd3 || !this.model.curadd4 ||
      !this.model.curcity || !this.model.curstate || !this.model.curpin || !this.model.curemail || !this.model.curmobile) { this.notification.error('Please fill the Employee Details', ''); return }

    for (let i = 0; i < this.tablerow.length; i++) {
      if (this.tablerow[i].educationalQualification == '' || this.tablerow[i].educationalInstitution == '' ||
        this.tablerow[i].educationalPercentage == '' || this.tablerow[i].educationalYearofPassing == '') {
        this.notification.error('Please fill the Employee Details', '');
        return false
      }
    }

    if (!this.model.ter) { this.notification.error('Please Select Termination', ''); return }
    if (this.model.ter == "N") { this.notification.error('Please Select Termination "Y" ', ''); return }
    if (!this.model.terdate) { this.notification.error('Please choose Date of Termination', ''); return }
    if (!this.model.termode) { this.notification.error('Please Select Mode of Termination', ''); return }
    if (!this.model.terreason) { this.notification.error('Please enter a Reason for Termination', ''); return }
    // this.activeTabIndex = 0;

    this.isSpinningVisible = true;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          ModuleID: 0,
          Flag: 'T',
          IP: '',
          Guser: this.currentUser.userCode,
          Empcode: this.model.empcode ? this.model.empcode : '',
          Loccode: this.model.loccode.Location ? this.model.loccode.Location : '',
          LocName: this.model.loccode.Description ? this.model.loccode.Description : '',
          Gender: this.model.gender ? this.model.gender : '',
          RollNo: this.model.rollno ? this.model.rollno : '',
          Designation: this.model.designation ? this.model.designation : '',
          Name: this.model.name ? this.model.name : '',
          FatherName: this.model.fathername ? this.model.fathername : '',
          PAN: this.model.pan ? this.model.pan : '',
          JoinDate: this.model.joindate ? moment(this.model.joindate).format(AppConfig.dateFormat.apiMoment) : '',
          DOB: this.model.dob ? moment(this.model.dob).format(AppConfig.dateFormat.apiMoment) : '',
          ResAdd1: this.model.resadd1 ? this.model.resadd1 : '',
          ResAdd2: this.model.resadd2 ? this.model.resadd2 : '',
          ResAdd3: this.model.resadd3 ? this.model.resadd3 : '',
          ResAdd4: this.model.resadd4 ? this.model.resadd4 : '',
          Rescity: this.model.rescity ? this.model.rescity : '',
          Resstate: this.model.resstate ? this.model.resstate : '',
          ResPIN: this.model.respin ? this.model.respin : '',
          ResEmail: this.model.resemail ? this.model.resemail : '',
          ResMobile: this.model.resmobile ? this.model.resmobile : '',
          ResLandLine: this.model.reslandline ? this.model.reslandline : '',
          CurAdd1: this.model.curadd1 ? this.model.curadd1 : '',
          CurAdd2: this.model.curadd2 ? this.model.curadd2 : '',
          CurAdd3: this.model.curadd3 ? this.model.curadd3 : '',
          CurAdd4: this.model.curadd4 ? this.model.curadd4 : '',
          Curcity: this.model.curcity ? this.model.curcity : '',
          Curstate: this.model.curstate ? this.model.curstate : '',
          CurPIN: this.model.curpin ? this.model.curpin : '',
          CurEmail: this.model.curemail ? this.model.curemail : '',
          CurMobile: this.model.curmobile ? this.model.curmobile : '',
          CurLandLine: this.model.curlandline ? this.model.curlandline : '',
          Remarks: this.model.remarks ? this.model.remarks : '',
          Edu: this.model.edu ? this.model.edu : '',
          Ind: this.model.ind ? this.model.ind : '',
          Capital: this.model.capital ? this.model.capital : '',
          Ter: this.model.ter ? this.model.ter : '',
          TerDate: this.model.terdate ? moment(this.model.terdate).format(AppConfig.dateFormat.apiMoment) : '',
          TerMode: this.model.termode ? this.model.termode : '',
          TerReason: this.model.terreason ? this.model.terreason : '',
          TerRem: this.model.terrem ? this.model.terrem : '',
          PFmembership: this.model.pfmembership ? this.model.pfmembership : '',
          ESImembership: this.model.esimembership ? this.model.esimembership : '',
          TotalSalary: this.model.salary ? this.model.salary : '',
          PFAmount: this.model.pfamount ? this.model.pfamount : '',
          ESIAmount: this.model.esiamount ? this.model.esiamount : '',
          EmpRollCode: this.model.emprollcode ? this.model.emprollcode : '',
          KYCName: this.model.kycname ? this.model.kycname : '',
          KYCFlag: this.model.kycflag ? this.model.kycflag : '',
          BasicAmt: this.model.basicamount ? this.model.basicamount : '',
          HRAAmt: this.model.hraamount ? this.model.hraamount : '',
          OtherAllownc: this.model.otherallownc ? this.model.otherallownc : '',
        }],
      "requestId": "700170",
      "outTblCount": "0"
    }).then((response) => {

      // console.log(response)
      this.isSpinningVisible = false;
      if (response[0]) {
        this.responsearray = this.utilServ.convertToObject(response[0])
        // console.log(response.errorCode);

        if (this.responsearray[0].Status == 4) {
          this.isSpinningVisible = false;
          this.notification.success(this.responsearray[0].Msg, '')
          this.disableapprovebtn = false;
          this.disabletersavebtn = true;
          this.terminationmsg = true;
          this.savemessage = false;
          this.finalisemessage = false;
          this.disableupdatebtn = true;
          // approved messages from BO
          this.approved = this.responsearray[0].Approved;
          this.hoapproved = this.responsearray[0].HOApproved;
          this.hoverified = this.responsearray[0].HOVerified;
          this.terminated = this.responsearray[0].Terminated;

        }
        else if (this.responsearray[0].Status == 0) {
          this.isSpinningVisible = false;
          this.notification.error(response[0].Msg, '')
        }
      }

      else if (response.errorCode == 1) {
        this.isSpinningVisible = false;
        this.notification.error('Franchisee Staff Termination already saved', '')
      }

      else {
        this.isSpinningVisible = false;
        this.notification.error('Franchisee Staff Termination Saved Failed', '')
      }

    })
  }

  approvetermination() {

    if (!this.model.loccode || !this.model.name || !this.model.rollno || !this.model.pan || !this.model.designation ||
      !this.model.joindate || !this.model.dob || !this.model.gender || !this.model.fathername || !this.model.pfamount ||
      !this.model.esiamount || !this.model.salary || !this.model.resadd1 || !this.model.resadd2 || !this.model.resadd3 ||
      !this.model.resadd4 || !this.model.rescity || !this.model.resstate || !this.model.respin || !this.model.resemail ||
      !this.model.resmobile || !this.model.curadd1 || !this.model.curadd2 || !this.model.curadd3 || !this.model.curadd4 ||
      !this.model.curcity || !this.model.curstate || !this.model.curpin || !this.model.curemail || !this.model.curmobile) { this.notification.error('Please fill the Employee Details', ''); return }

    for (let i = 0; i < this.tablerow.length; i++) {
      if (this.tablerow[i].educationalQualification == '' || this.tablerow[i].educationalInstitution == '' ||
        this.tablerow[i].educationalPercentage == '' || this.tablerow[i].educationalYearofPassing == '') {
        this.notification.error('Please fill the Employee Details', '');
        return false
      }
    }

    if (!this.model.ter) { this.notification.error('Please Select Termination', ''); return }
    if (this.model.ter == "N") { this.notification.error('Please Select Termination "Y" ', ''); return }
    if (!this.model.terdate) { this.notification.error('Please choose Date of Termination', ''); return }
    if (!this.model.termode) { this.notification.error('Please Select Mode of Termination', ''); return }
    if (!this.model.terreason) { this.notification.error('Please enter a Reason for Termination', ''); return }
    this.disabletersavebtn = true;
    this.isSpinningVisible = true;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          ModuleID: 0,
          Flag: 'TA',
          IP: '',
          Guser: this.currentUser.userCode,
          Empcode: this.model.empcode ? this.model.empcode : '',
          Loccode: this.model.loccode.Location ? this.model.loccode.Location : '',
          LocName: this.model.loccode.Description ? this.model.loccode.Description : '',
          Gender: this.model.gender ? this.model.gender : '',
          RollNo: this.model.rollno ? this.model.rollno : '',
          Designation: this.model.designation ? this.model.designation : '',
          Name: this.model.name ? this.model.name : '',
          FatherName: this.model.fathername ? this.model.fathername : '',
          PAN: this.model.pan ? this.model.pan : '',
          JoinDate: this.model.joindate ? moment(this.model.joindate).format(AppConfig.dateFormat.apiMoment) : '',
          DOB: this.model.dob ? moment(this.model.dob).format(AppConfig.dateFormat.apiMoment) : '',
          ResAdd1: this.model.resadd1 ? this.model.resadd1 : '',
          ResAdd2: this.model.resadd2 ? this.model.resadd2 : '',
          ResAdd3: this.model.resadd3 ? this.model.resadd3 : '',
          ResAdd4: this.model.resadd4 ? this.model.resadd4 : '',
          Rescity: this.model.rescity ? this.model.rescity : '',
          Resstate: this.model.resstate ? this.model.resstate : '',
          ResPIN: this.model.respin ? this.model.respin : '',
          ResEmail: this.model.resemail ? this.model.resemail : '',
          ResMobile: this.model.resmobile ? this.model.resmobile : '',
          ResLandLine: this.model.reslandline ? this.model.reslandline : '',
          CurAdd1: this.model.curadd1 ? this.model.curadd1 : '',
          CurAdd2: this.model.curadd2 ? this.model.curadd2 : '',
          CurAdd3: this.model.curadd3 ? this.model.curadd3 : '',
          CurAdd4: this.model.curadd4 ? this.model.curadd4 : '',
          Curcity: this.model.curcity ? this.model.curcity : '',
          Curstate: this.model.curstate ? this.model.curstate : '',
          CurPIN: this.model.curpin ? this.model.curpin : '',
          CurEmail: this.model.curemail ? this.model.curemail : '',
          CurMobile: this.model.curmobile ? this.model.curmobile : '',
          CurLandLine: this.model.curlandline ? this.model.curlandline : '',
          Remarks: this.model.remarks ? this.model.remarks : '',
          Edu: this.model.edu ? this.model.edu : '',
          Ind: this.model.ind ? this.model.ind : '',
          Capital: this.model.capital ? this.model.capital : '',
          Ter: this.model.ter ? this.model.ter : '',
          TerDate: this.model.terdate ? moment(this.model.terdate).format(AppConfig.dateFormat.apiMoment) : '',
          TerMode: this.model.termode ? this.model.termode : '',
          TerReason: this.model.terreason ? this.model.terreason : '',
          TerRem: this.model.terrem ? this.model.terrem : '',
          PFmembership: this.model.pfmembership ? this.model.pfmembership : '',
          ESImembership: this.model.esimembership ? this.model.esimembership : '',
          TotalSalary: this.model.salary ? this.model.salary : '',
          PFAmount: this.model.pfamount ? this.model.pfamount : '',
          ESIAmount: this.model.esiamount ? this.model.esiamount : '',
          EmpRollCode: this.model.emprollcode ? this.model.emprollcode : '',
          KYCName: this.model.kycname ? this.model.kycname : '',
          KYCFlag: this.model.kycflag ? this.model.kycflag : '',
          BasicAmt: this.model.basicamount ? this.model.basicamount : '',
          HRAAmt: this.model.hraamount ? this.model.hraamount : '',
          OtherAllownc: this.model.otherallownc ? this.model.otherallownc : '',
        }],
      "requestId": "700170",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinningVisible = false;
      this.responsearray = this.utilServ.convertToObject(response[0])

      if (this.responsearray[0].Status == 4) {
        this.isSpinningVisible = false;
        this.notification.success(this.responsearray[0].Msg, '')
        this.disableapprovebtn = true;
        this.terminationmsg = false;

      }
      else {
        this.isSpinningVisible = false;
        this.notification.error('Franchisee Staff Termination Approval Failed', '')
      }
    })
  }

  pdf() {


    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          Empcode: this.model.empcode ? this.model.empcode : ' ',
          Euser: this.currentUser.userCode,
          Flag: 'P',
        }],
      "requestId": "200096",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "2";
    reqParams['fileOptions'] = { 'pageSize': 'A3' };
    let isPreview: boolean;
    isPreview = false;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {

      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.notification.error('No data Found', '');
        this.isSpinningVisible = false;
        return;
      }
      else {
        if (!isPreview) {
          // this.notification.success('File downloaded successfully', '');
          this.isSpinningVisible = false;
          return;
        }
      }
    }, () => {
      this.isSpinningVisible = false;
      this.notification.error("Server encountered an Error", '');
    });

  }

  reset() {

    if (this.viewLocation == false) {
      this.model.loccode = ''
    }
    if (!((this.dataServ.branch == 'HO') || (this.dataServ.branch == 'HOGT'))) {
      this.disableapprovebtn = false;
    }
    this.approved = null;
    this.hoapproved = null;
    this.hoverified = null;
    this.empcodearray1 = this.empcodearray;

    this.formHdlr.config.disableSaveBtn = true;
    this.disablefinalizebtn = true;
    this.disablepdfbtn = true;
    this.savemessage = false;
    this.finalisemessage = false;
    this.terminationmsg = false;
    this.enableupdatebtn = true;
    this.model.joindate = null;
    this.model.dob = null;
    this.disableinput = true;
    this.disabletersavebtn = false;
    this.disableapprovebtn = true;
    this.disableplusbtn = false;
    this.disableupdatebtn = true;
    this.activeTabIndex = 0;
    this.model.empcode = null;
    this.model.gender = null;
    this.model.rollno = '';
    this.model.designation = null;
    this.model.emprollcode = null;
    this.model.name = '';
    this.model.fathername = '';
    this.model.pan = '';
    this.model.kycflag = null;
    this.model.kycname = '';
    this.model.pfmembership = '';
    this.model.pfamount = '';
    this.model.esimembership = '';
    this.model.esiamount = '';
    this.model.basicamount = '';
    this.model.hraamount = '';
    this.model.otherallownc = '';
    this.model.salary = '';
    this.model.resadd1 = '';
    this.model.resadd2 = '';
    this.model.resadd3 = '';
    this.model.resadd4 = '';
    this.model.rescity = '';
    this.model.resstate = '';
    this.model.respin = '';
    this.model.resemail = '';
    this.model.resmobile = '';
    this.model.reslandline = '';
    this.model.curadd1 = '';
    this.model.curadd2 = '';
    this.model.curadd3 = '';
    this.model.curadd4 = '';
    this.model.curcity = '';
    this.model.curstate = '';
    this.model.curpin = '';
    this.model.curemail = '';
    this.model.curmobile = '';
    this.model.curlandline = '';
    this.model.remarks = '';
    this.disablebutton = true;

    this.model.edu = '';
    this.model.ind = '';
    this.model.capital = '';
    this.model.curmobile = '';
    this.tablerow.length = 1;
    this.tablerow2.length = 1;
    this.detailstablerow.length = 1;

    this.model.ter = null;
    this.model.terdate = new Date();
    this.model.termode = null;
    this.model.terreason = '';
    this.model.terrem = '';

    for (let i = 0; i < this.tablerow.length; i++) {
      this.tablerow[i].educationalQualification = '';
      this.tablerow[i].educationalInstitution = '';
      this.tablerow[i].educationalPercentage = '';
      this.tablerow[i].educationalYearofPassing = '';
      this.tablerow[i].educationalRemarks = '';
    }

    for (let i = 0; i < this.tablerow2.length; i++) {
      this.tablerow2[i].industryQualification = '';
      this.tablerow2[i].industryInstitution = '';
      this.tablerow2[i].industryPercentage = '';
      this.tablerow2[i].industryYearofPassing = '';
      this.tablerow2[i].industryRemarks = '';
    }

    for (let i = 0; i < this.detailstablerow.length; i++) {
      this.detailstablerow[i].fromYeartoYear = '';
      this.detailstablerow[i].Firm = '';
      this.detailstablerow[i].designation = '';
      this.detailstablerow[i].remarks = '';
    }
    this.getDataOfempCodeArray()
  }

}
