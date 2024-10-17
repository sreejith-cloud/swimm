import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { DataService, AuthService, User, FindOptions, FormHandlerComponent } from 'shared';
import { DatePipe } from '@angular/common';
import { differenceInCalendarDays } from 'date-fns';
export interface Dropdown {
  label: string;
  value: string
}
export interface exchangeDropdown {
  Product_Text: string;
  Product_Value: string
}

export interface dropDownCode {
  Code:string
}
export interface  counterTable{
  Ins_code:string
  Symbol:string
  FixedBrokerage:string
  NewFixedBrokerage:string
  BrokerageDiscountpermissionFor_RM:string
  BrokerageDiscountpermissionFor_SH:string
  BrokerageDiscountpermissionFor_AD:string
  EDApprovalreqd:string
}
export interface commudityTable{
  Instrument:string
  Product:string
  Symbol:string
  NormalBrok:string
  CurNormalBrok:string
  IntradayBrok:string
  CurIntradayBrok:string
}
@Component({
  selector: 'app-brokerage-revision',
  templateUrl: './brokerage-revision.component.html',
  styleUrls: ['./brokerage-revision.component.css']
})
export class BrokerageRevisionComponent implements OnInit {
  dateofEffect: Date
  entryFieldsShow: boolean = false
  currentUser: User;
  TradeFindopt: FindOptions;
  symbolFindOpt: FindOptions;
  futuresSymbolOpt: FindOptions;
  optionsSymbolOpt: FindOptions;
  FuturesSymbol: any = ''
  OptionsSymbol: any = ''
  symbol: any = ''
  Tradecode
  detailData = []
  detailDataTitles = ['test', 'test2', 'test3', 'test4']
  detailDataHeads = ['test', 'test2', 'test3', 'test4']
  currentBrokerage: string = 'D'
  isSpining: boolean = false
  instrumentDropdowns: Dropdown[] = [
    // { label: 'FUTCOM', value: 'FUTCOM' },
    // { label: 'FUTIDX', value: 'FUTIDX' },//
    // { label: 'OPTCOM', value: 'OPTCOM' },//
    // { label: 'OPTFUT', value: 'OPTFUT' }
  ]
  exchangeDropdowns: exchangeDropdown[] = [
    // { label: 'SELECT', value: '' },
    // { label: 'MCX', value: 'MCX' },
    // { label: 'NCDEX', value: 'NCDEX' },
    // { label: 'ICEX', value: 'ICEX' }
  ]

  instrument: string = 'FUTCOM'
  exchange: string = ''
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  // @ViewChild('formHdl2') formHdlr2: FormHandlerComponent;

  deliveryCheck: boolean = false
  equityOnlineBrokerageCheck: boolean = false
  futuresCheck: boolean = false
  optionsCheck: boolean = false
  futuresSymbolwiseCheck: boolean = false
  OptionsSymbolwiseCheck: boolean = false
  cdsFuturesCheck: boolean = false
  cdsOptionsCheck: boolean = false
  // mcxsxFuturesCheck:boolean=false
  // mcxsxOptionsCheck:boolean=false
  commcxFuturesCheck: boolean = false
  comncdexFuturesCheck: boolean = false
  // comicexFutures:boolean=false
  comOptionsCheck: boolean = false
  comSymbolwiseCheck: boolean = false
  bondCheck: boolean = false
  slbCheck: boolean = false
  hfcltype: string = ''
  hfRegion: string = ''
  hdnfldSLB_MIN: string = ''
  hdnfldSLB_MAX: string = ''
  hfSlno: string = ''
  hfRMApprovalreqdAmt: string = ''
  hfSHApprovalreqdAmt: string = ''
  hfSalesHeadsApprovalreqdAmt: string = ''
  hfRMApprovalreqd: string = ''
  hfSHApprovalreqd: string = ''
  hfSalesHeadsApprovalreqd: string = ''
  hfEDApprovalreqd: string = ''
  hfInscode: string = ''
  hfFutFixedBrok: string = ''
  lblFutFixedBrok: string = ''
  hfEDApprovalreqdAmt: string = ''
  hfProcode: string = ''
  hfOptFixedBrok: string = ''
  lblOptFixedBrok: string = ''

  deliveryDelivery: string = ''
  deliverySpeculation: string = ''
  deliveryMinBrokerage: string = ''
  equityDelivery: string = ''
  equitySpeculation: string = ''
  equityMinBrokerage: string = ''
  offlinePercentage: string = ''
  offlineLot: string = ''
  onlinePercentage: string = ''
  onlineLot: string = ''
  onlineIntradayBrokerage: string = ''
  onlineCarryForwardBrokerage: string = ''
  offlineIntradayBrokerage: string = ''
  offlineCarryForwardBrokerage: string = ''
  cdsFuturesDefaultBrokerage: string = ''
  cdsOptionsDefaultBrokerage: string = ''
  // mcxsxFuturesDefaultBrokerage:string=''
  // mcxsxOptionsDefaultBrokerage:string=''
  mcxNormal: string = ''
  mcxDelivery: string = ''
  mcxIntraday: string = ''
  ncdexNormal: string = ''
  ncdexDelivery: string = ''
  ncdexIntraday: string = ''
  optionNormal: string = ''
  optionIntraday: string = ''
  symbolOrAmountNormal: string = ''
  symbolOrAmountIntraday: string = ''
  exchangeOrSymbol: string = 'E'
  bonddelivery: string = ''
  bondspeculation: string = ''
  bondminbrokerage: string = ''
  slbpercentage: string = ''
  projectedBrokerage: string = ''
  reason: string = ''
  remark: string = ''

  FuturesSymbolField: string = ''
  OptionsSymbolField: string = ''
  ssqlExchange: string = ''

  delivaryAvailableSlabDropdowns: dropDownCode[] = []
  onlineAvailableSlabDropdowns: dropDownCode[] = []
  bondAvailableSlabDropdowns: dropDownCode[] = []
  delivaryAvailableSlab: string = ''
  onlineAvailableSlab: string = ''
  bondAvailableSlab: string = ''

  contrBrkDtsTable: counterTable[] = []
  contrBrkDtsTablShow: boolean = true
  commodityTable: commudityTable[] = []
  commodityTableShow: boolean = true

  btnSave: boolean = false
  divDisclaimer1:boolean =true
  divDisclaimer2:boolean =false
  tradecodeShow:boolean =false
  Qry:string=''
  today:Date =new Date
  constructor(private authServ: AuthService,
    private dataServ: DataService,
    private notif: NzNotificationService,
    private datepipe:DatePipe,
    private modalService: NzModalService) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    //   this.TradeFindopt = {
    //   findType: 3010,
    //   codeColumn: 'Tradecode',
    //   codeLabel: 'Tradecode',
    //   descColumn: 'NAME',
    //   descLabel: 'NAME',
    //   hasDescInput: true,
    //   requestId: 8,
    //   whereClause:  "LOCATION='" + this.dataServ.branch + "'"
    // }
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
    this.symbolFindOpt = {
      findType: 7005,
      codeColumn: 'S.Symbol',
      codeLabel: 'Symbol',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.futuresSymbolOpt = {
      findType: 7006,
      codeColumn: 'B.Symbol',
      codeLabel: 'Symbol',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
    this.optionsSymbolOpt = {
      findType: 7004,
      codeColumn: 'B.Symbol',
      codeLabel: 'Symbol',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
  }
  disabledFutureDate = (current: Date): boolean => {
    return (differenceInCalendarDays(current, this.today) > 0)
  };
  ngOnInit() {
    this.dateofEffect = new Date()
    this.getInstrument_Symbol()
    // this.Tradecode = { Location: 'PL', TradeCode: 'v083' }


    // this.Tradecode={Location:'kz',TradeCode:'C024'}
  }
  prefill()
  {
    this.deliveryCheck = true
    this.equityOnlineBrokerageCheck = true
    this.futuresSymbolwiseCheck = true
    this.OptionsSymbolwiseCheck = true
    this.comSymbolwiseCheck = true
    this.bondCheck = true

    this.futuresCheck = true
    this.optionsCheck = true
    this.cdsFuturesCheck = true
    this.cdsOptionsCheck = true
    this.commcxFuturesCheck = true
    this.comncdexFuturesCheck = true
    this.comOptionsCheck = true
    this.slbCheck = true

    this.hfcltype = ''

    this.deliveryDelivery =this.currentBrokerage ==='U'?'0.6': '0.3'
    this.deliverySpeculation = this.currentBrokerage ==='U'?'0.06':'0.03'
    this.equityDelivery = this.currentBrokerage ==='U'?'0.4':'0.2'
    this.equitySpeculation = this.currentBrokerage ==='U'?'0.4':'0.02'
    this.offlinePercentage = this.currentBrokerage ==='U'?'0.06':'0.04'
    this.offlineLot = ''
    this.onlinePercentage = this.currentBrokerage ==='U'?'0.04':'0.02'
    this.onlineLot = ''
    this.onlineIntradayBrokerage = this.currentBrokerage ==='U'?'21':'19'
    this.onlineCarryForwardBrokerage = this.currentBrokerage ==='U'?'21':'19'
    this.offlineIntradayBrokerage = this.currentBrokerage ==='U'?'151':'149'
    this.offlineCarryForwardBrokerage = this.currentBrokerage ==='U'?'201':'199'
    this.cdsFuturesDefaultBrokerage =this.currentBrokerage ==='U'?'6': '3'
    this.cdsOptionsDefaultBrokerage = this.currentBrokerage ==='U'?'8':'4'
    this.mcxNormal =this.currentBrokerage ==='U'?'0.05': '0.04'
    this.mcxDelivery = this.currentBrokerage ==='U'?'0.26':'0.24'
    this.mcxIntraday = this.currentBrokerage ==='U'?'0.06':'0.04'
    this.ncdexNormal = this.currentBrokerage ==='U'?'0.07':'0.03'
    this.ncdexDelivery = this.currentBrokerage ==='U'?'0.27':'0.23'
    this.ncdexIntraday = this.currentBrokerage ==='U'?'0.07':'0.03'
    this.optionNormal = this.currentBrokerage ==='U'?'251':'240'
    this.optionIntraday = this.currentBrokerage ==='U'?'160':'140'
    this.bonddelivery = this.currentBrokerage ==='U'?'0.8':'0.4'
    this.bondspeculation = this.currentBrokerage ==='U'?'0.08':'0.04'
    this.slbpercentage = this.currentBrokerage ==='U'?'17':'14'
    this.projectedBrokerage = this.currentBrokerage ==='U'?'600':'501'
    this.reason = this.currentBrokerage ==='U'?'res':'reasonss'
    this.remark = this.currentBrokerage ==='U'?'rem':'remarksss'
  }
  ngAfterViewInit() {
    this.formHdlr.config.showSaveBtn = false
    this.formHdlr.config.showFindBtn = false
    this.formHdlr.config.showPreviewBtn = true
  }

    currentBrokerageFunction() {
      console.log(this.currentBrokerage);

      if (this.currentBrokerage || this.currentBrokerage==='') {
          if (this.currentBrokerage === 'U') {
            this.modalService.confirm({
              nzTitle: '<i>Confirmation</i>',
              nzContent: '<b>Brokerage upward revision need to intimate the client with 30 days notice by email or letter. Do you want to continue.?</b>',
              nzOnOk: () => {
                this.reset('brok')
                // document.getElementById("divView").style.display = "block";
                // document.getElementById("divDown").style.display = "none";

                this.tradecodeShow = true
                this.entryFieldsShow = false
                // document.getElementById("divDisclaimer2").style.display = "block";
                // document.getElementById("divDisclaimer1").style.display = "none";
                this.divDisclaimer2=true
                this.divDisclaimer1=false
              },
              nzOnCancel: () => {
                this.reset('brok')
                this.currentBrokerage = undefined
                setTimeout(() => {
                  this.currentBrokerage = 'D'
                }, 10);
                console.log(this.currentBrokerage,"else");

                // ant-radio ant-radio-checked
                // this.currentBrokerage = undefined
              }
            });
              // if (confirm('Brokerage upward revision need to intimate the client with 30 days notice by email or letter. Do you want to continue.?')) {
              //     this.reset('brok')
              //     // document.getElementById("divView").style.display = "block";
              //     // document.getElementById("divDown").style.display = "none";

              //     this.tradecodeShow = true
              //     this.entryFieldsShow = false
              //     // document.getElementById("divDisclaimer2").style.display = "block";
              //     // document.getElementById("divDisclaimer1").style.display = "none";
              //     this.divDisclaimer2=true
              //     this.divDisclaimer1=false
              // }
              // else {
              //   this.reset('brok')
              //   this.currentBrokerage = undefined
              //   setTimeout(() => {
              //     this.currentBrokerage = 'D'
              //   }, 10);
              //   console.log(this.currentBrokerage,"else");

              //   // ant-radio ant-radio-checked
              //   // this.currentBrokerage = undefined
              // }
          }
          else
          {
            this.reset('brok')
            // document.getElementById("divView").style.display = "block";
            // document.getElementById("divDown").style.display = "none";
            this.tradecodeShow = true
            this.entryFieldsShow = false
            // document.getElementById("divDisclaimer1").style.display = "block";
            // document.getElementById("divDisclaimer2").style.display = "none";

            this.divDisclaimer1=true
            this.divDisclaimer2=false

          }
          console.log(this.currentBrokerage);


      }

  }

  view() {

    if(!this.currentBrokerage || this.currentBrokerage==='')
    {
      this.notif.error('Please select brokerage revision type','')
      return
    }
    if(!this.tradecodeShow && this.currentBrokerage==='U')
    {
      this.notif.error('Please confirm brokerage revision upward alert ','')
      return
    }
    if(!this.Tradecode)
    {
      this.notif.error('Please select tradecode','')
      return
    }
    console.log(this.Tradecode, "tradecode");
    this.detailData = []
    this.isSpining=true
    this.Search('', 'B.Symbol,B.Ins_code,FixedBrokerage', '', 'Symbol,Ins_code,FixedBrokerage', 'Symbol,Ins_code,FixedBrokerage', 'txtFutSybol,hfInscode,tbxOldFutBrok', 'No', 'N')
    this.SearchF('', 'B.Symbol,B.Ins_code,FixedBrokerage', '', 'Symbol', 'Symbol,Ins_code,FixedBrokerage', 'tbxOptions,hfProcode,tbxOldOptBrok', 'No', 'N')
    this.getData(0, "N");
    // this.rdlstComFutSymbol_SelectedIndexChanged()
  }
  getData(flag: number, type: string) {

    var del = '0.00', spec = '0.00', BrokMin = '0.00';

    if (type == "N") {
      if (this.deliveryDelivery !== "")
        del = this.deliveryDelivery

      if (this.deliverySpeculation !== "")
        spec = this.deliverySpeculation

      if (this.deliveryMinBrokerage != "")
        BrokMin = this.deliveryMinBrokerage
    }

    if (type == "B") {
      if (this.bonddelivery !== "")
        del = this.bonddelivery

      if (this.bondspeculation !== "")
        spec = this.bondspeculation

      if (this.bondminbrokerage != "")
        BrokMin = this.bondminbrokerage
    }

    if (type == "O") {
      if (this.equityDelivery != "")
        del = this.equityDelivery

      if (this.equitySpeculation !== "")
        spec = this.equitySpeculation

      if (this.equityMinBrokerage != "")
        BrokMin = this.equityMinBrokerage
    }
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Loc: this.Tradecode ? (this.Tradecode.Location ? this.Tradecode.Location.trim() : '') : '',
          tradecode: this.Tradecode ? (this.Tradecode.TradeCode ? this.Tradecode.TradeCode.trim() : '') : '',
          flag: flag,//this.currentBrokerage?Number(this.currentBrokerage):0,
          Delivery: del?Number(del):0,
          Speculation: spec?Number(spec):0,
          BrokMin: BrokMin?Number(BrokMin):0,
          usercode: this.currentUser.userCode ? this.currentUser.userCode : '',
        }],
      "requestId": "1000080",
      "outTblCount": "0"
    })
      .then((response) => {

        console.log("responsess", response);
        if (response.errorCode == 0) {
          if (response.results && response.results.length > 0) {
            let data1 = response.results[0]?response.results[0]:[]

            if (data1 && data1.length > 0) {
              if (data1[0].Msg) {
                this.notif.error(data1[0].Msg, '')
                this.isSpining = false
              }
              else {
                if (type === "N" && flag === 1) {
                  if(data1.length >0)
                  {
                  this.delivaryAvailableSlabDropdowns = data1
                  this.delivaryAvailableSlabDropdowns.unshift({ Code: 'Select' })
                  this.delivaryAvailableSlab='Select'
                  this.isSpining = false
                }
                else
                {
                  this.delivaryAvailableSlabDropdowns =[]
                  this.delivaryAvailableSlab=''
                  this.isSpining = false
                }
                }
                else if (type === "O" && flag === 1) {
                  if(data1.length >0)
                  {
                  this.onlineAvailableSlabDropdowns = data1
                  this.onlineAvailableSlabDropdowns.unshift({ Code: 'Select' })
                  this.onlineAvailableSlab='Select'
                  this.isSpining = false
                  }
                  else
                  {
                    this.onlineAvailableSlabDropdowns =[]
                    this.onlineAvailableSlab=''
                    this.isSpining = false
                  }
                }
                else if (type === "B" && flag === 1) {
                  if(data1.length >0)
                  {
                  this.bondAvailableSlabDropdowns = data1
                  this.bondAvailableSlabDropdowns.unshift({ Code: 'Select' })
                  this.bondAvailableSlab='Select'
                  this.isSpining = false
                }
                else
                {
                  this.bondAvailableSlabDropdowns =[]
                  this.bondAvailableSlab=''
                  this.isSpining = false
                }
                }
                else if (type === "N" && flag === 2) {
                  let x = 0
                  if (this.currentBrokerage === "D")
                    x = this.validateDownward(data1[0]);
                  else if (this.currentBrokerage === "U")
                    x = this.validateUpward(data1[0]);
                  else
                    x = 0
                  if (x == 1) {
                    this.saveToDB();
                  }
                  else {
                    this.isSpining=false

                    if (this.deliveryCheck && this.delivaryAvailableSlabDropdowns.length !== 0) {
                      this.delivaryAvailableSlabDropdowns = []
                      // this.delivaryAvailableSlab = ''
                      this.delivaryAvailableSlab = undefined
                    }
                    if (this.equityOnlineBrokerageCheck && this.onlineAvailableSlabDropdowns.length !== 0) {
                      this.onlineAvailableSlabDropdowns = []
                      // this.onlineAvailableSlab = ''
                      this.onlineAvailableSlab = undefined
                    }
                    if (this.bondCheck && this.bondAvailableSlabDropdowns.length !== 0) {
                      this.bondAvailableSlabDropdowns = []
                      // this.bondAvailableSlab = ''
                      this.bondAvailableSlab = undefined
                    }
                  }
                }
                else {
                  this.detailData = data1;
                  console.log(this.detailData);
                  this.entryFieldsShow = true
                  this.hfcltype = this.detailData[0].Cltype ? this.detailData[0].Cltype.trim() : '';

                  if(this.hfcltype === "NRE" || this.hfcltype === "NROCM" || this.hfcltype === "NRO")
                  {
                    // alert('For NRI clients please revise delivery & online brokerage');
                    this.modalService.info({
                      nzTitle: '<i>Info</i>',
                      nzContent: '<b>For NRI clients please revise delivery & online brokerage</b>',
                      nzOnOk: () => {
                      }

                    });
                  }
                  this.hfRegion = this.detailData[0].Region ? this.detailData[0].Region.trim() : '';
                  this.hdnfldSLB_MIN = this.detailData[0].SLB_MIN_Brokerage ? this.detailData[0].SLB_MIN_Brokerage.trim() : '';
                  this.hdnfldSLB_MAX = this.detailData[0].SLB_MAX_Brokerage ? this.detailData[0].SLB_MAX_Brokerage.trim() : '';
                  // this.prefill()//temporary
                  console.log(this.hfcltype,this.hfRegion,this.hdnfldSLB_MIN,this.hdnfldSLB_MAX,"tessss");

                  this.isSpining = false
                }
                // this.deliveryCheck =true
                // this.equityOnlineBrokerageCheck =this.detailData[0]?.ITClient
                // this.futuresCheck =
                // this.optionsCheck =
              }
            }
            else {
              this.notif.error('No Data found', '');
              this.isSpining = false


            }


          }
          else {
            this.notif.error('No Data found', '');
            this.isSpining = false


          }
        }
        else {
          this.notif.error(response.errorMsg, '');
          this.isSpining = false
        }

      })
  }



  // chkDelivery_CheckedChanged()
  // {
  //     if (this.deliveryCheck)
  //     {
  //         divDelivery.Visible = true;
  //     }
  //     else
  //     {
  //         divDelivery.Visible = false;
  //         txtDel.Text = "";
  //         txtSpec.Text = "";
  //         if (ddlSlab.Items.Count != 0)
  //         {
  //             ddlSlab.DataSource = "";
  //             ddlSlab.DataBind();
  //         }
  //     }
  // }

  // chkOnlineDelivery_CheckedChanged()
  // {
  //     if (chkOnlineDelivery.Checked == true)
  //     {
  //         divOnlineDelivery.Visible = true;
  //     }
  //     else
  //     {
  //         divOnlineDelivery.Visible = false;
  //         txtOnlineDel.Text = "";
  //         txtOnlineSpec.Text = "";
  //     }
  // }

  // chkFutures_CheckedChanged()
  // {
  //     if (chkFutures.Checked == true)
  //     {
  //         divFut.Visible = true;
  //     }
  //     else
  //     {
  //         divFut.Visible = false;
  //         txtFut1.Text = "";
  //         txtFut2.Text = "";
  //     }
  // }
  // chkCDSFut_CheckedChanged()
  // {
  //     if (chkCDSFut.Checked == true)
  //     {
  //         divCDSFut.Visible = true;
  //     }
  //     else
  //     {
  //         divCDSFut.Visible = false;
  //         txtCDSFut.Text = "";
  //     }
  // }
  // chkMCXSXFut_CheckedChanged()
  // {
  //     if (chkMCXSXFut.Checked == true)
  //     {
  //         divMCXSXFut.Visible = true;
  //     }
  //     else
  //     {
  //         divMCXSXFut.Visible = false;
  //         txtMCXSXFut.Text = "";
  //     }
  // }
  // chkComMCX_CheckedChanged()
  // {
  //     if (chkComMCX.Checked == true)
  //     {
  //         divComMCX.Visible = true;
  //     }
  //     else
  //     {
  //         divComMCX.Visible = false;
  //         txtMCXFutNormalBrkPer.Text = "";
  //         txtMCXFutDeliveryBrok.Text = "";
  //         txtMCXFutIntradayBrok.Text = "";
  //     }
  // }
  // chkComNCDEX_CheckedChanged()
  // {
  //     if (chkComNCDEX.Checked == true)
  //     {
  //         divComNCDEX.Visible = true;
  //     }
  //     else
  //     {
  //         divComNCDEX.Visible = false;
  //         txtNCDEXFutNormalBrok.Text = "";
  //         txtNCDEXFutDeliveryBrok.Text = "";
  //         txtNCDEXFutIntradayBrok.Text = "";
  //     }
  // }


  Clientidcheck(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  AllowTab(e) {
    let keyEntry = (e.keyCode) ? e.keyCode : e.which;
    if (keyEntry == '9')
      return true;
    else
      return false;
  }

  slabcheck(evt) {
    // document.getElementById("ddlSlab").value = "";
  }
  slabcheck1(evt) {
    // document.getElementById("ddlBondslab").value = "";
  }
  slabcheck2(evt) {
    // document.getElementById("ddlOnlineSlab").value = "";
  }
  numbercheck(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 47 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // checkView() {
  //     var a = document.getElementById('txtTradecode').value;

  //     if (a == '') {
  //         alert('Please enter Tradecode.');
  //         return false;
  //     }
  //     document.getElementById("divDown").style.display = "block";
  //     document.getElementById("divView").style.display = "block";
  //     document.getElementById("divDisclaimer2").style.display = "block";
  //     document.getElementById("divDisclaimer1").style.display = "block";
  //     return true;
  // }

  // handleChange() {
  //     var ret;
  //     var list = document.getElementById("rdbtnBrokRev"); //Client ID of the radiolist
  //     var inputs = list.getElementsByTagName("input");
  //     var selected;
  //     for (var i = 0; i < inputs.length; i++) {
  //         if (inputs[i].checked) {
  //             selected = inputs[i];
  //             break;
  //         }
  //     }

  //     if (selected) {
  //         if (selected.value == 'U') {
  //             if (confirm('Brokerage upward revision need to intimate the client with 30 days notice by email or letter. Do you want to continue.?')) {
  //                 document.getElementById("divView").style.display = "block";
  //                 document.getElementById("divDisclaimer2").style.display = "block";
  //                 document.getElementById("divDisclaimer1").style.display = "none";
  //                 document.getElementById("divDown").style.display = "none";
  //                 document.getElementById("txtTradecode").value = "";
  //                 document.getElementById("txtloc").value = "";
  //                 document.getElementById("lblMsg").value = "";
  //                 return true;
  //             }
  //             else {
  //                 return false;
  //             }
  //         }
  //         document.getElementById("divView").style.display = "block";
  //         document.getElementById("divDown").style.display = "none";
  //         document.getElementById("divDisclaimer1").style.display = "block";
  //         document.getElementById("divDisclaimer2").style.display = "none";
  //         document.getElementById("txtTradecode").value = "";
  //         document.getElementById("txtloc").value = "";
  //         document.getElementById("lblMsg").value = "";
  //     }
  //     return true;
  // }
  restrictAlphabets(key) {

    console.log(key, 'key');

    var keycode = (key.which) ? key.which : key.keyCode;
    //comparing pressed keycodes
    if (!(keycode == 8 || keycode == 46) && (keycode < 48 || keycode > 57)) {
      return false;
    }
    else {
      var parts = key.srcElement.value.split('.');
      if (parts.length > 1 && keycode == 46)
        return false;
      return true;
    }
    // var x = e.which || e.keycode;
    // if ((x >= 48 && x <= 57) || x == 8 ||
    //  (x >= 35 && x <= 40) || x == 46)
    //  return true;
    // else
    //   return false;
  }
  validate() {
    // if ((document.getElementById('<%= chkDelivery.ClientID  %>').checked == false) && (document.getElementById('<%= chkFutures.ClientID  %>').checked == false) && (document.getElementById('<%= chkCDSFut.ClientID  %>').checked == false) &&
    // (document.getElementById('<%= chkMCXSXFut.ClientID  %>').checked == false) && (document.getElementById('<%= chkOpt.ClientID  %>').checked == false) && (document.getElementById('<%= chkCDSOpt.ClientID  %>').checked == false) && (document.getElementById('<%= chkMCXSXOpt.ClientID  %>').checked == false)
    // && (document.getElementById('<%= chkComMCX.ClientID  %>').checked == false) && (document.getElementById('<%= chkComNCDEX.ClientID  %>').checked == false) &&
    // (document.getElementById('<%= chkComOptions.ClientID  %>').checked == false)&& (document.getElementById('<%= chkFutSyb.ClientID  %>').checked == false)&&(document.getElementById('<%= chkOptSyb.ClientID  %>').checked == false)&&(document.getElementById('<%= chkComICEX.ClientID  %>').checked == false)
    // && (document.getElementById('<%= chkComFutSymbol.ClientID  %>').checked == false) && (document.getElementById('<%= chkBond.ClientID  %>').checked == false) && (document.getElementById('<%= Checkslb.ClientID  %>').checked == false) && (document.getElementById('<%= chkOnlineDelivery.ClientID  %>').checked == false)
    // ) {
      // futuresSymbolwiseCheck
    if (!this.deliveryCheck && !this.equityOnlineBrokerageCheck && !this.futuresCheck
      && !this.optionsCheck
      && !this.futuresSymbolwiseCheck && !this.OptionsSymbolwiseCheck
      && !this.cdsFuturesCheck && !this.cdsOptionsCheck
      // && !this.mcxsxFuturesCheck && !this.mcxsxOptionsCheck
      && !this.commcxFuturesCheck && !this.comncdexFuturesCheck
      // && !this.comicexFutures
      && !this.comOptionsCheck && !this.comSymbolwiseCheck
      && !this.bondCheck && !this.slbCheck) {
      this.notif.error('Please select any of the checkboxes', '');
      return false;
    }
    else {
      if (this.deliveryCheck) {
        if (this.deliveryDelivery == '') {
          this.notif.error('Please enter Delivery Brokerage %', '')
          return false;
        }
        if (this.deliverySpeculation == '') {
          this.notif.error('Please enter Speculation Brokerage %', '')
          return false;
        }
      }
      if (this.equityOnlineBrokerageCheck) {
        if (this.equityDelivery == '') {
          this.notif.error('Please enter online Delivery Brokerage %', '')
          return false;
        }
        if (this.equitySpeculation == '') {
          this.notif.error('Please enter online Speculation Brokerage %', '')
          return false;
        }
      }
      if (this.futuresCheck) {
        var c = this.offlinePercentage;
        var d = this.offlineLot;
        var l = this.onlinePercentage;
        var k = this.onlineLot;
        console.log(c,d,l,k ,"cdlk");


        if ((c === '') && (d === '') && (l === '') && (k === '')) {
          this.notif.error('Please enter Future Brokerage % or Lot for Offline or Online', '')
          return false;
        }
        else {
          if (d !== '') {
            var s = d.substring(0, 1);
            console.log(s);

            if (s === "0") {
              this.notif.error('Please enter valid lot', '')
              return false;
            }
          }
          if (k !== '') {
            var j = k.substring(0, 1);
            console.log(j);

            if (j === "0") {
              this.notif.error('Please enter valid lot', '')
              return false;
            }
          }
        }

      }


      if (this.optionsCheck) {
        var e = this.onlineIntradayBrokerage
        var x = this.onlineCarryForwardBrokerage
        var y = this.offlineIntradayBrokerage
        var z = this.offlineCarryForwardBrokerage

        if ((e === '') && (x === '') && (y === '') && (z === '')) {
          this.notif.error('Please enter any one of options Lot', '')
          return false;
        }
        else {
          var t = e.substring(0, 1);
          var p = x.substring(0, 1);
          var q = y.substring(0, 1);
          var r = z.substring(0, 1);
          if ((t === "0") || (p === "0") || (q === "0") || (r === "0")) {
            this.notif.error('Please enter valid Lot', '')
            return false;
          }
        }
      }

      if (this.cdsFuturesCheck) {

        if (this.cdsFuturesDefaultBrokerage == '') {
          this.notif.error('Please enter CDS Future Lot', '')
          return false;
        }
        else {
          var u = this.cdsFuturesDefaultBrokerage.substring(0, 1);
          if (u === "0") {
            this.notif.error('Please enter valid Lot', '')
            return false;
          }
        }
      }


      if (this.cdsOptionsCheck) {
        if (this.cdsOptionsDefaultBrokerage == '') {
          this.notif.error('Please enter CDS options Lot', '')
          return false;
        }
        else {
          var v = this.cdsOptionsDefaultBrokerage.substring(0, 1);
          if (v === "0") {
            this.notif.error('Please enter valid Lot', '')
            return false;
          }
        }
      }

      // if (this.mcxsxFuturesCheck) {

      //     if (this.mcxsxFuturesDefaultBrokerage == '') {
      //         this.notif.error('Please enter MCXSX Future Lot','')
      //         return false;
      //     }
      //     else {
      //         var w = this.mcxsxFuturesDefaultBrokerage.substring(0, 1);
      //         if (w == "0") {
      //             this.notif.error('Please enter valid Lot','')
      //             return false;
      //         }
      //     }
      // }

      // if (this.mcxsxOptionsCheck) {
      //     if (this.mcxsxOptionsDefaultBrokerage == '') {
      //         this.notif.error('Please enter MCXSX options Lot','')
      //         return false;
      //     }
      //     else {
      //         var x = this.mcxsxOptionsDefaultBrokerage.substring(0, 1);
      //         if (x == "0") {
      //             this.notif.error('Please enter valid Lot','')
      //             return false;
      //         }
      //     }
      // }

      if (this.commcxFuturesCheck) {
        var MCXNormalPer = this.mcxNormal;
        var MCXDeliveryPer = this.mcxDelivery;
        var MCXIntraPer = this.mcxIntraday;

        if ((MCXNormalPer === '') && (MCXDeliveryPer === '') && (MCXIntraPer === '')) {
          this.notif.error('Please enter any of the COM-MCX Futures Brokerage %', '')
          return false;
        }

        if ((MCXNormalPer === "0") || (MCXDeliveryPer === "0") || (MCXIntraPer === "0")) {
          this.notif.error('Please enter valid COM-MCX Futures Brokerage %', '')
          return false;
        }
      }

      if (this.comncdexFuturesCheck) {
        var NCDEXNormalPer = this.ncdexNormal
        var NCDEXDeliveryPer = this.ncdexDelivery
        var NCDEXIntraPer = this.ncdexIntraday

        if ((NCDEXNormalPer === '') && (NCDEXDeliveryPer === '') && (NCDEXIntraPer === '')) {
          this.notif.error('Please enter any of the COM-NCDEX Futures Brokerage %', '')
          return false;
        }

        if ((NCDEXNormalPer === "0") || (NCDEXDeliveryPer === "0") || (NCDEXIntraPer === "0")) {
          this.notif.error('Please enter valid COM-NCDEX Futures Brokerage %', '')
          return false;
        }
      }


      if (this.comOptionsCheck) {
        var OptionsNormalLot = this.optionNormal
        var OptionsIntraLot = this.optionIntraday

        if ((OptionsNormalLot === '') && (OptionsIntraLot === '')) {
          this.notif.error('Please enter COM Options Lot', '')
          return false;
        }
        else {
          var OptionsNormal = OptionsNormalLot.substring(0, 1);
          var OptionsIntra = OptionsIntraLot.substring(0, 1);
          if ((OptionsNormal === "0") || (OptionsIntra === "0")) {
            this.notif.error('Please enter valid COM Options Lot', '')
            return false;
          }
        }
      }

      if (this.comSymbolwiseCheck) {

        var COMSymbol = this.symbol?this.symbol['B.Symbol']:''//document.getElementById('txtCOMSymbol').value;
        var COMNormalLot = this.symbolOrAmountNormal
        var COMIntraLot = this.symbolOrAmountIntraday
        // var list = document.getElementById("rdlstComFutSymbol"); //Client ID of the radiolist
        // var inputs = list.getElementsByTagName("input");
        // var selected;
        // for (var i = 0; i < inputs.length; i++) {
        //     if (inputs[i].checked) {
        //         selected = inputs[i];
        //         break;
        //     }
        // }

        if (this.exchangeOrSymbol) {
          if (this.exchangeOrSymbol !== '') {
            if (this.exchangeOrSymbol === 'E') {
              var exchange = document.getElementById("drpdwnExchange");
              var COMexchange = this.exchange;

              if (COMexchange !== '') {
                this.notif.error('Please Add the selected COM Options - Symbolwise', '')
                return false;
              }
            }
            else if (this.exchangeOrSymbol === 'S') {
              if (COMSymbol !== '') {
                this.notif.error('Please Add the selected COM Options - Symbolwise', '')
                return false;
              }
            }
          }
        }
        if (COMNormalLot !== '' || COMIntraLot !== '') {
          this.notif.error('Please Add the selected COM Options - Symbolwise', '')
          return false;
        }
      }

      if (this.bondCheck) {
        if (this.bonddelivery === '') {
          this.notif.error('Please enter Delivery Brokerage %', '')
          return false;
        }
        if (this.bondspeculation === '') {
          this.notif.error('Please enter Speculation Brokerage %', '')
          return false;
        }
      }
      if (this.slbCheck) {
        if (this.slbpercentage === '') {
          this.notif.error('Please enter slb Brokerage %', '')
          return false;
        }
      }

      if (this.projectedBrokerage === '') {
        this.notif.error('Please enter projected brokerage', '')
        return false;
      }
      if (Number(this.projectedBrokerage) < 500) {
        this.notif.error('Minimum projected brokerage should be 500', '')
        return false;
      }
      if (this.reason === '') {
        this.notif.error('Please enter reason for revision', '')
        return false;
      }
      console.log(this.deliveryCheck,this.bondCheck,this.equityOnlineBrokerageCheck);
      console.log("after");
      console.log(this.delivaryAvailableSlab,this.bondAvailableSlab,this.onlineAvailableSlab);


      if (this.deliveryCheck) {
          if (this.delivaryAvailableSlab ==undefined || this.delivaryAvailableSlab ==null  || this.delivaryAvailableSlab ==='Select' || this.delivaryAvailableSlab ==='') {
              this.notif.error("Please select any available slab",'');
              return false;
          }
      }
      if (this.bondCheck) {
          if (this.bondAvailableSlab==undefined || this.bondAvailableSlab==null || this.bondAvailableSlab === '' || this.bondAvailableSlab === 'Select') {
            this.notif.error("Please select any available slab",'');
              return false;
          }
      }
      if (this.equityOnlineBrokerageCheck) {
          if (this.onlineAvailableSlab==undefined || this.onlineAvailableSlab==null || this.onlineAvailableSlab === '' || this.onlineAvailableSlab === 'Select') {
              this.notif.error("Please select any available slab",'');
              return false;
          }
      }


      if ((!this.deliveryCheck || !this.equityOnlineBrokerageCheck) && (this.hfcltype === 'NRE' || this.hfcltype === 'NRO' || this.hfcltype === 'NROCM')) {
        this.notif.error("For NRI clients please revise delivery & online brokerage", '');
      }
    }

    // if (confirm('Do you want to continue?')) {
    //   return true;
    // }
    // else {
    //   return false;
    // }
    // console.log(boolf,"bool",bool);
    return true

  }

  save() {
    console.log(this.symbol,"save");
    console.log(this.OptionsSymbol);
    console.log(this.FuturesSymbol);


    if (this.validate()) {
      this.modalService.confirm({
        nzTitle: '<i>Confirmation</i>',
        nzContent: '<b>Do you want to continue?</b>',
        nzOnOk: () => {
      var x;

      //To check available slab
      this.isSpining=true
      if (this.deliveryCheck) {
        if (this.delivaryAvailableSlab==undefined || this.delivaryAvailableSlab==null || this.delivaryAvailableSlab ==='Select' || this.delivaryAvailableSlab ==='') {
          this.notif.error("Enter valid delivery and speculation.", '')
          this.isSpining=false
          return;
        }
      }
      if (this.futuresSymbolwiseCheck || this.OptionsSymbolwiseCheck) {
        if (this.contrBrkDtsTable.length > 0) {
        }
        else {
          this.notif.error("Please enter Futures/Options Symbol brokerage", '')
          this.isSpining=false
          return;
        }

      }
      if (this.comSymbolwiseCheck) {//validation added for COM Symbolwise Amountwise not available in dotnet
        if (this.commodityTable.length > 0) {
        }
        else {
          this.notif.error("Please enter COM Symbolwise Amountwise brokerage", '')
          this.isSpining=false
          return;
        }

      }
      if (this.FuturesSymbolField !== '' || this.OptionsSymbolField !== '') {
        this.notif.error("Please Add Futures/Options Symbol brokerage", '')
        this.isSpining=false
        return;
      }
      if (this.bondCheck) {
        if(this.bondAvailableSlab==undefined || this.bondAvailableSlab==null || this.bondAvailableSlab ==='' || this.bondAvailableSlab ==='Select') {
          this.notif.error("Enter valid delivery and speculation.", '')
          this.isSpining=false
          return;
        }
      }
      this.getData(2, 'N')
      },
        nzOnCancel: () => {
          this.isSpining=false
      }
      });
    }
    else{
      this.isSpining=false
    }
  }
  validateDownward(data) {
    console.log("validateDownward", data);

    var delivery, speculation, FutBrok, FutLot, cds, Futmin, optintraday, optcarryforward, OnlineSpecMax, OnlineDeliverymax, OnlineFutBrok;
    var comFut, ComFutDelivery, comOptintraday, comOptioncarryforward;

    // DataSet ds = new DataSet();
    // ds = getData(2,"N");
    delivery = data.DeliveryRackRate //Number(ds.Tables[0].Rows[0]["DeliveryRackRate"].ToString());
    speculation = data.SpecRackRate //Number(ds.Tables[0].Rows[0]["SpecRackRate"].ToString());
    FutBrok = data.FutureRackRate //Number(ds.Tables[0].Rows[0]["FutureRackRate"].ToString());
    OnlineSpecMax = data.OnlineSpecbrkMax //Number(ds.Tables[0].Rows[0]["OnlineSpecbrkMax"].ToString());
    OnlineDeliverymax = data.OnlineDeliverybrkMax //Number(ds.Tables[0].Rows[0]["OnlineDeliverybrkMax"].ToString());
    OnlineFutBrok = data.OnlineFuturesBrkPerMax //Number(ds.Tables[0].Rows[0]["OnlineFuturesBrkPerMax"].ToString());

    FutLot = 100;
    Futmin = 1;
    cds = 10;
    optintraday = 150;
    optcarryforward = 200;
    comFut = 0.05;
    ComFutDelivery = 0.25;
    comOptintraday = 150;
    comOptioncarryforward = 250;

    if (this.deliveryCheck) {
      if ((Number(this.deliveryDelivery) == Number(this.detailData[0].DlvBrokeragePercent)) && (Number(this.deliverySpeculation) == Number(this.detailData[0].SpecBrokeragePercent))) {
        this.notif.error("Not possible to change % equal to existing brokerage", '');
        return 0;
      }
      else {
        if (Number(this.deliveryDelivery) > Number(this.detailData[0].DlvBrokeragePercent)) {
          this.notif.error("Not possible to change % above existing brokerage", '');
          return 0;
        }
        if (Number(this.deliveryDelivery) > Number(delivery)) {
          this.notif.error("Not possible to change % above rack rate", '');
          return 0;
        }
        if (Number(this.deliverySpeculation) > Number(this.detailData[0].SpecBrokeragePercent)) {
          this.notif.error("Not possible to change % above existing brokerage", '');
          return 0;
        }
        if (Number(this.deliverySpeculation) > Number(speculation)) {
          this.notif.error("Not possible to change % above rack rate", '');
          return 0;
        }
      }
    }

    if (this.equityOnlineBrokerageCheck) {
      if ((Number(this.equityDelivery) == Number(this.detailData[0].OnlineDlvBrokerage)) && (Number(this.equitySpeculation) == Number(this.detailData[0].OnlineSpecBrokerage))) {
        this.notif.error("Not possible to change % equal to existing brokerage", '');
        return 0;
      }
      else {
        if (Number(this.equityDelivery) > Number(this.detailData[0].OnlineDlvBrokerage) && this.hfRegion != "MEA" && this.hfRegion != "KWT" && this.hfRegion != "OMN" && this.hfRegion != "BAH") {
          this.notif.error("Not possible to change % above existing brokerage", '');
          return 0;
        }
        if (Number(this.equityDelivery) > Number(OnlineDeliverymax) && this.hfRegion != "MEA" && this.hfRegion != "KWT" && this.hfRegion != "OMN" && this.hfRegion != "BAH") {
          this.notif.error("Not possible to change % above " + OnlineDeliverymax, '');
          return 0;
        }
        if (Number(this.equitySpeculation) > Number(this.detailData[0].OnlineSpecBrokerage))//Number(lblOnlinecurspec.Text))
        {
          this.notif.error("Not possible to change % above existing brokerage", '');
          return 0;
        }
        if (Number(this.equitySpeculation) > Number(OnlineSpecMax)) {
          this.notif.error("Not possible to change % above " + OnlineSpecMax, '');
          return 0;
        }
        //offline brokerage
        if ((Number(this.equityDelivery) > Number(this.detailData[0].DlvBrokeragePercent)) && this.hfRegion != "MEA" && this.hfRegion != "KWT" && this.hfRegion != "OMN" && this.hfRegion != "BAH") {
          this.notif.error("Not possible to change % above existing offline brokerage", '');
          return 0;
        }
        if (Number(this.equitySpeculation) > Number(this.detailData[0].OnlineSpecBrokerage)) {
          this.notif.error("Not possible to change % above existing offline brokerage", '');
          return 0;
        }
      }
    }

    if (this.futuresCheck) {
      if ((this.offlinePercentage != "") && (this.offlineLot != "")) {
        this.notif.error("You can request % wise or lot wise reduction any one only at a time", '')
        return 0;

      }
      else if (this.offlinePercentage != "") {
        if (Number(this.offlinePercentage) > Number(FutBrok)) {
          this.notif.error("Not possible to change % above rack rate", '')
          return 0;
        }
        if (Number(this.offlinePercentage) == Number(this.detailData[0].FuturesBrokeragePercent)) {
          this.notif.error("Not possible to change % equal to existing brokerage", '')
          return 0;
        }
      }
      else {
        if (this.offlineLot != "") {
          if (Number(this.offlineLot) > Number(FutLot)) {
            this.notif.error("lot wise reduction should not exceed rack rate", '')
            return 0;
          }
          if (Number(this.offlineLot) < Number(Futmin)) {
            this.notif.error("Not possible to change below 1 Rs.", '')
            return 0;
          }
          if (Number(this.offlineLot) == Number(this.detailData[0].FuturesBrokerageLot)) {
            this.notif.error("lot wise reduction should not equal to existing brokerage", '')
            return 0;
          }
        }
      }

      if ((this.onlinePercentage != "") && (this.onlineLot != "")) {
        this.notif.error("You can request % wise or lot wise reduction any one only at a time", '')
        return 0;
      }
      else if (this.onlinePercentage != "") {
        if (Number(this.onlinePercentage) > Number(OnlineFutBrok)) {
          this.notif.error("Not possible to change % above rack rate", '')
          return 0;
        }
        if (Number(this.onlinePercentage) == Number(this.detailData[0].FuturesPercent_Online)) {
          this.notif.error("Not possible to change % equal to existing brokerage", '')
          return 0;
        }
      }
      else {
        if (this.onlinePercentage != "") {
          if (Number(this.onlineLot) > Number(FutLot)) {
            this.notif.error("lot wise reduction should not exceed rack rate", '')
            return 0;
          }
          if (Number(this.onlineLot) < Number(Futmin)) {
            this.notif.error("Not possible to change below 1 Rs.", '')
            return 0;
          } this.onlineLot
          if (Number(this.onlineLot) == Number(this.detailData[0].FuturesperLot_Online)) {
            this.notif.error("lot wise reduction should not equal to existing brokerage", '')
            return 0;
          }
        }
      }
    }

    if (this.optionsCheck) {
      if (this.onlineCarryForwardBrokerage != "") {
        if (Number(this.onlineIntradayBrokerage) > Number(optintraday)) {
          this.notif.error("lot wise reduction should not exceed rack rate", '')
          return 0;
        }
        if (Number(this.onlineIntradayBrokerage) < Number(Futmin)) {
          this.notif.error("Not possible to change below 1 Rs.", '')
          return 0;
        }
        if (this.detailData[0].OptionOnlineIntradayPerlot != "Default Brokerage") {
          if (Number(this.onlineIntradayBrokerage) == Number(this.detailData[0].OptionOnlineIntradayPerlot)) {
            this.notif.error("lot wise reduction should not equal to existing brokerage", '')
            return 0;
          }
        }
      }
      if (this.offlineIntradayBrokerage != "") {
        if (Number(this.offlineIntradayBrokerage) > Number(optintraday)) {
          this.notif.error("lot wise reduction should not exceed rack rate", '')
          return 0;
        }
        if (Number(this.offlineIntradayBrokerage) < Number(Futmin)) {
          this.notif.error("Not possible to change below 1 Rs.", '')
          return 0;
        }
        if (this.detailData[0].OptionOfflineIntradayPerlot != "Default Brokerage") {
          if (Number(this.offlineIntradayBrokerage) == Number(this.detailData[0].OptionOfflineIntradayPerlot)) {
            this.notif.error("lot wise reduction should not equal to existing brokerage", '')
            return 0;
          }
        }
      }
      if (this.onlineCarryForwardBrokerage != "") {
        if (Number(this.onlineCarryForwardBrokerage) > Number(optcarryforward)) {
          this.notif.error("lot wise reduction should not exceed rack rate", '')
          return 0;
        }
        if (Number(this.onlineCarryForwardBrokerage) < Number(Futmin)) {
          this.notif.error("Not possible to change below 1 Rs.", '')
          return 0;
        }
        if (this.detailData[0].OptionOnlineCarryforwardPerlot != "Default Brokerage") {
          if (Number(this.onlineCarryForwardBrokerage) == Number(this.detailData[0].OptionOnlineCarryforwardPerlot)) {
            this.notif.error("lot wise reduction should not equal to existing brokerage", '')
            return 0;
          }
        }
      }
      if (this.offlineCarryForwardBrokerage != "") {
        if (Number(this.offlineCarryForwardBrokerage) > Number(optcarryforward)) {
          this.notif.error("lot wise reduction should not exceed rack rate", '')
          return 0;
        }
        if (Number(this.offlineCarryForwardBrokerage) < Number(Futmin)) {
          this.notif.error("Not possible to change below 1 Rs.", '')
          return 0;
        }
        if (this.detailData[0].OptionofflineCarryforwardPerlot != "Default Brokerage") {
          if (Number(this.offlineCarryForwardBrokerage) == Number(this.detailData[0].OptionofflineCarryforwardPerlot)) {
            this.notif.error("lot wise reduction should not equal to existing brokerage", '')
            return 0;
          }
        }
      }
    }

    if (this.cdsFuturesCheck) {
      if (Number(this.cdsFuturesDefaultBrokerage) > Number(cds)) {
        this.notif.error("CDS rate should not exceed above 10 Rs", '')
        return 0;
      }
      if (this.detailData[0].CurFuturesBrokperLot != "Default Brokerage") {
        if (Number(this.cdsFuturesDefaultBrokerage) == Number(this.detailData[0].CurFuturesBrokperLot)) {
          this.notif.error("CDS rate should not equal to existing brokerage", '')
          return 0;
        }
      }
    }

    if (this.cdsOptionsCheck) {
      if (Number(this.cdsOptionsDefaultBrokerage) > Number(cds)) {
        this.notif.error("CDS rate should not exceed above 10 Rs", '')
        return 0;
      }
      if (this.detailData[0].CurOptionsBrokperLot != "Default Brokerage") {
        if (Number(this.cdsOptionsDefaultBrokerage) == Number(this.detailData[0].CurOptionsBrokperLot)) {
          this.notif.error("CDS rate should not equal to existing brokerage", '')
          return 0;
        }
      }
    }

    if (this.commcxFuturesCheck) {
      if (this.mcxNormal != "") {
        if (Number(this.mcxNormal) > Number(comFut))//Number(comFut))
        {
          this.notif.error("COM MCX Futures - Normal Brokerage % not possible to change above rack rate", '')
          return 0;
        }
        if (Number(this.mcxNormal) == Number(this.detailData[0].ComMCXFuturesNormalBrkPer)) {
          this.notif.error("COM MCX Futures - Normal Brokerage % not possible to change equal to existing brokerage", '')
          return 0;
        }
      }

      if (this.mcxDelivery != "") {
        if (Number(this.mcxDelivery) > Number(ComFutDelivery))//Number(ComFutDelivery))
        {
          this.notif.error("COM MCX Futures - Delivery Brokerage % not possible to change above rack rate", '')
          return 0;
        }
        if (Number(this.mcxDelivery) == Number(this.detailData[0].ComMCXFuturesDeliveryBrk)) {
          this.notif.error("COM MCX Futures - Delivery Brokerage % not possible to change equal to existing brokerage", '')
          return 0;
        }
      }

      if (this.mcxIntraday != "") {
        if (Number(this.mcxIntraday) > Number(comFut))// Number(comFut))
        {
          this.notif.error("COM MCX Futures - Intraday Brokerage % not possible to change above rack rate", '')
          return 0;
        }
        if (Number(this.mcxIntraday) == Number(this.detailData[0].ComMCXFuturesIntradayBrkPer)) {
          this.notif.error("COM MCX Futures - Intraday Brokerage % not possible to change equal to existing brokerage", '')
          return 0;
        }
      }
    }

    if (this.comncdexFuturesCheck) {
      if (this.ncdexNormal != "") {
        if (Number(this.ncdexNormal) > Number(comFut))//Number(comFut))
        {
          this.notif.error("COM NCDEX Futures - Normal Brokerage % not possible to change above rack rate", '')
          return 0;
        }
        if (Number(this.ncdexNormal) == Number(this.detailData[0].ComNCDEXFuturesNormalBrkPer)) {
          this.notif.error("COM NCDEX Futures - Normal Brokerage % not possible to change equal to existing brokerage", '')
          return 0;
        }
      }

      if (this.ncdexDelivery != "") {
        if (Number(this.ncdexDelivery) > Number(ComFutDelivery))//Number(ComFutDelivery))
        {
          this.notif.error("COM NCDEX Futures - Delivery Brokerage % not possible to change above rack rate", '')
          return 0;
        }
        if (Number(this.ncdexDelivery) == Number(this.detailData[0].ComNCDEXFuturesDeliveryBrk)) {
          this.notif.error("COM NCDEX Futures - Delivery Brokerage % not possible to change equal to existing brokerage", '')
          return 0;
        }
      }

      if (this.ncdexIntraday != "") {
        if (Number(this.ncdexIntraday) > Number(comFut))//Number(comFut))
        {
          this.notif.error("COM NCDEX Futures - Intraday Brokerage % not possible to change above rack rate", '')
          return 0;
        }
        if (Number(this.ncdexIntraday) == Number(this.detailData[0].ComNCDEXFuturesIntradayBrkPer)) {
          this.notif.error("COM NCDEX Futures - Intraday Brokerage % not possible to change equal to existing brokerage", '')
          return 0;
        }
      }
    }




    if (this.comOptionsCheck) {
      if (this.optionNormal != "") {
        if (Number(this.optionNormal) > Number(comOptioncarryforward))//Number(comOptioncarryforward))
        {
          this.notif.error("COM Options Normal lot wise reduction should not exceed rack rate", '')
          return 0;
        }
        if (Number(this.optionNormal) == Number(this.detailData[0].COMOptionsNormalBrokperLot)) {
          this.notif.error("COM Options Normal lot wise reduction should not be equal to existing lot", '')
          return 0;
        }
      }

      if (this.optionIntraday != "") {
        if (Number(this.optionIntraday) > Number(comOptintraday))//Number(comOptintraday))
        {
          this.notif.error("COM Options - Intraday lot wise reduction should not exceed rack rate", '')
          return 0;
        }
        if (Number(this.optionIntraday) == Number(this.detailData[0].COMOptionsIntradayBrokperLot)) {
          this.notif.error("COM Options - Intraday lot wise reduction should not be equal to existing lot", '')
          return 0;
        }
      }
    }

    if (this.bondCheck) {
      if ((Number(this.bonddelivery) == Number(this.detailData[0].BondDlvBrokeragePercent)) && (Number(this.bondspeculation) == Number(this.detailData[0].BondSpecBrokeragePercent))) {
        this.notif.error("Not possible to change % equal to existing brokerage", '')
        return 0;
      }
      else {
        if (Number(this.bonddelivery) > Number(this.detailData[0].BondDlvBrokeragePercent)) {
          this.notif.error("Not possible to change % above existing brokerage", '')
          return 0;
        }
        if (Number(this.bonddelivery) > Number(delivery)) {
          this.notif.error("Not possible to change % above rack rate", '')
          return 0;
        }
        if (Number(this.bondspeculation) > Number(this.detailData[0].BondSpecBrokeragePercent)) {
          this.notif.error("Not possible to change % above existing brokerage", '')
          return 0;
        }
        if (Number(this.bondspeculation) > Number(speculation)) {
          this.notif.error("Not possible to change % above rack rate", '')
          return 0;
        }
      }
    }
    //Response.Write("lbl: " + lblcurSLB_Brok.Text);
    //Response.Write("txt: " + TextBox1.Text);
    //Response.End();
    if (this.slbCheck) {
      if (this.slbpercentage != "") {
        // Response.Write("slb_min=" + hdnfldSLB_MIN.Value);
        if (Number(this.slbpercentage) > Number(this.detailData[0].SLB_Brok_Per)) {

          //Response.Write(SLB_Brok_Per);
          this.notif.error("Not possible to change % above existing brokerage SLB", '')
          return 0;
        }
        if (Number(this.slbpercentage) == Number(this.detailData[0].SLB_Brok_Per)) {

          this.notif.error("Not possible to change % equal to existing brokerage SLB", '')
          return 0;
        }
        if (Number(this.slbpercentage) < Number(this.hdnfldSLB_MIN))//Number(hdnfldSLB_MIN.Value))
        {
          this.notif.error("Not possible to change % below 3.", '')
          return 0;
        }

      }
    }
    return 1;
  }

  validateUpward(data) {
    var delivery, speculation, FutBrok, FutLot, cds, OnlineSpecMax, OnlineDeliverymax, OnlineFutBrok;


    delivery = data.DeliveryRackRate
    speculation = data.SpecRackRate
    FutBrok = data.FutureRackRate
    OnlineSpecMax = data.OnlineSpecbrkMax
    OnlineDeliverymax = data.OnlineDeliverybrkMax
    OnlineFutBrok = data.OnlineFuturesBrkPerMax

    FutLot = 100;
    cds = 10;

    if (this.deliveryCheck) {
      if ((Number(this.deliveryDelivery) == Number(this.detailData[0].DlvBrokeragePercent)) && (Number(this.deliverySpeculation) == Number(this.detailData[0].SpecBrokeragePercent))) {
        this.notif.error("Not possible to change % equal to existing brokerage", '')
        return 0;
      }
      else {
        if (Number(this.deliveryDelivery) < Number(this.detailData[0].DlvBrokeragePercent)) {
          this.notif.error("Not possible to change % below existing brokerage", '')
          return 0;
        }
        if (Number(this.deliverySpeculation) < Number(this.detailData[0].SpecBrokeragePercent)) {
          this.notif.error("Not possible to change % below existing brokerage", '')
          return 0;
        }
      }
    }

    if (this.equityOnlineBrokerageCheck) {
      if ((Number(this.equityDelivery) == Number(this.detailData[0].OnlineDlvBrokerage)) && (Number(this.equitySpeculation) == Number(this.detailData[0].OnlineSpecBrokerage))) {
        this.notif.error("Not possible to change % equal to existing brokerage", '')
        return 0;
      }
      else {
        if (Number(this.equityDelivery) < Number(this.detailData[0].OnlineDlvBrokerage)) {
          this.notif.error("Not possible to change % below existing brokerage", '')
          return 0;
        }
        if (Number(this.equitySpeculation) < Number(this.detailData[0].OnlineSpecBrokerage)) {
          this.notif.error("Not possible to change % below existing brokerage", '')
          return 0;
        }
        if (Number(this.equityDelivery) > Number(OnlineDeliverymax)) {
          this.notif.error("Not possible to change online deivery % above " + OnlineDeliverymax, '')
          return 0;
        }
        if (Number(this.equitySpeculation) > Number(OnlineSpecMax)) {
          this.notif.error("Not possible to change online speculation % above " + OnlineSpecMax, '')
          return 0;
        }
        //offline brokerage
        if (Number(this.equityDelivery) > Number(this.detailData[0].OnlineDlvBrokerage)) {
          this.notif.error("Not possible to change % above existing offline brokerage", '')
          return 0;
        }
        if (Number(this.equitySpeculation) > Number(this.detailData[0].OnlineSpecBrokerage)) {
          this.notif.error("Not possible to change % above existing offline brokerage", '')
          return 0;
        }
      }
    }

    if (this.futuresCheck) {
      if ((this.offlinePercentage != "") && (this.offlineLot != "")) {
        this.notif.error("You can request % wise or lot wise revision any one only at a time", '')
        return 0;
      }
      else if (this.offlinePercentage != "") {
        if (Number(this.offlinePercentage) <= Number(this.detailData[0].FuturesBrokeragePercent)) {
          this.notif.error("Not possible to change % below or equal to existing brokerage", '')
          return 0;
        }
      }
      else {
        if (this.offlineLot != "") {
          if (Number(this.offlineLot) <= Number(this.detailData[0].FuturesBrokerageLot)) {
            this.notif.error("lot wise reduction should not below or equal to existing brokerage", '')
            return 0;
          }
        }
      }

      if ((this.onlinePercentage != "") && (this.onlineLot != "")) {
        this.notif.error("You can request % wise or lot wise revision any one only at a time", '')
        return 0;
      }
      else if (this.onlinePercentage != "") {
        if (Number(this.onlinePercentage) <= Number(this.detailData[0].FuturesPercent_Online)) {
          this.notif.error("Not possible to change % below or equal to existing brokerage", '')
          return 0;
        }
      }
      else {
        if (this.onlineLot != "") {
          if (Number(this.onlineLot) <= Number(this.detailData[0].FuturesperLot_Online)) {
            this.notif.error("lot wise reduction should not below or equal to existing brokerage", '')
            return 0;
          }
        }
      }
    }

    if (this.optionsCheck) {
      if (this.onlineIntradayBrokerage != "") {
        if (this.detailData[0].OptionOnlineIntradayPerlot != "Default Brokerage") {
          if (Number(this.onlineIntradayBrokerage) <= Number(this.detailData[0].OptionOnlineIntradayPerlot)) {
            this.notif.error("lot wise reduction should not below or equal to existing brokerage", '')
            return 0;
          }
        }
      }
      if (this.onlineCarryForwardBrokerage != "") {
        if (this.detailData[0].OptionOnlineCarryforwardPerlot != "Default Brokerage") {
          if (Number(this.onlineCarryForwardBrokerage) <= Number(this.detailData[0].OptionOnlineCarryforwardPerlot)) {
            this.notif.error("lot wise reduction should not below or equal to existing brokerage", '')
            return 0;
          }
        }
      }
      if (this.offlineIntradayBrokerage != "") {
        if (this.detailData[0].OptionOfflineIntradayPerlot != "Default Brokerage") {
          if (Number(this.offlineIntradayBrokerage) <= Number(this.detailData[0].OptionOfflineIntradayPerlot)) {
            this.notif.error("lot wise reduction should not below or equal to existing brokerage", '')
            return 0;
          }
        }
      }
      if (this.offlineCarryForwardBrokerage != "") {
        if (this.detailData[0].OptionofflineCarryforwardPerlot != "Default Brokerage") {
          if (Number(this.offlineCarryForwardBrokerage) <= Number(this.detailData[0].OptionofflineCarryforwardPerlot)) {
            this.notif.error("lot wise reduction should not below or equal to existing brokerage", '')
            return 0;
          }
        }
      }
    }

    if (this.cdsFuturesCheck) {
      if (this.detailData[0].CurFuturesBrokperLot != "Default Brokerage") {
        if (Number(this.cdsFuturesDefaultBrokerage) <= Number(this.detailData[0].CurFuturesBrokperLot)) {
          this.notif.error("CDS rate should not below or equal to existing brokerage", '')
          return 0;
        }
      }
    }

    if (this.cdsOptionsCheck) {
      if (this.detailData[0].CurOptionsBrokperLot != "Default Brokerage") {
        if (Number(this.cdsOptionsDefaultBrokerage) <= Number(this.detailData[0].CurOptionsBrokperLot)) {
          this.notif.error("CDS rate should not below or equal to existing brokerage", '')
          return 0;
        }
      }
    }

    if (this.commcxFuturesCheck) {
      if (this.mcxNormal != "") {
        if (Number(this.mcxNormal) <= Number(this.detailData[0].ComMCXFuturesNormalBrkPer)) {
          this.notif.error("COM MCX Futures - Normal Brokerage % not possible to change below or equal to existing brokerage", '')
          return 0;
        }
      }

      if (this.mcxDelivery != "") {
        if (Number(this.mcxDelivery) <= Number(this.detailData[0].ComMCXFuturesDeliveryBrk)) {
          this.notif.error("COM MCX Futures - Delivery Brokerage % not possible to change below or equal to existing brokerage", '')
          return 0;
        }
      }

      if (this.mcxIntraday != "") {
        if (Number(this.mcxIntraday) <= Number(this.detailData[0].ComMCXFuturesIntradayBrkPer)) {
          this.notif.error("COM MCX Futures - Intraday Brokerage % not possible to change below or equal to existing brokerage", '')
          return 0;
        }
      }
    }

    if (this.comncdexFuturesCheck) {
      if (this.ncdexNormal != "") {
        if (Number(this.ncdexNormal) <= Number(this.detailData[0].ComNCDEXFuturesNormalBrkPer)) {
          this.notif.error("COM NCDEX Futures - Normal Brokerage % not possible to change below or equal to existing brokerage", '')
          return 0;
        }
      }

      if (this.ncdexDelivery != "") {
        if (Number(this.ncdexDelivery) <= Number(this.detailData[0].ComNCDEXFuturesDeliveryBrk)) {
          this.notif.error("COM NCDEX Futures - Delivery Brokerage % not possible to change below or equal to existing brokerage", '')
          return 0;
        }
      }

      if (this.ncdexIntraday != "") {
        if (Number(this.ncdexIntraday) <= Number(this.detailData[0].ComNCDEXFuturesIntradayBrkPer)) {
          this.notif.error("COM NCDEX Futures - Intraday Brokerage % not possible to change below or equal to existing brokerage", '')
          return 0;
        }
      }
    }








    if (this.comOptionsCheck) {
      if (this.optionNormal != "") {
        if (Number(this.optionNormal) <= Number(this.detailData[0].COMOptionsNormalBrokperLot)) {
          this.notif.error("COM Options Normal - lot wise reduction should not below or equal to existing brokerage", '')
          return 0;
        }
      }

      if (this.optionIntraday != "") {
        if (Number(this.optionIntraday) <= Number(this.detailData[0].COMOptionsIntradayBrokperLot)) {
          this.notif.error("COM Options Intraday - lot wise reduction should not below or equal to existing brokerage", '')
          return 0;
        }
      }
    }

    if (this.bondCheck) {
      if ((this.bonddelivery == this.detailData[0].BondDlvBrokeragePercent) && (this.bondspeculation == this.detailData[0].BondSpecBrokeragePercent)) {
        this.notif.error("Not possible to change % equal to existing brokerage", '')
        return 0;
      }
      else {
        if (Number(this.bonddelivery) < Number(this.detailData[0].BondDlvBrokeragePercent)) {
          this.notif.error("Not possible to change % below existing brokerage", '')
          return 0;
        }
        if (Number(this.bondspeculation) < Number(this.detailData[0].BondSpecBrokeragePercent)) {
          this.notif.error("Not possible to change % below existing brokerage", '')
          return 0;
        }
      }
    }
    if (this.slbCheck) {
      if (this.slbpercentage != "") {
        if (Number(this.slbpercentage) < Number(this.detailData[0].SLB_Brok_Per)) {
          //Response.Write(TextBox1.Text);
          //Response.Write(SLB_Brok_Per);
          this.notif.error("Not possible to change % below existing brokerage  SLB", '')
          return 0;
        }
        if (Number(this.slbpercentage) == Number(this.detailData[0].SLB_Brok_Per)) {
          //Response.Write(TextBox1.Text);
          //Response.Write(SLB_Brok_Per);
          this.notif.error("Not possible to change % equal to existing brokerage SLB", '')
          return 0;
        }
        if (Number(this.slbpercentage) > Number(this.hdnfldSLB_MAX)) {
          this.notif.error("Not possible to change % above 30.", '')
          return 0;
        }

      }
    }
    return 1;
  }
  saveToDB() {
    try {
      this.isSpining=true
      var delivery = '0', speculation = '0', fut1 = '0', fut2 = '0', option = '0', cdsFut = '0', cdsOpt = '0', mcxsxFut = '0', mcxsxOpt = '0', projectedbrok = '0';
      var OptionOnlineIntradayPerlot = '0', OptionOnlineCarryforwardPerlot = '0', OptionOfflineIntradayPerlot = '0', OptionofflineCarryforwardPerlot = '0';
      var minbrok = '0', comMCXNormalBrkPer = '0', comMCXDeliveryBrok = '0', comMCXIntradayBrok = '0', comNCDEXNormalBrok = '0', comNCDEXDeliveryBrok = '0', comICEXNormalBrok = '0', comICEXDeliveryBrok = '0', comICEXIntradayBrok = '0';
      var comNCDEXIntradayBrok = '0', comNMCENormalBrok = '0', comNMCEDeliveryBrok = '0', comNMCEIntradayBrok = '0', ComMCXFutNormalLot = '0', comMCXFutIntradayLot = '0';
      var comNCDEXFutNormalLot = '0', comNCDEXFutIntradayLot = '0', comNMCEFutNormalLot = '0', comNMCEFutIntradayLot = '0', ComOptionsNormal = '0', ComOptionsIntraday = '0';
      var Bonddelivery = '0', Bondspeculation = '0', SLB_Brok_Per = '0';
      var Onlinedelivery = '0', OnlineSpec = '0', Onlinefut1 = '0', Onlinefut2 = '0';
      var slab, Bondslab, OnlineSlab;
      // DataSet ds = new DataSet();
      var COMval;

      if (this.delivaryAvailableSlab !=="") {
        slab = this.delivaryAvailableSlab//ddlSlab.Text;
      }
      else
        slab = "";

      if (this.deliveryDelivery !== "")
        delivery = this.deliveryDelivery
      if (this.deliveryMinBrokerage !== "")
        minbrok = this.deliveryMinBrokerage;

      if (this.deliverySpeculation !== "")
        speculation = this.deliverySpeculation
      if (this.offlinePercentage !== "")
        fut1 = this.offlinePercentage
      if (this.offlineLot !== "")
        fut2 = this.offlineLot
      if (this.onlineIntradayBrokerage !== "")
        OptionOnlineIntradayPerlot = this.onlineIntradayBrokerage
      if (this.onlineCarryForwardBrokerage !== "")
        OptionOnlineCarryforwardPerlot = this.onlineCarryForwardBrokerage
      if (this.offlineIntradayBrokerage !== "")
        OptionOfflineIntradayPerlot = this.offlineIntradayBrokerage
      if (this.offlineCarryForwardBrokerage !== "")
        OptionofflineCarryforwardPerlot = this.offlineCarryForwardBrokerage
      if (this.cdsFuturesDefaultBrokerage !== "")
        cdsFut = this.cdsFuturesDefaultBrokerage
      if (this.cdsOptionsDefaultBrokerage !== "")
        cdsOpt = this.cdsOptionsDefaultBrokerage
      // if (txtMCXSXFut.Text !== "")
      //     mcxsxFut = txtMCXSXFut.Text
      // if (txtMCXSXOpt.Text !== "")
      //     mcxsxOpt = txtMCXSXOpt.Text
      if (this.mcxNormal !== "")
        comMCXNormalBrkPer = this.mcxNormal
      if (this.mcxDelivery !== "")
        comMCXDeliveryBrok = this.mcxDelivery
      if (this.mcxIntraday !== "")
        comMCXIntradayBrok = this.mcxIntraday
      if (this.ncdexNormal !== "")
        comNCDEXNormalBrok = this.ncdexNormal
      if (this.ncdexDelivery !== "")
        comNCDEXDeliveryBrok = this.ncdexDelivery
      if (this.ncdexIntraday !== "")
        comNCDEXIntradayBrok = this.ncdexIntraday


      // if (txtICEXFutNormalBrok.Text !== "")
      //     comICEXNormalBrok = txtICEXFutNormalBrok.Text
      // if (txtICEXFutDeliveryBrok.Text !== "")
      //     comICEXDeliveryBrok = txtICEXFutDeliveryBrok.Text
      // if (txtICEXFutIntradayBrok.Text !== "")
      //     comICEXIntradayBrok = txtICEXFutIntradayBrok.Text

      if (this.optionNormal !== "")
        ComOptionsNormal = this.optionNormal
      if (this.optionIntraday !== "")
        ComOptionsIntraday = this.optionIntraday

      if (this.bonddelivery !== "")
        Bonddelivery = this.bonddelivery

      if (this.bondspeculation !== "")
        Bondspeculation = this.bondspeculation

      if (this.bondAvailableSlab !== "") {
        Bondslab = this.bondAvailableSlab
      }
      else
        Bondslab = "";

      if (this.onlineAvailableSlab !== "") {
        OnlineSlab = this.onlineAvailableSlab
      }
      else
        OnlineSlab = "";

      if (this.projectedBrokerage !== "")
        projectedbrok = this.projectedBrokerage
      if (this.slbpercentage !== "")
        SLB_Brok_Per = this.slbpercentage

      if (this.equityDelivery !== "")
        Onlinedelivery = this.equityDelivery

      if (this.equitySpeculation !== "")
        OnlineSpec = this.equitySpeculation


      if (this.onlinePercentage !== "")
        Onlinefut1 = this.onlinePercentage
      if (this.onlineLot !== "")
        Onlinefut2 = this.onlineLot
      let json ={
        "Slno": 0,
        "Location": this.Tradecode ? (this.Tradecode.Location ? this.Tradecode.Location.trim().toUpperCase() : '') : '',//txtloc.Text.ToUpper(),
        "tradecode": this.Tradecode ? (this.Tradecode.TradeCode ? this.Tradecode.TradeCode.trim().toUpperCase() : '') : '',
        "UpwardorDownward": this.currentBrokerage ? this.currentBrokerage : '',
        "Del": this.deliveryCheck ? "Y" : "N",
        "Delivery": delivery?Number(delivery):0,
        "Speculation": speculation?Number(speculation):0,
        "Slab": slab?Number(slab):0,
        "BrokMin": minbrok?Number(minbrok):0,
        "FuturesPercent": fut1?Number(fut1):0,
        "FuturesperLot": fut2?Number(fut2):0,
        "OptionsperLot": option?Number(option):0,
        "OptionOnlineIntradayPerlot": OptionOnlineIntradayPerlot?Number(OptionOnlineIntradayPerlot):0,
        "OptionOnlineCarryforwardPerlot": OptionOnlineCarryforwardPerlot?Number(OptionOnlineCarryforwardPerlot):0,
        "OptionOfflineIntradayPerlot": OptionOfflineIntradayPerlot?Number(OptionOfflineIntradayPerlot):0,
        "OptionofflineCarryforwardPerlot": OptionofflineCarryforwardPerlot?Number(OptionofflineCarryforwardPerlot):0,
        "CDSFuturesperLot": cdsFut?Number(cdsFut):0,
        "CDSOptionsperLot": cdsOpt?Number(cdsOpt):0,
        "MCXSXFuturesperLot": mcxsxFut?Number(mcxsxFut):0,
        "MCXSXOptionsperLot": mcxsxOpt?Number(mcxsxOpt):0,
        "comMCXNormalBrkPer": comMCXNormalBrkPer?Number(comMCXNormalBrkPer):0,
        "comMCXDeliveryBrok": comMCXDeliveryBrok?Number(comMCXDeliveryBrok):0,
        "comMCXIntradayBrok": comMCXIntradayBrok?Number(comMCXIntradayBrok):0,
        "comNCDEXNormalBrok": comNCDEXNormalBrok?Number(comNCDEXNormalBrok):0,
        "comNCDEXDeliveryBrok": comNCDEXDeliveryBrok?Number(comNCDEXDeliveryBrok):0,
        "comNCDEXIntradayBrok": comNCDEXIntradayBrok?Number(comNCDEXIntradayBrok):0,
        "ComOptionsNormal": ComOptionsNormal?Number(ComOptionsNormal):0,
        "ComOptionsIntraday": ComOptionsIntraday?Number(ComOptionsIntraday):0,
        "comICEXNormalBrok": comICEXNormalBrok?Number(comICEXNormalBrok):0,
        "comICEXDeliveryBrok": comICEXDeliveryBrok?Number(comICEXDeliveryBrok):0,
        "comICEXIntradayBrok": comICEXIntradayBrok?Number(comICEXIntradayBrok):0,
        "Bond": this.bondCheck ? "Y" : "N",//"0"
        "BondDelivery": Bonddelivery?Number(Bonddelivery):0,
        "BondSpeculation": Bondspeculation?Number(Bondspeculation):0,
        "BondSlab": Bondslab?Number(Bondslab):0,
        "Onlinechkd": this.equityOnlineBrokerageCheck ? "Y" : "N",//""
        "OnlineDelivery": Onlinedelivery?Onlinedelivery:'0',//Number(Onlinedelivery),//"0"
        "OnlineSpeculation": OnlineSpec?OnlineSpec:'0',//Number(OnlineSpec),//"0"
        "OnlineSlab": OnlineSlab?Number(OnlineSlab):0,
        "OnlineFuturesPercent": Onlinefut1?Onlinefut1:'0',//Number(Onlinefut1),//"0"
        "OnlineFuturesperLot": Onlinefut2?Onlinefut2:'0',//Number(Onlinefut2),//"0"
        "ProjectedBrok": projectedbrok?Number(projectedbrok):0,
        "ReasonForRevision": this.reason ? this.reason.toUpperCase() : '',
        "AdditionalRemarks": this.remark ? this.remark.toUpperCase() : '',
        "flag":0,//0
        "RMorSHorED": "",
        "RMorSHorEDapproved": "N",
        "RejectedRemarks": "",
        "DOE": this.dateofEffect?this.datepipe.transform(this.dateofEffect,'yyyy-MM-dd'):this.datepipe.transform(new Date(),'yyyy-MM-dd'),
        "ApprovedUser": "",
        "usercode": this.currentUser.userCode ? this.currentUser.userCode : '',
        "SLB_Brok_Per": SLB_Brok_Per?SLB_Brok_Per:'0',//Number(SLB_Brok_Per),
        "count":this.contrBrkDtsTable.length+this.commodityTable.length //0
        // "@count":(grdContrBrkDts.Rows.Count+grdCommodity.Rows.Count)
      }
    //   let json = {
    //   "Slno":66287,
    //   "Location":"GT",
    //   "tradecode":"G248",
    //   "UpwardorDownward":"",
    //   "Del":"",
    //   "Delivery":0,
    //   "Speculation":0,
    //   "Slab":0,
    //   "BrokMin":0,
    //   "FuturesPercent":0,
    //   "FuturesperLot":0,
    //   "OptionsperLot":0,
    //   "OptionOnlineIntradayPerlot":0,
    //   "OptionOnlineCarryforwardPerlot":0,
    //   "OptionOfflineIntradayPerlot":0,
    //   "OptionofflineCarryforwardPerlot":0,
    //   "CDSFuturesperLot":0,
    //   "CDSOptionsperLot":0,
    //   "MCXSXFuturesperLot":0,
    //   "MCXSXOptionsperLot":0,
    //   "comMCXNormalBrkPer":0,
    //   "comMCXDeliveryBrok":0,
    //   "comMCXIntradayBrok":0,
    //   "comNCDEXNormalBrok":0,
    //   "comNCDEXDeliveryBrok":0,
    //   "comNCDEXIntradayBrok":0,
    //   "ComOptionsNormal":0,
    //   "ComOptionsIntraday":0,
    //   "comICEXNormalBrok":0,
    //   "comICEXDeliveryBrok":0,
    //   "comICEXIntradayBrok":0,
    //   "Bond":"0",
    //   "BondDelivery":0,
    //   "BondSpeculation":0,
    //   "BondSlab":0,
    //   "Onlinechkd":"",
    //   "OnlineDelivery":"0",
    //   "OnlineSpeculation":"0",
    //   "OnlineSlab":0,
    //   "OnlineFuturesPercent":"0",
    //   "OnlineFuturesperLot":"0",
    //   "ProjectedBrok":0,
    //   "ReasonForRevision":"AS PERAS 0.15% ",
    //   "AdditionalRemarks":"",
    //   "flag":1,
    //   "RMorSHorED":"SH",
    //   "RMorSHorEDapproved":"Y",
    //   "RejectedRemarks":"",
    //   "DOE":"2023-07-03",
    //   "ApprovedUser":"00078",
    //   "usercode":"",
    //   "SLB_Brok_Per":"15.0000"
    // }
      console.log("save payload", json);
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [json],
        "requestId": "1000086",//"10000100",
        "outTblCount": "0"
      })
        .then((response) => {
          //  ds = con.SPGetDS("SpInsertClientBrokerageReduction", array);
          console.log("response", response);
          if(response.errorCode==0)
          {
          let data =response.results[0][0]// {Result:"Data Saved successfully.",BrokSlNo:9876}
          let lblMsg = data.Result //this.notif.error(ds.Tables[0].Rows[0]["Result"]
          this.hfSlno = data.BrokSlNo //hfSlno.Value= ds.Tables[0].Rows[0]["BrokSlNo"]
          if (lblMsg === "Data Saved successfully.") {
            var FixedBrokerage = 0;

            if (this.contrBrkDtsTable.length > 0) {
              console.log(this.contrBrkDtsTable,"this.contrBrkDtsTable");

              this.contrBrkDtsTable.forEach(row => {
                console.log(row);

                this.callSpBrokerageReductionFoSymbolwise(row)
              });
            }
            if (this.commodityTable.length > 0) {
              this.commodityTable.forEach(row => {
                let COMNormalBrk = row.NormalBrok ? row.NormalBrok : 0
                let COMIntradayBrk = row.IntradayBrok ? row.IntradayBrok : 0;

                this.callSpBrokerageReduction_COMSymbolwise(row, COMNormalBrk, COMIntradayBrk)
              });
            }
            this.sendmail();
          }
          else{
            this.notif.error(lblMsg,'')
            this.isSpining=false
          }
          this.btnSave = false;
        }
        else {
          if(response.errorMsg)
          {
            this.notif.error(response.errorMsg,'')
            this.isSpining=false
          }
          else
          {
            this.notif.error('Something went wrong','')
            this.isSpining=false
          }
        }
        })

    }

    catch (err) {
      console.log(err, "err");
      this.btnSave = false;
    }
  }



  SearchCOMSymbol(Type, Qry, SrvFilters, ClntFilters, Sort, RtnFields, RtnControls, CanSubmit, AccessCheck) {
    var trdcode = this.Tradecode ? (this.Tradecode.Location ? this.Tradecode.Location.trim() : '') : ''
    var loc = this.Tradecode ? (this.Tradecode.TradeCode ? this.Tradecode.TradeCode.trim() : '') : ''
    console.log(this.instrument,"this.instrument");

    var Instrument = this.instrument

    Qry = "C.ClientID = B.ClientID and Ltrim(Rtrim(C.CURLOCATION)) = '" + loc + "' and Ltrim(Rtrim(C.TRADECODE)) = '" + trdcode + "') V On S.Instrumentcode = V.Instrument And S.Product = V.Product And S.Symbol = V.Symbol where 1=1";
    console.log(Type,"Type");

    if (Type === "MCX") {
      Qry = Qry + " and S.InstrumentCode = '" + Instrument + "' and S.Product = 'COMMCX'";
    }
    else if (Type === "NCDEX") {
      Qry = Qry + " and S.InstrumentCode = '" + Instrument + "' and S.Product = 'COMNCDEX'";
    }
    else if (Type === "ICEX") {
      Qry = Qry + " and S.InstrumentCode = '" + Instrument + "' and S.Product = 'COMICEX'";
    }
    else if (Type === "Sym") {
      Qry = Qry + " and S.Product In ('COMMCX', 'COMNCDEX', 'COMICEX') and S.InstrumentCode = '" + Instrument + "'";
    }
    else {
      // alert("Select an exchange to proceed...!");
      this.modalService.info({
        nzTitle: '<i>Info</i>',
        nzContent: '<b>Select an exchange to proceed...!</b>',
        nzOnOk: () => {
        }

      });
      return false;
    }
    console.log(Qry, "Qry");
    this.Qry=Qry
    // this.symbolFindOpt.whereClause =Qry
    this.symbolFindOpt = undefined
    this.symbolFindOpt = {
      findType: 7005,
      codeColumn: 'S.Symbol',
      codeLabel: 'Symbol',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: Qry
    }
    console.log("this.symbolFindOpt", this.symbolFindOpt);


  }

  rdlstComFutSymbol_SelectedIndexChanged() {
    if (this.exchangeOrSymbol === "E") {
      this.exchange = "";
      this.instrument = "FUTCOM";
      this.symbolOrAmountNormal = ""
      this.symbolOrAmountIntraday = ""
      // this.symbol.Symbol = ""
      // this.symbol.NormalBrokerage = ""
      // this.symbol.IntradayNormalBrokerage = ""
      this.symbol=""
    }
    else {
      this.exchange = "";
      this.instrument = "FUTCOM";
      this.symbolOrAmountNormal = ""
      this.symbolOrAmountIntraday = ""
      // this.symbol.Symbol = ""
      // this.symbol.NormalBrokerage = ""
      // this.symbol.IntradayNormalBrokerage = ""
      this.symbol=""
      this.SearchCOMSymbol('Sym', '" + this.ssqlExchange + "', 'S.InstrumentCode,S.Product,S.Symbol', '', 'InstrumentCode,Product,Symbol', 'Product,Symbol,NormalBrokerage,IntradayNormalBrokerage', 'hdfCOMProduct,txtCOMSymbol,txtComFutNormal,txtComFutIntraday', 'No', 'N')
      // imgBtnCOMFut.Attributes.Add("OnClick", "return SearchCOMSymbol('Sym','" + ssqlExchange + "','S.InstrumentCode,S.Product,S.Symbol','','InstrumentCode,Product,Symbol','Product,Symbol,NormalBrokerage,IntradayNormalBrokerage','hdfCOMProduct,txtCOMSymbol,txtComFutNormal,txtComFutIntraday','No','N');");
    }
  }
  ddlInstrument_SelectedIndexChanged()
    {
        if(this.exchangeOrSymbol ==='S')
        {
          this.SearchCOMSymbol('Sym', '" + this.ssqlExchange + "', 'S.InstrumentCode,S.Product,S.Symbol', '', 'InstrumentCode,Product,Symbol', 'Product,Symbol,NormalBrokerage,IntradayNormalBrokerage', 'hdfCOMProduct,txtCOMSymbol,txtComFutNormal,txtComFutIntraday', 'No', 'N')
        }
        else
        {
        this.symbol = "";
        this.exchange =''
        }
        // this.exchange = undefined
        // setTimeout(() => {
        //   this.exchange =''
        // }, 10);
        // txtComFutNormalBrkPer.Text = string.Empty;
        // txtComFutNormal.Text = string.Empty;
        // txtComFutIntradayBrkPer.Text = string.Empty;
        // txtComFutIntraday.Text = string.Empty;
    }
  symbolSearchClick()
  {
    setTimeout(() => {
      if(this.symbol && this.symbol !=='')
      {
      console.log("symbolSearchClick",this.symbol);


    if (this.exchangeOrSymbol === "E" && this.exchange === "") {
      this.notif.error("Please enter any of the COM - Exchange", '')
      this.symbol=''
      return;
    }

    this.symbolFindOpt = undefined
    this.symbolFindOpt = {
      findType: 7005,
      codeColumn: 'S.Symbol',
      codeLabel: 'Symbol',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: this.Qry
    }
  }
  }, 10);
    // setTimeout(() => {

    //   // this.symbol={
    //   //   Instrumentcode:this.symbol['S.Instrumentcode']?this.symbol['S.Instrumentcode']:'',
    //   //   Product:this.symbol['S.Product']?this.symbol['S.Product']:'',
    //   //   Symbol:this.symbol['S.Symbol']?this.symbol['S.Symbol']:'',
    //   //   IntradayNormalBrokerage:this.symbol['V.IntradayNormalBrokerage']?this.symbol['V.IntradayNormalBrokerage']:'',
    //   //   NormalBrokerage:this.symbol['V.NormalBrokerage']? this.symbol['V.NormalBrokerage']:'',
    //   // }
    //   // console.log(this.symbol ,"after symbol");
    // }, 10)


  }
  drpdwnExchange_SelectedIndexChanged() {
    if (this.exchange === "MCX" && this.exchangeOrSymbol === "E") {
      this.SearchCOMSymbol('MCX', '" + this.ssqlExchange + "', 'S.Instrumentcode,S.Product,S.Symbol', '', 'Symbol', 'Symbol,NormalBrokerage,IntradayNormalBrokerage', 'txtCOMSymbol,txtComFutNormal,txtComFutIntraday', 'No', 'N');
    }
    else if (this.exchange === "NCDEX" && this.exchangeOrSymbol === "E") {
      this.SearchCOMSymbol('NCDEX', '" + this.ssqlExchange + "', 'S.Instrumentcode,S.Product,S.Symbol', '', 'Symbol', 'Symbol,NormalBrokerage,IntradayNormalBrokerage', 'txtCOMSymbol,txtComFutNormal,txtComFutIntraday', 'No', 'N');
    }
    else if (this.exchange === "ICEX" && this.exchangeOrSymbol === "E") {
      this.SearchCOMSymbol('ICEX', '" + this.ssqlExchange + "', 'S.Instrumentcode,S.Product,S.Symbol', '', 'Symbol', 'Symbol,NormalBrokerage,IntradayNormalBrokerage', 'txtCOMSymbol,txtComFutNormal,txtComFutIntraday', 'No', 'N');
    }
    else if (this.exchange === "" && this.exchangeOrSymbol === "E") {
      this.SearchCOMSymbol('', '" + this.ssqlExchange + "', 'S.Instrumentcode,S.Product,S.Symbol', '', 'Symbol', 'Symbol,NormalBrokerage,IntradayNormalBrokerage', 'txtCOMSymbol,txtComFutNormal,txtComFutIntraday', 'No', 'N');
    }

    // this.symbol.Symbol = string.Empty;
    // this.symbolOrAmountNormal = string.Empty;
    // this.symbolOrAmountIntraday = string.Empty;
    // this.symbol.NormalBrokerage = string.Empty;
    // this.symbol.IntradayNormalBrokerage = string.Empty;
  }
  Search(Qry1, SrvFilters, ClntFilters, Sort, RtnFields, RtnControls, CanSubmit, AccessCheck) {

    var trdcode = this.Tradecode ? (this.Tradecode.TradeCode ? this.Tradecode.TradeCode.trim() : '') : ''
    var loc = this.Tradecode ? (this.Tradecode.Location ? this.Tradecode.Location.trim() : '') : ''
    Qry1 = "INS_CODE in('FUTIDX','FUTSTK') and SymbolwiseBrokerageAllowed='Y' and (location = '" + loc.trim() + "' and Tradecode = '" + trdcode.trim() + "')) A right join (select Symbol,Ins_code from fosymbol where SymbolwiseBrokerageAllowed='Y' and  INS_CODE in('FUTIDX','FUTSTK')) B on A.Symbol=B.Symbol and A.Ins_code=A.Ins_code WHERE 1 = 1"
    //Qry1 = "select A.Symbol ,A.Ins_code ,ISNULL(A.FixedBrokerage,0) FixedBrokerage from(select B.Symbol ,B.Ins_code ,ISNULL(A.FixedBrokerage,0) FixedBrokerage from (select f.Symbol,f.Ins_code,ISNULL(b.FixedBrokerage,0) FixedBrokerage,b.Foclientid from fosymbol f left join FoBrokerageSymbolWiseLotWise b on f.Symbol = b.Symbol and f.Ins_code = b.Product  left join FOclient a on a.FoClientID = b.Foclientid where INS_CODE in('FUTIDX','FUTSTK') and SymbolwiseBrokerageAllowed='Y' and (location = '" + loc + "' and Tradecode = '" + trdcode + "')) A right join (select Symbol,Ins_code from fosymbol where SymbolwiseBrokerageAllowed='Y' and  INS_CODE in('FUTIDX','FUTSTK')) B on A.Symbol=B.Symbol and A.Ins_code=A.Ins_code)A"
    // Qry1 = "select f.Symbol,f.Ins_code,ISNULL(b.FixedBrokerage,0) FixedBrokerage from fosymbol f left join FoBrokerageSymbolWiseLotWise b on f.Symbol = b.Symbol and f.Ins_code = b.Product  left join FOclient a on a.FoClientID = b.Foclientid where INS_CODE in('FUTIDX','FUTSTK') and SymbolwiseBrokerageAllowed='Y' and (location = '"+loc+"' and Tradecode = '" + trdcode + "' OR b.Foclientid is null)";
    //Qry2= "select A.Symbol,A.Ins_code,B.FixedBrokerage from fosymbol (nolock) A,FoBrokerageSymbolWiseLotWise B (nolock) where A.INS_CODE in('FUTIDX') and B.FoClientID='2689382'  and B.Symbol='BANKNIFTY' and A.INS_CODE=B.Product AND A.Symbol=B.Symbol"
    this.futuresSymbolOpt = undefined
    this.futuresSymbolOpt = {
      findType: 7006,
      codeColumn: 'B.Symbol',
      codeLabel: 'Symbol',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: Qry1
    }
    console.log("this.futuresSymbolOpt", this.futuresSymbolOpt);
  }
  SearchF(Qry, SrvFilters, ClntFilters, Sort, RtnFields, RtnControls, CanSubmit, AccessCheck) {
    var trdcode = this.Tradecode ? (this.Tradecode.TradeCode ? this.Tradecode.TradeCode.trim() : '') : ''
    var loc = this.Tradecode ? (this.Tradecode.Location ? this.Tradecode.Location.trim() : '') : ''
    // Qry = "select Symbol,Ins_code from fosymbol (nolock) where INS_CODE in('OPTIDX','OPTSTK') and SymbolwiseBrokerageAllowed='Y'";
    Qry = "INS_CODE in('OPTIDX','OPTSTK') and SymbolwiseBrokerageAllowed='Y' and (location = '" + loc.trim() + "' and Tradecode = '" + trdcode.trim() + "')) A right join (select Symbol,Ins_code from fosymbol where SymbolwiseBrokerageAllowed='Y' and  INS_CODE in('OPTIDX','OPTSTK')) B on A.Symbol=B.Symbol and A.Ins_code=A.Ins_code WHERE 1 = 1"
    //Qry = "select f.Symbol,f.Ins_code,ISNULL(b.FixedBrokerage,0) FixedBrokerage from fosymbol f left join FoBrokerageSymbolWiseLotWise b on f.Symbol = b.Symbol and f.Ins_code = b.Product  left join FOclient a on a.FoClientID = b.Foclientid where INS_CODE in('OPTIDX','OPTSTK') and SymbolwiseBrokerageAllowed='Y' and (location = '" + loc + "' and Tradecode = '" + trdcode + "' OR b.Foclientid is null)";
    this.optionsSymbolOpt = undefined
    this.optionsSymbolOpt = {
      findType: 7004,
      codeColumn: 'B.Symbol',
      codeLabel: 'Symbol',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: false,
      requestId: 8,
      whereClause: Qry
    }
    console.log("this.optionsSymbolOpt", this.optionsSymbolOpt);
  }
  getAvailableSlab(type) {
    this.isSpining=true
    if (type === 'delivery') {
      this.delivaryAvailableSlab=undefined
      // this.delivaryAvailableSlab=''
      this.delivaryAvailableSlabDropdowns=[]
      if(!this.deliveryDelivery || this.deliveryDelivery ==='')
      {
        this.notif.error('Please enter delivery','')
        this.isSpining=false
        this.isSpining=false
        return
      }
      if(!this.deliverySpeculation || this.deliverySpeculation ==='')
      {
        this.notif.error('Please enter speculation','')
        this.isSpining=false
        return
      }

      this.getData(1, "N")
    }
    else if (type === 'online') {
      this.onlineAvailableSlab=undefined
      // this.onlineAvailableSlab=''
      this.onlineAvailableSlabDropdowns=[]
      if(!this.equityDelivery || this.equityDelivery ==='')
      {
        this.notif.error('Please enter online delivery','')
        this.isSpining=false
        return
      }
      if(!this.equitySpeculation || this.equitySpeculation ==='')
      {
        this.notif.error('Please enter online speculation','')
        this.isSpining=false
        return
      }

      this.getData(1, "O")
    }
    else if (type === 'bond') {
      this.bondAvailableSlab=undefined
      // this.bondAvailableSlab=''
      this.bondAvailableSlabDropdowns=[]
      if(!this.bonddelivery || this.bonddelivery ==='')
      {
        this.notif.error('Please enter bond delivery','')
        this.isSpining=false
        return
      }
      if(!this.bondspeculation || this.bondspeculation ==='')
      {
        this.notif.error('Please enter bond speculation','')
        this.isSpining=false
        return
      }

      this.getData(1, "B")
    }
  }
  callSpBrokerageReductionFoSymbolwise(row) {
    // console.log(row);

    let FixedBrokerage = row.NewFixedBrokerage
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "Flag": "I",
          "SymbolType": "",
          "Symbol": "",
          "SlNo": Number(this.hfSlno),
          "Location": this.Tradecode ? (this.Tradecode.Location ? this.Tradecode.Location.trim().toUpperCase() : '') : '',
          "tradecode": this.Tradecode ? (this.Tradecode.TradeCode ? this.Tradecode.TradeCode.trim().toUpperCase() : '') : '',
          "UporDown": this.currentBrokerage,
          "Futures_Symbol": row.Symbol?row.Symbol.trim():'',
          "Futures_Product": row.Ins_code?row.Ins_code.trim():'',
          "Futures_Brokerage": FixedBrokerage,
          "Euser": this.currentUser.userCode ? this.currentUser.userCode : '',
          "RMApprovalreqd": row.BrokerageDiscountpermissionFor_RM?row.BrokerageDiscountpermissionFor_RM.trim():'',
          "SHApprovalreqd": row.BrokerageDiscountpermissionFor_SH?row.BrokerageDiscountpermissionFor_SH.trim():'',
          "SalesHeadsApprovalreqd": row.BrokerageDiscountpermissionFor_AD?row.BrokerageDiscountpermissionFor_AD.trim():'',
          "EDApprovalreqd": row.EDApprovalreqd?row.EDApprovalreqd.trim():'',
          "present_Brokerage": row.FixedBrokerage?row.FixedBrokerage.trim():''
        }],
      "requestId": "1000082",
      "outTblCount": "0"
    })
      .then((response) => {

        // ds = con.SPGetDS("SpBrokerageReductionFoSymbolwise", param);
        console.log("resssssss", response);

      })
  }
  callSpBrokerageReduction_COMSymbolwise(row, COMNormalBrk, COMIntradayBrk) {
    let FixedBrokerage = row.NewFixedBrokerage
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "Slno": Number(this.hfSlno),
          "Location": this.Tradecode ? (this.Tradecode.Location ? this.Tradecode.Location.trim().toUpperCase() : '') : '',
          "tradecode": this.Tradecode ? (this.Tradecode.TradeCode ? this.Tradecode.TradeCode.trim().toUpperCase() : '') : '',
          "UpwardorDownward": this.currentBrokerage,
          "Instrument": row.Instrument?row.Instrument.trim():'',
          "Product": row.Product?row.Product.trim():'',
          "Symbol": row.Symbol?row.Symbol.trim():'',
          "NormalBrok": COMNormalBrk?COMNormalBrk:'',
          "IntraDayBrok": COMIntradayBrk?COMIntradayBrk:'',
          "Euser": this.currentUser.userCode ? this.currentUser.userCode : ''
        }],
      "requestId": "1000083",
      "outTblCount": "0"
    })
      .then((response) => {

        // ds = con.SPGetDS("SpBrokerageReductionFoSymbolwise", param);
        console.log("resssssss", response);

      })
  }
  sendmail() {
    // StringBuilder strmailbody = new StringBuilder();
    // MailMessage mail = new MailMessage();

    // DataSet ds = new DataSet();
    // string[] array ={
    //                     "@Slno","0",
    //                     "@Loc",txtloc.Text,
    //                     "@tradecode",txtTradecode.Text,
    //                     "@RMorSHorED","",
    //                     "@flag","0",
    //                     "@usercode",Session["Usercode"].ToString()
    //                   };


    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "Slno": "0",
          "Loc": this.Tradecode ? (this.Tradecode.Location ? this.Tradecode.Location.trim().toUpperCase() : '') : '',
          "tradecode": this.Tradecode ? (this.Tradecode.TradeCode ? this.Tradecode.TradeCode.trim().toUpperCase() : '') : '',
          "RMorSHorED": "",
          "flag": "0",
          "usercode": this.currentUser.userCode ? this.currentUser.userCode : ''
        }],
      "requestId": "10000101",
      "outTblCount": "0"
    })
      .then((response) => {


        //  ds = con.SPGetDS("SpBrokerageRevisionMail", array);
        console.log("mail", response);
        this.notif.success('Data Saved successfully','')
        this.isSpining=false

      })
  }
  fillSymbol(type) {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "SymbolType": type,
          "Flag": "R"
        }],
      "requestId": "1000082",
      "outTblCount": "0"
    })
      .then((response) => {

        //  ds = con.SPGetDS("SpBrokerageReductionFoSymbolwise", array);
        console.log("resssssss", response);
        if (response) {
          let data = response.results[0][0]
          // if(type==='futures'){
          this.hfRMApprovalreqdAmt = data.BrokerageDiscountpermissionFor_RM !== "" ? data.BrokerageDiscountpermissionFor_RM : "0";
          this.hfSHApprovalreqdAmt = data.BrokerageDiscountpermissionFor_SH !== "" ? data.BrokerageDiscountpermissionFor_SH : "0";
          this.hfSalesHeadsApprovalreqdAmt = data.BrokerageDiscountpermissionFor_AD !== "" ? data.BrokerageDiscountpermissionFor_AD : "0";
          this.hfEDApprovalreqdAmt = "10";
          console.log(this.hfRMApprovalreqdAmt,this.hfSHApprovalreqdAmt,this.hfSalesHeadsApprovalreqdAmt," fillSymbol");

          // }
          // else if(type==='options'){
          //   this.hfRMApprovalreqdAmt = data.BrokerageDiscountpermissionFor_RM ? data.BrokerageDiscountpermissionFor_RM : "0";
          //   this.hfSHApprovalreqdAmt = data.BrokerageDiscountpermissionFor_SH ? data.BrokerageDiscountpermissionFor_SH : "0";
          //   this.hfSalesHeadsApprovalreqdAmt = data.BrokerageDiscountpermissionFor_AD ? data.BrokerageDiscountpermissionFor_AD : "0";
          //   this.hfEDApprovalreqdAmt = "10";
          // }
        }

      })
    // if(type==='futures')
    // {

    // }
    // else if(type==='options')
    // {

    // }

  }
  addSymbol(type) {
    if (type === 'futures') {
      this.btnAddFutSybol_Click()
    }
    else if (type === 'options') {
      this.btnAddOptSybol_Click()
    }
  }
  btnAddFutSybol_Click() {
    if (!this.FuturesSymbol || this.FuturesSymbol === "") {
      this.notif.error("Please enter futures symbol type", '')
      return;
    }
    if (!this.FuturesSymbol || this.FuturesSymbol['B.Symbol'] === "") {
      this.notif.error("Please enter futures symbol type", '')
      return;
    }
    if (this.FuturesSymbolField === "") {
      this.notif.error("Please enter futures fixedbrokerage", '')
      return;
    }
    if (this.currentBrokerage === "D") {
      if (Number(this.FuturesSymbol['A.FixedBrokerage']) > 0) {
        if (Number(this.FuturesSymbolField) >= Number(this.FuturesSymbol['A.FixedBrokerage'])) {
          this.notif.error("Futures FixedBrokerage below to existing brokerage ", '')
          return;
        }
      }
    }
    if (this.currentBrokerage == "U") {
      if (Number(this.FuturesSymbol['A.FixedBrokerage']) > 0) {
        if (Number(this.FuturesSymbolField) <= Number(this.FuturesSymbol['A.FixedBrokerage'])) {
          this.notif.error("Futures FixedBrokerage above to existing brokerage ", '')
          return;
        }
      }
    }
    if (Number(this.FuturesSymbolField) >= Number(this.hfRMApprovalreqdAmt) && this.currentBrokerage == "D") {
      this.hfRMApprovalreqd = "Y";
      this.hfSHApprovalreqd = "N";
      this.hfSalesHeadsApprovalreqd = "N";
      this.hfEDApprovalreqd = "N";
    }
    else if (Number(this.FuturesSymbolField) <= Number(this.hfRMApprovalreqdAmt) && Number(this.FuturesSymbolField) >= Number(this.hfSHApprovalreqdAmt) && this.currentBrokerage == "D") {
      this.hfRMApprovalreqd = "Y";
      this.hfSHApprovalreqd = "Y";
      this.hfSalesHeadsApprovalreqd = "N";
      this.hfEDApprovalreqd = "N";
    }
    else if (Number(this.FuturesSymbolField) <= Number(this.hfSHApprovalreqdAmt) && Number(this.FuturesSymbolField) >= Number(this.hfSalesHeadsApprovalreqdAmt) && this.currentBrokerage == "D") {
      this.hfRMApprovalreqd = "Y";
      this.hfSHApprovalreqd = "Y";
      this.hfSalesHeadsApprovalreqd = "Y";
      this.hfEDApprovalreqd = "N";
    }
    else {
      if (this.currentBrokerage == "D") {
        this.hfRMApprovalreqd = "Y";
        this.hfSHApprovalreqd = "Y";
        this.hfSalesHeadsApprovalreqd = "Y";
        this.hfEDApprovalreqd = "Y";
      }
    }
    if (this.contrBrkDtsTable.length > 0) {
      this.contrBrkDtsTable.forEach((row,index) => {

        console.log(row,index,"row index contrtable futures",this.hfInscode,this.FuturesSymbol);
        if (row.Ins_code.trim() === this.FuturesSymbol['B.Ins_code'].trim()  && row.Symbol.trim() === this.FuturesSymbol['B.Symbol'].trim()) {//if (row.Ins_code.trim() === this.hfInscode && row.Symbol.trim() === this.FuturesSymbol.Symbol.trim()) {
          this.notif.error("Same data already entered", '')
          // this.OptionsSymbol = ''
          this.FuturesSymbol = ''
          this.FuturesSymbolField = "";
          return;
        }
        if(index ===this.contrBrkDtsTable.length-1)
        {
          this.addfuturestoTable()
        }

      });
    }
    else{
      this.addfuturestoTable()
    }


  }
  addfuturestoTable()
  {
    console.log(this.FuturesSymbol,"this.FuturesSymbol");

    let json = {
      Ins_code: this.FuturesSymbol['B.Ins_code']?this.FuturesSymbol['B.Ins_code']:'',//this.hfInscode,
      Symbol: this.FuturesSymbol['B.Symbol']?this.FuturesSymbol['B.Symbol']:'',
      FixedBrokerage: this.FuturesSymbol['A.FixedBrokerage']?this.FuturesSymbol['A.FixedBrokerage']:'',//this.hfFutFixedBrok,
      NewFixedBrokerage: this.FuturesSymbolField,
      BrokerageDiscountpermissionFor_RM: this.hfRMApprovalreqd,
      BrokerageDiscountpermissionFor_SH: this.hfSHApprovalreqd,
      BrokerageDiscountpermissionFor_AD: this.hfSalesHeadsApprovalreqd,
      EDApprovalreqd: this.hfEDApprovalreqd

    }
    this.contrBrkDtsTablShow = false
    this.contrBrkDtsTable.push(json)
    setTimeout(() => {
      this.contrBrkDtsTablShow = true
    }, 10);
    console.log(this.contrBrkDtsTable, "this.contrBrkDtsTable");

    this.FuturesSymbolField = "";
    this.hfFutFixedBrok = "";
    this.lblFutFixedBrok = "";
    this.FuturesSymbol = "";
    this.hfInscode = "";
  }
  btnAddOptSybol_Click() {
    if(!this.OptionsSymbol || this.OptionsSymbol === '')
    {
      this.notif.error("Please enter Options symbol type", '')
      return;
    }
    if (!this.OptionsSymbol || this.OptionsSymbol['B.Symbol'] === "") {
      this.notif.error("Please enter Options symbol type", '')
      return;
    }
    if (this.OptionsSymbolField === "") {
      this.notif.error("Please enter options fixedbrokerage", '')
      return;
    }
    if (this.currentBrokerage == "D") {
      if (Number(this.OptionsSymbol['A.FixedBrokerage']) > 0) {
        if (Number(this.OptionsSymbolField) >= Number(this.OptionsSymbol['A.FixedBrokerage'])) {
          this.notif.error("Options FixedBrokerage below to existing brokerage ", '')
          return;
        }
      }
    }
    if (this.currentBrokerage == "U") {
      if (Number(this.OptionsSymbol['A.FixedBrokerage']) > 0) {
        if (Number(this.OptionsSymbolField) <= Number(this.OptionsSymbol['A.FixedBrokerage'])) {
          this.notif.error("options FixedBrokerage above to existing brokerage ", '')
          return;
        }
      }
    }

    if (Number(this.OptionsSymbolField) >= Number(this.hfRMApprovalreqdAmt) && this.currentBrokerage == "D") {
      this.hfRMApprovalreqd = "Y";
      this.hfSHApprovalreqd = "N";
      this.hfSalesHeadsApprovalreqd = "N";
      this.hfEDApprovalreqd = "N";
    }
    else if (Number(this.OptionsSymbolField) <= Number(this.hfRMApprovalreqdAmt) && Number(this.OptionsSymbolField) >= Number(this.hfSHApprovalreqdAmt) && this.currentBrokerage == "D") {
      this.hfRMApprovalreqd = "Y";
      this.hfSHApprovalreqd = "Y";
      this.hfSalesHeadsApprovalreqd = "N";
      this.hfEDApprovalreqd = "N";
    }
    else if (Number(this.OptionsSymbolField) <= Number(this.hfSHApprovalreqdAmt) && Number(this.OptionsSymbolField) >= Number(this.hfSalesHeadsApprovalreqdAmt) && this.currentBrokerage == "D") {
      this.hfRMApprovalreqd = "Y";
      this.hfSHApprovalreqd = "Y";
      this.hfSalesHeadsApprovalreqd = "Y";
      this.hfEDApprovalreqd = "N";
    }
    else {
      if (this.currentBrokerage == "D") {
        this.hfRMApprovalreqd = "Y";
        this.hfSHApprovalreqd = "Y";
        this.hfSalesHeadsApprovalreqd = "Y";
        this.hfEDApprovalreqd = "Y";
      }
    }
    if (this.contrBrkDtsTable.length > 0) {
      this.contrBrkDtsTable.forEach((row,index) => {
        if (row.Ins_code.trim() == this.OptionsSymbol['B.Ins_code'].trim() && row.Symbol.trim() == this.OptionsSymbol['B.Symbol'].trim()) {//if (row.Ins_code == this.hfProcode && row.Symbol == this.OptionsSymbol.Symbol) {
          this.notif.error("Same data already entered", '')
          this.hfOptFixedBrok = "";
          this.OptionsSymbolField = "";
          this.lblOptFixedBrok = "";
          this.OptionsSymbol = "";
          this.hfProcode = "";
          return;
        }
        if(index ===this.contrBrkDtsTable.length-1)
        {
        this.addOptionTotable()
      }

      });
    }
    else{
      this.addOptionTotable()
    }


  }
  addOptionTotable()
  {
    let json = {
      Ins_code: this.OptionsSymbol['B.Ins_code'],//this.hfProcode,
      Symbol: this.OptionsSymbol['B.Symbol'],
      FixedBrokerage: this.OptionsSymbol['A.FixedBrokerage'],//this.hfOptFixedBrok,
      NewFixedBrokerage: this.OptionsSymbolField,
      BrokerageDiscountpermissionFor_RM: this.hfRMApprovalreqd,
      BrokerageDiscountpermissionFor_SH: this.hfSHApprovalreqd,
      BrokerageDiscountpermissionFor_AD: this.hfSalesHeadsApprovalreqd,
      EDApprovalreqd: this.hfEDApprovalreqd

    }
    this.contrBrkDtsTablShow = false
    this.contrBrkDtsTable.push(json)
    setTimeout(() => {
      this.contrBrkDtsTablShow = true
    }, 10);
    console.log(this.contrBrkDtsTable, "this.contrBrkDtsTable");

    // ddlOptions.SelectedIndex = 0;
    this.hfOptFixedBrok = "";
    this.OptionsSymbolField = "";
    this.lblOptFixedBrok = "";
    this.OptionsSymbol = "";
    this.hfProcode = "";
  }
  FuturesSymbolSerach()
  {
    setTimeout(() => {

      console.log(this.FuturesSymbol,"FuturesSymbol");
    }, 10);
  }
  OptionsSymbolSearch()
  {
    setTimeout(() => {

    console.log(this.OptionsSymbol,"OptionsSymbol");
  }, 10);
  }
  tbxFixedBrok_TextChanged(type: string) {
    var symbol =''
    console.log(this.FuturesSymbol,"tbxFixedBrok_TextChanged this.FuturesSymbol ");

    if (type === 'FUT') {
      this.lblFutFixedBrok = "";
      this.hfFutFixedBrok = "";
      symbol = this.FuturesSymbol['B.Symbol']?this.FuturesSymbol['B.Symbol']:''
    }
    else if (type === 'OPT') {
      this.lblOptFixedBrok = "";
      this.hfOptFixedBrok = "";
      symbol = this.OptionsSymbol['B.Symbol']?this.OptionsSymbol['B.Symbol']:''
    }


    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "SymbolType": type,
          "Flag": "R",
          "Symbol": symbol?symbol.trim():'',
          "Location": this.Tradecode ? (this.Tradecode.Location ? this.Tradecode.Location.trim().toUpperCase() : '') : '',
          "tradecode": this.Tradecode ? (this.Tradecode.TradeCode ? this.Tradecode.TradeCode.trim().toUpperCase() : '') : '',
          "SlNo":0
        }],
      "requestId": "1000082",
      "outTblCount": "0"
    })
      .then((response) => {

        //  ds = con.SPGetDS("SpBrokerageReductionFoSymbolwise", array);
        console.log("resssssss", response);
        if (response.errorCode == 0) {
          let data = response.results[1][0]
          // DataSet ds = con.SPGetDS("SpBrokerageReductionFoSymbolwise", param);
          if (data.length > 0) {
            //this.lblFutFixedBrok = dt.Rows[0]["FixedBrokerage"].ToString();
            if (type === 'FUT') {
              this.lblFutFixedBrok = data.FixedBrokerage !== "" ? data.FixedBrokerage : "0";
              this.hfFutFixedBrok = this.lblFutFixedBrok;
            }
            else if (type === 'OPT') {
              this.lblOptFixedBrok = data.FixedBrokerage !== "" ? data.FixedBrokerage : "0";
              this.hfOptFixedBrok = this.lblOptFixedBrok;
            }

          }
          else {
            if (type === 'FUT') {
              this.hfFutFixedBrok = "0";
              this.lblFutFixedBrok = "0.000";
            }
            else if (type === 'OPT') {
              this.hfOptFixedBrok = "0";
              this.lblOptFixedBrok = "0.000";
            }
          }
        }
        else{
          console.log(response,'res');

        }

      })
  }
  btnAddCOMFut_Click() {
    var COMFutMin, COMFutMax, COMOptMin, COMOptionsIntraday, COMOptionsNormal;
    COMFutMin = 5;
    COMFutMax = 800;
    COMOptMin = 5;
    COMOptionsIntraday = 150;
    COMOptionsNormal = 250;

    if (this.exchangeOrSymbol === "E" && this.exchange === "") {
      this.notif.error("Please enter any of the COM - Exchange", '')
      return;
    }
    if (!this.symbol || this.symbol === "") {
      this.notif.error("Please enter any of the COM - Symbol", '')
      return;
    }
    if (!this.symbol || this.symbol['S.Symbol'] === "") {
      this.notif.error("Please enter any of the COM - Symbol", '')
      return;
    }

    if (this.symbolOrAmountNormal !== "") {
      if (this.symbolOrAmountNormal.substring(0, 1) === "0") {
        this.notif.error("Please enter valid COM Symbolwise - Normal Brokerage", '')
        return;
      }
    }

    if (this.symbolOrAmountIntraday !== "") {
      if (this.symbolOrAmountIntraday.substring(0, 1) == "0") {
        this.notif.error("Please enter valid COM Symbolwise - Intraday Brokerage", '')
        return;
      }
    }

    if (this.symbolOrAmountNormal === "" && this.symbolOrAmountIntraday === "") {
      {
        this.notif.error("Please enter values in both Normal and Intraday Brokerage fields", '')
        return;
      }
    }

    if ((this.symbolOrAmountNormal !== "" && this.symbolOrAmountIntraday === "") || (this.symbolOrAmountNormal === "" && this.symbolOrAmountIntraday !== "")) {
      this.notif.error("Please enter values in both Normal and Intraday Brokerage fields", '')
      return;
    }
    else if (this.symbolOrAmountNormal !== "" && this.symbolOrAmountIntraday !== "") {
      if ((Number(this.symbolOrAmountNormal) === Number(this.symbol['V.NormalBrokerage']))
        && (Number(this.symbolOrAmountIntraday) === Number(this.symbol['V.IntradayNormalBrokerage']))) {
        this.notif.error("COM Symbolwise - Either Normal Or Intraday Brokerage reduction should be different from existing brokerage", '')
        return;
      }
    }


    if (this.currentBrokerage === "D") {
      if (this.instrument.trim() === "FUTCOM") {
        if (this.symbolOrAmountNormal !== "") {
          if (Number(this.symbolOrAmountNormal) < Number(COMFutMin)) {
            this.notif.error("COM Symbolwise - Normal Brokerage reduction not possible to change below rack rate", '')
            return;
          }
          if (Number(this.symbolOrAmountNormal) > Number(COMFutMax)) {
            this.notif.error("COM Symbolwise - Normal Brokerage reduction not possible to change above rack rate", '')
            return;
          }

          if (Number(this.symbol['V.NormalBrokerage']) > 0) {
            if (Number(this.symbolOrAmountNormal) > Number(this.symbol['V.NormalBrokerage'])) {
              this.notif.error("COM Symbolwise - Normal brokerage reduction should not exceed existing brokerage", '')
              return;
            }
          }
        }

        if (this.symbolOrAmountIntraday !== "") {
          if (Number(this.symbolOrAmountIntraday) < Number(COMFutMin)) {
            this.notif.error("COM Symbolwise - Intraday Brokerage reduction not possible to change below rack rate", '')
            return;
          }
          if (Number(this.symbolOrAmountIntraday) > Number(COMFutMax)) {
            this.notif.error("COM Symbolwise - Intraday Brokerage reduction not possible to change above rack rate", '')
            return;
          }

          if (Number(this.symbol['V.IntradayNormalBrokerage']) > 0) {
            if (Number(this.symbolOrAmountIntraday) > Number(this.symbol['V.IntradayNormalBrokerage'])) {
              this.notif.error("COM Symbolwise - Intraday brokerage reduction should not exceed existing brokerage", '')
              return;
            }
          }
        }
      }
      else {
        if (this.symbolOrAmountNormal !== "") {
          if (Number(this.symbolOrAmountNormal) < Number(COMOptMin)) {
            this.notif.error("COM Symbolwise - Normal Brokerage reduction not possible to change below rack rate", '')
            return;
          }
          if (Number(this.symbolOrAmountNormal) > Number(COMOptionsNormal)) {
            this.notif.error("COM Symbolwise - Normal Brokerage reduction not possible to change above rack rate", '')
            return;
          }
          if (Number(this.symbol['NormalBrokerage']) > 0) {
            if (Number(this.symbolOrAmountNormal) > Number(this.symbol['V.NormalBrokerage'])) {
              this.notif.error("COM Symbolwise - Normal Brokerage reduction should not exceed existing brokerage", '')
              return;
            }
          }
        }

        if (this.symbolOrAmountIntraday !== "") {
          if (Number(this.symbolOrAmountIntraday) < Number(COMOptMin)) {
            this.notif.error("COM Symbolwise - Intraday Brokerage reduction not possible to change below rack rate", '')
            return;
          }
          if (Number(this.symbolOrAmountIntraday) > Number(COMOptionsIntraday)) {
            this.notif.error("COM Symbolwise - Intraday Brokerage reduction not possible to change above rack rate", '')
            return;
          }
          if (Number(this.symbol['V.IntradayNormalBrokerage']) > 0) {
            if (Number(this.symbolOrAmountIntraday) > Number(this.symbol['V.IntradayNormalBrokerage'])) {
              this.notif.error("COM Symbolwise - Intraday Brokerage reduction should not exceed existing brokerage", '')
              return;
            }
          }
        }
      }
    }
    else if (this.currentBrokerage === "U") {
      if (this.instrument.trim() === "FUTCOM") {
        if (this.symbolOrAmountNormal != "") {
          if (Number(this.symbolOrAmountNormal) < Number(COMFutMin)) {
            this.notif.error("COM Symbolwise - Normal Brokerage reduction not possible to change below rack rate", '')
            return;
          }
          if (Number(this.symbolOrAmountNormal) > Number(COMFutMax)) {
            this.notif.error("COM Symbolwise - Normal Brokerage reduction not possible to change above rack rate", '')
            return;
          }

          if (Number(this.symbol['V.NormalBrokerage']) > 0) {
            if (Number(this.symbolOrAmountNormal) < Number(this.symbol['V.NormalBrokerage'])) {
              this.notif.error("COM Symbolwise - Normal brokerage reduction should not be below existing brokerage", '')
              return;
            }
          }
        }
        if (this.symbolOrAmountIntraday != "") {
          if (Number(this.symbolOrAmountIntraday) > Number(COMFutMax)) {
            this.notif.error("COM Symbolwise - Intraday Brokerage reduction not possible to change above rack rate", '')
            return;
          }
          if (Number(this.symbolOrAmountIntraday) < Number(COMFutMin)) {
            this.notif.error("COM Symbolwise - Intraday Brokerage reduction not possible to change below rack rate", '')
            return;
          }

          if (Number(this.symbol['V.IntradayNormalBrokerage']) > 0) {
            if (Number(this.symbolOrAmountIntraday) < Number(this.symbol['V.IntradayNormalBrokerage'])) {
              this.notif.error("COM Symbolwise - Intraday brokerage reduction should not be below existing brokerage", '')
              return;
            }
          }
        }
      }
      else {
        if (this.symbolOrAmountNormal !== "") {
          if (Number(this.symbolOrAmountNormal) > Number(COMOptionsNormal)) {
            this.notif.error("COM Symbolwise - Normal Brokerage reduction not possible to change above rack rate", '')
            return;
          }
          if (Number(this.symbolOrAmountNormal) < Number(COMOptMin)) {
            this.notif.error("COM Symbolwise - Normal Brokerage reduction not possible to change below rack rate", '')
            return;
          }
          if (Number(this.symbol['V.NormalBrokerage']) > 0) {
            if (Number(this.symbolOrAmountNormal) < Number(this.symbol['V.NormalBrokerage'])) {
              this.notif.error("COM Symbolwise - Normal brokerage reduction should not be below existing brokerage", '')
              return;
            }
          }
        }

        if (this.symbolOrAmountIntraday !== "") {
          if (Number(this.symbolOrAmountIntraday) > Number(COMOptionsIntraday)) {
            this.notif.error("COM Symbolwise - Intraday Brokerage reduction not possible to change above rack rate", '')
            return;
          }
          if (Number(this.symbolOrAmountIntraday) < Number(COMOptMin)) {
            this.notif.error("COM Symbolwise - Intraday Brokerage reduction not possible to change below rack rate", '')
            return;
          }
          if (Number(this.symbol['V.IntradayNormalBrokerage']) > 0) {
            if (Number(this.symbolOrAmountIntraday) < Number(this.symbol['V.IntradayNormalBrokerage'])) {
              this.notif.error("COM Symbolwise - Intraday Brokerage reduction should not be below existing brokerage", '')
              return;
            }
          }
        }
      }
    }

    if (this.commodityTable.length > 0) {
      this.commodityTable.forEach((row,index) => {
        let Instrument = row.Instrument.trim();
        let Product = row.Product.trim();
        let Symbol = row.Symbol.trim();
        let COMproduct = ""
        let COMInstrument = ""
        COMInstrument = this.instrument.trim();
        if (this.exchange !== "") {
          COMproduct = "COM" + this.exchange;
        }
        else {
          COMproduct = this.symbol['S.Product'].trim();
        }

        if (Instrument.trim() === COMInstrument.trim() && Product.trim() === COMproduct.trim() && Symbol.trim() === this.symbol['S.Symbol'].trim()) {
          this.notif.error("Entry already exist for the same Symbol", '')
          this.exchange = "";
          this.exchangeOrSymbol = 'E'
          this.symbolOrAmountNormal = "";
          this.symbolOrAmountIntraday = "";
          // this.symbol.Symbol = "";
          // this.symbol.NormalBrokerage = "";
          // this.symbol.IntradayNormalBrokerage = "";
          this.symbol = ""
          return;
        }
        if(index ===this.commodityTable.length-1)
        {
          this.addSymbolAmount()
        }
      });
    }
    else
    {
      this.addSymbolAmount()
    }


  }
  addSymbolAmount(){
    let dr = {
      Instrument:'',
      Product:'',
      Symbol:'',
      NormalBrok:'',
      CurNormalBrok:'',
      IntradayBrok:'',
      CurIntradayBrok:''
    }
    dr["Instrument"] = this.instrument.trim();
    if (this.exchange !== "") {
      dr["Product"] = "COM" + this.exchange;
    }
    else {
      dr["Product"] = this.symbol['S.Product'].trim();
    }
    dr["Symbol"] = this.symbol['S.Symbol'];

    if (this.symbolOrAmountNormal !== "") {
      dr["NormalBrok"] = this.symbolOrAmountNormal;
      dr["CurNormalBrok"] = this.symbol['V.NormalBrokerage'];
    }
    else {
      dr["NormalBrok"] = "";
      dr["CurNormalBrok"] = "";
    }
    if (this.symbolOrAmountIntraday !== "") {
      dr["IntradayBrok"] = this.symbolOrAmountIntraday;
      dr["CurIntradayBrok"] = this.symbol['V.IntradayNormalBrokerage'];
    }
    else {
      dr["IntradayBrok"] = "";
      dr["CurIntradayBrok"] = "";
    }
    this.commodityTableShow = false
    this.commodityTable.push(dr)

    setTimeout(() => {
      this.commodityTableShow = true
    }, 10);


  this.exchange = "";
  this.exchangeOrSymbol = 'E'
  this.symbolOrAmountNormal = "";
  this.symbolOrAmountIntraday = "";
  // this.symbol.Symbol = "";
  // this.symbol.NormalBrokerage = "";
  // this.symbol.IntradayNormalBrokerage = "";
  this.symbol = ""
  }
  deleteContrBrkDtsTabl(i) {
    this.contrBrkDtsTablShow = false
    this.contrBrkDtsTable.splice(i, 1)
    setTimeout(() => {
      this.contrBrkDtsTablShow = true
    }, 10);

  }
  deletecommodityTabl(i) {
    this.commodityTableShow = false
    this.commodityTable.splice(i, 1)
    setTimeout(() => {
      this.commodityTableShow = true
    }, 10);
  }
  deliveryCheckFunction()
  {
    this.deliveryDelivery=''
    this.deliverySpeculation=''
    this.deliveryMinBrokerage=''
    this.delivaryAvailableSlab=''
    this.delivaryAvailableSlabDropdowns=[]
  }
  equityOnlineBrokerageCheckFunction()
  {
    this.equityDelivery=''
    this.equitySpeculation=''
    this.equityMinBrokerage=''
    this.onlineAvailableSlab=''
    this.onlineAvailableSlabDropdowns=[]
  }
  futuresCheckFunction()
  {
    this.offlinePercentage=''
    this.offlineLot=''
    this.onlinePercentage=''
    this.onlineLot=''
  }
  optionsCheckFunction()
  {
    this.onlineIntradayBrokerage=''
    this.onlineCarryForwardBrokerage=''
    this.offlineIntradayBrokerage=''
    this.offlineCarryForwardBrokerage=''
  }
  futuresSymbolwiseCheckFunction()
  {
    this.FuturesSymbol=''
    this.FuturesSymbolField=''
  }
  optionsSymbolwiseCheckFunction()
  {
    this.OptionsSymbol=''
    this.OptionsSymbolField=''
  }
  cdsFuturesCheckFucntion()
  {
    this.cdsFuturesDefaultBrokerage=''
  }
  cdsOptionsCheckFucntion()
  {
    this.cdsOptionsDefaultBrokerage=''
  }
  commcxFuturesCheckFunction()
  {
    this.mcxNormal=''
    this.mcxIntraday=''
    this.mcxDelivery=''
  }
  comncdexFuturesCheckFunction()
  {
    this.ncdexNormal=''
    this.ncdexIntraday=''
    this.ncdexDelivery=''
  }
  comOptionsCheckFunction()
  {
    this.optionNormal=''
    this.optionIntraday=''
  }
  comSymbolwiseCheckFunction()
  {
    this.exchangeOrSymbol='E'
    this.instrument='FUTCOM'
    this.exchange=''
    this.symbol=''
    this.symbolOrAmountNormal=''
    this.symbolOrAmountIntraday=''
  }
  bondCheckFunction()
  {
    this.bonddelivery=''
    this.bondspeculation=''
    this.bondminbrokerage=''
    this.bondAvailableSlab=''
    this.bondAvailableSlabDropdowns=[]
  }
  slbCheckFunction()
  {
    this.slbpercentage=''
  }
  getInstrument_Symbol()
  {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{usercode:''}],
      "requestId": "1000085",//spgetCommodity_Symbol
      "outTblCount": "0"
    })
      .then((response) => {

        //  ds = con.SPGetDS("SpBrokerageReductionFoSymbolwise", array);
        console.log("resssssss", response);
        if (response.errorCode == 0) {
          // let data1 = response.results[0][0]
          this.instrumentDropdowns =response.results[0]?response.results[0]:[]
          this.exchangeDropdowns =response.results[1]?response.results[1]:[]
          this.exchangeDropdowns.unshift({ Product_Text: 'Select',Product_Value: '' })
          // if (ds.Tables[0].Rows.Count > 0)
          //   {
          //       ddlInstrument.DataTextField = ds.Tables[0].Columns["InstrumentCode"].ToString();
          //       ddlInstrument.DataValueField = ds.Tables[0].Columns["InstrumentCode"].ToString();
          //       ddlInstrument.DataSource = ds.Tables[0];
          //       ddlInstrument.DataBind();
          //   }
          //   if (ds.Tables[1].Rows.Count > 0)
          //   {
          //       drpdwnExchange.Items.Insert(0, new ListItem("Select", ""));
          //       drpdwnExchange.DataValueField = ds.Tables[1].Columns["Product_Value"].ToString();
          //       drpdwnExchange.DataTextField = ds.Tables[1].Columns["Product_Text"].ToString();
          //       drpdwnExchange.DataSource = ds.Tables[1];
          //       drpdwnExchange.DataBind();
          //       drpdwnExchange.Items.Insert(0, new ListItem("--Select--", ""));
          //   }
          // DataSet ds = con.SPGetDS("SpBrokerageReductionFoSymbolwise", param);

        }
        else{
          console.log(response,'res');
        }

      })
  }
  tradecodeSearch()
  {
    this.reset('tradeclear')
  }
  reset(type?) {
    if(type !=='brok' && type !=='tradeclear')
      this.currentBrokerage ='D';
    if(type !=='tradeclear')
    {
      this.Tradecode = undefined
    }
    this.entryFieldsShow = false
    this.tradecodeShow =type !=='tradeclear'?false:this.tradecodeShow
    this.dateofEffect = new Date()

    this.instrument = 'FUTCOM'
    this.exchange = ''
    this.deliveryCheck = false
    this.equityOnlineBrokerageCheck = false
    this.futuresCheck = false
    this.optionsCheck = false
    this.futuresSymbolwiseCheck = false
    this.OptionsSymbolwiseCheck = false
    this.cdsFuturesCheck = false
    this.cdsOptionsCheck = false
    // this.mcxsxFuturesCheck = false
    // this.mcxsxOptionsCheck = false
    this.commcxFuturesCheck = false
    this.comncdexFuturesCheck = false
    // this.comicexFutures = false
    this.comOptionsCheck = false
    this.comSymbolwiseCheck = false
    this.bondCheck = false
    this.slbCheck = false

    this.hfcltype = ''

    this.deliveryDelivery = ''
    this.deliverySpeculation = ''
    this.equityDelivery = ''
    this.equitySpeculation = ''
    this.offlinePercentage = ''
    this.offlineLot = ''
    this.onlinePercentage = ''
    this.onlineLot = ''
    this.onlineIntradayBrokerage = ''
    this.onlineCarryForwardBrokerage = ''
    this.offlineIntradayBrokerage = ''
    this.offlineCarryForwardBrokerage = ''
    this.cdsFuturesDefaultBrokerage = ''
    this.cdsOptionsDefaultBrokerage = ''
    // this.mcxsxFuturesDefaultBrokerage = ''
    // this.mcxsxOptionsDefaultBrokerage = ''
    this.mcxNormal = ''
    this.mcxDelivery = ''
    this.mcxIntraday = ''
    this.ncdexNormal = ''
    this.ncdexDelivery = ''
    this.ncdexIntraday = ''
    this.optionNormal = ''
    this.optionIntraday = ''
    this.symbolOrAmountNormal = ''
    this.symbolOrAmountIntraday = ''
    this.exchangeOrSymbol = ''
    this.bonddelivery = ''
    this.bondspeculation = ''
    this.slbpercentage = ''
    this.projectedBrokerage = ''
    this.reason = ''
    this.remark = ''

    this.detailData = []
    this.contrBrkDtsTablShow = true
    this.contrBrkDtsTable = []
    this.commodityTableShow = true
    this.commodityTable = []

    this.FuturesSymbol = ''
    this.FuturesSymbolField = ''
    this.OptionsSymbol = ''
    this.OptionsSymbolField = ''
    this.instrument = 'FUTCOM'
    this.exchangeOrSymbol = 'E'
    this.symbol = ''

    this.delivaryAvailableSlab = ''
    this.delivaryAvailableSlabDropdowns = []
    this.onlineAvailableSlab = ''
    this.onlineAvailableSlabDropdowns = []
    this.bondAvailableSlab = ''
    this.bondAvailableSlabDropdowns = []

    this.divDisclaimer1=type !=='tradeclear'?true:this.divDisclaimer1
    this.divDisclaimer2=type !=='tradeclear'?false:this.divDisclaimer2

  }
}
