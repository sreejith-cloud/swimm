import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzNotificationService ,NzDatePickerComponent } from 'ng-zorro-antd';
// import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { AuthService, DataService, FormHandlerComponent, User } from 'shared';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pan-verification',
  templateUrl: './pan-verification.component.html',
  styleUrls: ['./pan-verification.component.less']
})
export class PanVerificationComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  @ViewChild('datePicker') datePicker2: NzDatePickerComponent;
  currentUser:User;
  isLoading: boolean = false;
  tableData: Array<any> = [];
  panNo:string
  name:string
  maxname:string='85'
  tableDataHeader: Array<any>=[];
  today:Date =new Date()
  dob
  dobText:string
  constructor(
    private dataServ: DataService,
    private notif: NzNotificationService,
    private authServ:AuthService,
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    // this.panNo='CYIPP8888A'
    // this.name='ABC PQR XYZ'
    // this.dob=new Date()//'19/08/1974'
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showSaveBtn = false;
    this.getNameMaxLength()
  }
  getNameMaxLength()
  {
    this.isLoading = true;
    this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            EUser:this.currentUser.userCode?this.currentUser.userCode:''
          }],
        "requestId": "10000234",
        "outTblCount": "0"
      })
      .then((resp) => {
        this.isLoading = false;
        if(resp && resp.results)
        {
          console.log(resp.results);
          
          this.maxname=resp.results && resp.results[0] && resp.results[0].namemaxlength?resp.results[0].namemaxlength:'85'
          console.log(this.maxname);
          
        }
      })
  }
  disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  /* fetch response from pan verification API*/
  verify() {
    if (!this.panNo) {
      this.notif.error('Please enter PAN Number ', '');
      return;
    }
    this.panNo=this.panNo.toUpperCase()
    if(!this.validatePANOnVerify(this.panNo))
    {
      this.notif.error('Please enter valid PAN ', '');
      return;
    }
    if (!this.name) {
      this.notif.error('Please enter Name (As per PAN Card) ', '');
      return;
    }
    this.name=this.name.toUpperCase()
    // if(!this.validateName(this.name,'verify'))
    // {
    //   this.notif.error('Please enter valid Name (As per PAN Card)', '');
    //   return;
    // }
    if (!this.dobText) {
      this.notif.error('Please enter DOB ', '');
      return;
    }
    if (!this.testDate(this.dobText)) {
      this.notif.error('Please enter valid DOB ', '');
      return;
    }
    
    this.tableDataHeader = []
    this.tableData = []
    this.isLoading = true;

    this.dataServ.post(environment.pan_verify,[
        {
            "pan": this.panNo ? this.panNo : '',//"CYIPP8888A", //-- M
            "name": this.name ? this.name : '',//"ABC PQR XYZ", //-- M
            "fathername": '',//"PQR ABC FED", //-- O
            "dob": this.dobText ? this.dobText : ''//"19/08/1974" //-- M
        }],{'Content-Type':'application/json'})
    // this.dataServ.getResultArray({
    //   "batchStatus": "false",
    //   "detailArray":
    //     [{
    //       PAN: this.panNo ? this.panNo : ''
    //     }],
    //   "requestId": "100062",
    //   "outTblCount": "0"
    // })
    .then((resp:any) => {
      this.isLoading = false;
      if(resp && resp.errorCode=='1')
      {
      if (resp && resp.data) {
        let orderdata = JSON.parse(resp.data)
        console.log(orderdata);
        
        this.tableData = orderdata && orderdata.outputData?orderdata.outputData:[]
        if (this.tableData.length > 0) {
          this.tableDataHeader = Object.keys(this.tableData[0])
        } else {
          this.notif.error('No data found', '');
          return;
        }
      } else {
        this.notif.error('Server error', '');
        return;
      }
    }
    else {
      this.notif.error(resp.errorMessage, '');
      return;
    }
    })
  }
  
  validatePan(val) {
    // console.log(val);

    var charonly = /^[A-Za-z]+$/
    var numonly = /^[0-9]+$/
    // console.log("val.currentTarget.value : ",val.currentTarget.value);
    // console.log("val.target.selectionStart :",val.target.selectionStart);
    // console.log("val.target.selectionStart type : ",typeof val.target.selectionStart );

    // val.currentTarget.value.length
    var fullstring = val.currentTarget.value
    var text = val.key
    // console.log(text);

    if (val.target.selectionStart <= 4) {
      // console.log("1");
      // console.log(charonly.test(text));

      return charonly.test(text)

    }
    else if (val.target.selectionStart > 4 && val.target.selectionStart <= 8) {
      // console.log("2");
      return numonly.test(text)

    }
    else if (val.target.selectionStart == 9) {
      // console.log("3");
      return charonly.test(text)
    }
    else if (fullstring.length > 9) {
      // console.log("4");
      return false;
    }
  }
  // validateName(val,type?) {
  //   console.log(val,type);
    
  //   let charonly = /^[a-zA-Z ]*$/
  //   let space =/^[ ]*$/
  //   var text = type==='verify'?val:val.key
  //   let bool =type==='verify' && space.test(text)?false:charonly.test(text)

  //   return bool
  // }
  validatePANOnVerify(panCardNo:string):boolean
  {
    console.log(panCardNo,"panCardNo",typeof panCardNo);
    
    let regex = new RegExp(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/);
    if (panCardNo == null) {
      return false;
  }
  // Return true if the PAN NUMBER
  // matched the ReGex
  if (regex.test(panCardNo) == true) {
      return true;
  }
  else {
      return false;
  }
  }
  resetForm() {
    this.panNo = null;
    this.name = null;
    this.dob = null;
    this.dobText=null
    this.tableDataHeader = []
    this.tableData = []
    this.getNameMaxLength()
  }
  
  changeDate(event){
    this.dobText=event?moment(event).format('DD/MM/yyyy'):''
    this.dob=undefined
    if (this.datePicker2) {
      this.datePicker2.nzValue = null;
    }
    
  }
  testDate(str) {
    var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if(t === null)
      return false;
    var d = +t[1], m = +t[2], y = +t[3];
  
  // Get the year from the Date object
  const year = new Date().getFullYear();
    if(m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1900 && y <= year) {
      return true;  
    }
  
    return false;
  }
  formatInputDate(event: any): void {

    console.log(event.target.value,"event.target.value");
    // if (/\D/.test(event.target.value)) {
      //   event.target.value=''
      //   this.dobText = null;
      //   return
      // }
    if (/[^0-9\/]/.test(event.target.value)) {
      event.target.value=''
      this.dobText = null;
      return
    }
    let input = event.target.value.replace(/\D/g, '');
    console.log(input,"input");
    if (input.length >= 2 && input.length < 5) {
      input = input.substring(0, 2) + '/' + input.substring(2);
    } else if (input.length > 4) {
      input = input.substring(0, 2) + '/' + input.substring(2, 4) + '/' + input.substring(4, 8);
    }
    this.dobText = input;
  }
  
}