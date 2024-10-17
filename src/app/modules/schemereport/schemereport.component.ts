import { Component, OnInit, ViewChild } from '@angular/core';
import { FindOptions, AppConfig, DataService, User, AuthService, UtilService } from "shared";
import { NzNotificationService } from 'ng-zorro-antd';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { WorkspaceService } from 'shared';
import { FormHandlerComponent } from 'shared';
@Component({
  selector: 'app-schemereport',
  templateUrl: './schemereport.component.html',
  styleUrls: ['./schemereport.component.less']
})
export class SchemereportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  applicablefor: any;
  currentUser: User;
  isSpinVisible: boolean;
  VoucherList: any = [];
  model: any = {}
  applica: any = [];
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private wsServ: WorkspaceService,
    private notif: NzNotificationService) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }
  ngOnInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showExportExcelBtn = false;
    this.model.Shcemetype='Paid';
  }
Schemetypechange(data){
  debugger
  this.VoucherList=[];
  this.model.applicablefor=null;
  this.model.tradedp=null;
}
  view() {
    debugger
    if (!this.model.Shcemetype) {
      this.notification.error('please select Scheme Type', '')
      return;
    }
    this.VoucherList = [];
    this.isSpinVisible = true;
    let val;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
      [{
        SchemeType: this.model.Shcemetype ,
        ApplicableFor: this.model.applicablefor == 'ALL' ? '' : this.model.applicablefor || '',
        TrdorDP: this.model.tradedp || '',
      }],
      "requestId": "7035",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        debugger
        if (response.results && response.results[0].length > 0) {
          debugger
          this.isSpinVisible = false;
          this.VoucherList = response.results[0];
          debugger
        }
        else {
          debugger
          this.isSpinVisible = false;
          this.notif.error("No Data Found", '');
          return;
        }
      }
    })
  }
  resetForm() {
    this.VoucherList = [];
    this.model.Shcemetype = null;
    this.model.tradedp = null;
    this.model.applicablefor = null;
    this.model.Shcemetype='Paid'
  }
}