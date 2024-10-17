import { Component, OnInit, ViewChild } from '@angular/core';
import { log } from 'console';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService, DataService, FindOptions, FormHandlerComponent } from 'shared';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  TradeFindopt: FindOptions;
  Tradecode
  DetailData:Array<any> =[]
  isSpinning:boolean =false
  currentUser
  pageIndexVal:number=1
  row:number=5
  detailDataHeads:Array<string>=[]
  totalPages:number=0
  flag: string ='T';
  constructor(private dataServ: DataService,
    private authServ: AuthService,
    private notif: NzNotificationService,) {
      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      });
    this.TradeFindopt = {
      findType: 5098,
      codeColumn: 'ClientCode',
      codeLabel: 'TradeCode',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
   }

  ngOnInit() {
    this.formHdlr.config.showPreviewBtn=true
    // this.formHdlr.config.showExportExcelBtn=true
    this.formHdlr.config.showFindBtn=false
    this.formHdlr.config.showSaveBtn=false
    // this.tableData()
  }
    tableData() {
      if(!this.Tradecode)
    {
      this.notif.error("Please provide Tradecode", '',{ nzDuration: 1000});
      return
    }
      console.log(this.Tradecode);

      this.isSpinning = true;
      this.DetailData = [];
      this.detailDataHeads=[]
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray": [{
          Euser: this.currentUser && this.currentUser.firstname ? this.currentUser.firstname : '',
          Filename:  '',
          flag: this.flag,
          Tradecode :this.Tradecode.ClientCode?this.Tradecode.ClientCode:'',
          Page: (this.pageIndexVal-1)*this.row,
          FromDate:'',
          ToDate:''
        }],
        "requestId": "10000156",
        "outTblCount": "0"
      }).then((response) => {
        if (response.errorCode == 0) {
          if (response && response.results && response.results[0].length > 0) {
            this.DetailData = response.results[0]
            this.detailDataHeads = Object.keys(this.DetailData[0])
            this.isSpinning = false;
          }
          else {
            this.notif.error('No data found', '')
            this.isSpinning = false;
          }
          // this.totalPages =7//
          if(response && response.results && response.results[1] && response.results[1][0] && response.results[0].length > 0)
          {
          this.totalPages = response.results[1][0].Totalcount?response.results[1][0].Totalcount:0
          this.row = response.results[1][0].Pagecount?response.results[1][0].Pagecount:0
          }
        }
        else {
          this.notif.error(response.errorMsg, '')
          this.isSpinning = false;
        }
      })
    }


    reset()
    {
      this.totalPages =0
      this.row =5
      this.pageIndexVal=1;
      this.DetailData = [];
      this.detailDataHeads=[]
      this.flag='T'
      this.Tradecode=null
    }
    ExportExcelOFFile() {

      this.isSpinning = true;
      let reqParams = {
        "batchStatus": "false",
        "detailArray": [{
          Euser: this.currentUser && this.currentUser.firstname ? this.currentUser.firstname : '',
          Filename:  '',
          flag: 'X',
          Tradecode :'',
          Page: 0,
          FromDate:'',
          ToDate:''
        }],
        "requestId": "10000156",
        "outTblCount": "0",
      }
      reqParams['fileType'] = "3";
      reqParams['fileOptions'] = { 'pageSize': 'A3R' };
      let isPreview: boolean;
      isPreview = false;
      this.dataServ.generateReport(reqParams, isPreview).then((response) => {
        if (response.errorCode === 0) {
          if (response.errorMsg != undefined && response.errorMsg != '') {
            this.notif.error('No data to export', '');
            this.isSpinning = false;
          }
          else {
            if (!isPreview) {
              this.notif.success('File downloaded successfully', '');
              this.isSpinning = false;
            }
          }
        }
        else {
          this.notif.error(response.errorMsg, '')
          this.isSpinning = false;
        }
      }, () => {
        this.notif.error("Server encountered an Error", '');
        this.isSpinning = false;
      });
    }
}
