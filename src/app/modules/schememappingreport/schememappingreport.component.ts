import { Component, OnInit, ViewChild } from '@angular/core';
import { FormHandlerComponent } from 'shared';
import { FindOptions } from "shared";
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NzNotificationService } from 'ng-zorro-antd';
import { WorkspaceService } from 'shared';
import { AuthService } from 'shared';
import { User } from 'shared/lib/models/user';

@Component({
  selector: 'app-schememappingreport',
  templateUrl: './schememappingreport.component.html',
  styleUrls: ['./schememappingreport.component.less']
})
export class SchememappingreportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  TradeFindopt: FindOptions;
  stateFindopt: FindOptions;
  RegionFindopt: FindOptions;
  locationFindopt: FindOptions;
  DpClientidFindopt: FindOptions;
  DPIDFindopt: FindOptions;
  ApplicableforFindopt: FindOptions;
  SchemenameFindopt: FindOptions;
  Dpids: any;
  model: any = {}
  currentUser: User;
  trdcd: any;
  isSpinVisible: boolean;
  schemes: any = [];
  VoucherList: any = [];
  applicablefor: any;
  app: any;
  distinctapp: any;
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
    this.loadsearch();
  }
  ngOnInit() {
    this.formHdlr.setFormType('report');
    this.getDpid();
    this.getApplicablefor();
    this.formHdlr.config.showExportPdfBtn = false;
    this.formHdlr.config.showExportExcelBtn = false;
  }
  loadsearch() {
    this.stateFindopt = {
      findType: 1000,
      codeColumn: 'ReportingState',
      codeLabel: 'ReportingState',
      descColumn: 'StateCode',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

    this.RegionFindopt = {
      findType: 1004,
      codeColumn: 'REGION',
      codeLabel: 'REGION',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
      // whereClause: "ReportingState ='" + data.ReportingState + "'"
    }
    this.TradeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.DpClientidFindopt = {
      findType: 5021,
      codeColumn: 'DpClientid',
      codeLabel: 'DpClientid',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.DPIDFindopt = {
      findType: 5004,
      codeColumn: 'Dpid',
      codeLabel: 'Dpid',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.SchemenameFindopt = {
      findType: 5064,
      codeColumn: 'SchemeName',
      codeLabel: 'SchemeName',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
  }

  onChangestate(data) {
    if (data == null) {
      return
    }
    this.RegionFindopt = {
      findType: 1004,
      codeColumn: 'REGION',
      codeLabel: 'REGION',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "ReportingState ='" + data.ReportingState + "'"
    }
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "ReportingState ='" + data.ReportingState + "'"
    }
  }
  onChangeRegion(data) {
    if (data == null) {
      return
    }
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'Name',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "L.REGION ='" + data.REGION + "'"
    }
  }

  onChangeLocation(data) {
    if (data == null) {
      return
    }
    this.TradeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: "Location='" + data.Location + "'"
    }

    this.DpClientidFindopt = {
      findType: 5021,
      codeColumn: 'DpClientid',
      codeLabel: 'DpClientid',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "Location='" + data.Location + "'"
    }
  }
  onChangeScheme(data) {
    if (data != "" && data != null) {
      this.model.applicablefor = data.ApplicableType.trim();
      this.model.schemename = { SchemeName: data.SchemeName.trim() };
      // if (data.Location != null) {
      //   this.trdcd = data.Location.trim();
      //   this.model.location = { Location: data.Location.trim() }
      // }
    }
  }
  getApplicablefor() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
      [{
        Usercode: this.currentUser.userCode || '',
      }],
      "requestId": "7022"
    }).then((response) => {
      let res;
      if (response.errorCode == 0) {
        if (response.results && response.results[0].length > 0) {
          var app = [{ ApplicableType: '' }];
          this.applicablefor = app.concat(response.results[0]);
          // this.model.dpid = this.Dpids[0].Name;
        }
      }
    });
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
          // this.model.dpid = this.Dpids[0].Name;
        }
      }
    });
  }
  filldata(data) {
    // this.resetForm();
    if (data != "" && data != null) {
      this.model.dpid = data.dpid.trim();
      this.model.dpClientid = { DpClientid: data.DpClientid.trim() };
      this.model.Tradecode = { Tradecode: data.Tradecode.trim() };
      this.model
      if (data.Location != null) {
        this.trdcd = { Tradecode: data.Tradecode.trim() };
      }
    }
  }
  resetForm() {
    this.model.location = '';
    this.model.state = '';
    this.model.Region = '';
    this.model.Tradecode = '';
    this.model.dpid = '';
    this.model.dpClientid = '';
    this.model.schemename = '';
    this.VoucherList = [];
    this.model.applicablefor = '';
    this.loadsearch();
  }
  resetForm1() {
    this.VoucherList = [];
  }
  view() {
    this.resetForm1();
    this.isSpinVisible = true;
    let val;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
      [{
        Scheme_Name: this.model.schemename ? this.model.schemename.SchemeName : '',
        applicable_Type: this.model.applicablefor || '',
        Tradecode: this.model.Tradecode ? this.model.Tradecode.Tradecode : '',
        Euser: this.currentUser.userCode || '',
        dpid: this.model.dpid || '',
        dpClientId: this.model.dpClientid ? this.model.dpClientid.DpClientid : '',
        State: this.model.state ? this.model.state.ReportingState : '',
        Region: this.model.Region ? this.model.Region.REGION : '',
        Location: this.model.location ? this.model.location.Location : '',
      }],
      "requestId": "7020",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        // if (response.results && response.results[0] && response.results.rows[0].length > 0) {
        if (response.results && response.results[0].length > 0) {
          this.isSpinVisible = false;
          // this.VoucherList = this.utilServ.convertToObject(response.results.ro);
          this.VoucherList = response.results[0];
        }
        else {
          this.isSpinVisible = false;
          this.notif.error("No Data Found", '');
          return;
        }
      }
    })
    // }
  }
}