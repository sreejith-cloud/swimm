import { Component, OnInit, ViewChild } from '@angular/core';
import { PoaserviceService } from '../clientpoadashboard/poaservice.service';
import { DataService, FormHandlerComponent } from 'shared';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService, User } from 'shared';



@Component({
  selector: 'app-poaapprovedorreject',
  templateUrl: './poaapprovedorreject.component.html',
  styleUrls: ['./poaapprovedorreject.component.less']
})
export class PoaapprovedorrejectComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  clientid: any;

  imagesignature: any;
  disimage: any;
  pdfSrc: any;
  isSpinning: boolean = false;
  ReportResponse: any = [];
  isVisibleMod: boolean = false;
  remarks: any;
  html: any;
  rejectedremarkarray: any
  rejectedremarkarray1: any;//mod aksa
  curstatus: any;
  buttondisable: Boolean = false;

  rejectedreason: any;
  currentUser: User;
  id: any;
  type: any;
  reasons: any;
  reason: any;
  text: any;//mod aksa
  savedisable: boolean = false;
  // fulldisable:boolean=false
  reasonforrejct: boolean = false;//mod aksa
  showselect: boolean = false;//mod aksa
  showtext: boolean = false;//mod aksa
  documentrejected: any;//mod aksa
  otherreason: any;//mod aksa
  showreject: boolean = false
  // showbutton:boolean=false;//mod aksa
  showcheck: boolean = false
  entryDate: any;
  constructor(
    private poaserv: PoaserviceService,
    private dataserv: DataService,
    private sanitizer: DomSanitizer,
    private notif: NzNotificationService,
    private authServ: AuthService

  ) {
    this.poaserv.clientid.subscribe((items) => {
      this.clientid = items
    })
    this.poaserv.id.subscribe((items) => {
      this.id = items
    })
    this.poaserv.type.subscribe((items) => {
      this.type = items
    })
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {

    // this.showselect=false
    // this.rejectedremarkarray1 = [
    // { "value": "ALL", "description": "ALL" },
    // { "value": "Signature Mismatch", "description": "Signature Mismatch" },
    // { "value": "Target Client not available", "description": "Target Client not available" },
    //   { "value": "Other", "description": "Other" }
    // ]

    this.getdata()
    this.getRejectedRemarks()
    this.isVisibleMod = false;
    this.buttondisable = false;
    // this.savedisable = true;
    //    this. showselect=true;
    // this.showtext=true;
    // this.showcheck = true;
    if (this.type != 'P') {
      // debugger


      this.buttondisable = true
      // this.fulldisable=false;
      // this.savedisable = false;
      //  this. showselect=false;
      //  this.showtext=false
      // this.showcheck = false;

    }
    if (this.type != 'A') {
      // debugger//mod aksa
      //  this. showselect=false;
      //  this.showtext=false;
      //  this.savedisable=false;
      //  this.showcheck=false;
      this.showreject = false


    }
    else {
      // debugger
      // this. showselect=true;
      // this.showtext=true;
      // this.savedisable=true;
      // this.showcheck=true;
      this.showreject = true
    }
    // console.log("type",this.type);

  }
  //mod aksa
  ngAfterViewInit() {
    this.formHdlr.setFormType('default');
    this.formHdlr.config.showPreviewBtn = false;
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showDeleteBtn = false;
    this.formHdlr.config.showSaveBtn = true;
    this.formHdlr.config.showCancelBtn = false;


  }

  getRejectedRemarks() {
    this.dataserv.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser ? this.currentUser.userCode : '',
          type: 'POA'
        }],
      "requestId": "7289",
      "outTblCount": "0"
    }).then((response) => {

      // debugger
      this.rejectedremarkarray = response.results[0]
      this.rejectedremarkarray1 = response.results[1]//mod aksa
      // console.log("rejectedremarkarray1", this.rejectedremarkarray1);//mod aksa


      // console.log("rejecremarkarray", this.rejectedremarkarray);


      this.rejectedremarkarray.push({ Reason: "Other", ReasonDesc: "" })

    });
  }

  getdata() {
    this.isSpinning = true
    this.dataserv.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          id: this.id || 0,
          dpid: '',
          loc: '',
          clientid: this.clientid || 0,
          trandt: '',
          // FromDate: '',//mod aksa
          // ToDate: '',//mod aksa
          type: 'S',
          euser: this.currentUser ? this.currentUser.userCode : ''
        }],
      "requestId": "7278",
      "outTblCount": "0"
    }).then((response) => {
      // debugger
      if (response.results) {
        this.isSpinning = false
        var data1 = response.results[0][0]
        this.ReportResponse = data1
        this.reason = this.ReportResponse.Reason
        console.log("entryDate" , this.ReportResponse.EntryDate)
        this.entryDate =  this.convertToDate(this.ReportResponse.EntryDate)
        console.log("This.entryDate",this.entryDate)

        // console.log('response',response);
        if(this.ReportResponse.IsMygeojit==false && this.type == 'A'){
          this.showreject=true
        }
        else{
          this.showreject=false
        }

        if (response.results[1][0]) {
          var signature = response.results[1][0].Signature
          this.imagesignature = (this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + signature))
        }
        if (response.results[2][0]) {

          this.disimage = response.results[2][0].ImgData;
          var disimagetype;
          disimagetype = response.results[2][0].ImgType

          this.pdfSrc = (this.sanitizer.bypassSecurityTrustResourceUrl('data:' + disimagetype + ';base64,' + this.disimage));
        }
        if (response.results[3][0]) {
          this.html = response.results[3][0].HTML
        }

      }
      else {
        this.notif.error('Error while updating status', '');
        this.isSpinning = false

      }
      if (response.errorCode) {
        this.notif.error(response.errorCode, '');
        return
      }

      //  this.ReportResponse =  data1

    });

  }

  private convertToDate(dateString: string | null): Date | null {
    if (!dateString) {
      return null; // handle null or undefined values
    }

    // Split the date string into day, month, and year components
    const dateComponents = dateString.split('/');
    if (dateComponents.length !== 3) {
      return null; // handle invalid date string format
    }

    // Parse the components and create a Date object
    const day = parseInt(dateComponents[0], 10);
    const month = parseInt(dateComponents[1], 10) - 1; // months are zero-based in JavaScript
    const year = parseInt(dateComponents[2], 10);

    const date = new Date(year, month, day);

    // Reset the time part to midnight (00:00:00)
    date.setHours(0, 0, 0, 0);
    
    return date;
  }


  onchangeType(data) {
    // debugger
    // console.log("change", data);

    if (data == 'Other') {
      this.remarks = '';
    }
    else {
      this.remarks = data
    }
  }

  Savestatus(status) {
    this.curstatus = status
    if (status == 'R' && (this.remarks == "" || this.remarks == undefined)) {
      this.isVisibleMod = true
      return
    }
    if(this.entryDate == '' || this.entryDate == undefined){
      this.notif.error('Please Select Entry Date','')
      return
    }
    this.isSpinning = true
    this.dataserv.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          id: this.id || 0,
          dpcode: this.ReportResponse.DPCode,
          dp: this.ReportResponse.DPID,
          DPACNO: this.ReportResponse.DPClientID,
          loc: this.ReportResponse.Loc,
          trcode: this.ReportResponse.Tradecode,
          apprflag: this.curstatus,
          reason: this.remarks || '',
          guser: this.currentUser ? this.currentUser.userCode : '',
          ReqReceivedDt: this.entryDate?this.formatDate(this.entryDate):'',
        }],
      "requestId": "7280",
      "outTblCount": "0"
    }).then((response) => {
      // debugger
      // console.log('response',response);
      this.isSpinning = false;

      if (response.results) {
        this.isSpinning = false;
        // this.notif.success('Status updated successfully', '');
        if (response.results[0][0].Errorcode == 0) {
          this.notif.success(response.results[0][0].Msg, '');
          this.buttondisable = true
          this.isVisibleMod = false
        }
        else if (response.results[0][0].Errorcode == 1) {
          this.isSpinning = false;
          this.notif.error(response.results[0][0].Msg, '');
          this.buttondisable = true
          this.isVisibleMod = false
        }
        // this.savedisable = true;
        // this.fulldisable=false;


      }
      else {
        this.isSpinning = false
        this.notif.error(response.errorMsg, '');
        // this.notif.error(response.results[0].rows[0][1], '');
        this.buttondisable = true
        // this.savedisable = false;
        // this.fulldisable=true;
        this.isVisibleMod = false
      }
      if (response.errorCode) {
        this.isSpinning = false
        this.notif.error(response.results[0].rows[0][1], '');
        return
      }
    })

  }

  handleCancel1() {
    this.isVisibleMod = false;
    this.remarks = "";
  }


  // mod aksa begins
  ticked(data) {
    // debugger
    // console.log(data);
    //this.reasonforrejct=false;
    if (data) {
      this.showselect = true
      // this.showbutton=true
      // this.showFindBtn = false;
    }
    if (!data) {
      this.showselect = false
    }
  }
  onselect(text) {
    // debugger
    // console.log("text", text);

    if (text == 'Other') {
      this.showtext = true
    }
    else {
      this.showtext = false
    }

  }
  save() {
    // debugger

    if (!this.reasons) {
      this.notif.error('Please select reason', '')
      return
    }

    // if (!this.reasosn) {
    //   this.notif.error('Please select reason', '')
    //   return
    // }

    this.dataserv.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{


          clientid: this.clientid || 0,
          Rejected: this.documentrejected,
          Reason: this.reasons == 'Other' ? this.otherreason : this.reasons,
          flag: 'I',
          Euser: this.currentUser ? this.currentUser.userCode : '',

        }],
      "requestId": "7282",
      "outTblCount": "0"
    })
      .then((response) => {

        // console.log("responsess", response);
        if (response.errorCode == 0) {

          this.notif.success("Saved Successfully", '')

        }
      })

  }            

  private formatDate(date: Date | null): string | null {
    if (!date) {
      return null;
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
}

