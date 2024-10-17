import { Component, OnInit } from '@angular/core';
import { DataService } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import * as  jsonxml from 'jsontoxml'
import { UtilService } from 'shared';
import { InputMasks, InputPatterns } from 'shared';
import { User } from 'shared/shared';
import { AuthService } from 'shared';
@Component({
  selector: 'app-bank-change',
  templateUrl: './bank-change.component.html',
  styleUrls: ['./bank-change.component.less']
})
export class BankChangeComponent implements OnInit {
  emailId: any='';
  bankName: any;
  ClientDetails: any;
  ClientHistory: any;
  ClientDetailsShow: boolean = false;
  isSpining:boolean=false
  inputMasks = InputMasks;
  BankDetailsHist:boolean=false
  currentUser: User;
  constructor(private dataServ: DataService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private authServ: AuthService) {
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      })
     }

  ngOnInit() {
    this.bankName = 'YES'
  }
  PoolClient() {debugger
    debugger
    if(this.emailId==''||this.emailId==null||this.emailId==undefined)
    {
      this.notif.error('Please enter email','')
      return
    }
    this.Clear()
    this.isSpining=true
    this.ClientDetailsShow = false
    this.BankDetailsHist=false
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Emailid: this.emailId,
          Euser: this.currentUser.userCode,
          Bank: 'YES',
          VorI: 'V',
          FileData: ''
        }],
      "requestId": "7047",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpining=false
      if (response.errorCode == 0) {
        if (response.results && response.results[0] && response.results[0].length) {
          this.ClientDetails = response.results[0]
          this.ClientDetails.forEach(item=>{
            item["Disable"]=true;
            item["Otp"]=''
            item["Remarks"]='YES bank change'
            item["OtpSuccessFlag"]=true
          })
          this.ClientDetailsShow = true
          this.ClientHistory = response.results[1]
        
          if(this.ClientHistory.length>0)
          {
            this.BankDetailsHist=true
          }

        }
        else {
          this.notif.error('No data found', '')
        }
      }
      else {
        this.notif.error(response.errorMsg, '')
      }

    })

  }
  SendOTP(index) {
    this.dataServ.SendOTP({
      "MOBILENO": this.ClientDetails[index].MobilePhone,
      "APPLICATIONID": "CRD",
      "USERKEYINFO": this.ClientDetails[index].Clientid,
      "MSGTEMPLATE": "Your OTP for change of bank account in your profile is <otp>",
      "EXPIRY": "10",
      "OTPLENGTH": "4",
      "SMSOTP": "Y",
      "MAILOTP": "N",
      "MAILID": "xxxxxx@gmail.com",
      "SUBJECT": "OTP for txn",
      "MAILMSGTEMPLATE": "Your otp to complete txn is <otp>",
    }).then((response) => {
      if(response.error_code==0)
      {
       this.notif.success('OTP sent successfully','')
       this.ClientDetails[index].Disable=false
      }
      else
      {
        this.notif.error(response.error_message,'')
      }
    })
  }
  ValidateOTP(data,index)
  {debugger
   if(data.length==4)
   {
      this.dataServ.ValidateOTP({
        "USERKEYINFO":this.ClientDetails[index].Clientid,
        "APPLICATIONID":"CRD",
        "OPT":this.ClientDetails[index].Otp

      }).then((response)=>{debugger
        if(response.error_code==0)
        {
          if(response.validation_status==1)
          {
            this.notif.success('OTP validated Successfully','')
            this.ClientDetails[index].OtpSuccessFlag=false
            
          }
          if(response.validation_status==-1)
          {
            this.notif.error('OTP expired','')
            this.ClientDetails[index].OtpSuccessFlag=true
          }
          if(response.validation_status==0)
          {
            this.notif.error('OTP validation failed','')
            this.ClientDetails[index].OtpSuccessFlag=true
          }
        }
        else
        {
          this.notif.error(response.error_message,'')
          this.ClientDetails[index].OtpSuccessFlag=true
        }
      })
    }
    
  }
  SaveData(index) {
    if(this.emailId==''||this.emailId==null||this.emailId==undefined)
    {
      this.notif.error('Please enter email','')
      return
    }
    if(this.ClientDetails[index].Otp==''||this.ClientDetails[index].Otp==null||this.ClientDetails[index].Otp==undefined)
    {
      this.notif.error('Please enter OTP','')
      return
    }
   
 
    this.isSpining=true
    var clientDetailsarray=[]
    clientDetailsarray.push(this.ClientDetails[index])
    console.log("response", this.ClientHistory)
    var Bankjson = this.utilServ.setJSONArray(clientDetailsarray)
    var BankXmlData = jsonxml(Bankjson);
    console.log(BankXmlData);
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Emailid: this.emailId,
          Euser: this.currentUser.userCode,
          Bank: this.bankName,
          VorI: 'G',
          FileData:BankXmlData
        }],
      "requestId": "7047",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpining=false
      if (response.errorCode == 0) {
        this.notif.success('Data saved ', '')
        this.ClientDetails[index].Disable=true
      }
      else {
        this.notif.error(response.errorMsg, '')
      }
    })
  }
  Clear()
  {
    this.ClientDetails=[];
    this.ClientHistory=[];
  }
}
