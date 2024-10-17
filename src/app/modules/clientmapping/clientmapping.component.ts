import { Component, OnInit ,ViewChild} from '@angular/core';
import { FindOptions, AppConfig } from "shared";
import { DataService , UtilService ,User ,AuthService ,FormHandlerComponent} from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-clientmapping',
  templateUrl: './clientmapping.component.html',
  styleUrls: ['./clientmapping.component.less']
})
export class ClientmappingComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  mappingtype: any;
  tradecode : any;
  TradeFindopt: FindOptions;
  EmpFindopt : FindOptions;
  name : any;
  custlg : any;
  newlg : any;
  showapproval : boolean = false;
  count : any;
  ReportResponse: any = [];
  ReportResponseHeader: any = [];
  remarks : any;
  currentUser: User;
  type : any;
  rmuser : boolean = false;

  constructor(
    private dataServ : DataService,
    private notif: NzNotificationService,
    private utilServ :UtilService,
    private authServ : AuthService,
  ) {

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    	

    this.TradeFindopt = {
      findType: 6042,
      codeColumn: 'TradeCode',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

    this.EmpFindopt = {
      findType: 6045,
      codeColumn: 'EmpCode',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }


   }

  ngOnInit() {
    debugger
    this.mappingtype = 'LG'
    this.GetType()
    this.remarks = ""

  }

  ngAfterViewInit() {
    this.formHdlr.setFormType('default');
     this.formHdlr.config.showFindBtn = false;
     this.formHdlr.config.showDeleteBtn = false;

  }

  GetType(){
    debugger
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
       [{
        Euser : this.currentUser?this.currentUser.userCode : '',
      }],
      "requestId": "7283",
      "outTblCount": "0"
    }).then((response) => {
        debugger
      if (response.results[0].length > 0) {
        this.type = response.results[0][0].Type
        if(this.type == 'R' || this.type =='B'){
          this.rmuser = true
          this.GetCount()
        }
        else{
          this.rmuser = false
        }
      }
      if(response.errorCode){
        this.notif.error(response.errorMsg, '');
      }
    })
  }
  GetCount(){
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
       [{
        UserType : this.type,
        Euser : '16048',
        Flag : 'S',

      }],
      "requestId": "7282",
      "outTblCount": "0"
    }).then((response) => {
        debugger
      if (response.results[0].length > 0) {
        this.count = response.results[0][0].Cont
      }
      if(response.errorCode){
        this.notif.error(response.errorMsg, '');
      }
    })

  }

  save(){
    debugger

    if(this.tradecode =="" || this.tradecode == undefined){
      this.notif.error('Please enter Tradecode', '');
      return
    }
    if(this.newlg =="" || this.newlg == undefined){
      this.notif.error('Please enter New LG', '');
      return
    }
    console.log(this.tradecode)
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
       [{
        ClientCode : this.tradecode.TradeCode,
        OldLGCode : this.custlg,
      	LGCode :this.newlg.EmpCode,
      	EUser :'01671',
        ProcessFlag :'S' ,
        ID : 0,
        ApprovedFlag :'N',
        ApprovRemarks : ''
      }],
      "requestId": "7278",
      "outTblCount": "0"
    }).then((response) => {
        debugger
      if (response.results[0]) {
        if(response.results[0][0].Msg){
          this.notif.error(response.results[0][0].Msg, '');
        }
        else{
          this.notif.success('Data saved sucessfully', '');
          this.remarks = "";
          this.Reset();
        }
      }
      else if(response.errorCode){
        this.notif.error(response.errorMsg, '');
      }
      else{     
          this.notif.success('Data saved sucessfully', '');
          this.remarks = "";
         this.Reset();
          return
      }

    })

  }

  Reset(){
    debugger
    this.tradecode = "";
    this.name = "";
    this.custlg ="";
    this.newlg = "";
    this.showapproval  = false;
    this.ReportResponse = [];
    this.ReportResponseHeader = [];
    this.remarks ="";
  
  }

  onChangetradecode(data){
    debugger
    this.name = data.NAME
    this.custlg = data.ITEXECUTIVE

  }

  showApproval(data){
    debugger
    if(data == 'C'){
      this.showapproval = !this.showapproval
    }
    else{
      this.showapproval = !this.showapproval
      this.viewdata()
    }
    
  }

  viewdata(){
    debugger

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
       [{
        UserType : this.type,
        Euser : '16048',
        Flag : 'V'
      }],
      "requestId": "7282",
      "outTblCount": "0"
    }).then((response) => {
        debugger
      if (response.results[0].length > 0) {
        debugger
        // let data = this.utilServ.convertToObject(response);
        // this.ReportResponse = data
        // this.ReportResponseHeader = Object.keys(data[0])
        this.ReportResponse = response.results[0]
      }
      else{
        this.notif.error('No data found', '');
        this.ReportResponse = []
      }
      if(response.errorCode){
        this.notif.error(response.errorMsg, '');
        
      }
    })
  }

  ApproveorReject(type,data){
    debugger
    if(type == 'R'){
      debugger
      if(this.remarks == "" || this.remarks == undefined){
        this.notif.error('Please enter Rejected reason as remarks', '')
        return
      }
    }
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
       [{
        ClientCode : data.TradeCode,
        OldLGCode : '',
      	LGCode :data.LGCode,
      	EUser :'01671',
        ProcessFlag :'A' ,
        ID : data.ID,
        ApprovedFlag :type,
        ApprovRemarks : this.remarks
      }],
      "requestId": "7278",
      "outTblCount": "0"
    }).then((response) => {
        debugger
      if (response.results[0].length > 0) {
        if(response.results[0][0].Msg){
          this.notif.success(response.results[0][0].Msg, '');
          this.remarks = "";
          this.viewdata();
          this.GetCount();
          return
        }
        else{
          this.notif.success('Data saved sucessfully', '');
          this.remarks = "";
          return
        }
      }
      if(response.errorCode){
        this.notif.error(response.errorMsg, '');
        this.remarks = "";
        return
      }
    
    })

  }

  Pledgechange(data){
    debugger
    this.remarks = data
  }
}
