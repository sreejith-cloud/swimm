import { Component, OnInit, ViewChild} from '@angular/core';
import { DataService, AuthService, FindOptions, UtilService, InputMasks, PageService, Permissions } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import * as  jsonxml from 'jsontoxml';
import { Observable, interval, Subscription, BehaviorSubject } from 'rxjs';
import { validateConfig } from '@angular/router/src/config';


export interface IPVProcess{
  region:any;
  location:any;
  serialno:any;
  kitno:any;
  processtype:any;
  refresh:any
}

@Component({
  selector: 'app-aof-ipvprocess',
  templateUrl: './aof-ipvprocess.component.html',
  styleUrls: ['./aof-ipvprocess.component.less']
})
export class AofIpvprocessComponent implements OnInit {
  pagePerms: Permissions;
  private permissions: Permissions = new Permissions();
  model: IPVProcess
  currentUser: any;
  ClientDetails:any;
  changeClients:any =[];
  clientHeaders:any=[];
  ClientDetailsShow: boolean = false;

  RegionFindOption:FindOptions;
  locationFindOption:FindOptions;
  serialnoFindOption:FindOptions;
  kitnoFindOption:FindOptions;

  inputMasks = InputMasks

  updateSubscription: Subscription;
  refreshtime: any
  isSpinVisible : boolean = false

  dataVisible:boolean =false;
  showExport:boolean =false;
  showSave:boolean =false;
  dataContent:any;

  region:any;
  location:any;
  loc:any;
  loca:any;

  minrm:any;
  defaultrm:any;

  count: any;

  constructor(
    private dataServ:DataService,
    private authServ:  AuthService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private pagServ: PageService
  ) {
    this.authServ.getUser().subscribe(user => {
    this.currentUser = user;
    });
    this.model =<IPVProcess>{};

    this.RegionFindOption = {
      findType: 5091,
      codeColumn: 'Region',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }

    this.locationFindOption = {
      findType: 5091,
      codeColumn: 'Location',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }

    this.serialnoFindOption = {
      findType: 5091,
      codeColumn: 'Serialno',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.kitnoFindOption = {
      findType: 5091,
      codeColumn: 'Kitno',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause:  "1=1"
    }
    
   }

  ngOnInit() { 

    this.model.processtype = 'P'

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Region: '',
          Location:'',
          Serialno:'',
          Kitno: '',
          processtype :'G',
          filedata : '',
          Euser: this.currentUser.userCode,
        }],
      "requestId": "7058",
      "outTblCount": "0"
    }).then((response) => { 
      if (response.results && response.results[0] && response.results[0].length) {
        this.minrm = response.results[0][0].IPV_MIN_RefreshMinute
        this.defaultrm = response.results[0][0].IPV_Default_RefreshMinute
        this.model.refresh = this.defaultrm  
      }
    });
    
    this.updateSubscription = interval(60000).subscribe(
      (val) => { this.pooldata()
    });  

    this.updatePermissions()  
    setTimeout(() => {
      if (this.pagePerms.canPrint == false) {
        this.showExport = false;
      }
      else {
        this.showExport = true;
      }
      if (this.pagePerms.canAdd == true) {debugger
        this.showSave = true;
      }
      else {
        this.showSave = false;
      }
    }, 300) 
  }

regionchange(){
  if (this.model.region == null) {
    this.region = ''
    return
  }

  this.locationFindOption = {
    findType: 5091,
    codeColumn: 'Location',
    codeLabel: '',
    descColumn: '',
    descLabel: '',
    hasDescInput: false,
    requestId: 8,
    whereClause: this.region
  }
}

locationchange(){
  if (this.model.location == null) {
    this.location =''
    return
  }

  this.serialnoFindOption = {
    findType: 5091,
    codeColumn: 'Serialno',
    codeLabel: '',
    descColumn: '',
    descLabel: '',
    hasDescInput: false,
    requestId: 8,
    whereClause: this.location
  }
  this.kitnoFindOption = {
    findType: 5091,
    codeColumn: 'Kitno',
    codeLabel: '',
    descColumn: '',
    descLabel: '',
    hasDescInput: false,
    requestId: 8,
    whereClause: this.location
  }
}
  pooldata(){
    this.fresh(1)
    this.ClientDetailsShow = false
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Region: this.model.region?this.model.region.Region:'',
          Location: this.model.location?this.model.location.Location: '',
          Serialno: this.model.serialno?this.model.serialno.Serialno:'',
          Kitno: this.model.kitno?this.model.kitno.Kitno:'',
          processtype :this.model.processtype,
          filedata : '',
          Euser: this.currentUser.userCode,
        }],
      "requestId": "7058",
      "outTblCount": "0"
    }).then((response) => { 
      if (response.errorCode == 0) {
        if (response.results && response.results[0] && response.results[0].length) {
          this.count = response.results[0].length
          this.ClientDetailsShow = true
          this.ClientDetails = response.results[0]
          this.clientHeaders=Object.keys(this.ClientDetails[0])
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

  onprocesschange(i){
    this.ClientDetailsShow = false
    this.ClientDetails =''
  }

  Save(type){
    var processtpe 
    if(type == "P"){
      processtpe = "S"
    var clntdata = [];
    this.ClientDetails.forEach(items => {
      if (items.ipv == true ) {
        this.changeClients =[];
        this.changeClients.push(items)
        clntdata.push({"client":this.changeClients})
      }
    })
    
  }
  else if(type == "A"){
    processtpe = "L"
    var clntdata = [];
    this.ClientDetails.forEach(items => {
      if (items.ipvurl != null ) {
        this.changeClients =[];
        this.changeClients.push(items)
        clntdata.push({"client":this.changeClients})
      }
    })
    this.ClientDetails.forEach(items => {
      if (items.ipv_url != null ) {
        this.changeClients =[];
        this.changeClients.push(items)
        clntdata.push({"client":this.changeClients})
      }
    })
  }
 
  if(clntdata && clntdata.length){
 
    var fullData = [];
    var changeaccountXML = '';

    fullData = this.utilServ.setJSONMultipleArray(clntdata);
    changeaccountXML = jsonxml(fullData);

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Region: this.model.region?this.model.region.Region:'',
          Location: this.model.location?this.model.location.Location:'',
          Serialno: this.model.serialno?this.model.serialno.Serialno:'',
          Kitno: this.model.kitno?this.model.kitno.Kitno:'',
          processtype :processtpe,
          filedata : changeaccountXML?changeaccountXML:'',
          Euser: this.currentUser.userCode,
        }],
      "requestId": "7058",
      "outTblCount": "0"
    }).then((response) => { 
      if (response.errorCode == 0) {
        this.notif.success('Saved Sucessfull', '')
        this.onprocesschange(1)
      }
      else {
        this.notif.error(response.errorMsg, '')
      }
    })
  }
  else{
    this.notif.error('No Data Selected', '')
  }
  }

  fresh(data){
      setTimeout(() => {
        if(Number(this.model.refresh) < this.minrm){
          this.model.refresh = this.defaultrm
        this.notif.error('Enter value greater than '+this.minrm, '')
        }
        else{
          this.refreshdata()
        }
      }, 2000); 
  }

  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
  }

  // Validate(data){debugger
  //   if(this.model.refresh < this.minrm){
  //     return false
  //   }
  //   if (data.target.selectionStart == 0) {
  //     if(data.key == 0)
  //     return false
  //     else
  //     return true
  //   }
  //   else{
  //     return true
  //   }
  // }

  Export(){
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          Region: this.model.region?this.model.region.Region:'',
          Location: this.model.location?this.model.location.Location:'',
          Serialno: this.model.serialno?this.model.serialno.Serialno:'',
          Kitno: this.model.kitno?this.model.kitno.Kitno:'',
          processtype :this.model.processtype,
          filedata : '',
          Euser: this.currentUser.userCode,
        }],
      "requestId": "7058",
      "outTblCount": "0"
    }

    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3R' };
    let isPreview: boolean;
    isPreview = false;
    this.isSpinVisible = true;
    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
       this.isSpinVisible = false;

      if (response.errorMsg != undefined && response.errorMsg != '') {
        this.isSpinVisible = false;
        this.notif.error("No Data Found", '');
        return;
      }
      else {
        if (!isPreview) {
          this.isSpinVisible = false;
          this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an Error", '');
    });
  }

  Showdata(items){
    if (items.Kitno == null) {
      return
    }
    else {
      this.dataContent = items
      this.dataVisible = true; 
    }
  }

  handleCancel(): void {
    this.dataVisible = false;
  }

  updatePermissions() {
    this.pagePerms = this.pagServ.getPermissions();
  }

  refreshdata(){
    this.updateSubscription.unsubscribe();
    if(this.model.refresh ==""){
    this.model.refresh  = this.defaultrm 
    }
    this.refreshtime = this.model.refresh ? this.model.refresh*60000:600000
    this.updateSubscription = interval(this.refreshtime).subscribe(
      (val) => {  this.pooldata()  
    });  
  }

}
