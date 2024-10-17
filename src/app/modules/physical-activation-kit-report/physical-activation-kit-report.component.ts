import { Component, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { DataService, FindOptions, FormHandlerComponent, User,AuthService } from 'shared';

@Component({
  selector: 'app-physical-activation-kit-report',
  templateUrl: './physical-activation-kit-report.component.html',
  styleUrls: ['./physical-activation-kit-report.component.css']
})
export class PhysicalActivationKitReportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  locationFind: FindOptions;
  regionFind: FindOptions;
  tradeCodeFind: FindOptions;
  location
  region
  tradecode
  fromDate:Date =new Date
  toDate:Date =new Date
  approved:string=''
  received:string=''
  DocumentsArrayHeads:Array<any>=[]
  DocumentsArray:Array<any>=[]
  isSpining:boolean =false
  currentUser: User;
  today:  Date=new Date
  isSpinningVisible: boolean;
  selectedData: any[] = [];
  data: any;
  constructor(private dataserve: DataService,private notif: NzNotificationService,private authServ:AuthService) {
    this.locationFind = {
      findType: 1100,
      codeColumn: 'Location',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.regionFind={
      findType: 1101,
      codeColumn: 'REGION',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.tradeCodeFind = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: '',
      descColumn: 'NAME',
      descLabel: 'Name',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
   }
   disabledFutureDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };
  ngOnInit() {
    this.formHdlr.config.showFindBtn = false
    this.formHdlr.config.showPreviewBtn = true
    this.formHdlr.config.showSaveBtn = true
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showCancelBtn = true;
    // this.formHdlr.config.showExportExcelBtn = false;
    // this.formHdlr.config.showExportPdfBtn = false;
  }
  view()
  {
   const tradeCode = this.tradecode? this.tradecode.Tradecode.substring(this.tradecode.Location.trim().length):''
    this.DocumentsArray = []
    this.DocumentsArrayHeads = []
    this.isSpinningVisible = true;
    this.dataserve.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Region :this.region?this.region.REGION:'',              
          Loc :this.location?this.location.Location:'',          
          usercode :this.currentUser.userCode,
          Flag :'Display' ,
          FromDate :this.fromDate?this.fromDate:'', 
          ToDate :this.toDate?this.toDate:'',   
          Approved :this.approved,
          Received :this.received,
          param :'',
          TradeCode :this.tradecode?tradeCode:'' 
        }],
      "requestId": "10000208",
      "outTblCount": "0"
    })
      .then((response) => {
        this.isSpinningVisible = false;
        if (response.results.length > 0) {
          let data1 = response.results[0]

          if (data1.length > 0) {
            this.DocumentsArray = data1;
            this.DocumentsArrayHeads = Object.keys(this.DocumentsArray[0])
            var termsToRemove = ["Clientid", "Euser", "ClientSerialNo","region"];
            this.DocumentsArrayHeads = this.DocumentsArrayHeads.filter(function(term) {
              return !termsToRemove.includes(term);
              });
            this.isSpining = false
          }
          else {
            this.notif.error('No Data found', '');
            this.isSpining = false
            return

          }
          if (response.errorCode) {
            this.notif.error(response.errorCode, '');
            this.isSpining = false
            return
          }

        }

      })
  }
  export()
  {
    this.isSpinningVisible = true;
    let reqParams = {
      "batchStatus": "false",
      "detailArray":
      [{
        Region :this.region?this.region.Region:'',              
        Loc :this.location?this.location.Location:'',          
        usercode :this.currentUser.userCode,
        Flag :'Export' ,
        FromDate :this.fromDate?this.fromDate:'', 
        ToDate :this.toDate?this.toDate:'',   
        Approved :this.approved,
        Received :this.received,
        param :'',
        TradeCode :this.tradecode?this.tradecode.Tradecode:'' 
      }],
    "requestId": "10000208",
    "outTblCount": "0"
    }
    reqParams['fileType'] = "3";
    reqParams['fileOptions'] = { 'pageSize': 'A3' };
    let isPreview: boolean;
    isPreview = false;

    this.dataserve.generateReport(reqParams, isPreview).then((response) => {
      // debugger
      this.isSpinningVisible = false;
      console.log(response);
      
      // this.isSpinning = false;
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


  reset()
  {
    this.location=undefined
    this.region=undefined
    this.tradecode=undefined
    this.fromDate =new Date
    this.toDate =new Date
    this.approved=''
    this.received=''
    this.DocumentsArray = []
    this.DocumentsArrayHeads = []
  }

  // onCheckboxChange(data: any,checked: any, index: number) {
  //   console.log(data.approved,data,data.Approved);

  //     this.selectedData.push(data);
 
    
  //   console.log(this.selectedData,this.DocumentsArray,index)
  // }

  // onCheckboxChange(dataItem: any, ind:any){
  //   if (dataItem.received) {
  //     this.selectedData.push(dataItem);
  //   } else {
  //     this.selectedData.forEach((element,i) => {
  //       if(element.Location == dataItem.Location && element.Tradecode == dataItem.Tradecode){
  //       this.selectedData.splice(i,1)
  //       }
        
  //     });//((item, i) => i !== ind);
 
  //   }
  //   console.log("SelectedData",this.selectedData)
  //   this.DocumentsArray[ind].Received = false;
  // }

  onCheckboxChange(dataItem: any, ind: any) {
    console.log(this.selectedData.length)
    if(this.selectedData.length === 0){
      this.selectedData.push(dataItem);
    }
    else{
    const isSelected = this.selectedData.some(element => element.Location === dataItem.Location && element.Tradecode === dataItem.Tradecode);
     console.log(isSelected)
    if (!isSelected) {
        this.selectedData.push(dataItem);
    } else {
        this.selectedData = this.selectedData.filter(element => !(element.Location === dataItem.Location && element.Tradecode === dataItem.Tradecode));
    }
  }
    console.log("SelectedData", this.selectedData);
    this.DocumentsArray[ind].Received = false;
}


  save(){

    if(this.selectedData.length == 0){
      this.notif.error('Nothing selected to Save','')
      return;
    }else{
      this.selectedData.forEach(element => {
        element.ClientSerialNo = element.ClientSerialNo?element.ClientSerialNo:0
        element.Approved = element.Approved == true ? 'Y':(element.Approved == false ? 'N' : element.Approved)
        element.Received = 'Y'
      });
    }
    const jsonString =    JSON.stringify(this.selectedData)
    this.isSpinningVisible = true;
    this.dataserve.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Data:JSON.parse(jsonString),
          Euser:this.currentUser.userCode
        }],
      "requestId": "10000229",
      "outTblCount": "0"
    })
      .then((response) => {
        this.isSpinningVisible = false 
        if(response.results[0][0].Msg == 'Success'){
          this.notif.success("Saved Successfully",'')
        }
        else{
          this.notif.error("Save Failed",'')
        }
      })
  }


}
