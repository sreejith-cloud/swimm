import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService, DataService, FormHandlerComponent, User, UtilService } from 'shared';
import { FindOptions } from 'shared';
import * as  jsonxml from 'jsontoxml';
export interface reportFilter {
  location: any;
  PanNo: any;
}
@Component({
  selector: 'app-enableactivationrequest',
  templateUrl: './enableactivationrequest.component.html',
  styleUrls: ['./enableactivationrequest.component.less']
})
export class EnableactivationrequestComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  panFindOption: FindOptions;
  model: reportFilter;
  isLoading: boolean = false;
  listOfData: any[] = []
  GridHead: any;
  xmlData: any;
  remarksData: any;
  checkboxData: any;
  currentUser: User;


  constructor(
    private dataServ: DataService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private notif: NzNotificationService,
  ) {
    this.loadSearch()
    this.model = <reportFilter>{};
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    
  }
  ngAfterViewInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn = false;
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showSendMailbtn = false;
  }
  /** checkbox event change function */
  eventCheckBox(param,data){
    this.listOfData.forEach((item: any) => {
      if (item.selected) {
        item.selected = false
      }
      if(item.AccountCode == data.AccountCode){
        item.isSave = false
      }else{
        item.isSave = true
      }
    })
    data.selected = true;
  }

  viewData() {
    if (!this.model.PanNo) {
      this.notif.error('Please Choose Pan', '');
      return
    }
    this.isLoading=true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "PAN": this.model.PanNo ? this.model.PanNo.PAN : '',
          "Reason": '',
          "DP": '',
          "TRADECODE": '',
          "FLG": 'V',
          "EUSER": this.currentUser ? this.currentUser.userCode : ''
        }],
      "requestId": "100131",
      "outTblCount": "0"
    }).then((response) => {
      this.isLoading = false;
      if (response && response[0]) {
        
        this.listOfData=[]
        this.GridHead=[]
        this.listOfData = this.utilServ.convertToResultArray(response[0]);
        this.listOfData.forEach(item=>{
          item.selected = false
          item.isSave = true
          item.remarks = ''
        });
        if (this.listOfData.length>0) {
          this.GridHead = Object.keys(this.listOfData[0]);
        }else{
          this.notif.error('No data found', '')
          return;
        }
        if(this.listOfData[0].ErrorCode==0){
          this.notif.success(this.listOfData[0].ErrorMessage, '')
          this.listOfData=[]
        }else if(this.listOfData[0].ErrorCode==1){
          this.notif.error(this.listOfData[0].ErrorMessage, '')
          this.listOfData=[]
        }
        
      }
      else {
        this.notif.error('No data found', '')
        return;
      }
    })
  }
  /**save data */
  saveData(data) {
    if(!data.remarks || !data.selected){
      this.notif.error('Enable Request & Add Remarks to save', '');
      return
    }
    this.isLoading=true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "PAN": this.model.PanNo ? this.model.PanNo.PAN : '',
          "Reason": data.remarks ? data.remarks : '',
          "DP": data.AccountCode || '',
          "TRADECODE": '',
          "FLG": 'S',
          "EUSER": this.currentUser ? this.currentUser.userCode : ''
        }],
      "requestId": "100131",
      "outTblCount": "0"
    }).then((response) => {
      this.isLoading = false;
      if (response && response[0]) {
        let resData = this.utilServ.convertToObject(response[0]);
        if(resData[0].ErrorCode==0){
          this.notif.success(resData[0].ErrorMessage, '')
          return;
        }else{
          this.notif.error(resData[0].ErrorMessage, '')
          return;
        }
      }
      else {
        this.notif.error('No data found', '')
        return;
      }
    })
  }

  loadSearch(){
    this.panFindOption = {
      findType: 5036,
      codeColumn: 'PAN',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
  }
  reset(){
    this.listOfData = [];
    this.GridHead = [];
    this.model.PanNo = null
  }
}
