import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FindOptions, AppConfig,DataService, User,AuthService, UtilService } from "shared";
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-mtfloc',
  templateUrl: './mtfloc.component.html',
  styleUrls: ['./mtfloc.component.less']
})

export class MtflocComponent implements OnInit {
  isSpinning:boolean=false;
  TradeFindopt: FindOptions;
  Tradecode:any={};
  DpId:any
  DpClientId:any={};
  DpIdFindopt:FindOptions;
  DpAcNOFindopt: FindOptions;
  DpArray: any=[];
  remark:string
  document: string;
  currentUser: User;
  Dpids: any;
  fileType: string;
  fileName: string;
  fileListPhoto:any=[];


  constructor( 
    private authServ: AuthService,
    private utilServ: UtilService,
    private notif: NzNotificationService,
     private dataServ: DataService,
    ) {

      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      });

    this.TradeFindopt = {
      findType: 5006,
      codeColumn: 'Tradecode',
      codeLabel: 'Tradecode',
      descColumn: 'NAME',
      descLabel: 'NAME',
      hasDescInput: true,
      requestId: 8,
      whereClause: '1=1'
    }
    this.DpIdFindopt = {
      findType: 5006,
      codeColumn: 'DPID',
      codeLabel: 'DPID',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: '1=1'
    }
    this.DpAcNOFindopt = {
      findType: 5006,
      codeColumn: 'DPACNO',
      codeLabel: 'DPACNO',
      descColumn: '',
      descLabel: '',
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1"
    }
     }

  ngOnInit() {
    this.getDpid()

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
getDPdetails(data){
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
getDatebyTradecode(data){
  this.isSpinning=true
  this.dataServ.getResultArray({
    "batchStatus": "false",
    "detailArray":
      [{
        Tradecode:data.Tradecode
      
      }],
    "requestId": "5056",
    "outTblCount": "0"
  }).then((response) => {
  if(response.results){    
    this.fileListPhoto=[]
    this.DpArray=response.results[0]
    console.log(this.DpArray)
this.DpArray.forEach(element => {
  element.Location=data.Location
  element.Tradecode=data.Tradecode
  element.checked=false
});
          }
  this.isSpinning=false

      })
}
clear(){
  this.DpArray=[]
   this.Tradecode={}
  this.DpClientId={};
  this.DpId = this.Dpids[0].DPID;

}
createdpTable(data){
this.fileListPhoto=[]
  this.DpArray=[]
  data.checked=false
  this.DpArray.push(data)
  console.log(this.DpArray)
}

private getBase64(img: File, callback: (img: string) => void): void {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result!.toString()));
  reader.readAsDataURL(img);
}


encodeImageFileAsURL(file) {
  let reader = new FileReader();
  reader.onloadend = () => {

    let dataUrl: string = reader.result.toString();
    this.document= dataUrl.split(',')[1];
    console.log(this.document)
  }
  reader.readAsDataURL(file);
}
beforeUploadPhoto = (file: UploadFile): boolean => {
  this.fileListPhoto = [file];
  this.fileType=file.type;
  this.fileName=file.name
  this.encodeImageFileAsURL(file);
  return false;
}

// beforeUpload = (file: File) => {
//   return new Observable((observer: Observer<boolean>) => {
//     const isJPG = file.type === 'image/jpeg';
//     const ispdf = file.type === 'image/pdf';
   
//     if (isJPG||ispdf) {
    
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       this.notif.error('Image must smaller than 2MB!','');
//       observer.complete();
//       return;
//     }
 
  
//       observer.next(isJPG && isLt2M);

//       observer.complete();
//   }else{
//       this.notif.error('You can only upload JPG or PDF file!','');
//       observer.complete();
   
//     }

//   });

// };
// handleChange(info: { file: UploadFile }): void {
//   switch (info.file.status) {
//     case 'uploading':
     
//       break;
//     case 'done':
     
//       this.getBase64(info.file!.originFileObj!, (img: string) => {
      
//         this.document = img;
//       });
//       break;
//     case 'error':
      
//       this.notif.error('Network error','');
    
//       break;
//   }
// }

save(){    
  var dpdetails:any=""
let Tradecode=this.DpArray[0].Tradecode
let ClientID=this.DpArray[0].CLIENTID
let Location=this.DpArray[0].Location
this.DpArray.forEach(item => {
        if(item.checked==true){
          dpdetails=dpdetails+(item.DPID)+'|'+item.DPACNO+','
        }
  });
  if(dpdetails==""){
    this.notif.error("Please select DP",'')
    return
  }
  if(this.document==undefined){
    this.notif.error("Please upload the document",'')
    return
  }

  this.dataServ.getResultArray({
    "batchStatus": "false",
    "detailArray":
      [{
        Tradecode:Tradecode||'',
				ClientID:ClientID||'',
				DpDetails:dpdetails,
				Remarks:this.remark?this.remark:'',
				Mode:'P',
				Euser:this.currentUser.userCode,
        Doc:this.document,
        DocName:this.fileName,
        DocType:this.fileType,
				Location:Location||''


      }],
    "requestId": "5050",
    "outTblCount": "0"
  }).then((response) => {
  console.log(response)
  if(response.errorCode==0){
    this.notif.success("SuccessFully Saved",'')
  }
  if(response.errorCode==1){
    this.notif.error(response.errorMsg,'')
  }
})

}

  
}
