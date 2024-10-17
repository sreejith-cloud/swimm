import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { UtilService, DataService } from 'shared';
import * as  jsonxml from 'jsontoxml'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { ClientMasterService } from '../../../client-master/client-master.service';
import { CRFDataService } from '../../CRF.service';
import { ClientMasterService } from '../../client-master.service';


@Component({
  selector: 'proof-upload',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class ProofUploadComponent implements OnInit {
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
  Docdoc = '';
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
  IdentityArray: any;
  isadditionalAddressShow: boolean;
  isSameAsPermanantAddress: boolean = false;
  SupportFiles: any = [];
  Imglist: any;
  ImgTypeDatalist = [];
  ImgTypeData: any;
  index: number;
  saveButtonFlag: boolean;
  apllicationform: any = [];
  externalWindow: any = [];
  ImgTypeDatas: any = [];
  Mandatoryproofs: any = [];
  retrieveData: any = [];
  isderivativeSegment: boolean = false;
  proofIdentity: boolean = false;
  proofCorres: boolean = false;
  NRI: boolean;
  passProof:boolean =false;
  applicationStatus: any;
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private msg: NzMessageService,
    private notification: NzNotificationService,
    private cmServ: ClientMasterService,
    private utilServ: UtilService,
    private notif: NzNotificationService,
    private crfServe: CRFDataService,
    private dataServ: DataService,
    private modalService: NzModalService,

  ) {
    this.form = fb.group({

    });
    this.base4String = "data:image/jpeg;base64,"

    this.cmServ.proofIdentity.subscribe(item => {
      this.proofIdentity = item
    })

    this.cmServ.proofCorres.subscribe(item => {
      this.proofCorres = item
    })
    this.cmServ.isNRE.subscribe(val => {
      this.NRI = val
    });
    this.cmServ.proofPassport.subscribe(val => {
      this.passProof = val
    });

    this.cmServ.applicationStatus.subscribe(item => {
      this.applicationStatus = item
    })
    
  }

  ngOnInit() {
    this.cmServ.hoderDetails.subscribe((val) => {
      this.holderDetails = val
    })
    // this.cmServ.isAdditionalAddressGiven.subscribe(val => {
    //   if (val != null && this.ImgTypeDatalist) {
    //     this.isadditionalAddressShow = val
    //     if (val) {
    //       let index = this.ImgTypeDatalist.indexOf('Additional Correspondence address proof');
    //       if (index == -1) {
    //         this.ImgTypeDatalist.push('Additional Correspondence address proof');
    //       }

    //     }
    //     else {
    //       let index = this.ImgTypeDatalist.indexOf('Additional Correspondence address proof');
    //       if (index > -1) {
    //         this.ImgTypeDatalist.splice(index, 1);
    //       }
    //     }
    //   }
    // })

    this.cmServ.sameAsPermantAddress.subscribe(val => {
      if (val != null && this.ImgTypeDatalist) {
        this.isSameAsPermanantAddress = val
        if (val) {
          var removeIndex = this.ImgTypeDatalist.map(function (item) { return item.slno; }).indexOf(84);
          if (removeIndex > -1) {
            this.ImgTypeDatalist.splice(removeIndex, 1);
          }
        }
      }
    })

    this.cmServ.isPanSelected.subscribe(val => {
      if (val != null && this.ImgTypeDatalist) {
        if (val) {
          var removeIndex = this.ImgTypeDatalist.map(function (item) { return item.slno; }).indexOf(81);
          if (removeIndex > -1) {
            this.ImgTypeDatalist.splice(removeIndex, 1);
          }
        }
      }
    })

    this.cmServ.isderivativeSegment.subscribe(val => {
      this.isderivativeSegment = val
    })

    this.crfServe.saveButtonFlag.subscribe(item => {
      this.saveButtonFlag = item
    })

  }

  beforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'image/jpeg' || file.type == 'image/png') {
      if (this.ImgTypeData == 'Photo') {
        const isLt5K = file.size / 1024 < 50
        if (!isLt5K) {
          this.notif.error('Image must smaller than 50KB!', '', { nzDuration: 60000 })
          return false;
        }
      }
      else {
        const isLt2M = file.size / 1024 < 1500
        if (!isLt2M) {
          this.notif.error('Image must smaller than 1500KB!', '', { nzDuration: 60000 })
          return false;
        }
      }
      this.encodeImageFileAsURL(file);
      return false;
    }
    else if (this.ImgTypeData == 'Derivative Proof' && file.type == 'application/pdf') {
      const isLt2Mder = file.size / 1024 < 1500
      if (!isLt2Mder) {
        this.notif.error('file must smaller than 1500KB!', '', { nzDuration: 60000 })
        return false;
      }
      this.encodeImageFileAsURL(file);
      return false;
    }
    else {
      this.notif.error("Please uplaod jpeg/png", '')
      return false
    }
  }


  encodeImageFileAsURL(file) {
    let count = 0
    let notallowUpload = false
    let reader = new FileReader();
    this.ImgTypeData


    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      this.Imglist = {
        DocName: this.ImgTypeData,
        DocNameText: this.ImgTypeData,
        Docfile: file.name,
        Doctype: file.type,
        Docuid: file.uid,
        Docsize: file.size,
        Docdoc: document
      }

      for (var i = 0; i < this.SupportFiles.length; i++) {
        if (this.SupportFiles[i].DocName == this.ImgTypeData) {
          this.index = i;
        }
      }
      setTimeout(() => {
        if (this.index >= 0) {
          this.modalService.confirm({
            nzTitle: '<i>Confirmation</i>',
            nzContent: '<b>Are you sure want to Replace the file?</b>',
            nzOnOk: () => {
              this.SupportFiles[this.index] = this.Imglist
              this.index = -1;
            }
          });
        }
        else {
          this.SupportFiles.push(this.Imglist)
          this.Imglist = [];
          this.ImgTypeData = null;
        }
      }, 300);
    }
    reader.readAsDataURL(file);
  }

  showModal(data) {
    // this.filePreiewContent = data.Docdoc
    // this.filePreiewFilename = data.DocName
    // this.filePreiewContentType = data.Doctype
    // this.filePreiewVisible = true;
    // var test = 'data:' + data.Doctype + ';base64,' + data.Docdoc
    // var _frame = document.createElement('iframe');
    // _frame.src = test
    // _frame.id = "preview"
    // _frame.style.width = "100%";
    // _frame.style.height = "100%";
    // this.externalWindow = window.open('','_blank','width=1000,height=600,left=200,top=200');
    // this.externalWindow.document.getElementsByTagName('body')[0].appendChild(_frame);

    this.filePreiewContent = ''
    this.filePreiewVisible = false
    this.filePreiewContent = data
    this.filePreiewVisible = true
  }

  Deleterow(i) {
    this.SupportFiles.splice(i, 1)
  }

  getData() {
    let x = this.uploadTempSave()
  }

  checkUploads() {
    let isDoc = true
    let isDocUploaded = true
    if (this.SupportFiles.length == 0) {
      this.notif.error('Please Upload Proofs', '')
      return false
    }
    var proofarray = this.SupportFiles;
    var notlisted: any = [];
    var mandatproofs = this.Mandatoryproofs;

    mandatproofs.forEach(element => {
      isDocUploaded = false
      proofarray.forEach(item => {
        if (element.Document == item.Docname || element.Document == item.DocName) {
          isDocUploaded = true;
          return
        }
      })
      if (!isDocUploaded) {
        notlisted.push(Number(element["slno"]))
      }
    });

    var proofderivative
    if (!this.isderivativeSegment) {
      proofderivative = notlisted.indexOf(87);
      if (proofderivative != -1) {
        notlisted.splice(proofderivative, 1);
      }
    }

    var proofSameAS
    if (this.proofCorres) {
      proofSameAS = notlisted.indexOf(84);
      if (proofSameAS != -1) {
        notlisted.splice(proofSameAS, 1);
      }
    }

    var proofIdentity
    if (this.proofIdentity) {
      proofIdentity = notlisted.indexOf(81);
      if (proofIdentity != -1) {
        notlisted.splice(proofIdentity, 1);
      }
    }
    debugger
    var passportProof
    passportProof = notlisted.indexOf(98);
    if (!this.NRI) {
      if (passportProof != -1) {
        notlisted.splice(passportProof, 1);
      }     
    }
    else{
      if(this.passProof){
        notlisted.splice(passportProof, 1);
      }
    }
    

    if (notlisted.length > 0) {
      this.notif.error('Please Upload ' + mandatproofs[mandatproofs.findIndex(o => o.slno == notlisted[0])].Document, '')
      isDoc = false
    }
    else {
      isDoc = true;
    }

    if (isDoc) {
      let DocName = this.SupportFiles[0].DocName
      let counter = 0;
      let finalDocuments: any = JSON.stringify(this.SupportFiles)
      finalDocuments = JSON.parse(finalDocuments)
      for (let i = 0; i < finalDocuments.length; i++) {
        if (DocName == finalDocuments[i].DocName) {
          counter = counter + 1;
          finalDocuments[i].DocName = finalDocuments[i].DocName
        }
        else {
          DocName = finalDocuments[i].DocName
          counter = 1
          finalDocuments[i].DocName = finalDocuments[i].DocName
        }
      }
      let jsond = this.utilServ.setJSONArray(finalDocuments);
      let imageXmlData = jsonxml(jsond);
      return {
        status: true,
        data: imageXmlData,
        obj: finalDocuments
      }
    }
  }

  uploadTempSave() {
    if (this.SupportFiles.length == 0) {
      return {
        status: false,
        data: ''
      }
    }
    let DocName = this.SupportFiles[0].DocName
    let counter = 0;
    let finalDocuments: any = JSON.stringify(this.SupportFiles)
    finalDocuments = JSON.parse(finalDocuments)
    for (let i = 0; i < finalDocuments.length; i++) {
      if (DocName == finalDocuments[i].DocName) {
        counter = counter + 1;
        finalDocuments[i].DocName = finalDocuments[i].DocName
      }
      else {
        DocName = finalDocuments[i].DocName
        counter = 1
        finalDocuments[i].DocName = finalDocuments[i].DocName
      }
    }
    let jsond = this.utilServ.setJSONArray(finalDocuments);
    let imageXmlData = jsonxml(jsond);
    return {
      status: true,
      data: imageXmlData
    }
  }

  applicationform = (file: UploadFile, filelist): boolean => {

    // if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
    if (file.type == 'image/jpeg' || file.type == 'image/png') {
      // const isLt2M = true
      const isLt2M = file.size / 1024 < 1536
      if (!isLt2M) {
        this.msg.error('Image must smaller than 1.5MB!')
        return false;
      }
      else {
        this.encodeApplicationForm(file);
      }
    }
    else {
      this.msg.error("Please uplaod jpeg/png")
      return false
    }
  }
  encodeApplicationForm(file) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      this.Imglist = {
        // DocName: this.ProofTypeData,
        DocName: "KYC Application Form",
        DocNameText: "KYC Application Form",
        Docfile: file.name,
        Doctype: file.type,
        Docuid: file.uid,
        Docsize: file.size,
        Docdoc: document
      }
      this.SupportFiles.push(this.Imglist)
    }
    reader.readAsDataURL(file);
  }

  setproofs(Atcion) {
    // this.actionType=Atcion
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
          this.ImgTypeDatalist = response.results[0];
          this.Mandatoryproofs = this.ImgTypeDatalist.filter(item => {
            return item.DocumentProofRequired == true
          })
          if (this.retrieveData.length > 0) {
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

}
