import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService, DataService, FindOptions, FormHandlerComponent, User } from 'shared';

@Component({
  selector: 'app-pan-based-client-profile-master',
  templateUrl: './pan-based-client-profile-master.component.html',
  styleUrls: ['./pan-based-client-profile-master.component.less']
})
export class PanBasedClientProfileMasterComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  panFind:FindOptions
  pan
  DocumentsArray:Array<any>=[]
  DocumentsArrayHeads:Array<any>=[]
  isSpining:boolean =false
  currentUser:User;
  constructor(private dataserve: DataService,private notif: NzNotificationService,private authServ:AuthService) {
    this.panFind = {
      findType: 5036,
      codeColumn: 'PAN',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showPreviewBtn = true;
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showSaveBtn = false;
  }
  view()
  {
    if(!this.pan)
    {
      this.notif.error('Please enter PAN number', '');
      return
    }
    this.DocumentsArray = []
    this.DocumentsArrayHeads = []
    this.isSpining=true
    console.log(this.pan);

    this.dataserve.getResultArray({
      "batchStatus": "false",
      "dbConn": "db23",
      "detailArray":
        [{
          Pan:this.pan && this.pan.PAN?this.pan.PAN:'',
          Download:'',
          EUser:this.currentUser.userCode?this.currentUser.userCode:''
        }],
      "requestId": "25460",
      "outTblCount": "0"
    })
      .then((response) => {
        if(response)
        {
          if(response.errorCode==1)
          {
          this.notif.error(response.errorMsg, '');
          this.isSpining = false
          return
          }
        if (response.results.length > 0) {
          let data1 = response.results[0]

          if (data1.length > 0) {
            this.DocumentsArray = data1;
            this.DocumentsArrayHeads = Object.keys(this.DocumentsArray[0])
            this.isSpining = false
          }
          else {
            this.notif.error('No Data found', '');
            this.isSpining = false
            return

          }

        }
        else
        {
          this.notif.error('No Data found', '');
            this.isSpining = false
            return
        }
      }
      else{
        this.notif.error('No Data found', '');
            this.isSpining = false
            return
      }

      })
  }
  export()
  {
    if(!this.pan)
    {
      this.notif.error('Please enter PAN number', '');
      return
    }
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          Pan:this.pan && this.pan.PAN?this.pan.PAN:'',
          Download:'Y',
          EUser:this.currentUser.userCode?this.currentUser.userCode:''
        }],
      "requestId": "25460",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3R' };
    let isPreview: boolean;
    isPreview = false;
    this.isSpining = true;

    this.dataserve.generateReportmultiexcel(reqParams, isPreview).then((response) => {
      this.isSpining = false;
      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.isSpining = false;
        this.notif.error(response.errorMsg, '',{ nzDuration: 1000});
        return;
      }
      else {
        if (!isPreview) {
          this.isSpining = false;
          this.notif.success('File downloaded successfully', '',{ nzDuration: 1000});
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an Error", '',{ nzDuration: 1000});
    });
  }
  reset()
  {
    this.DocumentsArrayHeads=[]
    this.DocumentsArray=[]
    this.pan=undefined

  }
}
