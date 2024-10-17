import { Component, OnInit, ViewChild } from '@angular/core';
import { viewAttached } from '@angular/core/src/render3/instructions';

import { FormHandlerComponent, DataService, FindOptions, User } from 'shared';
import { InputMasks, InputPatterns } from 'shared';
import { AuthService } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, RequiredValidator, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-custodianmaster',
  templateUrl: './custodianmaster.component.html',
  styleUrls: ['./custodianmaster.component.css']
})
export class CustodianmasterComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  inputMasks = InputMasks;
  inputPatterns = InputPatterns
  Maxlen1: any = 10;
  Minlen1: any = 10;
  Maxlen2: any = 10;
  Minlen2: any = 10;
  CountrycodeArray: any = [];
  relationArray: any;
  applicationStatus: any;
  mob2Country: any;
  mob1Country: any;
  telCountry: any;
  isloader: boolean = false;
  add1: any;
  add2: any;
  add3: any;
  add4: any;
  pindata: any = null

  isReport: boolean = false;
  Country: string;
  CUSTODIAN_ID = "";
  cid = "";
  name = "";
  pan = "";
  address = "";
  mobile = "";
  emailid = "";
  pincode = "";
  isd = "";
  std = "";
  telephone = "";
  data: any[] = [];
  custodianFindopt: FindOptions;
  isedit: any
  isPemantSelected: boolean = false;
  isSpinVisible: boolean = false;
  errormsg = ""
  rdata: string;
  currentUser: User;

  constructor(private dataServ: DataService, private authServ: AuthService, private notification: NzNotificationService) {

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.custodianFindopt = {
      findType: 6057,
      codeColumn: 'CUSTODIAN_ID',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'

    }
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
      console.log(response);
      if (response.results) {
        this.CountrycodeArray = response.results[5]
        console.log(this.CountrycodeArray);

      }
    })

    this.formHdlr.setFormType('report');
    this.formHdlr.config.showSaveBtn = true;
    this.formHdlr.config.showExportExcelBtn = false;
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showCancelBtn = false;
    this.formHdlr.config.showCancelBtn = true;
    this.formHdlr.config.showPreviewBtn = false;
  }

  SetPhoneNumberLen(mob, code) {
    if (mob == 'FirstMob') {
      if (code == '091') {
        this.Maxlen1 = 10;
        this.Minlen1 = 10;
      }
      else {
        this.Maxlen1 = 16;
        this.Minlen1 = 3;
        this.Maxlen2 = 16;
        this.Minlen2 = 3;
      }
    }
    else {
      if (code == '091') {
        this.Maxlen2 = 10;
        this.Minlen2 = 10;
      }
      else {
        this.Maxlen2 = 16;
        this.Minlen2 = 3;
      }
    }
  }

  getPinData(data: any) {
    debugger
    this.isloader = true;
    if (data == null) {
      this.isloader = false;
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
          console.log(response);
          if (response.results[0].length > 0) {
            debugger
            this.pindata = response.results[0][0];
            console.log(this.pindata);

            if (!this.pindata) {
              this.pindata = null
            }
            console.log(this.pindata);

            //  console.log( this.pindata[0].Country);
            // console.log(this.pindata[0].STATENAME)
          }
        })
      this.isloader = false;
    }
    else {
      this.pindata = null
    }
  }

  save() {
    debugger
    if (!this.name) {
      this.notification.error('Please enter Name', '')
      return
    }

    if (this.pan.length != 10) {

      this.notification.error('Please enter valid Pan', '')
      this.pan = ''
      return
    }
    else {
      var inputvalues = this.pan;
      //   var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/
      var regex = /^([a-zA-Z]([a-zA-Z]([a-zA-Z]([a-zA-Z]([a-zA-Z]([0-9]([0-9]([0-9]([0-9]([a-zA-Z])?)?)?)?)?)?)?)?)?)?$/;
      if (!regex.test(inputvalues)) {
        this.pan = ''
        this.notification.error('Please enter valid Pan', '')
        return
      }
    }

    // if (this.mobile.length != 10 && this.telephone.length != 7) {
    //   this.notification.error('Enter Valid Number', '')
    //   this.mobile = ''
    //   return
    // }

    if (this.mobile.length == 0 && this.telephone.length == 0) {
      this.notification.error('Enter either mobile or telephone', '')
      return
    }


    if (this.mobile.length > 0 &&  this.mobile.length != 10) {
      this.notification.error('Please enter valid mobile ', '')
      return
    }
    if (this.telephone.length > 0 && this.telephone.length < 6) {
      this.notification.error('Please enter valid telephone ', '')
      return
    }

    if (!this.address) {
      this.notification.error('Please enter address', '')
      return
    }

    if (!this.emailid) {
      this.notification.error('Please enter email id', '')
      return
    }

    var mailPattern = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")
    if (!mailPattern.test(this.emailid)) {
      this.notification.error('Please enter valid Email id', '')
      this.emailid = ''
      return
    }

    if (this.pincode.length != 6) {

      this.notification.error('Please enter valid Pincode', '')
      this.pincode = ''
      return
    }

    if (!this.isd) {
      this.notification.error('Please enter ISD Code', '')
      return
    }

    if (this.isd.length != 3) {
      this.notification.error('Please enter valid ISD Code', '')
      this.isd = ''
      return
    }

    if (this.std.length > 4) {
      this.notification.error('Please enter valid STD Code', '')
      this.std = ''
      return
    }

    this.isSpinVisible = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          flag: this.isedit ? 'U' : 'I',
          id: this.CUSTODIAN_ID ? this.CUSTODIAN_ID : '',
          Name: this.name,
          Pan: this.pan,
          Address: this.address,
          Mobile: this.mobile,
          Emailid: this.emailid,
          Pincode: this.pincode,
          City: this.pindata.District,
          State: this.pindata.STATENAME,
          Country: this.pindata.Country,
          Isdcode: this.isd,
          Stdcode: this.std,
          Telephone: this.telephone,
          Euser: this.currentUser.userCode
        }],
      "requestId": "7925",
      "outTblCount": "0"
    })
      .then((response) => {
        this.isSpinVisible = true;
        console.log(response);
        if (response.errorCode == 0) {
          if (!this.isedit) {
            this.notification.success("Saved Successfully", '')
          }
          else if (this.isedit) {
            this.notification.success("Updated Successfully", '')
          }
        }
        if (response && response[0] && response[0].rows.length > 0) {
          this.notification.error("Data not found", '')
        }
      })

    this.cid = '';
    this.name = '';
    this.pan = '';
    this.address = '';
    this.mobile = '';
    this.emailid = '';
    this.pincode = '';
    this.isd = null;
    this.std = '';
    this.telephone = '';
    this.pindata.District = '';
    this.pindata.STATENAME = '';
    this.pindata.Country = '';
  }

  onChangecustodian(data) {
    if (data == null) {
      return
    }
    this.CUSTODIAN_ID = data.CUSTODIAN_ID;
    this.name = data.CUSTODIAN_NAME;
    this.pan = data.CUSTODIAN_PANNO;
    this.address = data.CUSTODIAN_ADDRESS_LINE1;
    this.mobile = data.CUSTODIAN_MOBILENO;
    this.emailid = data.CUSTODIAN_EMAIL;
    this.pincode = data.CUSTODIAN_PINCODE;
    this.isd = data.CUSTODIAN_OFF_ISDCODE;
    this.std = data.CUSTODIAN_OFF_STDCODE;
    this.telephone = data.CUSTODIAN_TELNO;
    this.getPinData(data.CUSTODIAN_PINCODE);

    this.isedit = true
  }

  Reset() {
    this.cid = '';
    this.name = '';
    this.pan = '';
    this.address = '';
    this.mobile = '';
    this.emailid = '';
    this.pincode = '';
    this.std = '';
    this.telephone = '';
    this.pindata.District = '';
    this.pindata.STATENAME = '';
    this.pindata.Country = '';
    this.isd = null;

    this.isedit = false;
  }

  charrestrict(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  characterstrict(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  Validatename(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
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

}


