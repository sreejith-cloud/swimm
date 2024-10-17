import { Component, OnInit, ViewChild  } from '@angular/core';
import { NzMessageService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { DataService, FindOptions, FormHandlerComponent, User,AuthService,UtilService } from 'shared';

export interface ckycEmaillog {
  PAN: any;

}

@Component({
  selector: 'app-ckycemaillog',
  templateUrl: './ckycemaillog.component.html',
  styleUrls: ['./ckycemaillog.component.css']
})
export class CKYCEmaillogComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  currentUser: User;
  reportType:any = 'T';
  notification2:any='Notification with template'
  notification1:any ='Notification without template'
  model: ckycEmaillog;
  DpIDFindopt: FindOptions;
  DpAcNOFindopt: FindOptions;
  TradeFindopt: FindOptions;
  panFindOption: FindOptions;
  geojitUniqueCodeFindOption: FindOptions;
  Pan: any;
  Tradecode: any;
  uniqueCode: any;
  DpClientId: any
  DpId: any;
  Dpids: any;
  DocumentsArray:any[]=[];
  isSpining: boolean;
  fileName: any;
  file:any;
  uploadedFileType: string;
  isFileSelected: boolean;
  DocumentsArrayHeads: string[];
  alwaysDisabled :boolean =true;
  reportTypeList :any[]= [{reportName:'Notification without template',reportCode:'NT'},
                          {reportName:'Notification with template',reportCode:'T'}]
  reportCode
  isItemSelected: boolean;
  constructor(    private dataServ: DataService, 
                  private authServ: AuthService, 
                  private notif: NzNotificationService,
                  private utilServ: UtilService,

  )  {
    this.model = <ckycEmaillog>{

    };

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

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
    this.geojitUniqueCodeFindOption = {
      findType: 5036,
      codeColumn: 'AccountCode',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.TradeFindopt = {
      findType: 4000,
      codeColumn: 'Clientid',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.DpAcNOFindopt = {
      findType: 5006,
      codeColumn: 'DPACNO',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
  }

  ngOnInit() {

    this.formHdlr.config.showFindBtn = false
    this.formHdlr.config.showPreviewBtn = true
    this.formHdlr.config.showSaveBtn = false
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showCancelBtn = true;
    this.getDpid();
  }
  
  getDpid() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        Code: 1
      }],
      "requestId": "3"
    }).then((response) => {
      let res;
      if (response) {
        if (response[0].rows.length > 0) {
          var ar = [{ DPID: '' }];
          this.Dpids = ar.concat(this.utilServ.convertToObject(response[0]));
  
          this.DpId = this.Dpids[0].DPID;
          console.log(this.DpId)
         
        }
      }
    });
  }

  getDpdetails(data){
    console.log("HI",data)
    this.DpAcNOFindopt = {
      findType: 5006,
      codeColumn: 'DPACNO',
      codeLabel: 'DPACNO',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "dpid ='" + data + "'"
    }
  }

  fileChangeEvent = () => {
    return (file: UploadFile): boolean => {
      this.file = [file];
      this.uploadedFileType = file.type;
      console.log("",this.uploadedFileType)
      this.isFileSelected = true;
      if(this.uploadedFileType == 'csv'|| this.uploadedFileType == 'CSV'|| this.uploadedFileType == 'text/csv')  //this.uploadedFileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        {
          this.Tradecode='';
          this.Pan='';
          this.DocumentsArray=[];
          this.DpClientId='';
          this.DpId='';
          this.DocumentsArrayHeads=[];
      this.processFile()
        }
        else{
          this.notif.error('Please upload CSV file','')
          this.file = [];
          this.uploadedFileType = '';
          this.isFileSelected = false;
        }
      return false;
    };
  }

  search(){
    this.DocumentsArray=[];
    this.DocumentsArrayHeads=[];
    this.isSpining = true
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          flag :this.fileName?'B':'N',
          reportType :this.reportType?this.reportType:'',
          Pan :this.Pan? this.Pan.PAN:'',
          TradeCode : this.uniqueCode?this.uniqueCode.AccountCode:'',
          Dpid : this.DpClientId?this.DpClientId.DPID:'',
          DpClientId : this.DpClientId?this.DpClientId.DPACNO:'',
          fileName : this.fileName?this.fileName:''
        }],
      "requestId": "106496",
      "outTblCount": "0"
    })
      .then((response) => {
        this.isSpining = false;
        if(response.errorCode == 0)
          {
        this.DocumentsArray = response.results[0];
        this.DocumentsArrayHeads = Object.keys(this.DocumentsArray[0]);
          }
        else{
          this.notif.error(response.errorMsg,'')

        }


      })
  }
  setDpid(){
    this.DpId = this.DpClientId?this.DpClientId.DPID :'' ;
  }
  export()
  {
    this.isSpining = true;
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          flag :this.fileName?'B':'N',
          reportType :this.reportType?this.reportType:'',
          Pan :this.Pan? this.Pan.PAN:'',
          TradeCode : this.uniqueCode?this.uniqueCode.AccountCode:'',
          Dpid : this.DpClientId?this.DpClientId.DPID:'',
          DpClientId : this.DpClientId?this.DpClientId.DPACNO:'',
          fileName : this.fileName?this.fileName:''
        }],
      "requestId": "106496",
      "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3' };
    let isPreview: boolean;
    isPreview = false;

    this.dataServ.generateReport(reqParams, isPreview).then((response) => {
      this.isSpining = false;      
      if (response.errorMsg) {
        this.notif.error(response.errorMsg, '');
        return;
      }
      else {
        if (!isPreview) {
          this.notif.success('File downloaded successfully', '');
          return;
        }
      }
    }, () => {
      this.notif.error("Server encountered an Error", '');
    });
  }


  reset(){
    this.Tradecode='';
    this.Pan='';
    this.DocumentsArray=[];
    this.DpClientId='';
    this.DpId='';
    this.DocumentsArrayHeads=[];
    this.file = [];
    this.uploadedFileType = '';
    this.isFileSelected = false;
    this.fileName='';
  }

  processFile() {
    return new Promise((resolve, reject) => {
      let val = this.file;
      if (val) {
        val.status = "Processing";
        const formdata: FormData = new FormData();
        formdata.append('file', val[0]);
        this.isSpining = true;
        this.dataServ.ftpuploadFile(formdata).then((response: any) => {
          this.isSpining = false;
          if (response && response.errorCode == 0) {
            this.fileName = response.fileName;
            resolve(this.fileName)
            this.notif.success('File uploaded','')
          }
          else {
            this.notif.error(response.errorMsg, '');
          }
        });
      }
    });
  }

  fileClosedEvent(event){
    this.isFileSelected=false;
    this.file =[];
    this.uploadedFileType ='';
    this.fileName ='';
  }
 
}
