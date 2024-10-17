import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UploadFile } from 'ng-zorro-antd/upload';
import { ClientMasterService } from '../../client-master.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';
import { UtilService } from 'shared';
import * as  jsonxml from 'jsontoxml'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'proof-upload',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class ProofUploadComponent implements OnInit {
  loading = false;
  avatarUrl: string;
  fileList: any=[];

  // photoPreview: SafeUrl;
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;

  form: FormGroup;
  base4String:string;
  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;
  url = '';
  panUrl: any=null;
  IdentitydocumentUrl: any=null;
  PermanentaddressUrl: any=null;
  CorrespondenceaddressUrl: any=null;
  AdditionalCorrespondenceaddressUrl: any=null;
  SignatureUrl: any=null;
  panloading: boolean;
  idloading: boolean;
  paloading: boolean;
  caloading: boolean;
  acaloading: boolean;
  sloading: boolean;
  panObj:any;
  IdentityObj: any;
  PermanentaddressObj: any;
  CorrespondenceaddressObj: any;
  AdditionalCorrespondenceaddressObj: any;
  SignatureUObj: any;
  holderDetails: any;
  panObj33:any;
  fileList1: any=[];
  fileList2: any=[];
  fileList3: any=[];
  fileList4: any=[];
  fileList5: any=[];
  IdentityArray: any;
  isadditionalAddressShow: boolean;
  isSameAsPermanantAddress: boolean=false;
  SupportFiles: any=[];
  Imglist: any;
  ImgTypeDatalist=['PAN',
    'Identity address proof',
    'Permanent address proof',
    'Correspondence address proof',
    'Signature']
  ImgTypeData: any;
  index: number;
  modalService: any;
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private msg: NzMessageService,
    private notification: NzNotificationService,
    private cmServ: ClientMasterService,
    private utilServ: UtilService,
    private notif: NzNotificationService,

  ) {    
    this.form = fb.group({
      
    });
    this.base4String="data:image/jpeg;base64,"
  }

  ngOnInit() {
    this.cmServ.hoderDetails.subscribe((val) =>{
      this.holderDetails =val
      console.log(this.holderDetails);
  }) 
    this.cmServ.isAdditionalAddressGiven.subscribe(val=>{
      if(val!=null&&this.ImgTypeDatalist){
      this.isadditionalAddressShow=val
      if(val){
        let index = this.ImgTypeDatalist.indexOf('Additional Correspondence address proof');
        if (index == -1) {
          this.ImgTypeDatalist.push('Additional Correspondence address proof');
        }
      
      }
      else{
        let index = this.ImgTypeDatalist.indexOf('Additional Correspondence address proof');
        if (index > -1) {
          this.ImgTypeDatalist.splice(index, 1);
        }
      }
    }
    })

    this.cmServ.sameAsPermantAddress.subscribe(val=>{
      if(val!=null && this.ImgTypeDatalist){
      this.isSameAsPermanantAddress=val
      if(val){
        let index = this.ImgTypeDatalist.indexOf('Correspondence address proof');
          if (index > -1) {
            this.ImgTypeDatalist.splice(index, 1);
          }
      }
      else{
        let index = this.ImgTypeDatalist.indexOf('Correspondence address proof');
          if (index == -1) {
            this.ImgTypeDatalist.push('Correspondence address proof');
          }
      }
    }
    })

    this.cmServ.isPanSelected.subscribe(val=>{
      if(val!=null && this.ImgTypeDatalist){
      // this.isSameAsPermanantAddress=val
      if(val){
        let index = this.ImgTypeDatalist.indexOf('Identity address proof');
          if (index > -1) {
            this.ImgTypeDatalist.splice(index, 1);
          }
      }
      else{
        let index = this.ImgTypeDatalist.indexOf('Identity address proof');
          if (index == -1) {
            this.ImgTypeDatalist.push('Identity address proof');
          }
      }
    }
    })

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
    if(this.ImgTypeData=='PAN' || this.ImgTypeData=='Signature'){
    for(let i=0;i<=this.SupportFiles.length-1;i++){
    if(this.SupportFiles[i].docname==this.ImgTypeData){
      count=count+1
      this.notif.error(this.ImgTypeData+' Can not  upload more than '+count,'')
      notallowUpload=true
      // break;
    }   
    if(notallowUpload)
    break   
    }
  }
  else{
 for(let j=0;j<=this.SupportFiles.length-1;j++){
    if(this.SupportFiles[j].docname==this.ImgTypeData){
       count=count+1
    } 
    if(this.ImgTypeData=='Correspondence address proof'){
      if(count==5){
        this.notif.error(this.ImgTypeData+' Can not  upload more than '+count,'')
        notallowUpload=true
        // break;
      }
    }
    else{
    if(count==3){
      this.notif.error(this.ImgTypeData+' Can not  upload more than '+count,'')
      notallowUpload=true
      // break;
    }
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
getData(){
 let x=this.uploadTempSave()
console.log(x)
}
checkUploads(){
  let isDocUploaded=true
  if(this.SupportFiles.length==0){
    this.notif.error('Please Upload Proofs','')
    return false
  }
 let uploadedDocNames=[]
 this.SupportFiles.forEach(element => {
  uploadedDocNames.push(element.docname)
 }); 
for(let i=0;i<=this.ImgTypeDatalist.length-1;i++){
    // for(let j=0;j<=this.SupportFiles.length-1;j++){
      if(!(uploadedDocNames.includes(this.ImgTypeDatalist[i]))){
        this.notif.error('Please Upload '+this.ImgTypeDatalist[i],'')
        isDocUploaded=false;
        return false
      }
      else{
        isDocUploaded=true;
      }
    // }
}

if(isDocUploaded){
let docName=this.SupportFiles[0].docname
let counter=0;
let finalDocuments:any=JSON.stringify(this.SupportFiles)
finalDocuments=JSON.parse(finalDocuments)
for(let i=0;i<finalDocuments.length;i++){
  if(docName==finalDocuments[i].docname){
  counter=counter+1;
  finalDocuments[i].docname=finalDocuments[i].docname+counter
  }
  else{
    docName=finalDocuments[i].docname
    counter=1
    finalDocuments[i].docname=finalDocuments[i].docname+counter
  }
}
  let jsond = this.utilServ.setJSONArray(finalDocuments);
  let imageXmlData = jsonxml(jsond);
 return {
  status:true,
  data:imageXmlData
 }
}
}
  uploadTempSave(){
    if(this.SupportFiles.length==0){
      return{
        status:false,
        data:''
       }
    }
    let docName=this.SupportFiles[0].docname
    let counter=0;
    let finalDocuments:any=JSON.stringify(this.SupportFiles)
    finalDocuments=JSON.parse(finalDocuments)
    for(let i=0;i<finalDocuments.length;i++){
      if(docName==finalDocuments[i].docname){
      counter=counter+1;
      finalDocuments[i].docname=finalDocuments[i].docname+counter
      }
      else{
        docName=finalDocuments[i].docname
        counter=1
        finalDocuments[i].docname=finalDocuments[i].docname+counter
      }
    }
      let jsond = this.utilServ.setJSONArray(finalDocuments);
      let imageXmlData = jsonxml(jsond);
     return {
      status:true,
      data:imageXmlData
     }
    
}

}
