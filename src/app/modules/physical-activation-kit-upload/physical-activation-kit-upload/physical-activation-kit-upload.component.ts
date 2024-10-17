import { Component, OnInit, ViewChild } from '@angular/core';
import { FormHandlerComponent, DataService, FindOptions,User,UtilService, WorkspaceService} from 'shared';
import { InputMasks, InputPatterns } from 'shared';
import { AuthService } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UploadFile } from 'ng-zorro-antd/upload';
import { PhysicalActivationkitService } from '../physical-activationkit.service'; 
import { Console } from 'console';

@Component({
  selector: 'app-physical-activation-kit-upload',
  templateUrl: './physical-activation-kit-upload.component.html',
  styleUrls: ['./physical-activation-kit-upload.component.css']
})
export class PhysicalActivationKitUploadComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  filePreiewContent: any;
  filePreiewVisible: boolean;
  filePreiewContentType: any;
  filePreiewFilename: any;
  fileList: any = [];
  Dpids: any[];
  DpId: any = {};
  dpid: any;
  TradecodeFindopt: FindOptions;
  DpIdFindopt: FindOptions;
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  dpClientIdFindopt: FindOptions;
  PanFindOption: FindOptions;
  serialnoFindOption: FindOptions;
  currentUser: User;
  selectedValue:any='Trade';
  selectedFile: File | null = null;
  Imglist: any;
  ImgTypeData: any;
  SupportFiles = [];
  index: number = -1;
  selectedLocation: any;
  selectedTradeCode: any;
  selectedDPClientID: any;
  kitNo: string='';
  isSpining:boolean=false
  uploadedDocumentsList: any;
  constructor(private dataServ: DataService, 
    private utilServ: UtilService,
    private authServ: AuthService, 
    private notif: NzNotificationService,
    private modalService: NzModalService,
    private wsServ: WorkspaceService,
    private paKitServ:PhysicalActivationkitService) {

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    // this.documentOptions = {
    //   findType: 6057,
    //   codeColumn: 'Document_ID',
    //   codeLabel: '',
    //   descColumn: '',
    //   descLabel: '',
    //   hasDescInput: false,
    //   requestId: 8,
    //   whereClause: '1=1'
    // }
    this.dpClientIdFindopt = {
      findType: 5006,
      codeColumn: 'CLIENTID',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }

    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.TradecodeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: '',
      descColumn: 'NAME',
      descLabel: 'Name',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
  }
  inputMasks = InputMasks;
  inputPatterns = InputPatterns;
  DocumentFindopt: FindOptions;
  documentOptions:any=[];
  selectedDocument:any='';
  model:any;
  
  ngOnInit() {

    this.getDpid();
    this.fillDropdown();
  }

  onChangeDocument(string:any){
   console.log(string,"Is getting searched")
  }

  hideapprovebtn(){
    console.log("Is getting searched",this.selectedDocument)
  }

  characterstrict(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

   
  validateInput() {
    // Use a regular expression to allow only alphanumeric characters
    this.kitNo = this.kitNo.replace(/[^a-zA-Z0-9]/g, '');
  }

  showModal(file) {
    if (file["originFileObj"]) {
      let file1 = file["originFileObj"]
      this.filePreiewContent = file1.doc
      this.filePreiewFilename = file1.name
      this.filePreiewContentType = file1.type
      this.filePreiewVisible = true;
    }
    else {
      this.filePreiewContent = file.doc
      this.filePreiewFilename = file.name
      this.filePreiewContentType = file.type
      this.filePreiewVisible = true
    }
  }

  getDpid() {
    this.isSpining =true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 14
        }],
      "requestId": "3"
    }).then((response) => {
      this.isSpining =false;
      let res;
      if (response) {
        if (response[0].rows.length > 0) {
          var ar = [{ DPID: '' }];
          this.Dpids = ar.concat(this.utilServ.convertToObject(response[0]));
          this.DpId = this.Dpids[0].DPID;
        }
      }
    });
  }



beforeUpload = (file: UploadFile): boolean => {
  console.log("file,file",file.size)
  //if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
    if ((file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/JPG') && file.size < 2097152  ) {  
  this.encodeImageFileAsURL(file);
    return false;
  } else {
    //this.notif.error('Please upload jpeg/png/pdf', '');
    this.notif.error('Please upload a JPG file that is less than 2mb size','')
    return false;
  }
}

encodeImageFileAsURL(file) {
  let reader = new FileReader();

  reader.onloadend = () => {
    let dataUrl: string = reader.result.toString();
    let document = dataUrl.split(',')[1];
    const fileType = file.type.split('/')
    this.Imglist = {
      Docname: this.ImgTypeData,
      Docfile: file.name,
      Doctype: fileType[1],
      Docuid: file.uid,
      Docsize: file.size,
      Docdoc: document,
    };
      for (let i = 0; i < this.SupportFiles.length; i++) {
      if (this.SupportFiles[i].Docname == this.ImgTypeData) {
        this.index = i;
      }
    }
  };

  reader.readAsDataURL(file);
}

  fillDropdown(){
    this.isSpining =true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          flag:'Addendum',
         
        }],
      "requestId": "33901",
      "outTblCount": "0"
    })
      .then((response) => {
        this.isSpining=false
        console.log(response);

        this.documentOptions = response ? response[0].rows:[]
      })

  }
  
  uploadDocument(){
    var tradeCode
if(this.selectedTradeCode && this.selectedLocation && this.selectedValue == 'Trade')
  {  if (this.selectedTradeCode.Tradecode.startsWith(this.selectedLocation.Location.trim())) {
      tradeCode = this.selectedTradeCode.Tradecode.substring(this.selectedLocation.Location.trim().length)    
    }else{
      this.notif.error("Please Choose the Correct location",'')
      return
    }
  }
  else if(!this.selectedLocation && this.selectedValue == 'Trade'){
    this.notif.error("Please select  Location",'')
    return
  }
  else if(!this.selectedTradeCode && this.selectedValue == 'Trade' ){
  this.notif.error("Please select  Trade code",'')
  return
  }


if(!this.selectedDPClientID && this.selectedValue == 'DP'){
  this.notif.error("Please select DP account no",'')
  return
}

if(this.dpid == '' && this.selectedValue == 'DP'){
  this.notif.error("Please select DP account no",'')
  return
}

 if(this.selectedDocument == '' || this.selectedDocument == null){
  this.notif.error("Please select Document Type",'')
  return
}
if(this.kitNo == ''){
  this.notif.error("Please Add Kit No",'')
  return
}



if(!this.Imglist){
  this.notif.error("Please select a Document to Upload",'')
  return
}
this.isSpining =true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          flag:'Upload',
          imgData:this.Imglist? this.Imglist.Docdoc:'',
          Euser:this.currentUser.userCode,
          ImageTitle:this.selectedDocument?this.selectedDocument[2]:'',
          ImageId:this.selectedDocument?this.selectedDocument[0]:'',//this.Imglist? this.Imglist.Docuid:'',
          imgType:this.Imglist? this.Imglist.Doctype:'',
          Loc:this.selectedLocation?this.selectedLocation.Location:'',
          Tradecode:this.selectedTradeCode? tradeCode:'' ,
          kitNo:this.kitNo?this.kitNo:'',
          DpId:this.dpid?this.dpid:'',
          DpAcno:this.selectedDPClientID?this.selectedDPClientID.DPACNO.trim():'',
        }],
      "requestId": "33901",
      "outTblCount": "0"
    })
      .then((response) => {
        this.isSpining =false;
         if (response && response.errorCode != 1  && (response[0].rows[0][0] == 'File Uploaded Successfully' || response[0].rows[0][0] == 'File Updated Successfully' )){
          this.notif.success(response[0].rows[0][0],"")
          this.onSelectedValueChanged();
          
        }
        else if(response.errorCode == 1) {
          this.notif.error(response.errorMsg, '');
          this.isSpining = false
        }  else{
          this.notif.error("Upload Failed", '');
          this.isSpining = false
        }
      })
  }

  viewapproveorreject() {
    let workspaceData = this.wsServ.workspaces;
    var tradeCode
    if(this.selectedTradeCode && this.selectedLocation)
  {  if (this.selectedTradeCode.Tradecode.startsWith(this.selectedLocation.Location.trim())) {
      tradeCode = this.selectedTradeCode.Tradecode.substring(this.selectedLocation.Location.trim().length)   
    }else{
      this.notif.error("Please Choose the Correct location",'')
      return
    }
  }
  else if(!this.selectedLocation && this.selectedValue == 'Trade' ){
    this.notif.error("Please select a Location",'')
    return
  }
  else if(!this.selectedTradeCode && this.selectedValue == 'Trade' ){
    this.notif.error("Please select a Trade code",'')
    return
  }
 
  
  if(!this.selectedDPClientID && this.selectedValue == 'DP'){
    this.notif.error("Please select DP account no",'')
    return
  }
  
  if(this.dpid == '' && this.selectedValue == 'DP'){
    this.notif.error("Please select DP account no",'')
    return
  }
    let approveTab: boolean = false
    var approveIndex
    for (let i = 0; i < this.wsServ.workspaces.length; i++) {
      if ((workspaceData[i]['type']) == "physicalActivationKitImageView") {
        approveTab = true
        approveIndex = i;
      }
    }
    
    if (approveTab) {
      this.wsServ.removeWorkspace(approveIndex);
      setTimeout(() => {
        this.wsServ.createWorkspace("physicalActivationKitImageView");
      }, 200);
    }
    else {
      setTimeout(() => {
        this.wsServ.createWorkspace("physicalActivationKitImageView");
      }, 200);
    }
    this.paKitServ.tradeCode.next(tradeCode)
    this.paKitServ.loc.next(this.selectedLocation.Location)
    this.paKitServ.id.next(this.selectedDPClientID.DPACNO)
    this.paKitServ.dpid.next(this.dpid)
    

  }

  onSelectedValueChanged(){
    this.selectedValue = 'Trade'
    this.selectedLocation='';
    this.selectedTradeCode='';
    this.selectedDPClientID='';
    this.dpid='';
    this.selectedDocument=null;
    this.kitNo='';
    this.Imglist='';
  }

  onChangeLocation(event:any){
    const sqlQuery = `1=1 and Location Like '%${this.selectedLocation.Location.trim()}%'`;

    this.TradecodeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: '',
      descColumn: 'NAME',
      descLabel: 'Name',
      hasDescInput: false,
      requestId: 8,
      whereClause: sqlQuery
    }
  }

  onChangetradeCode($event){
    const sqlQuery = `1=1 and Location Like '%${this.selectedTradeCode.Location.trim()}%'`;
    this.locationFindopt = {
      findType: 1003,
      codeColumn: 'Location',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: sqlQuery
    }
     this.resetFileandKitNo()
  }
 
  resetFileandKitNo(){
    this.kitNo='';
    this.Imglist ='';
    this.selectedDocument=null;
  }

  onChangedpClientId($event){

    this.dpid = this.selectedDPClientID.DPID.trim()

  }

  onChangedpId($event){

    const sqlQuery = `1=1 and DPID = '${this.dpid.trim()}'`;
    this.dpClientIdFindopt = {
      findType: 5006,
      codeColumn: 'CLIENTID',
      codeLabel: '',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: sqlQuery
    }
    this.resetFileandKitNo()
  }

  onKeyPress(event: KeyboardEvent) {
      const pressedKey = event.key;
  
      // Check if the pressed key is alphanumeric or backspace
      const isAlphanumericOrBackspace = /^[a-zA-Z0-9]$/.test(pressedKey) || pressedKey === 'Backspace';
  
      // If not alphanumeric or backspace, prevent the event
      if (!isAlphanumericOrBackspace) {
        event.preventDefault();
      }
    }
  
}
