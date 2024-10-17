import { Component, OnInit, ViewChild } from '@angular/core';
import { LOGGER_SERVICE_PROVIDER, NzNotificationService } from 'ng-zorro-antd';
import { AuthService, DataService, FormHandlerComponent, User } from 'shared';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email-mobile-validate',
  templateUrl: './email-mobile-validate.component.html',
  styleUrls: ['./email-mobile-validate.component.css']
})
export class EmailMobileValidateComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  email: any;
  mobile: number;
  Pan: any;
  currentUser: User;
  pastedText: any;

  isSpining: boolean = false;

  constructor(
    private dataServ: DataService,
    private authServ: AuthService,
    private notif: NzNotificationService
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }


  ngOnInit() {
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showSaveBtn = false;
  }

  PanCheck(event) {
    if (this.Pan != '') {
      this.isSpining = true;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            PAN: this.Pan,
            Mob: this.mobile || '',
            Email: this.email || '',
            flag: 'F',
            euser: this.currentUser.userCode,
            // Src: 'SPICE',
            EntryType: 'MobEmailChange',
            ShortURL: '',
            ShortURLGenerate: 'N'
          }],
        "requestId": "700201",
        "outTblCount": "0"
      }).then((response) => {
        this.isSpining = false;
        console.log(response, 'K')
        if (response.errorCode == 0 && response.results[0]) {
          this.email = response.results[0][0].Email
          this.mobile = response.results[0][0].Mobile
          // this.notif.success(response[1].rows[0], '')
        }
      })
    }
  }
  ValidatePan(event) {
    var inputvalues = this.Pan;
    //   var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/
    var regex = /^([a-zA-Z]([a-zA-Z]([a-zA-Z]([a-zA-Z]([a-zA-Z]([0-9]([0-9]([0-9]([0-9]([a-zA-Z])?)?)?)?)?)?)?)?)?)?$/;
    if (!regex.test(inputvalues)) {
      this.Pan = ''
      //this.notif.info('Please enter valid Pan', '')
      return
    }
  }


  ValidateMob(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[0-9 ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  ValidateMail(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9@._]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  Save() {
    this.isSpining = true;
    let reqBody: any = {
      requestId: "700201",
      outTblCount: "0",
      dbConn: "db23",
      batchStatus: false,
      detailArray: [{
        PAN: this.Pan,
        Mob: this.mobile || '',
        Email: this.email || '',
        flag: 'I',
        euser: this.currentUser.userCode,
        // Src: 'SPICE',
        EntryType: 'MobEmailChange',
        ShortURL: '',
        ShortURLGenerate: 'N'
      }],
    }
    this.dataServ.post(environment.api_send_emailormob, reqBody).then((res: any) => {
      this.isSpining = false;
      if (res.errorcode == 0) {
        this.notif.success('Link Sent', '')
      } else {
        let errorMsg = res.Msg ? res.Msg : res.errorMsg ? res.errorMsg : 'Something Went Wrong! Please try again'
        this.notif.error(errorMsg, '')
      }
    }, (error) => {
      this.isSpining = false;
      this.notif.error('Something Went Wrong! Please try again', '')
    })
  }

  resetForm() {
    this.email = '';
    this.mobile = null;
    this.Pan = ''
  }




}
