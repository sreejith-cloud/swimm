import { Component, OnInit, ViewChild, ElementRef,AfterViewInit } from '@angular/core';
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
  selector: 'app-gfslacceptance',
  templateUrl: './gfslacceptance.component.html',
  styleUrls: ['./gfslacceptance.component.less']
})
export class GfslacceptanceComponent implements OnInit,AfterViewInit {
  @ViewChild('batch2') batch: ElementRef;
  batchNo:number
  currentUser: User;
  DetailData=[];
  isSpinVisible: boolean = false;
  detailDataHeads=[]
  DetailDataTemp=[]
  inputMasks = InputMasks;
  buttonactive:boolean=true
  remarks:String
  barcode:any;
  batchNumber:any;
  barcodeId:any;
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
   }
ngAfterViewInit(){
    this.batch.nativeElement.focus()
  }
  ngOnInit() {
  }

  view() {
    if(this.batchNo==null&&this.barcode==null){
      this.notification.warning('Warning','Please enter batch number or barcode')
      return;
    }
        this.isSpinVisible = true;
    
        let val;
        this.DetailData = [];
        this.detailDataHeads=[];
        this.dataServ.getResponse({
          "batchStatus": "false",
          
          "detailArray":
            [{
              
              "BatchNo" : this.batchNo?this.batchNo:0,
              "Euser" :this.currentUser.userCode,
              "BarCode":this.barcode?this.barcode:0
             
            }],
          "requestId": "6038",
          "outTblCount": "0"
    
        }).then((response) => {
          this.isSpinVisible = false;
          let data = this.utilServ.convertToObject(response[0]);
    
          if (data.length > 0) {
            this.DetailData = data;
            this.detailDataHeads=Object.keys(this.DetailData[0])
            this.buttonactive=false
            this.batchNumber=this.DetailData[0].BatchNo
            this.barcodeId=this.DetailData[0].BarCodeId

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
        this.notif.warning("Nothing to accept",'')
         return;
      }
            this.isSpinVisible = true;
        
            // var JSONData = this.utilServ.setJSONArray(this.DetailData);
            // var xmlData = jsonxml(JSONData);
            this.dataServ.getResultArray({
              "batchStatus": "false",
              
              "detailArray":
                [{
                  
                  "XMLData" : xmlData,
                  "BatchNo": Number(this.batchNumber)?Number(this.batchNumber):0,
                  "UserAction":'A',
                  "Euser" :this.currentUser.userCode,
                  "Remarks":this.remarks?this.remarks:''
                 
                }],
              "requestId": "6037",
              "outTblCount": "0"
        
            }).then((response) => {
              console.log(response)
              if(response.results[0][0].msg=='ACCEPT'){
                this.notification.success("HO Acceptance finished",'')
                this.isSpinVisible = false;
                // this.view();
               this.reset();
              }
              if(response.errorCode==1){
                this.notification.error(response.errorMsg,'')
              }
            })
            this.isSpinVisible = false;
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
        //  this.notif.warning("Nothing to Accept",'')
        // return;
      
      var JSONData = this.utilServ.setJSONArray(this.DetailDataTemp);
      var xmlData = jsonxml(JSONData);
      }else{
        this.notif.warning("Nothing to reject",'')
         return;
      }
            // var JSONData = this.utilServ.setJSONArray(this.DetailDataTemp);
            // var xmlData = jsonxml(JSONData);
            this.dataServ.getResultArray({
              "batchStatus": "false",
              
              "detailArray":
                [{
                  
                  "XMLData" : xmlData,
                  "BatchNo": this.batchNumber?this.batchNumber:0,
                  "UserAction":'R',
                  "Euser" :this.currentUser.userCode,
                  "Remarks":this.remarks?this.remarks:''
                 
                }],
              "requestId": "6037",
              "outTblCount": "0"
        
            }).then((response) => {
              console.log(response)
              if(response.results[0][0].msg=='REJECT'){
                this.notification.success("HO rejection done successfully",'')
                // this.view();
                this.reset();
              }
              if(response.errorCode==1){
                this.notification.error(response.errorMsg,'')
              }
            })
      }

      reset(){
        this.detailDataHeads=[];
        this.DetailData=[];
        this.DetailDataTemp = [];
        this.batchNo=null
        this.buttonactive=true
        this.remarks=''
        this.batchNumber=0
        this.barcodeId=0
        this.barcode=''
      }

}
