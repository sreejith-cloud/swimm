import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions, UtilService, DataService, AuthService, FormHandlerComponent, AppConfig } from 'shared';
import { CollectionrequestsService } from './collectionrequests.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { differenceInCalendarDays } from 'date-fns';

export interface CollectionReqDetails {
  Location: any;
  Tradecode: any;
  kitno:any
  Status: string;
  type:any
  customer_mobile_no: string,
  paytype:any
}

@Component({
  selector: 'app-collectionrequests',
  templateUrl: './collectionrequests.component.html',
  styleUrls: ['./collectionrequests.component.less']
})
export class CollectionrequestsComponent implements OnInit, OnDestroy {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  locationFindopt: FindOptions;
  dpClientIdFindopt: FindOptions;
  TradecodeFindopt: FindOptions;
  currentUser: any;
  clientName: any
  Location: any
  isLoading: boolean = false;
  model: CollectionReqDetails;
  fdate = new Date();
  tdate = new Date();
  today=new Date()
  ReportResponseHeader: any = [];
  tableData: any = [];
  clientData: any = [];
  getStatuslist: any = [];
  Dpids: any;
  dataloadStream$: Subscription;
  locationview:boolean=false
  showallpending:boolean=true
  //isSourceExt:boolean=true

  isVisibleMod:boolean=false
  qrcodeurl:any
  upirefno:any
  invoiceNo:any
  dpclntid:any
  amount:any
  pa:any
  name:any
  tcode:any
  kitnoName:any

  constructor(
    private dataServ: DataService,
    private utilServ: UtilService,
    private notif: NzNotificationService,
    private authServ: AuthService,
    private CollectionServ: CollectionrequestsService,

  ) {
    
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.model = <CollectionReqDetails>{}
  }

  ngOnInit() {
    if (!((this.dataServ.branch == 'HO') || (this.dataServ.branch == 'HOGT'))) {
      this.model.Location = { Location: this.dataServ.branch };
      this.locationview=true;
    }
    this.loadSearch();
    this.model.paytype='QRCODE'
    this.formHdlr.setFormType('viewsave');
    this.formHdlr.config.showSaveBtn = false;
    this.model.Location = { Location: this.dataServ.branch };
    this.loadClientData();
    this.loadStatusData()
    //this.isSourceExt = true

    
  }

  // ngAfterViewInit() {

  //   if (this.dataServ.Source == 'ext') {
  //     this.isSourceExt = true
  //     this.model.kitno = this.dataServ.queryExtractedParams.KitNo
  //     //this.summary()
  //   }

  // }
  ngOnDestroy() {
    this.dataloadStream$.unsubscribe();
    console.log('unsubscribed');
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  disabledFutureDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, this.dataServ.finStartdate) < 0 || differenceInCalendarDays(current, this.today) > 0)
  };

  loadClientData() {
    this.dataloadStream$ = this.CollectionServ.collectionReqDetail.subscribe(item => {
      item ? this.clientData = item : this.clientData = []
    })

    if (this.clientData.length > 0) {
      console.log('collection req client data',this.clientData);
      this.clientData.forEach(item=>{
        this.model.Location=item.Location
        this.model.Tradecode=item.clientCode;
        this.model.type=item.Status;
        this.model.kitno=item.KitNo
        this.fdate=item.DATE
        this.model.Status='Pending'
      })
      this.preview()
    } else {
        this.model.Tradecode=''
        this.model.Status=''
        this.model.kitno=''
    }
  }
  
  loadSearch() {
    this.TradecodeFindopt = {
      findType: 4000,//6124
      codeColumn: 'ClientCode',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.locationFindopt = {
      findType: 4001,
      codeColumn: 'Location',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
  }

  loadStatusData() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Flag: '1',
          value: ''
        }],
      "requestId": "700007",
      "outTblCount": "0"
    }).then((response) => {
      this.isLoading = false;
      console.log('response', response);

      if (response && response.results[0]) {
        let Statuslist = response.results[0]
        if (Statuslist.length > 0) {
          this.getStatuslist = Statuslist
          this.model.Status='Pending'
          console.log(this.getStatuslist);
        } else {
          this.notif.error('status not found', '');
          return;
        }
      }
    })
  }
  /**
   * Mobile number ASCII Value select Only Numbers 0-9
   */
  onKeyPress(event) {
    if ((event.keyCode < 48 || event.keyCode > 57)) {
      if (43 == event.keyCode) return true;
      event.preventDefault();
    } else {
      return true;
    }
  }
  /**
   * function used to call ccavenue service for sending upi link
   */
  sendSMSLink(data, i) {
    this.isLoading = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          dpid: data.Dpid || '',
          dpclientid: data.Kitno || '',
          clientcode: data.ClientCode || '',
          filedata: data.Mobile || '',
          invoice_id: data.InvoiceNo || '',
          flag: 'FETCH'
        }],
      "requestId": "700003",
      "outTblCount": "0"
    }).then((response) => {
      this.isLoading = false;
      debugger
      if (response) {
        let orderdata = response.results[0]
        if (orderdata[0].error) {
          this.notif.error(orderdata[0].errorMessage, '');
          return;
        }
        if (orderdata.length > 0) {
          console.log('orderdata', orderdata[0]["customer_mobile_no"]);
          orderdata.forEach(element => {
            this.model.customer_mobile_no = element.customer_mobile_no
            // this.model.customer_name = element.customer_name,dpClientid
          });
          if (this.model.customer_mobile_no) {

            let obj = {
              "bill_delivery_type": orderdata[0]["bill_delivery_type"] || "SMS",
              "terms_and_conditions": orderdata[0]["terms_and_conditions"] || "terms and condition",
              "valid_for": orderdata[0]["valid_for"] || 2,
              "valid_type": orderdata[0]["valid_type"] || "days",
              "customer_name": orderdata[0]["customer_name"] || '',
              "customer_mobile_no": orderdata[0]["customer_mobile_no"] || '',
              // "customer_email_id":  '',
              "customer_email_id": orderdata[0]["customer_email_id"] || '',
              "customer_email_subject": orderdata[0]["customer_email_subject"] || '',
              "invoice_description": orderdata[0]["invoice_description"] || '',
              "amount": orderdata[0]["amount"] || 0,
              "sub_acc_id": orderdata[0]["sub_acc_id"] || '',
              "sms_content": orderdata[0]["sms_content"] || '',
              "clientcode": orderdata[0]["clientcode"] || '',
              "dpid": orderdata[0]["dpid"] || '',
              "dpclientid": orderdata[0]["dpclientid"] || ''
            }
            this.isLoading = true;
            this.dataServ.post(environment.api_collectionreq_sendlink, obj)
              .then(data => {
                this.isLoading = false;
                if (data) {
                  if (data["errorCode"] == 0) {
                    this.notif.success(data["errorMsg"], '')
                    this.tableData.forEach((itm, index) => {
                      if (i == index) {
                        itm.showSendIcon = true;
                      }
                    })
                  } else {
                    this.notif.error(data["errorMsg"], 'Try again later')
                  }
                } else {
                  this.notif.error('Server not available', '')
                }

              }
              );
          } else {
            this.notif.error('Mobile number not fetched', '')
          }
        } else {
          this.notif.error('No data found', '');
          return;
        }
      }
    })


  }
  validateData() {
    let response = {
      isValid: false,
      message: ''
    }

    if (!this.fdate) {
      response.isValid = false
      response.message = 'Please select Date.'
      return response
    }

    response.isValid = true
    response.message = ''
    return response
  }

  onChangeLocation(data){
    if(data==null){
      this.TradecodeFindopt = {
        findType: 4000,//6124
        codeColumn: 'ClientCode',
        codeLabel: '',
        descColumn: '',
        descLabel: '',
        hasDescInput: false,
        requestId: 8,
        whereClause: '1=1'
      }
    }
    else{
      this.TradecodeFindopt={
        findType: 4000,   //6100 6124
        codeColumn: 'ClientCode',
        codeLabel: '',
        descColumn: '',
        descLabel: '',
        hasDescInput: false,
        requestId: 8,
        whereClause: "Location ='" +data.Location+ "'"
        }
    }
  }
  /**
   * view button used to fetch table data
   */
  preview() {
    let validationStatus = this.validateData();
    if (!validationStatus.isValid) {
      this.notif.error(validationStatus.message, "");
      return;
    }
    //console.log('tcode',this.model.Tradecode);
    //let ccode=this.model.Location.Location.concat(this.model.Tradecode.TradeCode)
    // console.log('loc',this.model.Location);
    // console.log('tcode',this.model.Tradecode);
    // console.log('ccode',ccode);
    
    this.tableData=[]
    this.isLoading = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{

          BRANCH :this.model.Location?this.model.Location.Location:'',  
          Dpid    :'',  
          Dpclientid   :this.model.kitno?this.model.kitno:'',  
          CLIENTCODE   :this.model.Tradecode?this.model.Tradecode.ClientCode:'',  
          FROMDATE  :this.fdate? moment(this.fdate).format(AppConfig.dateFormat.apiMoment) : '',  
          TODATE      :this.tdate? moment(this.tdate).format(AppConfig.dateFormat.apiMoment) : '',
          MODE         :this.model.paytype,
          STATUS    :this.model.Status,  
          EUSER     :this.currentUser.userCode,
          ShowAllPnd   :this.showallpending==true?'Y':'N',
          ModuleId     :"10149"
          
        }],
      "requestId": "700001",
      "outTblCount": "0"
    }).then((response) => {
      this.isLoading = false;
      if (response && response.results[0]) {
        let orderdata = response.results[0]

        if (orderdata.length > 0) {
          this.tableData = orderdata
          this.tableData.forEach((itm, index) => {
            itm.showSendIcon = false
          })
          this.ReportResponseHeader = Object.keys(orderdata[0])
        } else {
          this.notif.error('No data found', '');
          return;
        }
      } else {
        this.notif.error('Server error', '');
        return;
      }
    })
  }

  filldata(data) {
    if (data == null) {
      return
    }
    this.resetForm();
    if (data != "" && data != null) {
      // this.model.Dpid = data.dpid.trim();
      // this.model.Dpclientid = { DpClientid: data.DpClientid.trim() };
      // this.model.Dpclientid = data.DpClientid.trim();
      this.model.Tradecode = { Tradecode: data.Tradecode.trim() }
    }
    else {
      // this.model.Dpid = "";
      // this.model.Dpclientid = { DpClientid: "" };
      this.model.Tradecode = { Tradecode: "" };
    }
  }

  showResult(data) {
    // if (data == null) {
    //   return;
    // }
    // if (data != "" && data != null) {
    //   // this.model.Dpid = data.DPID.trim();
    //   // this.model.Dpclientid = { DpClientid: data.DPACNO.trim() };
    //   this.model.Tradecode = { Tradecode: data.Tradecode.trim() }
    // }
    // else {
    //   // this.model.Dpid = "";
    //   // this.model.Dpclientid = { DpClientid: "" };
    //   this.model.Tradecode = { Tradecode: "" };
    // }
    
    // console.log(this.model.Tradecode);
    
  }

  resetForm() {
    this.model.Tradecode = '';
    // this.model.Dpid = '';
    // this.model.Dpclientid = '';
    if(this.locationview==false){
      this.model.Location = { Location: this.dataServ.branch };
    }    
    this.model.Tradecode = '';
    this.tableData = [];
    this.fdate = new Date();
    this.tdate = new Date();
    this.model.kitno=null;
    this.model.Status='Pending'
    this.model.paytype='QRCODE'
  }

  showqrcode(data,i){
    console.log('data',data);
    
    this.isVisibleMod=true
    this.isLoading=true
    this.invoiceNo=data.InvoiceNo
    this.amount=data.Amount
    this.pa=data.VPAID
    this.dpclntid=data.Kitno
    this.name=data.name
    this.tcode=data.ClientCode
    let kitnoOrDpacntno=Array.from(data.Kitno)[0]
    if(kitnoOrDpacntno=='g' || kitnoOrDpacntno=='G'){
      this.kitnoName='DP KITNO'
    }
    else{
      this.kitnoName='Dp Account Number'
    }
    
    this.dataServ.post(environment.api_getqrcode_url,{"data":data.Url},{ responseType: 'text' }).then(res=>{
      this.isLoading=false
      this.qrcodeurl=res
      console.log('url ',this.qrcodeurl);
    })
  }

  paytypeChange(){
    this.tableData=[]
    this.ReportResponseHeader=[]
  }

  handleCancelUPI(){
    this.isVisibleMod=false
    this.upirefno=''
  }

  ValidateupiRefNo(){
    if(!this.upirefno){
      this.notif.error('Please Enter the UPI Ref No','')
      return
    }
    if(this.upirefno.length!=12){
      this.notif.error('invalid UPI Ref No','')
      return
    }

    this.isVisibleMod=false
    this.isLoading=true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          PaymentRefNo:this.upirefno,
          TransactionId:this.invoiceNo,
          Euser:this.currentUser.userCode
        }],
      "requestId": "100353"
    }).then((response) => {
      if (response) {
          this.isLoading=false

          if(response.errorCode==1){
            this.notif.error(response.errorMsg,'')
            this.upirefno=''
          }
          else{
          let res = this.utilServ.convertToObject(response[0]);
          if(res[0].errorCode==1){
            this.notif.error(res[0].errorMsg,'')
            this.upirefno=''
          }
          else if(res[0].errorCode==0){
            this.notif.success(res[0].errorMsg,'')
            this.upirefno=''
            this.preview()
          }
          else{
            this.notif.error('ERROR!!','')
            this.upirefno=''
          }
        }
      }
    });
  }


}
