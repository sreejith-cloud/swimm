import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FindOptions, FormHandlerComponent, InputMasks, User, UtilService } from 'shared';
import { commissionTable } from './commissionTable';
import * as  jsonxml from 'jsontoxml';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

export interface remiserCommission {
  Remiser: any
  slabdesc: any;
}


@Component({
  selector: 'app-remiser-commission-slab',
  templateUrl: './remiser-commission-slab.component.html',
  styleUrls: ['./remiser-commission-slab.component.less'],
})
export class RemiserCommissionSlabComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  model: remiserCommission;

  currentUser: User;
  inputMasks = InputMasks;

  remiserData: any = [];
  tablerow: any = [];
  detailDataHeads: any = [];
  DetailData: any = [];
  data: any[] = [];

  isView: boolean = false;
  isSpining: boolean = false;
  clonegrid: boolean = false;
  isHistory: boolean = false;
  isRemiser: boolean = true;

  RemiserFindopt: FindOptions;

  cloneGrid: any = [];
  cloneGridHeader: any = [];
  userHtml: any;
  fromdate: any;
  todate: any;

  isSpinVisible: boolean = false;
  isSlabVisible: boolean= false;

  activeTabIndex: number;
  activeSlabData: any;
  activeSlab: any;
 
  constructor(
    private dataServ: DataService,
    private notif: NzNotificationService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.model = <remiserCommission>{};

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.RemiserFindopt = {
      findType: 6046,
      codeColumn: 'Code',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

  }

  ngOnInit() {

    this.remiserData = new commissionTable();
    this.tablerow.push(new commissionTable())
  }
  ngAfterViewInit() {
    this.formHdlr.setFormType('default');
    this.formHdlr.config.showPreviewBtn = false;
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showDeleteBtn = false;
    this.formHdlr.config.showSaveBtn = true;
  }

  addRow(i) {
    debugger
    this.remiserData = new commissionTable();
    this.tablerow.push(new commissionTable())
  }

  deleteRow(index) {
    if (this.tablerow.length > 1) {
      this.tablerow.splice(index, 1);
    }
  }

  editRow(i, flag) {
    debugger
    if (flag == true) {
      this.tablerow[i].disabled = false;
    }
    else {
      this.tablerow[i].disabled = true;
    }
    // while (i < value.length) {
    // }

  }


  save() {
    debugger

    if (!this.model.Remiser) {
      this.notif.error('Please Choose Remiser ID', '')
      return;
    }

    if (this.model.slabdesc == '' || this.model.slabdesc == null || this.model.slabdesc == undefined) {
      this.notif.error('Please enter slab description', '')
      return;
    }

    if (this.model.slabdesc.trim() == '') {
      this.notif.error('Please enter slab description', '')
      return;
    }

    var i = 0;
    while (i < this.tablerow.length) {
      debugger
      if (this.tablerow[i].FromSlab == null || this.tablerow[i].FromSlab == undefined || this.tablerow[i].FromSlab.toString() == '') {
        this.notif.error('Please enter From slab in table grid ' + (i + 1), '');
        return
      }
      if (this.tablerow[i].ToSlab == null || this.tablerow[i].ToSlab == undefined || this.tablerow[i].ToSlab.toString() == '') {
        this.notif.error('Please enter To slab in table grid ' + (i + 1), '');
        return
      }

      if (Number(this.tablerow[i].FromSlab) > Number(this.tablerow[i].ToSlab)) {
        this.notif.error('From slab greater than To slab in grid ' + (i + 1), '');
        return
      }

      if (this.tablerow[i].percentage == null || this.tablerow[i].percentage == undefined || this.tablerow[i].percentage.toString() == '') {
        this.notif.error('Please enter percentage in table grid ' + (i + 1), '');
        return
      }

      if (Number(this.tablerow[i].percentage) < 0 || Number(this.tablerow[i].percentage) > 100) {
        this.notif.error('Please check percentage  entered in table grid ' + (i + 1), '');
        return
      }
      i++;
    }

    i = 0;
    var tableDatas = [];
    var RemiserData = []

    while (i < this.tablerow.length) {
      tableDatas = [];
      tableDatas.push({ "RemiserCode": this.model.Remiser ? this.model.Remiser.Code : '' })
      tableDatas.push({ "FromSlab": this.tablerow[i].FromSlab })
      tableDatas.push({ "ToSlab": this.tablerow[i].ToSlab })
      tableDatas.push({ "Percentage": this.tablerow[i].percentage })
      RemiserData.push({ "Slabs": tableDatas })
      i++
    }

    var RemiserArray = this.utilServ.setJSONMultipleArray(RemiserData);
    var RemiserJson = jsonxml(RemiserArray);

    this.isSpining = true;

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Remiser: 0,
          Xmldata: RemiserJson,
          Euser: this.currentUser.userCode,
          slabdesc: this.model.slabdesc ? this.model.slabdesc : '',
          Flag: 'S',
          fromdate: '',
          todate: ''
        }],
      "requestId": "7914",
      "outTblCount": "0"
    }).then((response) => {
      debugger
      if (response.errorCode == 0) {
        if (response.results && response.results[0][0]) {
          if (response.results[0][0].errorCode == 0) {
            this.isSpining = false
            let i = 0
            // while (i < this.tablerow.length) {
            //   this.tablerow[i].disabled = true;
            //   i++
            // }
            this.Reset();
            this.notif.success(response.results[0][0].errorMessage, '');
          }
          else if (response.results[0][0].errorCode == 1) {
            this.isSpining = false
            this.notif.error(response.results[0][0].errorMessage, '');
          }
          else {
            this.isSpining = false
            this.notif.error('Error', '');
          }
        }
        else {
          this.isSpining = false
          this.notif.error('Error', '');
        }
      }
      else {
        this.isSpining = false
        this.notif.error(response.errorMsg, '');
      }
    })
  }

  Reset() {
    this.model.Remiser = '';
    this.model.slabdesc = '';
    this.remiserData = [];
    this.tablerow.splice(0)
    this.remiserData = new commissionTable();
    this.tablerow.push(new commissionTable())
    this.isRemiser = true;
  }


  ViewData(cloneRemiser) {

    if (cloneRemiser == null) {
      if (this.model.Remiser == '' || this.model.Remiser == null || this.model.Remiser == undefined) {
        this.notif.error('Please Choose Remiser ID', '')
        return;
      }
    }

    this.isSpining = true;
    var requestParams
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          Remiser: cloneRemiser ? cloneRemiser : this.model.Remiser ? this.model.Remiser.Code : '',
          Xmldata: '',
          Euser: this.currentUser.userCode,
          slabdesc: '',
          Flag: 'V',
          fromdate: '',
          todate: ''

        }],

      "requestId": "7914",
      "outTblCount": "0"
    }
    requestParams = reqParams
    this.dataServ.getResponse(requestParams).then(Response => {
      debugger
      this.isSpining = false;
      let data = this.utilServ.convertToObject(Response[0]);
      if (data.length > 0) {
        debugger
        this.isView = true;
        this.setTableRow(data)
        this.model.slabdesc = Response[1].rows[0][0];
        this.notif.success('Data pooled successfully', '')
      }
      else {
        this.OnRemiserChange(this.model.Remiser)
        this.notif.error('No data found', '')
        // this.formHdlr.config.showExportExcelBtn = false
        // this.formHdlr.config.showExportPdfBtn = false;
      }
    }, () => {
      this.notif.error("Server encountered an error", '');
    });

  }

  setTableRow(value) {
    debugger
    var i = 0;
    this.remiserData = [];
    this.tablerow.splice(0)
    this.remiserData = new commissionTable();

    while (i < value.length) {
      // this.tablerow[i].isView = true;
      this.tablerow.push(new commissionTable())

      this.tablerow[i].FromSlab = value[i].FromSlab ? value[i].FromSlab : 0;
      this.tablerow[i].ToSlab = value[i].ToSlab ? value[i].ToSlab : 0;
      this.tablerow[i].percentage = value[i].Percentage ? value[i].Percentage : 0;
      this.tablerow[i].disabled = true;
      i++
    }
  }

  handleCancelview() {
    this.clonegrid = false;
    this.isHistory = false;
  }

  clone() {
    debugger
    this.clonegrid = true;

    this.isSpining = true;
    var requestParams
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          Remiser: '0',
          Xmldata: '',
          Euser: this.currentUser.userCode,
          slabdesc: '',
          Flag: 'C',
          fromdate: '',
          todate: ''
        }],

      "requestId": "7914",
      "outTblCount": "0"
    }
    requestParams = reqParams
    this.dataServ.getResponse(requestParams).then(Response => {
      debugger
      this.isSpining = false;
      let clonedata = this.utilServ.convertToResultArray(Response[0]);
      if (clonedata.length > 0) {
        this.cloneGrid = clonedata
        this.userHtml = '';
        this.cloneGridHeader = Object.keys(clonedata[0])
      }
      else {
        this.notif.error('Error', 'No data found')
      }
    })

  }

  assignSlab(data) {
    debugger
    if (data) {
      this.remiserData = [];
      this.tablerow.splice(0)
      this.remiserData = new commissionTable();
      this.tablerow.push(new commissionTable())
      this.ViewData(data.RemiserCode)
      this.clonegrid = false;
    }
  }

  history() {
    debugger
    if (this.model.Remiser == '' || this.model.Remiser == null || this.model.Remiser == undefined) {
      this.notif.error('Please Choose Remiser ID', '')
      return;
    }

    this.isSpining = true;
    var requestParams
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
        [{
          Remiser: this.model.Remiser ? this.model.Remiser.Code : '',
          Xmldata: '',
          Euser: this.currentUser.userCode,
          slabdesc: '',
          Flag: 'H',
          fromdate: '',
          todate: ''
        }],
      "requestId": "7914",
      "outTblCount": "0"
    }
    requestParams = reqParams
    this.dataServ.getResponse(requestParams).then(Response => {
      debugger
      this.isSpining = false;
      let data = this.utilServ.convertToObject(Response[0]);
      if (data.length > 0) {
        debugger
        this.isHistory = true;
        this.cloneGrid = [];
        this.userHtml = this.sanitizer.bypassSecurityTrustHtml(data[0].HTML_Content);
        // this.userHtml = data[0].HTML_Content;
        // console.log(this.userHtml);
      }
      else {
        this.isHistory = false;
        this.notif.error('No data found', '')
      }
    }, () => {
      this.notif.error("Server encountered an error", '');
    });

  }

  OnRemiserChange(data) {
    debugger
    if (data && data.Code) {
      this.isRemiser = false;
    }
    else {
      this.isRemiser = true;
    }
    this.model.slabdesc = '';
    this.remiserData = [];
    this.tablerow.splice(0)
    this.remiserData = new commissionTable();
    this.tablerow.push(new commissionTable())
  }





  view() {
    // if (!this.model.Remiser) {
    //   this.notif.error('Please Choose Remiser ID', '')
    //   return;
    // }
    this.isSpinVisible = true;
    this.DetailData = []
    this.detailDataHeads = []

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Remiser: this.model.Remiser ? this.model.Remiser.Code : '',
          Xmldata: '',
          Euser: this.currentUser.userCode,
          slabdesc: '',
          Flag: 'R',
          fromdate: this.fromdate ? moment(this.fromdate).format(AppConfig.dateFormat.apiMoment) : '',
          todate: this.todate ? moment(this.todate).format(AppConfig.dateFormat.apiMoment) : '',

        }],

      "requestId": "7914",
      "outTblCount": "0"
    }).then((response) => {
      if (response && response[0]) {
        this.isSpinVisible = false;
        let data = this.convertToObject(response[0]);
        if (data.length > 0) {
          this.DetailData = data;
          console.log(this.DetailData);
          this.detailDataHeads = Object.keys(this.DetailData[0])
        }
        else {
          this.notif.error("No Data Found", '');
          return;
        }
      }
      else {
        this.notif.error("No Data Found", '');
        return;
      }
    })
  }

  convertToObject(response: any) {

    let objArr = [];
    for (let row of response.rows) {
      let object: any = []
      for (let i in row) {
        if (row[i] != null || row[i] != undefined) {
          if (row[i] == "Y" || row[i] == "N") {
            if (row[i] == "Y") {
              object[response.metadata.columns[i]] = true;
            } else {
              object[response.metadata.columns[i]] = false;
            }
          } else if (typeof row[i] == 'string' && row[i].indexOf("12:00:00 AM") >= 0) {
            object[response.metadata.columns[i]] = row[i].substr(0, 2) + "/" + row[i].substr(3, 2) + "/" + row[i].substr(6, 4);
          } else if (response.metadata.columnsTypes[i] == 'int' || response.metadata.columnsTypes[i] == 'numeric') {
            object[response.metadata.columns[i]] = Number(row[i]);
          } else {
            object[response.metadata.columns[i]] = row[i];
          }
        }
        else {
          object[response.metadata.columns[i]] = row[i];
        }
      }
      objArr.push(object);
    }
    return objArr;
  }

  clear() {
    this.model.Remiser = '';
    this.fromdate = '';
    this.todate = '';
    this.detailDataHeads = []
    this.DetailData = [];
  }

  viewRemiser(i, data) {debugger
    // this.activeTabIndex = 0
    this.isSlabVisible= true;
    this.activeSlabData = data.SlabData
    this.activeSlab = 'Slab : '+ data['Slab Description']

  }

  handleSlabCancel(){
    this.isSlabVisible = false;
  }
}
