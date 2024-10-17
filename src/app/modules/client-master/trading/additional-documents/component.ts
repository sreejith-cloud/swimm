import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UploadFile } from 'ng-zorro-antd/upload';
import { ClientMasterService } from '../../client-master.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';
import { UtilService } from 'shared';
import * as  jsonxml from 'jsontoxml'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'trading-additional-documents',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class AdditionalDocumentsComponent implements OnInit {
  // fileList0:any=[]
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  fileList: any=[];
  fileList1: any=[];
  fileList2: any=[];
  fileList3: any=[];
  fileList4: any=[];
  fileList5: any=[];
  fileList6: any=[];
  holderDetails: any;
  SupportFiles: any=[];
  Imglist: any;
  ImgTypeDatalist=[
    // 'PAN',
    // 'Identity document',
    // 'Permanent address',
    // 'Correspondence address',
    // 'Additional Correspondence address',
    'Marriage Certificate',
'Gazetted Notification',
'Nominee Id Proof']
  ImgTypeData: any;
  index: number;
  
  // listOfDocs: any[] = [
  //   {
  //     title: 'PAN Card',
  //     filelist:this.fileList0
  //   },
  //   {
  //     title: 'Aadhaar Card',
  //     filelist:this.fileList1
  //   },
  //   {
  //     title: 'Passport',
  //     filelist:this.fileList2
  //   },
  //   {
  //     title: 'Driving License',
  //     filelist:this.fileList3
  //   },
  //   {
  //     title: 'Voters ID',
  //     filelist:this.fileList4
  //   },
  //   {
  //     title: 'Marriage Certificate',
  //     filelist:this.fileList5
  //   },
  //   {
  //     title: 'Gazetted Notification',
  //     filelist:this.fileList6
  //   }
  // ];
  form: FormGroup;
  constructor(
    private sanitizer: DomSanitizer,
    private msg: NzMessageService,
    private notif: NzNotificationService,
    private cmServ: ClientMasterService,
    private utilServ: UtilService,
    private fb: FormBuilder,

  ) {
    this.form = fb.group({
      
    });
    this.cmServ.hoderDetails.subscribe((val) =>{
      this.holderDetails =val
      console.log(this.holderDetails);
  }) 

  }

  ngOnInit() {

  }
  
  beforeUpload = (file: UploadFile): boolean => { 
    if(file.type=='application/pdf' || file.type=='image/jpeg' || file.type=='image/png'){
      const isLt2M = file.size / 1024 < 1500
      if (!isLt2M) {
        this.notif.error('Image must smaller than 1500KB!','',{nzDuration: 60000 })
        return false;
      }
      this.encodeImageFileAsURL(file);
      return false;
    }else{
      this.notif.error("Please uplaod jpeg/png/pdf",'')
      return false
    }
  }


  encodeImageFileAsURL(file) {
    let count=0
    let notallowUpload=false
    let reader = new FileReader();
    this.ImgTypeData
    

    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document= dataUrl.split(',')[1];
       this.Imglist={
        docname:this.ImgTypeData,
        //  Docfile:file.name,
         type:file.type,
         uid:file.uid,
         size:file.size,
         url:document,
       }
     
setTimeout(() => {
  if(this.SupportFiles.length){
    if(this.ImgTypeData=='PAN' || this.ImgTypeData=='Marriage Certificate' || this.ImgTypeData=='Gazetted Notification'){
    for(let i=0;i<=this.SupportFiles.length-1;i++){
    if(this.SupportFiles[i].docname==this.ImgTypeData){
      count=count+1
      this.notif.error(this.ImgTypeData+' cannot  upload more than '+count,'')
      notallowUpload=true
      // break;
    }   
    if(notallowUpload)
    break   
    }
  }
  else{
 for(let j=0;j<=this.SupportFiles.length-1;j++){debugger
    if(this.SupportFiles[j].docname==this.ImgTypeData){
       count=count+1
    } 
    if(count==3){
      this.notif.error(this.ImgTypeData+' cannot  upload more than '+count,'')
      notallowUpload=true
      // break;
    }  
    if(notallowUpload)
    break      
    }
  }
}
if(notallowUpload){
  this.Imglist=[];
  this.ImgTypeData=null;
  return
}
        this.SupportFiles.push(this.Imglist)
        this.SupportFiles.sort(function(a, b){
          var nameA=a.docname.toLowerCase(), nameB=b.docname.toLowerCase()
          if (nameA < nameB) //sort string ascending
              return -1 
          if (nameA > nameB)
              return 1
          return 0 //default return value (no sorting)
        })
        
        this.Imglist=[];
        this.ImgTypeData=null;
      }, 300)}
    reader.readAsDataURL(file);
  }
showModal(data)
{
  this.filePreiewContent = data.url
  this.filePreiewFilename = data.docname
  this.filePreiewContentType = data.type
  this.filePreiewVisible = true;
}
Deleterow(i) {
  this.SupportFiles.splice(i, 1)
}

 
//    showModal(file) {
//  if(file["originFileObj"]){
//       let  file1=file["originFileObj"]
//      this.filePreiewContent =file1.doc
//      this.filePreiewFilename = file1.name
//      this.filePreiewContentType = file1.type
//      this.filePreiewVisible = true;
//  }
//  else{
//    this.filePreiewContent =file.doc
//    this.filePreiewFilename = file.name
//    this.filePreiewContentType = file.type
//    this.filePreiewVisible = true
//  }
//  }
 
 
 getData(){
   let details=this.getAdditionalDocuments()
   let jsond = this.utilServ.setJSONArray(details);
   let imageXmlData = jsonxml(jsond);
  //  console.log(imageXmlData)
 }

   getAdditionalDocuments(){
     if(this.SupportFiles.length){
    let docName=this.SupportFiles[0].docname
    let counter=0;
    let finalDocuments:any=JSON.stringify(this.SupportFiles)
    finalDocuments=JSON.parse(finalDocuments)
    for(let i=0;i<finalDocuments.length;i++){
      if(docName==finalDocuments[i].docname){
      counter=counter+1;
      finalDocuments[i].panNumber=this.holderDetails["FirstHolderpanNumber"]
      finalDocuments[i].docname=finalDocuments[i].docname+counter
      }
      else{
        docName=finalDocuments[i].docname
        counter=1
        finalDocuments[i].docname=finalDocuments[i].docname+counter
        finalDocuments[i].panNumber=this.holderDetails["FirstHolderpanNumber"]
      }
    }
      
     return finalDocuments
  }
  else{
    return this.SupportFiles
  }
        
   }
   
//  getObjFromArray(filelist,proofname){
//  var  totalData=[] 
//  let data;
//  filelist.forEach((element,index) => {
//    if(element["originFileObj"]){
//    let file=element.originFileObj
//    data={
//      panNumber:this.holderDetails["FirstHolderpanNumber"],
//      docname:(proofname=='PAN'||proofname=='Signature')?proofname:proofname+(index+1),
//      url:file.doc,
//      size:file.size,
//      type:file.type,
//      uid:file.uid
//    }
//  }
//  else{
//    let file=element
//    data={
//      panNumber:this.holderDetails["FirstHolderpanNumber"],
//      docname:(proofname=='PAN'||proofname=='Signature')?proofname:proofname+(index+1),
//      url:file.doc,
//      size:file.size,
//      type:file.type,
//      uid:file.uid
//    }
//  }
//    totalData.push(data)
//  });
//  let jsond = this.utilServ.setJSONArray(totalData);
//  let imageXmlData = jsonxml(jsond);
//  return imageXmlData
//  }
 
  //  uploadTempSave(){
  //    console.log(this.panObj)
  //    console.log(this.IdentityObj)
  //    console.log(this.CorrespondenceaddressObj)
  //    console.log(this.PermanentaddressObj)
  //      return {
  //        status: true,
  //        data:[
  //            {doc:this.panObj},
  //            {doc: this.IdentityObj},
  //            {doc: this.CorrespondenceaddressObj},
  //            {doc: this.AdditionalCorrespondenceaddressObj},
  //            {doc: this.PermanentaddressObj},
  //            {doc: this.SignatureUObj,}  
  //        ],
  //    };

  //   }
}