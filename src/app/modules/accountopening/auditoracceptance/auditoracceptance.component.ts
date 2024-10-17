import { Component, OnInit, ViewChild, ElementRef ,AfterViewInit} from '@angular/core';
import { LookUpDialogComponent } from 'shared';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import * as moment from 'moment';
import { AppConfig } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import * as FileSaver from 'file-saver';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WorkspaceService } from 'shared';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as  jsonxml from 'jsontoxml'
import { empty } from '@angular-devkit/schematics';
import { dematmodel } from '../dstat';
import { InputMasks, InputPatterns } from 'shared';

@Component({
  selector: 'app-auditoracceptance',
  templateUrl: './auditoracceptance.component.html',
  styleUrls: ['./auditoracceptance.component.less']
})
export class AuditoracceptanceComponent implements OnInit,AfterViewInit {
  @ViewChild('batch1') batch: ElementRef;
  batchNo:number;
   currentUser: User;
    DetailData=[];
    DetailDataTemp=[];
    isSpinVisible: boolean = false;
    detailDataHeads=[]
    inputMasks = InputMasks;
    buttonactive:boolean=true
    remarks:string
    acSerialNumber:any=null;
    benId:any=null;
    barcode:any=null;
    FindBenid:FindOptions
    findBarcode:FindOptions
    FindAcSerialNumber:FindOptions

  constructor(
    private utilServ: UtilService,
    private dataServ: DataService,
    private authServ: AuthService,
    private sanitizer: DomSanitizer,
    private wsServ: WorkspaceService,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private notif: NzNotificationService
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.FindBenid = {
      findType: 3004,
      codeColumn: 'DpAccountBenId',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.findBarcode = {
      findType: 3004,
      codeColumn: 'BarCodeId',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.FindAcSerialNumber= {
      findType: 3004,
      codeColumn: 'AccountSerialNo',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
   }

  ngAfterViewInit(){
    this.batch.nativeElement.focus()
  }
  ngOnInit() {
  }
  view() {
    if((this.batchNo==null||this.batchNo==undefined) && (this.acSerialNumber==null||this.acSerialNumber==undefined) && (this.benId==null||this.benId==undefined) && (this.barcode==null||this.barcode==undefined)){
      this.notification.warning('Warning','Please fill any field')
      return;
    }
        this.isSpinVisible = true;
        let val;
        this.dataServ.getResponse({
          "batchStatus": "false",
          "detailArray":
            [{
              
              "BatchNo" : this.batchNo?this.batchNo:0,
              "Euser" :this.currentUser.userCode,
              "BenId"  :this.benId?this.benId.DpAccountBenId:'',
              "AccountSerialNo":this.acSerialNumber?this.acSerialNumber:0,
              "BarCode":this.barcode?this.barcode.BarCodeId:0
            }],
          "requestId": "6045",
          "outTblCount": "0"
        }).then((response) => {
          this.isSpinVisible = false;
          let data = this.utilServ.convertToObject(response[0]);
          if (data.length > 0) {
            this.DetailData = data;
            this.detailDataHeads=Object.keys(this.DetailData[0])
             this.buttonactive=false;
          }
          else {
            this.notification.error("No Data Found", '');
            return;
          }
        })
    
      }
AcceptData(){
  // if(this.batchNo==null){
  //   this.notification.warning('Warning','Please Give Batch Number')
  //   return;
  // }
      // this.isSpinVisible = true;
      this.DetailDataTemp = [];
      for(var i=0; i<=this.DetailData.length-1;i++){
        if(this.DetailData[i].selectedtopool==true){
          this.DetailDataTemp.push(this.DetailData[i])
        }
      }

      if(this.DetailDataTemp.length>0){
        //  this.notif.warning("Nothing to Accept",'')
        // return;
      
      var JSONData = this.utilServ.setJSONArray(this.DetailDataTemp);
      var xmlData = jsonxml(JSONData);
      }else{
        this.notif.warning("Nothing to Accept",'')
         return;
      }

      this.dataServ.getResultArray({
        "batchStatus": "false",
        
        "detailArray":
          [{
            
            "XMLData" : xmlData,
            "BatchNo": this.batchNo?this.batchNo:0,
            "UserAction":'A',
            "Euser" :this.currentUser.userCode,
            "Remarks":this.remarks?this.remarks:''
           
          }],
        "requestId": "6046",
        "outTblCount": "0"
  
      }).then((response) => {
        console.log(response)
        if(response.results[0][0].msg=='ACCEPT'){
          this.notification.success("Auditor acceptance done successfully",'')
          // this.view();
          this.reset();
        }
        if(response.errorCode==1){
          this.notification.error(response.errorMsg,'')
        }
      })
}


RejectData(){
  // if(this.batchNo==null){
  //   this.notification.warning('Warning','Please Give Batch Number')
  //   return;
  // }
      // this.isSpinVisible = true;
      this.DetailDataTemp = [];
      for(var i=0; i<=this.DetailData.length-1;i++){
        if(this.DetailData[i].selectedtopool==true){
          this.DetailDataTemp.push(this.DetailData[i])
        }
      }
         if(this.DetailDataTemp.length>0){
        //  this.notif.warning("Nothing to Reject",'')
        // return;
      
      var JSONData = this.utilServ.setJSONArray(this.DetailDataTemp);
      var xmlData = jsonxml(JSONData);
  
          }else{
        this.notif.warning("Nothing to Reject",'')
         return;
      }
      this.dataServ.getResultArray({
        "batchStatus": "false",
        
        "detailArray":
          [{
            
            "XMLData" : xmlData,
            "BatchNo": this.batchNo?this.batchNo:0,
            "UserAction":'R',
            "Euser" :this.currentUser.userCode,
            "Remarks":this.remarks?this.remarks:''
           
          }],
        "requestId": "6046",
        "outTblCount": "0"
  
      }).then((response) => {
        console.log(response)
        if(response.results[0][0].msg=='REJECT'){
          this.notification.success("Auditor rejection done successfully",'')
          // this.view();
          this.reset();
        }
        if(response.errorCode==1){
          this.notification.error(response.errorMsg,'')
        }
      })
}
reset(){
  this.batchNo=null
  this.DetailData = [];
            this.detailDataHeads=[]
            this.DetailDataTemp=[]
            this.buttonactive=true
            this.remarks=''
            this.acSerialNumber=null;
            this.benId=null;
            this.acSerialNumber=null;
}

}
