import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { InputMasks, InputPatterns, DataService } from 'shared';

import { ClientMasterService } from '../../client-master.service';
import { UploadFile, NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'trading-introducer-details',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class IntroducerDetailsComponent implements OnInit {
  fileType: string;
  fileList: any=[];
  fileName: string;
  document: string;
  remiserDocument:any;
  filePreiewContent: any;
  filePreiewFilename: any;
  filePreiewContentType: any;
  filePreiewVisible: boolean;

  form: FormGroup;
  inputMasks = InputMasks;
  isRemiser:boolean=false;
  isLoadingPanDetails: boolean = false;
  holderdetails: any;
  clientSerialNumber: number;
  introducerData: any=[];
  membershipData: any=[];
  BSECashleadGenerator: boolean=false;
  NSECashleadGenerator: boolean=false;
  NSEMFSSleadGenerator: boolean=false;
  NSECDSleadGenerator: boolean=false;
  COMICEXleadGenerator: boolean=false;
  COMMCXleadGenerator: boolean=false;
  COMNCDEXleadGenerator: boolean=false;
  NSEFOleadGenerator: boolean=false;
 leadGenerator: boolean=false;
  entryAccess: boolean=true;
  timeout=null;
  // isKRAVerified: boolean = false;
  // idProof: number = 1;

  constructor(
   private ngZone:NgZone,
    private fb: FormBuilder,
    private notif: NzNotificationService,
    private cmServ: ClientMasterService,  private dataServ: DataService,
  ) {
      this.form=fb.group({
      statusOfIntroducer:[null],
      IntroducerPhoneNumber:[null],
      nameOfIntroducer:[null],
      IntroducerClientCode:[null],
      IntroducerhouseName:[null],
      IntroducerhouseNumber:[null],
      Introducerstreet:[null],
      IntroducerRemiserCode:[null],
      IntroducerRemiserID:[null],
      IntroducerApCode:[null],
       leadGeneratorEmpCode:[null],
      leadGeneratorEmpName:[null],


      // NSECashleadGeneratorEmpCode:[null],
      // NSECashleadGeneratorEmpName:[null],
      // NSEFOleadGeneratorEmpCode:[null],
      // NSEFOleadGeneratorEmpName:[null],
      // NSECDSleadGeneratorEmpCode:[null],
      // NSECDSleadGeneratorEmpName:[null],
      // NSEMFSSleadGeneratorEmpCode:[null],
      // NSEMFSSleadGeneratorEmpName:[null],
      // BSECashleadGeneratorEmpCode:[null],
      // BSECashleadGeneratorEmpName:[null],
      // BSEFOleadGeneratorEmpCode:[null],
      // BSEFOleadGeneratorEmpName:[null],
      // BSECDSleadGeneratorEmpCode:[null],
      // BSECDSleadGeneratorEmpName:[null],
      // MCXFOleadGeneratorEmpCode:[null],
      // MCXFOleadGeneratorEmpName:[null],
      // COMMCXleadGeneratorEmpCode:[null],
      // COMMCXleadGeneratorEmpName:[null],
      // COMNCDEXleadGeneratorEmpCode:[null],
      // COMNCDEXleadGeneratorEmpName:[null],
      // COMICEXleadGeneratorEmpCode:[null],
      // COMICEXleadGeneratorEmpName:[null],
    })
  }
  beforeUpload = (file: UploadFile): boolean => {
    if(file.type=='application/pdf' || file.type=='image/jpeg' || file.type=='image/png'){
      this.fileList = [file];
      this.fileType=file.type;
      this.fileName=file.name
      this.encodeImageFileAsURL(file);
      return false;
    }else{
      this.notif.error("Please uplaod jpeg/png/pdf",'')
      return false
    }
  }


    encodeImageFileAsURL(file) {
      let reader = new FileReader();
        reader.onloadend = () => {
        let dataUrl: string = reader.result.toString();
        this.document= dataUrl.split(',')[1];
        this.remiserDocument={
          Docname:'Remiser Letter',
          Doctype:this.fileType,
          Docuid:file.uid,
          doc:this.document,
          Docsize:file.size
        }
      }
      reader.readAsDataURL(file);
    }

    showModal() {
      this.filePreiewContent = this.remiserDocument.doc
      this.filePreiewFilename = this.remiserDocument.Docname
      this.filePreiewContentType = this.remiserDocument.Doctype
      this.filePreiewVisible = true;
  }

  ngOnInit() {
      this.cmServ.hoderDetails.subscribe((val) =>{
        this.holderdetails =val
    }) 
    this.cmServ.isEntryAccess.subscribe(val=>{
      this.entryAccess=val
    })
    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val
    })
    this.cmServ.introducerDetails.subscribe(val=>{    
      this.introducerData=val;
    })
    // this.cmServ.membership.subscribe(element=>{
     
    //     if(element.SegmentType=='CASH' && element.Product=="BSE"){
    //       if(element.checked==true)
    //       this.BSECashleadGenerator=true;
    //         else{
    //           this.BSECashleadGenerator=false;
    //         }
    //     }
    //     if(element.SegmentType=='CASH' && element.Product=="NSE"){
    //       if(element.checked==true)
    //       this.NSECashleadGenerator=true;
    
    //     else{
    //       this.NSECashleadGenerator=false;
    //     }
    //   }

    //     if(element.SegmentType=="MF" && element.Product=="NSEMFSS" ){
    //       if(element.checked==true)
    //       this.NSEMFSSleadGenerator=true;
        
    //     else{
    //       this.NSEMFSSleadGenerator=false;
    //     }
    //   }
    //     if(element.SegmentType=='CDS' && element.Product=="NSECDS"){
    //       if(element.checked==true)
    //       this.NSECDSleadGenerator=true;
        
    //     else{
    //       this.NSECDSleadGenerator=false;
    //     }
    //   }

    //     if(element.SegmentType=="COM" && element.Product=="COMICEX" ){
    //       if(element.checked==true)
    //       this.COMICEXleadGenerator=true;
        
    //     else{
    //       this.COMICEXleadGenerator=false;
    //     }
    //   }
    //     if(element.SegmentType=="COM" && element.Product=="COMMCX" ){
    //       if(element.checked==true)
    //       this.COMMCXleadGenerator=true;
        
    //     else{
    //       this.COMMCXleadGenerator=false;
    //     }
    //   }
    //     if(element.SegmentType=="COM" && element.Product=="COMNCDEX" ){
    //       if(element.checked==true)
    //       this.COMNCDEXleadGenerator=true;
        
    //     else{
    //       this.COMNCDEXleadGenerator=false;
    //     }
    //   }
    //     if(element.SegmentType=="FO" && element.Product=="NSEFO" ){
    //       if(element.checked==true)
    //       this.NSEFOleadGenerator=true;
        
    //     else{
    //       this.NSEFOleadGenerator=false;
    //     }
    //   }
  
    // })
    this.cmServ.membership.subscribe(element=>{
      this.leadGenerator=false;
      this.membershipData=element
      this.membershipData.forEach(element => {
        if(element.checked==true){
          this.leadGenerator=true;
        }
      });
    })

//  {Field: "Membership", SegmentType: "CASH", Product: "BSE ", EnrolDate: "2015-02-25 00:00:00.0", checked: true}
// 1: {Field: "Membership", SegmentType: "CASH", Product: "NSE    ", EnrolDate: "2015-02-25 00:00:00.0", checked: false}
// 2: {Field: "Membership", SegmentType: "CDS", Product: "NSECDS    ", EnrolDate: null, checked: false}
// 3: {Field: "Membership", SegmentType: "COM", Product: "COMICEX   ", EnrolDate: null, checked: false}
// 4: {Field: "Membership", SegmentType: "COM", Product: "COMMCX    ", EnrolDate: null, checked: false}
// 5: {Field: "Membership", SegmentType: "COM", Product: "COMNCDEX  ", EnrolDate: null, checked: true}
// 6: {Field: "Membership", SegmentType: "FO", Product: "NSEFO     ", EnrolDate: null, checked: true}
// 7: {Field: "Membership", SegmentType: "MF", Product: "NSEMFSS   ", EnrolDate: "2015-02-25 00:00:00.0", checked: true}

  
    this.form.controls.statusOfIntroducer.valueChanges.subscribe(val=>{
      this.form.controls.IntroducerClientCode.patchValue(null)
      this.form.controls.IntroducerApCode.patchValue(null)
      if(val!=null){
      if(val.toUpperCase()=="REMISER"){
        this.isRemiser=true
        this.form.controls.IntroducerRemiserCode.setValidators([Validators.required])
        this.form.controls.IntroducerRemiserID.setValidators([Validators.required])
        this.form.controls["IntroducerRemiserCode"].updateValueAndValidity();
        this.form.controls["IntroducerRemiserID"].updateValueAndValidity();
      }else{
        this.isRemiser=false;
        this.form.controls.IntroducerRemiserCode.setValidators(null)
        this.form.controls.IntroducerRemiserID.setValidators(null)
        this.form.controls["IntroducerRemiserCode"].updateValueAndValidity();
        this.form.controls["IntroducerRemiserID"].updateValueAndValidity();
        this.fileList=[]
        this.remiserDocument=null
      } 
    }
    })
    this.form.controls.IntroducerClientCode.valueChanges.subscribe(val=>{
      if(val==null || val==""){
        this.form.controls.IntroducerPhoneNumber.patchValue(null)
        this.form.controls.nameOfIntroducer.patchValue(null)
        this.form.controls.IntroducerhouseName.patchValue(null)
        this.form.controls.Introducerstreet.patchValue(null)
        return
      }
      if(this.entryAccess==false){
        
        return
      }
      
      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
          [{
            Tradecode:val
          }],
        "requestId": "5021",
        "outTblCount": "0"
      }).then((response) => {
      if(response.results[0]){
        console.log(response.results)
        let data=response.results[0][0]
        if(data!=null){
        this.form.controls.IntroducerPhoneNumber.patchValue(data.RESPHONE1)
        this.form.controls.nameOfIntroducer.patchValue(data.Name)
        this.form.controls.IntroducerhouseName.patchValue(data.RESADD1)
        this.form.controls.Introducerstreet.patchValue(data.RESADD2)
        }
      }
      else{
        this.form.controls.IntroducerPhoneNumber.patchValue(null)
        this.form.controls.nameOfIntroducer.patchValue(null)
        this.form.controls.IntroducerhouseName.patchValue(null)
        this.form.controls.Introducerstreet.patchValue(null)
      }
      })
    })
  }

  fillLgCode(val){
 let  data=val.target.value;
 if(data==''||data==null){
   return
 }
    if(this.BSECashleadGenerator){
      if(this.form.value.BSECashleadGeneratorEmpCode==null){
        this.form.controls.BSECashleadGeneratorEmpCode.patchValue(data)
      }
    }
    if(this.NSECashleadGenerator){
   if(this.form.value.NSECashleadGeneratorEmpCode==null){
        this.form.controls.NSECashleadGeneratorEmpCode.patchValue(data)
      }
    }
    if(this.NSEMFSSleadGenerator){
   if(this.form.value.NSEMFSSleadGeneratorEmpCode==null){
        this.form.controls.NSEMFSSleadGeneratorEmpCode.patchValue(data)
      }
    }
    if(this.NSECDSleadGenerator){
   if(this.form.value.NSECDSleadGeneratorEmpCode==null){
        this.form.controls.NSECDSleadGeneratorEmpCode.patchValue(data)
      }
    }
    if(this.COMICEXleadGenerator){
   if(this.form.value.COMICEXleadGeneratorEmpCode==null){
        this.form.controls.COMICEXleadGeneratorEmpCode.patchValue(data)
      }
    }
    if(this.COMMCXleadGenerator){
   if(this.form.value.COMMCXleadGeneratorEmpCode==null){
        this.form.controls.COMMCXleadGeneratorEmpCode.patchValue(data)
      }
    }
    if(this.COMNCDEXleadGenerator){
   if(this.form.value.COMNCDEXleadGeneratorEmpCode==null){
        this.form.controls.COMNCDEXleadGeneratorEmpCode.patchValue(data)
      }
    }
    if(this.NSEFOleadGenerator){
   if(this.form.value.NSEFOleadGeneratorEmpCode==null){
        this.form.controls.NSEFOleadGeneratorEmpCode.patchValue(data)
      }
    }
 
  }

  // getEmpDetails(data,flag){
  //   if(data==''||data==null){
  //     if(flag=='NSECashleadGeneratorEmpName')
  //     this.form.controls.NSECashleadGeneratorEmpName.patchValue(null)
  //     if(flag=='NSEFOleadGeneratorEmpName')
  //     this.form.controls.NSEFOleadGeneratorEmpName.patchValue(null)
  //     if(flag=='NSECDSleadGeneratorEmpName')
  //     this.form.controls.NSECDSleadGeneratorEmpName.patchValue(null)
  //     if(flag=='NSEMFSSleadGeneratorEmpName')
  //     this.form.controls.NSEMFSSleadGeneratorEmpName.patchValue(null)
  //    if(flag=='BSECashleadGeneratorEmpName')
  //    this.form.controls.BSECashleadGeneratorEmpName.patchValue(null)
  //     if(flag=='BSEFOleadGeneratorEmpName')
  //     this.form.controls.BSEFOleadGeneratorEmpName.patchValue(null)
  //      if(flag=='BSECDSleadGeneratorEmpName')
  //      this.form.controls.BSECDSleadGeneratorEmpName.patchValue(null)
  //     if(flag=='MCXFOleadGeneratorEmpName')
  //     this.form.controls.MCXFOleadGeneratorEmpName.patchValue(null)
  //      if(flag=='COMMCXleadGeneratorEmpName')
  //      this.form.controls.COMMCXleadGeneratorEmpName.patchValue(null)
  //       if(flag=='COMNCDEXleadGeneratorEmpName')
  //       this.form.controls.COMNCDEXleadGeneratorEmpName.patchValue(null)
  //     if(flag=='COMICEXleadGeneratorEmpName')
  //     this.form.controls.COMICEXleadGeneratorEmpName.patchValue(null)
  //     return
  //   }
  //   this.dataServ.getResultArray({
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{
  //         EmpCode: data,
  //       }],
  //     "requestId": "7011"
  //   })
  //     .then((response) => {    
  //       if (response.results[0].length>0) {
  //         let details=response.results[0][0]
  //         if(flag=='NSECashleadGeneratorEmpName')
  //         this.form.controls.NSECashleadGeneratorEmpName.patchValue(details.EmpName)
  //         if(flag=='NSEFOleadGeneratorEmpName')
  //         this.form.controls.NSEFOleadGeneratorEmpName.patchValue(details.EmpName)
  //         if(flag=='NSECDSleadGeneratorEmpName')
  //         this.form.controls.NSECDSleadGeneratorEmpName.patchValue(details.EmpName)
  //         if(flag=='NSEMFSSleadGeneratorEmpName')
  //         this.form.controls.NSEMFSSleadGeneratorEmpName.patchValue(details.EmpName)
  //        if(flag=='BSECashleadGeneratorEmpName')
  //        this.form.controls.BSECashleadGeneratorEmpName.patchValue(details.EmpName)
  //         if(flag=='BSEFOleadGeneratorEmpName')
  //         this.form.controls.BSEFOleadGeneratorEmpName.patchValue(details.EmpName)
  //          if(flag=='BSECDSleadGeneratorEmpName')
  //          this.form.controls.BSECDSleadGeneratorEmpName.patchValue(details.EmpName)
  //         if(flag=='MCXFOleadGeneratorEmpName')
  //         this.form.controls.MCXFOleadGeneratorEmpName.patchValue(details.EmpName)
  //          if(flag=='COMMCXleadGeneratorEmpName')
  //          this.form.controls.COMMCXleadGeneratorEmpName.patchValue(details.EmpName)
  //           if(flag=='COMNCDEXleadGeneratorEmpName')
  //           this.form.controls.COMNCDEXleadGeneratorEmpName.patchValue(details.EmpName)
  //         if(flag=='COMICEXleadGeneratorEmpName')
  //         this.form.controls.COMICEXleadGeneratorEmpName.patchValue(details.EmpName)
         
  //       }
  //       else{
  //         if(flag=='NSECashleadGeneratorEmpName')
  //         this.form.controls.NSECashleadGeneratorEmpName.patchValue(null)
  //         if(flag=='NSEFOleadGeneratorEmpName')
  //         this.form.controls.NSEFOleadGeneratorEmpName.patchValue(null)
  //         if(flag=='NSECDSleadGeneratorEmpName')
  //         this.form.controls.NSECDSleadGeneratorEmpName.patchValue(null)
  //         if(flag=='NSEMFSSleadGeneratorEmpName')
  //         this.form.controls.NSEMFSSleadGeneratorEmpName.patchValue(null)
  //        if(flag=='BSECashleadGeneratorEmpName')
  //        this.form.controls.BSECashleadGeneratorEmpName.patchValue(null)
  //         if(flag=='BSEFOleadGeneratorEmpName')
  //         this.form.controls.BSEFOleadGeneratorEmpName.patchValue(null)
  //          if(flag=='BSECDSleadGeneratorEmpName')
  //          this.form.controls.BSECDSleadGeneratorEmpName.patchValue(null)
  //         if(flag=='MCXFOleadGeneratorEmpName')
  //         this.form.controls.MCXFOleadGeneratorEmpName.patchValue(null)
  //          if(flag=='COMMCXleadGeneratorEmpName')
  //          this.form.controls.COMMCXleadGeneratorEmpName.patchValue(null)
  //           if(flag=='COMNCDEXleadGeneratorEmpName')
  //           this.form.controls.COMNCDEXleadGeneratorEmpName.patchValue(null)
  //         if(flag=='COMICEXleadGeneratorEmpName')
  //         this.form.controls.COMICEXleadGeneratorEmpName.patchValue(null)
  //       }
  //   })
  //      }


  getEmpDetails(val){
    let data=val.target.value
    if(data==''||data==null){
      this.form.controls.leadGeneratorEmpName.patchValue(null)
      return
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          EmpCode: data,
        }],
      "requestId": "7011"
    })
      .then((response) => {    
        if (response.results.length>0) {
          let details=response.results[0][0]
          this.form.controls.leadGeneratorEmpName.patchValue(details.EmpName)
        }
        else{
          this.form.controls.leadGeneratorEmpName.patchValue(null)
        }
    })
  }, 300);
       }

}
