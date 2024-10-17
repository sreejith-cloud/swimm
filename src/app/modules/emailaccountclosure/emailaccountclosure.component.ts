import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, FindOptions, FormHandlerComponent, DataService, UtilService } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { UploadFile } from 'ng-zorro-antd';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
export interface reportData {
  client: any;
  dpClientid: any;
  dpid: any;
  clientcode: any;
  Tradecode: any;
  tradeCode: any;
  depository: string;
  depositoryList: string[];
  clientDetails: any;
  emailAddress: any;
  tradingAcno: boolean;
  nsdlAcno: boolean;
  cdslAcno: boolean;
  firstDocumentModel: any[];
  firstDocument: any;
  fileType: string;
  fileName: string;
  document: string;
  remark: string;
  firstHolderLocation: string;
  sourceClientId: string;
  slNo: any
  DpAcNO: any
}

export interface clientData {
  dpClientid: string;
  dpid: string;
  Tradecode: string;
  selectClient: boolean;
  location: string;
  dpAcno: string;
  clientId: string;
}

@Component({
  selector: 'app-emailaccountclosure',
  templateUrl: './emailaccountclosure.component.html',
  styleUrls: ['./emailaccountclosure.component.less']
})
export class EmailaccountclosureComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  model: reportData;
  TradeFindopt: FindOptions;
  DpClientId: any = {};
  DpIdFindopt: FindOptions;
  DpAcNOFindopt: FindOptions;
  isSpinning: boolean = false;

  pdfSrc: any;
  validateDetails: any = [];
  gridArray: clientData[] = [];
  currentUser: any;
  encryptData: string = '';
  Dpids: any;
  DpId: any;
  fileAsText: any;

  selectedClientData: any='';
  dpFilteredData: any= [];
  selectedFile: File | null = null;

  constructor(
    private authServ: AuthService,
    private notif: NzNotificationService,
    private sanitizer: DomSanitizer,
    private dataServ: DataService,
    private utilServ: UtilService,

  ) {

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user
    });

    this.model = <reportData>{}
    this.model.depositoryList = ['Trading Account', 'NSDL', 'CDSL']

    this.TradeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: '',
      descColumn: 'NAME',
      descLabel: '',
      hasDescInput: true,
      requestId: 8,
      whereClause: '1=1'
    }

    this.DpIdFindopt = {
      findType: 5006,
      codeColumn: 'DPID',
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
    this.model.document = '';
    this.formHdlr.setFormType('default');
    this.formHdlr.config.showSaveBtn = true;
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showDeleteBtn = false;
    this.model.tradingAcno = true;
    this.model.nsdlAcno = true;
    this.getDpid()
  }


  beforeDocumentUpload = (file: UploadFile): boolean => {
    if (file.type === 'message/rfc822') {
      this.model.firstDocumentModel = [file];
      this.model.fileType = file.type;
      this.model.fileName = file.name;
      this.encodeFirstDocumentFileAsURL(file);
    } else {
      this.model.fileName = '';
      this.notif.error('Please select a .eml file', '');
    }
    return false;
  }

  encodeFirstDocumentFileAsURL(file) {
    let fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = (event) => {
      if (event) {
        this.fileAsText = fileReader.result;
      }
      this.fileAsText = this.fileAsText.split("�").join("– ");
    };
  }

  /** final save */
  parseEml(emlContent) {
    const lines = emlContent.split('\n');
    const emailObject: any = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('From:')) {
        emailObject.from = line.substring(5).trim();
      } else if (line.startsWith('Subject:')) {
        emailObject.subject = line.substring(8).trim();
      } else if (line === '') {
        emailObject.body = lines.slice(i + 1).join('\n').trim();
        break;
      }
    }

    this.fileAsText = emailObject;
  }

  save() {
    if (!this.model.emailAddress) {
      this.notif.error('Email is required', '')
      return
    }
    if (!this.model.fileName) {
      this.notif.error('Please Upload Mail Document', '')
      return
    }
    this.isSpinning = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          TradeCode: '',
          DPID: this.model.dpid ? this.model.dpid : '',
          DPCLIENTID: this.model.DpAcNO ? this.model.DpAcNO : '',
          FROMMAILID: this.model.emailAddress ? this.model.emailAddress : '',
          MAILATTACHMENT: this.fileAsText ? this.fileAsText : '',
          EUSER: this.currentUser.userCode,
          UNIQUEKEY: this.encryptData ? this.encryptData : '',
          SlNo: 0,
          Remarks: this.model.remark ? this.model.remark : '',
          Loc: ''
        }],
      "requestId": "600006",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinning = false;
      if (response.results) {
        let resultSet = []
        resultSet = response.results[0]
        this.model.slNo = resultSet[0].SlNo
        let resultSet2 = response.results[1];
        resultSet2.forEach(element => {
          response.results[1]
        })
        let Status = resultSet2[0].Status
        if (Status == 1) {
          this.notif.error(resultSet2[0].Msg, '')
          this.reset();
          return
        }
        else {
          let date = new Date();
          let obj = {
            "plaintext": `${''}|${this.DpId ? this.DpId : ''}|${this.model.DpAcNO }|${this.model.emailAddress ? this.model.emailAddress : ''}|${date.getTime()}`,
            "request_type": "keyiv"
          }
          this.dataServ.post(environment.api_encryptdata_url, obj)
            .then(
              data => {
                this.encryptData = data["encryptedData"];
                this.saveEncryptData(resultSet[0].SlNo);

              }
            );
        }
      }
      else {
        let errorMsg = response.errorMsg ? response.errorMsg : 'Something Went Wrong!'
        this.notif.error(errorMsg, '')
        this.reset();
      }
    })
  }
  /* save EncryptData to DB */
  saveEncryptData(slno: any) {
    this.isSpinning = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          TradeCode: '',
          DPID: this.DpId ? this.DpId: '',
          DPCLIENTID: this.model.DpAcNO ? this.model.DpAcNO : '',
          FROMMAILID: this.model.emailAddress ? this.model.emailAddress : '',
          MAILATTACHMENT: this.model.document ? this.model.document : '',
          EUSER: this.currentUser.userCode,
          UNIQUEKEY: this.encryptData ? this.encryptData : '',
          SlNo: slno ? slno : '',
          Remarks: this.model.remark ? this.model.remark : '',
          Loc: ''
        }],
      "requestId": "600006",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinning = false;
      if (response.results) {
        let resultSet = []
        if (response.results[0].length < 2) {
          resultSet = response.results[0]
          let Msg = resultSet[0].Msg
          if (Msg) {
            this.notif.success(Msg, '');
            this.reset();
          }
        }
        let resultSet2 = response.results[1]
        let Status = resultSet2[0].Status
        let resultSet3 = response.results[2]
        let ClosureAndTransferFlag = resultSet3[0].ClosureAndTransferFlag
        if (ClosureAndTransferFlag == true) {
          this.notif.error('closure and transferable account not allowed', '')
          return
        }

      } else {
        let errorMsg = response.errorMsg ? response.errorMsg : 'Something Went Wrong!'
        this.notif.error(errorMsg, '')
      }

    })
  }
  /*  Tradecode model change */
  getDatabyTradecode() {
      this.isSpinning = true;
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            DPID: this.DpId ? this.DpId : '',
            DPClientid: this.model.DpAcNO ? this.model.DpAcNO : '',
            Flag: 'D'
          }],
        "requestId": "5056",
        "outTblCount": "0"
      }).then((response) => {
        this.isSpinning = false;
        if (response.results) {
          this.validateDetails = []
          let resultSet = response.results[0]
          if (resultSet && resultSet.length > 0) {
            this.showResult(resultSet);
          }
        }
        else {
          let errorMsg = response.errorMsg ? response.errorMsg : 'Something Went Wrong!'
          this.notif.error(errorMsg, '');
        }
      }, error => {
        this.isSpinning = false;
      })
  }
  /**  DpClientId model change */
  createdpTable(element) {
    this.model.dpid = element.Dpid.trim();
    this.model.dpClientid = { DpClientid: element.Clnt_id.trim() };
    this.model.tradeCode = element.Tradecode.trim();
    this.DpId = element.Dpid.trim();
    let tempObj = {
      dpClientid: this.model.dpClientid.DpClientid,
      dpid: element.Dpid,
      Tradecode: element.Tradecode,
      selectClient: false,
      location: element.Location,
      dpAcno: element.Clnt_id,
      clientId: element.Accountcode,
      Name: element.Name,
      PAN_GIR: element.PAN_GIR
    }
    this.gridArray = [tempObj]
  }

  /** selected client Result grid data */
  showResult(resultSet) {
    if (resultSet) {
      this.model.dpid = this.DpId;
      resultSet.forEach(element => {
        this.model.emailAddress = element.OFFEMAIL ? element.OFFEMAIL.toLowerCase() : '';
        this.model.clientcode = element.CLIENTID
        let tempObj = {
          dpClientid: element.DPACNO,
          dpid: element.DPID,
          Tradecode: this.model.tradeCode,
          selectClient: false,
          location: '',
          dpAcno: element.DPACNO,
          clientId: element.CLIENTID,
          emailId: element.OFFEMAIL,
          Name: element.Name,
          PAN_GIR: element.PAN_GIR
        }
        this.gridArray = [tempObj]
      });
    }
    else {
      this.model.dpid = "";
      this.model.dpClientid = { DpClientid: "" };
    }
  }
  /** Get Dpid list oninit */
  getDpid() {
    this.isSpinning = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 14
        }],
      "requestId": "3"
    }).then((response) => {
      this.isSpinning = false;
      let res: any;
      if (response) {
        if (response[0].rows.length > 0) {
          var ar = [{ DPID: '' }];
          this.Dpids = ar.concat(this.utilServ.convertToObject(response[0]));
          this.DpId = this.Dpids[0].DPID;
        }
      }
    },error=>{ this.isSpinning =false; });
  }
  /* DpId model change */
  getDPdetails(data) {
    this.DpAcNOFindopt = {
      findType: this.model.nsdlAcno ? 5071 : 5072,
      codeColumn: 'DPACNO',
      codeLabel: 'DPACNO',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "Dpid ='" + data + "'"
    }
  }

  /**
  *  Document download
  */
  Download() {
    this.pdfSrc = (this.sanitizer.bypassSecurityTrustResourceUrl('data:' + this.model.fileType + ';base64,' + this.model.document));
  }
  reset() {
    this.model.firstDocumentModel = null;
    this.model.fileType = '';
    this.model.fileName = ''
    this.model.emailAddress = '';
    this.model.DpAcNO = '';
    this.model.nsdlAcno = false;
    this.model.Tradecode = null;
    this.model.cdslAcno = false;
    this.gridArray = [];
    this.model.tradeCode = '';
    this.model.dpClientid = null;
    this.model.dpid = '';
    this.DpId = null;
    this.model.tradeCode = '';
    this.encryptData = '';
    this.model.document = '';
    this.model.emailAddress = '';
    this.model.remark = ''
  }

  getFilterdData(val: any) {
   if(val && val.length >= 3){
     this.isSpinning = true;
     this.dataServ.getResultArray({
       "batchStatus": "false",
       "detailArray":
         [{
            DPID        : this.DpId ? this.DpId : '',
            DPClientid  : val,
            Flag        : 'S'
         }],
       "requestId": "5056",
       "outTblCount": "0"
     }).then((response: any)=>{
       this.isSpinning = false;
       if (response.errorCode == 0 && response.results){
          this.dpFilteredData = response.results[0]
       }
     }, error => { this.isSpinning = false; })
   }
  }
  
 }
