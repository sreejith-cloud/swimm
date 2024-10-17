import { Component, OnInit } from '@angular/core';
import { FindOptions, AppConfig,DataService, User,AuthService, UtilService, FormHandlerComponent, WorkspaceService } from "shared";
import { NzNotificationService } from 'ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  trigger,
  state,
  animate,
  transition,
  style
} from "@angular/animations";// by ishaq expansion and shrinking


@Component({
  selector: 'app-accountopening',
  templateUrl: './accountopening.component.html',
  styleUrls: ['./accountopening.component.less']
})
export class AccountopeningComponent implements OnInit {
  showcomp:boolean=false;
  showcomp1:boolean=false;
  showcomp2:boolean=false;
  showcomp3:boolean=false;
  showcomp4:boolean=false;
  showcomp5:boolean=false;
  showcomp6:boolean=false;
  showcomp7:boolean=false;
  showcomp8:boolean=false;
  showLeftSide = false;
  StampCount:Number
  AuditorCount:Number
  BookletAtHOCount:number
  ProgressCount:number
  currentUser: User;
  EDIT_ACCESS: boolean=false;
  ENTRY_ACCESS: boolean=false;

  constructor(
    private dataServ: DataService,
    private notif: NzNotificationService,
     private authServ: AuthService,
     private wsServ: WorkspaceService,
     private modalService: NzModalService
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
 
    this.getDashboardData();
    
   }

  ngOnInit() {
    
  }
showComp(name){
  if(name=='book'){
    this.userAccess(name);
    this.showcomp1=false
    this.showcomp2=false
    this.showcomp3=false
    this.showcomp4=false
    this.showcomp5=false
    this.showcomp6=false
    this.showcomp=true
    this.showcomp8=false
    this.showcomp7=false
    
    
    
  }else if(name=='auditallocation'){
    this.userAccess(name);
    this.showcomp=false
    this.showcomp2=false
    this.showcomp3=false
    this.showcomp4=false
    this.showcomp5=false
    this.showcomp6=false
    this.showcomp1=true
    this.showcomp8=false
    this.showcomp7=false
    
  }else if(name=='auditoracceptance'){
    this.userAccess(name);
    this.showcomp=false
    this.showcomp1=false
    this.showcomp3=false
    this.showcomp4=false
    this.showcomp5=false
    this.showcomp6=false
    this.showcomp2=true
    this.showcomp8=false
    this.showcomp7=false
    
  }else if(name=='gfslacceptance'){
    this.userAccess(name);
    this.showcomp=false
    this.showcomp1=false
    this.showcomp2=false
    this.showcomp4=false
    this.showcomp5=false
    this.showcomp6=false
    this.showcomp3=true
    this.showcomp8=false
    this.showcomp7=false
    

  }
  else if(name=='auditorreview'){
    this.userAccess(name);
    this.showcomp=false
    this.showcomp1=false
    this.showcomp2=false
    this.showcomp3=false
    this.showcomp5=false
    this.showcomp6=false
    this.showcomp4=true
    this.showcomp8=false
    this.showcomp7=false
    
  }
  else if(name=='horeview'){
    this.userAccess(name);
    this.showcomp=false
    this.showcomp1=false
    this.showcomp2=false
    this.showcomp3=false
    this.showcomp4=false
    this.showcomp6=false
    this.showcomp5=true
    this.showcomp8=false
    this.showcomp7=false
    
  }
  else if(name=='Reports'){
    this.userAccess(name);
    this.showcomp=false
    this.showcomp1=false
    this.showcomp2=false
    this.showcomp3=false
    this.showcomp4=false
    this.showcomp5=false
    this.showcomp6=true
    this.showcomp8=false
    this.showcomp7=false
    
  }
  else if(name=='store'){
    this.userAccess(name);
    this.showcomp=false
    this.showcomp1=false
    this.showcomp2=false
    this.showcomp3=false
    this.showcomp4=false
    this.showcomp5=false
    this.showcomp6=false
    this.showcomp8=false
    this.showcomp7=true
   
  }
  else if(name=='box'){
    this.userAccess(name);
    this.showcomp=false
    this.showcomp1=false
    this.showcomp2=false
    this.showcomp3=false
    this.showcomp4=false
    this.showcomp5=false
    this.showcomp6=false
    this.showcomp8=true
    this.showcomp7=false
    
  }
  this.dataServ.ModuleID= name=='book'?'9865':name=='auditallocation'?'9866':name=='auditoracceptance'?'9867':name=='auditorreview'?'9868':name=='gfslacceptance'?'9869':name=='horeview'?'9870':name=='box'?'9871':name=='store'?'9872':name=='Reports'?'9873':'0';
  this.dataServ.viewLog()
  
}

// toggleCenter() {
//   
//   if (!this.showLeftSide) {
//     this.showLeftSide = true;
//   }
//   else {
//     this.showLeftSide = false;
//   }
// }

getDashboardData(){
  this.dataServ.getResultArray({
    "batchStatus": "false",
    "detailArray":
      [{
        RecordType:'POSTACCOPEN',
        Euser:'02230'
      }],
    "requestId": "6084",
    "outTblCount": "0"
  }).then((response) => {
    if(response.errorCode==0){
      this.StampCount=response.results[0][0].StampCount
      this.AuditorCount=response.results[0][0].AuditorCount
      this.BookletAtHOCount=response.results[0][0].BookletAtHOCount
      this.ProgressCount=response.results[0][0].ProgressCount
    }
    if(response.errorCode==1){
      this.notif.error(response.errorMsg,'')
    }
  })

}

userAccess(name){
  this.dataServ.getResultArray({
    "batchStatus": "false",
    "detailArray":
      [{
        "UserID": this.currentUser.userCode, 
        "ModuleID":name=='book'?9865:0||name=='auditallocation'?9866:0
        ||name=='auditoracceptance'?9867:0||name=='auditorreview'?9868:0||name=='gfslacceptance'?9869:0||name=='horeview'?9870:0
        ||name=='box'?9871:0 ||name=='store'?9872:0||name=='Reports'?9873:0,
        "Ip_address" :'',
        "Mac_address" :'',
        "MachineName" :''
      }],
    "requestId": "6085",
    "outTblCount": "0",
    "dbConn": 'db',
  }).then((response) => {
   if(response.results[0][0].EDIT_ACCESS&&response.results[0][0].ENTRY_ACCESS) {
     this.ENTRY_ACCESS=false
   }else{
    this.ENTRY_ACCESS=true
    this.warning();
  if(this.showcomp==true){
    this.showcomp=false
  }
  else if (this.showcomp1==true){
    this.showcomp1=false
  }
  else if (this.showcomp2==true){
    this.showcomp2=false
  }
  else if (this.showcomp3==true){
    this.showcomp3=false
  }
  else if (this.showcomp4==true){
    this.showcomp4=false
  }
  else if (this.showcomp5==true){
    this.showcomp5=false
  }
  else if (this.showcomp8==true){
    this.showcomp8=false
  }
  else if (this.showcomp7==true){
    this.showcomp7=false
  }
  return;
  // this.showcomp1==true?false:''
  // this.showcomp2==true?false:''
  // this.showcomp3==true?false:''
  // this.showcomp4==true?false:''
  // this.showcomp5==true?false:''
  // this.showcomp6==true?false:''
  // this.showcomp7==true?false:''
   }
  })
}
   
    // this.ws = this.dataServ.formhandlerRight;
    // if (!this.dataServ.formhandlerRight) {
    //   this.ws = this.dataServ.savedWorkSpace

    // }
    // this.responseData = response.results[0]
    // let moduledata=response.results[0]
    // this.responseData.forEach(element => {
    //   if (element.WorkSpace == this.ws) {
    //     this.permissions.canAccess = element.PreviewRight
    //     this.permissions.canAdd = element.AddRight
    //     this.permissions.canDelete = element.DeleteRight
    //     this.permissions.canModify = element.ModifyRight
    //     this.permissions.canPrint = element.PrintRight
    //   }
    // });


  // return this.permissions;

warning(): void {
  this.modalService.warning({
    nzTitle: 'Warning',
    nzContent: "You don't have permission to access this module"
  });
  // this.showcomp==true?false:''
  // this.showcomp1==true?false:''
  // this.showcomp2==true?false:''
  // this.showcomp3==true?false:''
  // this.showcomp4==true?false:''
  // this.showcomp5==true?false:''
  // this.showcomp6==true?false:''
  // this.showcomp7==true?false:''
}


}
