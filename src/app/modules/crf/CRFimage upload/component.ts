import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UploadFile } from 'ng-zorro-antd/upload';
import { CRFDataService } from '../CRF.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';
import { UtilService, DataService } from 'shared';
import * as  jsonxml from 'jsontoxml'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'crf-image-upload',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class CRFImageUploadComponent implements OnInit {
  @Input() fromnominee  : boolean =false;
  loading = false;
  avatarUrl: string;
  fileList: any = [];

  // photoPreview: SafeUrl;
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;

  form: FormGroup;
  base4String: string;
  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;
  url = '';
  panUrl: any = null;
  IdentitydocumentUrl: any = null;
  PermanentaddressUrl: any = null;
  CorrespondenceaddressUrl: any = null;
  AdditionalCorrespondenceaddressUrl: any = null;
  SignatureUrl: any = null;
  panloading: boolean;
  idloading: boolean;
  paloading: boolean;
  caloading: boolean;
  acaloading: boolean;
  sloading: boolean;
  panObj: any;
  IdentityObj: any;
  PermanentaddressObj: any;
  CorrespondenceaddressObj: any;
  AdditionalCorrespondenceaddressObj: any;
  SignatureUObj: any;
  holderDetails: any;
  panObj33: any;
  fileList1: any = [];
  fileList2: any = [];
  fileList3: any = [];
  fileList4: any = [];
  fileList5: any = [];
  fileList6: any = [];
  IdentityArray: any;
  ClientData: any;
  ProofTypeList: any = []
  Imglist: any;
  SupportFiles: any = [];
  ProofTypeData: any;
  index: number;
  Uploadedprooflist: any = [];
  retrieveData: any = [];
  IsForAprove: boolean;
  dataforaprove: any = [];
  Prooflist:any=[];
  isRejected: boolean=false;
  Mandatoryproofs: any=[];
  actionType: any;
  applicationForm: any;
  apllicationform:any=[];
  applicationReceived:boolean=false
  saveButtonFlag:boolean;
  applicationStatus:any;



  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private msg: NzMessageService,
    private notification: NzNotificationService,
    private cmServ: CRFDataService,
    private utilServ: UtilService,
    private modalService: NzModalService,
    private dataServ: DataService
  ) {
    this.form = fb.group({

    });
    this.base4String = "data:image/jpeg;base64,"

    this.cmServ.applicationStatus.subscribe(item=>{
      this.applicationStatus=item
    })
    console.log(this.applicationStatus,"this.applicationStatus  bank");
    
    if (this.applicationStatus=='T'||this.applicationStatus=='P'||this.applicationStatus=='A'||this.applicationStatus=='R' ||this.applicationStatus=='F') {
      this.cmServ.DataForAprooval.subscribe(item => {
        console.log("item[1]",item[1])
        this.retrieveData = item[1];
      })
    }
    this.cmServ.saveButtonFlag.subscribe(item=>
      {
        this.saveButtonFlag=item
      })
  }
  ngOnInit() {
    this.cmServ.hoderDetails.subscribe((val) => {
      this.holderDetails = val
    })
    this.cmServ.clientBasicData.subscribe(item => {
      this.ClientData = item;
    })
  

  }
  beforeUpload = (file: UploadFile, filelist): boolean => {
  // removed file.type == 'application/pdf' checking MODBY16676
    if (file.type == 'image/jpeg' || file.type == 'image/png') {
      // const isLt2M = true
      const isLt2M = file.size / 1024 < 1536
      if (!isLt2M) {
        this.notification.error('Image must smaller than 1.5MB!','')
        return false;
      }
      else {
        this.encodeImageFileAsURL(file);
      }
    }
    else {
      this.notification.error("Please upload jpeg/png",'')
      return false
    }
  }


  encodeImageFileAsURL(file) {
    
    let reader = new FileReader();
    reader.onloadend = () => {

      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      this.Imglist = {
       // Docname: this.ProofTypeData,
        // DocName: this.ProofTypeList[this.ProofTypeList.findIndex(item => item.slno === this.ProofTypeData)].Document,
        // DocnameText: this.ProofTypeList[this.ProofTypeList.findIndex(item => item.slno === this.ProofTypeData)].Document,

        DocName:this.ProofTypeData,
        DocnameText:this.ProofTypeData,
        Docfile: file.name,
        Doctype: file.type,
        Docuid: file.uid,
        Docsize: file.size,
        Docdoc: document
      }
      for (var i = 0; i < this.SupportFiles.length; i++) {
        if (this.SupportFiles[i].Docname == this.ProofTypeData) {
          this.index = i;
        }
      }
      setTimeout(() => {
        if (this.index >= 0) {
          this.modalService.confirm({
            nzTitle: '<i>Confirmation</i>',
            nzContent: '<b>Are you sure want to Replace the  file?</b>',
            nzOnOk: () => {
              this.SupportFiles[this.index] = this.Imglist
              this.index = -1;
            }
          });
        }
        else {

          this.SupportFiles.push(this.Imglist)
          this.Imglist = [];
          this.ProofTypeData = null;
        }
      }, 300);
    }
    reader.readAsDataURL(file);
  }
  showModal(file) {

    this.filePreiewContent=''
    this.filePreiewContent='';
    setTimeout(() => {
    this.filePreiewContent = file
    this.filePreiewVisible = true
    },500);


    // this.filePreiewContent = file.Docdoc
    // this.filePreiewFilename = 'Test'
    // this.filePreiewContentType = file.Doctype
    // this.filePreiewVisible = true;
  }

  setDataForxml() {
    
    if (this.SupportFiles.length > 0) {
      if (!this.Uploadedprooflist.length) {
        this.SupportFiles.forEach((item) => {
          var obj = {};
          var name = '';
          name = "ProofDoc";
          obj[name] = item
          this.Uploadedprooflist.push(obj)
        })
      }
      let imageXmlData = jsonxml(this.Uploadedprooflist);
      return imageXmlData
    }
  }
  reternImagefinalArray() {
    this.Uploadedprooflist=[]
    if (this.SupportFiles.length > 0) {
        this.SupportFiles.forEach((item) => {
          var obj = {};
          var name = '';
          name = "ProofDoc";
          obj[name] = item
          this.Uploadedprooflist.push(obj)
        })
      return this.Uploadedprooflist
    }
  }
  Deleterow(d, i) {
    this.SupportFiles.splice(i, 1)
  }
  setproofs(Atcion) {
    this.actionType=Atcion
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ParamType: Atcion,
          Location: "",
          EUser: ""
        }],
      "requestId": "6008",
      "outTblCount": "0"
    }).then((response) => {
      
      if (response.errorCode == 0) {
        if (response.results && response.results[0]) {
          this.ProofTypeList = response.results[0];
          this.Mandatoryproofs=this.ProofTypeList.filter(item=>{
            return item.DocumentProofRequired==true
          })
          if (this.retrieveData.length > 0) {
            console.log("this.ret",this.retrieveData)
            this.retrieveImagedata()
          }
        }
      }
    })
  }
  retrieveImagedata() {
    
    this.retrieveData.forEach(element => {
      
      // element.DocnameText = this.ProofTypeList[this.ProofTypeList.findIndex(item => item.slno.toString() === element.DocName)].Document
      element.DocnameText = element.DocName
      element.Docdoc = element.ImgData
      element.Doctype = element.ImgType;
      this.SupportFiles.push(element);
    });
  }

  ResetUploads()
  {
    this.SupportFiles=[];
    this.Uploadedprooflist=[];
  }
}
