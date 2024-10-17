import { Component, OnInit, ViewChild } from '@angular/core';
import { FormHandlerComponent, DataService, FindOptions, AuthService, User, UtilService, WorkspaceService } from 'shared';
import { ThirdPartyPOAComponent } from '../client-master/trading/third-party-poa/component';
import * as  jsonxml from 'jsontoxml'
import { Subscription } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-proof-verification',
  templateUrl: './proof-verification.component.html',
  styleUrls: ['./proof-verification.component.less']
})
export class ProofVerificationComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  serialNumber: any='';
  RequestInfo: any = [];
  RequestInfoHead: any = [];
  DocumentSubmited: any = [];
  DocumentSubmitedHead: any = [];
  filePreiewVisible: boolean = false;
  filePreiewContent: any = {};
  SerialNoFindOption: FindOptions;
  subscriptions: Subscription[] = [];
  currentUser: User;
  isSpining: boolean = false;
  count: any = 0;
  DocumentDetails: any=[];
  DocumentDetailsHeads:any=[];
  FromSpiceFlag:boolean=false
  spicecrfno: any ='';
  SpiceCRFFindOption: FindOptions;
  request_idno: any;//mod by aksa

  constructor(private dataServ: DataService, 
    private authServ: AuthService, 
    private utilServ: UtilService, 
    private notification: NzNotificationService, 
    private wsServ: WorkspaceService) {
    this.SerialNoFindOption = {
      findType: 6063,
      codeColumn: 'ClientSerialno',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.SpiceCRFFindOption = {
      findType: 6063,
      codeColumn: 'request_idno',//mod by aksa
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1" 
     
     
    }
    this.subscriptions.push(
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      })
    )
  }
  ngOnInit() {
    this.formHdlr.config.showFindBtn = false;
  }
  view() {
    if(this.serialNumber==null||this.serialNumber==undefined||this.serialNumber=='')
    {
      return
    }
    this.FromSpiceFlag=false;
    if(this.serialNumber.RequestFrom=='SPICE')
    {
      this.FromSpiceFlag=true;
    }
    this.isSpining = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          CRFClientSerialNo: this.serialNumber.BO_CRF_SerialNo,
          spiceserialno:this.request_idno ,//mod by aksa
          // flag:'spice',
          // flag_1:'backoffice'
        }],
      "requestId": "5800",
      "outTblCount": "0"
    }).then(response => {      
      if (response.errorCode == 0) {debugger
        this.RequestInfo = [];
        this.RequestInfoHead = [];
        this.DocumentSubmited = [];
        this.DocumentSubmitedHead = [];
        if (response.results && response.results.length) {
         if(response.results[0] && response.results[0].length)
         {
          this.isSpining = false;
          this.RequestInfo = response.results[0];
          
          this.RequestInfoHead = Object.keys(response.results[0][0])
          if(response.results[1]&& response.results[1].length)
          {
            this.DocumentDetails=response.results[1]
            this.DocumentDetailsHeads=Object.keys(response.results[1][0])
          }
          if(response.results[2] && response.results[2].length)
          {debugger
            this.DocumentSubmited = response.results[2];
           
            
            this.DocumentSubmitedHead = Object.keys(response.results[2][0])
            this.DocumentSubmitedHead.splice(this.DocumentSubmitedHead.findIndex(item => item=='ImgData' ), 1)
            this.DocumentSubmitedHead.splice(this.DocumentSubmitedHead.findIndex(item => item=='ImgType' ), 1)
            this.DocumentSubmited.forEach(element => {
              element.ReceivedFlag = element.ReceivedFlag ? true : false;
              element["disablecheck"]=true
            });
          }
          else{
            this.isSpining = false;
            this.notification.error('No document found for the CRF entry','')
          }
         }
         else{
          this.isSpining = false;
           this.notification.error('No CRF entry entry found for the SerielNo','')
         } 
        }
        else {
          this.isSpining = false;
          this.notification.error('No Result Found', '')
        }
      } else {
        this.isSpining = false;
        this.notification.error(response.errorMsg, '')
      }
    });
  }
  Reset() {
    this.RequestInfo = [];
    this.RequestInfoHead = [];
    this.DocumentSubmited = [];
    this.DocumentSubmitedHead = [];
    this.serialNumber = '';
    this.DocumentDetails=[];
    this.FromSpiceFlag=false;
    this.spicecrfno = '';
  }
  save() {
    if (!this.DocumentSubmited.length || !this.RequestInfo.length) {
      this.notification.error('Please Select a Request', '')
      return
    }
    this.DocumentSubmited.forEach(element => {
      delete element.ImgData
      if (element.ReceivedFlag) {
        element.ReceivedFlag = 'Y'
      }
      else {
        element.ReceivedFlag = 'N'
      }
    });
    var jsondata = this.utilServ.setJSONArray(this.DocumentSubmited)
    var xmldata = jsonxml(jsondata);
    this.isSpining = true;

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          CRFClientSerialNo: this.RequestInfo[0].ClientSerialno,
          FileData: xmldata,
          EUser: this.currentUser.userCode

        }],
      "requestId": "5801",
      "outTblCount": "0"
    }).then(response => {
      if (response.errorCode == 0) {
        this.isSpining = false
        this.notification.success('Data Saved SuccessFully', '')
        this.Reset()
      }
      else {
        this.isSpining = false
        this.notification.error(response.errorMsg, '');
      }
    });
  }
  Preview(data) {

    let index = this.DocumentSubmited.findIndex(x => x.Slno === data.Slno); //mod by aksa

    this.filePreiewVisible = true;
    this.filePreiewContent=[];
    setTimeout(() => {
    this.filePreiewContent = data;
    },500)

    this.DocumentSubmited[index].disablecheck=false
    
  }

  CheckBoxControl(index, value) {
     
    // if (this.DocumentSubmited[index].ReceivedDate == null || this.DocumentSubmited[index].ReceivedDate == undefined) {
      if(this.DocumentSubmited[index].ReceivedFlag)
      {
        this.DocumentSubmited[index].ReceivedDate = new Date();
      }
    // }
  }

  openprofilechange()
  {debugger
    var serial=this.RequestInfo[0].Spice_Id.split('_')[0]
    let ws = this.wsServ.workspaces
    let tab:boolean=false
    var index

    for (let i = 0; i < this.wsServ.workspaces.length; i++) {
      if ((ws[i]['type']) == "crf") {
        tab=true
        index=i;     
      } 
  }
  if(tab)
  {
    this.dataServ.slno = serial    
      this.wsServ.removeWorkspace(index);    
      this.dataServ.fromreport=true;
      setTimeout(() => {this.wsServ.createWorkspace("crf") },200);
  }
  else
  {
      this.dataServ.slno = serial           
      this.dataServ.fromreport=true;  
      setTimeout(() => {this.wsServ.createWorkspace("crf") },200);   
  }
}

spicecrfChange(data){debugger
  if(data == '' || data ==  undefined || data == null){
    return
  }
  else{
    this.serialNumber = data;
    this.view()
  }
}
}