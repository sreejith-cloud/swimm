import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ClientMasterService } from '../../client-master.service';
import { NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { ValidationService, UtilService } from 'shared';
import { InputMasks, InputPatterns } from 'shared';
import * as  jsonxml from 'jsontoxml'

@Component({
  selector: 'kyc-company-address',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})
export class KYCCompanyAddressComponent implements OnInit {
  @ViewChild('reference') el: ElementRef;

  form: FormGroup;
  inputMasks = InputMasks;

  isLoadingPanDetails: boolean = false;
  isKRAVerified: boolean = false;
  idProof: number = 1;
  noOfBanifialArray: any = [];
  noOfPromotersArray: any = [];
  noOfAuthrizersArray: any = [];
  isAdd: boolean = true;
  isUpdate: boolean = false;

  clientType: string
  prometerDetails: any = [];
  FormControlNames: any = {};
  index: number;
  fileList: any = [];
  AddressProofList1: any = [];
  AddressProofList2: any = [];
  fileList1: any = [];
  fileList2: any = [];
  fileList3: any = [];
  fileList4 = []
  fileList5 = []
  ParterersListDocument: any = {}
  photoListDocument: any = {}
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  ParterershipdeedDocument: any;
  coparcenersDocument: any;
  AuthSignatureDocument: any;
  AuthSignatureListDocument: any;
  Authindex: any;
  AuthisAdd: boolean = true;
  AuthisUpdate: boolean = false;
  AuthorizedTableData: any = [];
  fileList6: any = [];
  ShareholdingratioDocument: any=[];
  UBOindex: number;
  UBOisAdd: boolean = true;
  UBOisUpdate: boolean;
  UBOTableData: any = [];
  AddressProofDocument2: any;
  AddressProofDocument1: any;

  constructor(
    private fb: FormBuilder,
    private notif: NzNotificationService,
    private validServ: ValidationService,
    private utilServ: UtilService, 
    private cmServ: ClientMasterService,
  ) {
  }

  ngOnInit() {
    this.cmServ.clientType.subscribe((val) => {
      this.clientType = val;
    })
    this.form = this.fb.group({
      noOfBanifial: [1, [Validators.required]],
      noOfPromoter: [1, [Validators.required]],
      noOfAuthorized: [1, [Validators.required]],
      modeOfOperation:[null],
      correspondenceAddress: this.createcorrespondenceAddress(),
      RegisteredAddress: this.createRegisteredAddress(),
      detialsofPromoters: this.createDetails(),
      AuthorisedDetails: this.createAuthDetails(),
      UltimateBeneficialOwnerDetails: this.CreateUltimateBeneficialOwnerDetails()

    });
  }
  createcorrespondenceAddress() {
    return this.fb.group({
      houseName: [null,[Validators.required]],
      houseNumber: [null,[Validators.required]],
      street: [null,[Validators.required]],
      pincode: [null,[Validators.required]],
      city: [null,[Validators.required]],
      state: [null,[Validators.required]],
      country: [null,[Validators.required]],
      proofOfAddress: [null,[Validators.required]],
      ExpiryDate: [null,[Validators.required]],
      riskCountry: [null,[Validators.required]],
    })
  }
  createRegisteredAddress() {
    return this.fb.group({
      sameascorrespondence:[false],
      houseName: [null,[Validators.required]],
      houseNumber: [null,[Validators.required]],
      street: [null,[Validators.required]],
      pincode: [null,[Validators.required]],
      city: [null,[Validators.required]],
      state: [null,[Validators.required]],
      country: [null,[Validators.required]],
      proofOfAddress: [null,[Validators.required]],
      ExpiryDate: [null,[Validators.required]],
      riskCountry: [null],

    })
  }
  createDetails() {
    return this.fb.group({
      houseName: [null, [Validators.required]],
      houseNumber: [null, [Validators.required]],
      street: [null, [Validators.required]],
      Promotername: [null, [Validators.required]],
      PAN: [null, [Validators.required]],
      WhetherPoliticallyExposed: [null, [Validators.required]],
      clientRelationship: [null, [Validators.required]],
      DIN: [null],
      UID: [null],
    })
  }
  createAuthDetails() {
    return this.fb.group({
      AuthorisedName: [null, [Validators.required]],
      AuthorisedDesingnation: [null, [Validators.required]]
    })
  }
  CreateUltimateBeneficialOwnerDetails() {
    return this.fb.group({
      UltimateBeneficialOwnerName: [null, [Validators.required]],
      UltimateBeneficialOwnerPan: [null, [Validators.required]],
      UltimateBeneficialOwnerhouseName: [null, [Validators.required]],
      UltimateBeneficialOwnerhouseNumber: [null, [Validators.required]],
      UltimateBeneficialOwnerstreet: [null, [Validators.required]],
      UltimateBeneficialOwnerRelatedEntity: [null, [Validators.required]],
      UBORelationshipwiththeentity: [null, [Validators.required]],
      UltimateBeneficialOwnerEmail: [null, [Validators.required]],
      UltimateBeneficialOwnerContactNumber: [null, [Validators.required]],

    })
  }
  selectSameAsCorrespondence(val){    
    let corrAddForm:any=this.form.controls.correspondenceAddress
    let regAddForm:any=this.form.controls.RegisteredAddress
    if(val==true){
      regAddForm.patchValue(corrAddForm.value)
      this.AddressProofList2=this.AddressProofList1
      this.AddressProofDocument2=this.AddressProofDocument1
    }
    else{
      this.AddressProofDocument2=null;
      this.AddressProofList2=[]
      // regAddForm.reset()
    }
  }
  beforeUploadAddressProofList1 = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.AddressProofList1 = [file];
      this.encodeImageFileAsURL(file, 'AddressProofList1');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }
  beforeUploadAddressProofList2 = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.AddressProofList2 = [file];
      this.encodeImageFileAsURL(file, 'AddressProofList2');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }
  beforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.fileList = [file];
      this.encodeImageFileAsURL(file, 'ParterersList');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }
  beforeUploadphoto = (file: UploadFile): boolean => {
    if (file.type == 'image/jpeg') {
      this.fileList1 = [file];
      this.encodeImageFileAsURL(file, 'photo');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg", '')
      return false
    }
  }
  beforeUploadParterershipdeed = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.fileList2 = [file];
      this.encodeImageFileAsURL(file, 'Parterershipdeed');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }
  beforeUploadcoparceners = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.fileList3 = [file];
      this.encodeImageFileAsURL(file, 'coparceners');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }

  beforeUploadAuthSignature = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.fileList4 = [file];
      this.encodeImageFileAsURL(file, 'AuthSignature');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }

  beforeUploadAuthSignatureList = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.fileList5 = [file];
      this.encodeImageFileAsURL(file, 'AuthSignatureList');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }
  ShareholdingratioBeforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.encodeImageFileAsURL(file, 'Shareholdingratio');
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }

  encodeImageFileAsURL(file, type: string) {
    
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];
      if (type == "ParterersList") {
        this.ParterersListDocument = {
          ParterersListDocname: 'list of partner',
          ParterersListDoctype: file.type,
          ParterersListDocuid: file.uid,
          ParterersListDocsize: file.size,
          ParterersListDocdoc: document,

        }
      }
      if (type == "photo") {
        this.photoListDocument = {
          photoDocname: 'photo',
          photoDoctype: file.type,
          photoDocuid: file.uid,
          photoDocsize: file.size,
          photoDocdoc: document,

        }
      }

      if (type == "Parterershipdeed") {
        this.ParterershipdeedDocument = {
          ParterershipdeedDocname: 'Parterership deed',
          ParterershipdeedDoctype: file.type,
          ParterershipdeedDocuid: file.uid,
          ParterershipdeedDocsize: file.size,
          ParterershipdeedDocdoc: document,

        }
      }

      if (type == "coparceners") {
        this.coparcenersDocument = {
          coparcenersDocname: 'coparceners',
          coparcenersDoctype: file.type,
          coparcenersDocuid: file.uid,
          coparcenersDocsize: file.size,
          coparcenersDocdoc: document,

        }
      }

      if (type == "AuthSignature") {
        this.AuthSignatureDocument = {
          AuthSignatureDocname: 'Authorised Signature',
          AuthSignatureDoctype: file.type,
          AuthSignatureDocuid: file.uid,
          AuthSignatureDocsize: file.size,
          AuthSignatureDocdoc: document,

        }
      }
      if (type == "AuthSignatureList") {
        this.AuthSignatureListDocument = {
          AuthSignatureListDocname: 'Authorised Signature List',
          AuthSignatureListDoctype: file.type,
          AuthSignatureListDocuid: file.uid,
          AuthSignatureListDocsize: file.size,
          AuthSignatureListDocdoc: document,

        }
      }
      if (type == "Shareholdingratio") {
        if (this.ShareholdingratioDocument.length < 3) {
          this.ShareholdingratioDocument.push({
            ShareholdingratioDocname: 'Share holding ratio',
            ShareholdingratioDoctype: file.type,
            ShareholdingratioDocuid: file.uid,
            ShareholdingratioDocsize: file.size,
            ShareholdingratioDocdoc: document,
          })
        }
        else {
          this.notif.error('Maximum 3 Share holding pattern can be uploaded', '')
        }
       
      }

      if (type == "AddressProofList1") {
        this.AddressProofDocument1 = {
         Docname: 'Correspondence Address Proof Document',
         Doctype: file.type,
         Docuid: file.uid,
         Docsize: file.size,
         Docdoc: document,

        }
        
      }

      if (type == "AddressProofList12") {
        this.AddressProofDocument2 = {
         Docname: 'Register Address Proof Document',
         Doctype: file.type,
         Docuid: file.uid,
         Docsize: file.size,
         Docdoc: document,

        }
        
      }
    }
    reader.readAsDataURL(file);
  }
  ParterersListModal(data) {
    this.filePreiewContent = data.ParterersListDocdoc
    this.filePreiewFilename = data.ParterersListDocname
    this.filePreiewContentType = data.ParterersListDoctype
    this.filePreiewVisible = true;
  }
  photoListsModal(data) {
    this.filePreiewContent = data.photoDocdoc
    this.filePreiewFilename = data.photoDocname
    this.filePreiewContentType = data.photoDoctype
    this.filePreiewVisible = true;
  }
  ParterershipdeedModal(data) {
    this.filePreiewContent = data.ParterershipdeedDocdoc
    this.filePreiewFilename = data.ParterershipdeedDocname
    this.filePreiewContentType = data.ParterershipdeedDoctype
    this.filePreiewVisible = true;
  }

  coparcenersModal(data) {
    this.filePreiewContent = data.coparcenersDocdoc
    this.filePreiewFilename = data.coparcenersDocname
    this.filePreiewContentType = data.coparcenersDoctype
    this.filePreiewVisible = true;
  }
  AuthSignatureModal(data) {
    this.filePreiewContent = data.AuthSignatureDocdoc
    this.filePreiewFilename = data.AuthSignatureDocname
    this.filePreiewContentType = data.AuthSignatureDoctype
    this.filePreiewVisible = true;
  }
  AuthSignatureListModal(data) {
    this.filePreiewContent = data.AuthSignatureListDocdoc
    this.filePreiewFilename = data.AuthSignatureListDocname
    this.filePreiewContentType = data.AuthSignatureListDoctype
    this.filePreiewVisible = true;
  }
  ShareHolderRationModal(data) {
    this.filePreiewContent = data.ShareholdingratioDocdoc
    this.filePreiewFilename = data.ShareholdingratioDocname
    this.filePreiewContentType = data.ShareholdingratioDoctype
    this.filePreiewVisible = true;
  }
  AddressProofModal1() {
    this.filePreiewContent = this.AddressProofDocument1.Docdoc
    this.filePreiewFilename = this.AddressProofDocument1.Docname
    this.filePreiewContentType = this.AddressProofDocument1.Doctype
    this.filePreiewVisible = true;
  }
  AddressProofModal2() {
    this.filePreiewContent = this.AddressProofDocument2.Docdoc
    this.filePreiewFilename = this.AddressProofDocument2.Docname
    this.filePreiewContentType = this.AddressProofDocument2.Doctype
    this.filePreiewVisible = true;
  }
  DeleteShareholdingratioDocument(index) {
    this.ShareholdingratioDocument.splice(index, 1)
    // this.BankProofFile.splice(index, 1)
  }
  add() {
    if (this.prometerDetails.length == 10) {
      // this.notif.error("Maximum 10 Banks can select as a tranding banks",'')
      return
    }
    let form: any = this.form.controls.detialsofPromoters

    let isValid = this.validServ.validateForm(form, this.FormControlNames);
    if (!isValid) {
      return;
    }

    if (this.fileList.length == 0) {
      this.notif.error("Please upload Parterers List document", '')
      return
    }

    if (this.fileList1.length == 0) {
      this.notif.error("Please upload bank photo document", '')
      return
    }


    if (this.fileList2.length == 0) {
      this.notif.error("Please upload Parterership deed document", '')
      return
    }

    if (this.fileList3.length == 0) {
      this.notif.error("Please upload coparceners document", '')
      return
    }
    var totalData = { ...form.value, ...this.ParterersListDocument, ...this.photoListDocument, ...this.ParterershipdeedDocument, ...this.coparcenersDocument }
    this.prometerDetails = [...this.prometerDetails, ...totalData]
    console.log(this.prometerDetails)

    form.reset();
    this.fileList = []
    this.fileList1 = []
    this.fileList2 = []
    this.fileList3 = []
  }
  edit(data, i) {
    this.index = i
    this.isAdd = false;
    this.isUpdate = true;
    let form: any = this.form.controls.detialsofPromoters;
    form.patchValue(data)
  }
  update() {
    let form: any = this.form.controls.detialsofPromoters;
    let isValid = this.validServ.validateForm(form, this.FormControlNames);
    if (!isValid) {
      return
    }
    this.isAdd = true;
    this.isUpdate = false;


    var totalData = { ...form.value, ...this.ParterersListDocument, ...this.photoListDocument, ...this.ParterershipdeedDocument, ...this.coparcenersDocument }
    this.prometerDetails[this.index] = totalData
    form.reset();
    this.fileList = []
    this.fileList1 = []
    this.fileList2 = []
    this.fileList3 = []
  }
  reset() {
    let form: any = this.form.controls.detialsofPromoters;
    form.reset();
    this.fileList = []
    this.fileList1 = []
    this.fileList2 = []
    this.fileList3 = []
  }


  Authadd() {
    if (this.AuthorizedTableData.length == this.prometerDetails.length) {
      this.notif.error("You can't add more than Details of Promoters/ Trustees/ Karta/Partners and Whole Time Directors", '')
      return
    }
    let form: any = this.form.controls.AuthorisedDetails

    let isValid = this.validServ.validateForm(form, this.FormControlNames);
    if (!isValid) {
      return;
    }

    if (this.fileList4.length == 0) {
      this.notif.error("Please upload Authrised signature", '')
      return
    }

    if (this.fileList5.length == 0) {
      this.notif.error("Please upload bank photo document", '')
      return
    }


    var totalData = { ...form.value, ...this.AuthSignatureDocument, ...this.AuthSignatureListDocument }
    this.AuthorizedTableData = [...this.AuthorizedTableData, ...totalData]
    console.log(this.AuthorizedTableData)

    form.reset();
    this.fileList4 = []
    this.fileList5 = []

  }
  Authedit(data, i) {
    this.Authindex = i
    this.AuthisAdd = false;
    this.AuthisUpdate = true;
    let form: any = this.form.controls.AuthorisedDetails;
    form.patchValue(data)
  }
  Authupdate() {
    let form: any = this.form.controls.AuthorisedDetails;
    let isValid = this.validServ.validateForm(form, this.FormControlNames);
    if (!isValid) {
      return
    }
    this.AuthisAdd = true;
    this.AuthisUpdate = false;

    var totalData = { ...form.value, ...this.AuthSignatureDocument, ...this.AuthSignatureListDocument }

    this.AuthorizedTableData[this.Authindex] = totalData
    form.reset();
    this.fileList4 = []
    this.fileList5 = []

  }
  Authreset() {
    let form: any = this.form.controls.AuthorisedDetails;
    form.reset();
    this.fileList4 = []
    this.fileList5 = []

  }

  UBOadd() {

    let form: any = this.form.controls.UltimateBeneficialOwnerDetails

    let isValid = this.validServ.validateForm(form, this.FormControlNames);
    if (!isValid) {
      return;
    }

    if (this.ShareholdingratioDocument.length == 0) {
      this.notif.error("Please upload Share holding Pattern / Profit Sharing ratio", '')
      return
    }
    let Shareholdingratio = JSON.stringify(this.ShareholdingratioDocument)
    form.value["Shareholdingratio"] = JSON.parse(Shareholdingratio)
    // var totalData = { ...form.value,  }
    this.UBOTableData = [...this.UBOTableData, ...form.value]
    console.log(this.UBOTableData)
    form.reset();
    this.fileList6 = []
    this.ShareholdingratioDocument=[]
  }
  UBOedit(data, i) {
    this.UBOindex = i
    this.UBOisAdd = false;
    this.UBOisUpdate = true;
    let form: any = this.form.controls.UltimateBeneficialOwnerDetails;
    form.patchValue(data)
    this.ShareholdingratioDocument=data.Shareholdingratio;
  }
  UBOupdate() {
    let form: any = this.form.controls.UltimateBeneficialOwnerDetails;
    let isValid = this.validServ.validateForm(form, this.FormControlNames);
    if (!isValid) {
      return
    }
    if (this.ShareholdingratioDocument.length == 0) {
      this.notif.error("Please upload Share holding Pattern / Profit Sharing ratio", '')
      return
    }
    this.UBOisAdd = true;
    this.UBOisUpdate = false;

    let Shareholdingratio = JSON.stringify(this.ShareholdingratioDocument)
    form.value["Shareholdingratio"] = JSON.parse(Shareholdingratio)
    // var totalData = { ...form.value,  }
    let data = [...this.UBOTableData, ...form.value]
    // var totalData = { ...form.value, ...this.ShareholdingratioDocument }
    this.UBOTableData[this.UBOindex] = data
    form.reset();
    this.fileList6 = []
    this.ShareholdingratioDocument=[]

  }
  UBOreset() {
    let form: any = this.form.controls.UltimateBeneficialOwnerDetails;
    form.reset();
    this.fileList6 = []
  }
  noOfBeneficial() {
    this.noOfBanifialArray = Array(this.form.controls.noOfBanifial.value)
  }
  noOfPromoter() {
    this.noOfPromotersArray = Array(this.form.controls.noOfPromoter.value)
  }
  getData(){
    let data=this.getCompanyAddData()
    if(!data.status){
      alert()
    }
    console.log(data)
  }
  getCompanyAddData(){
    let isCorrsAddressValid = this.validServ.validateForm(this.form.controls.correspondenceAddress, this.FormControlNames);

    if (!isCorrsAddressValid) {
      this.el.nativeElement.scrollIntoView();
        return {}
    }
      if(this.AddressProofList1.length==0){
        this.notif.error("Please upload correspondence Address Proof",'')
            this.el.nativeElement.scrollIntoView();
        return {}
      }
      let data1: any = []
      let totalData1 = { ...this.form.controls.correspondenceAddress.value, ...this.AddressProofDocument1 }
      data1.push(totalData1)
      var JSONData1 = this.utilServ.setJSONArray(data1);
      let correspondenceAddressXML = jsonxml(JSONData1);
      
      let isRegisteredAddressValid=this.validServ.validateForm(this.form.controls.RegisteredAddress, this.FormControlNames);
      if(!isRegisteredAddressValid){
        this.el.nativeElement.scrollIntoView();
        return {}
      }
        if(this.AddressProofList2.length==0){
          this.notif.error("Please upload Register Address Proof",'')
              this.el.nativeElement.scrollIntoView();
          return {}
        }
       

        if(this.prometerDetails.length==0){
          this.notif.error("Details of Promoters/ Trustees/ Karta/Partners and Whole Time Directors required",'')
              this.el.nativeElement.scrollIntoView();
          return {}
        }
        else{
          var jsonData=this.utilServ.setJSONArray(this.prometerDetails)
          var promotersDetailsXML=jsonxml(jsonData)
        }
      let count= this.prometerDetails.length-this.AuthorizedTableData.length
        if(count!=0){
          if(this.AuthorizedTableData.length==0){
          this.notif.error("Please Add "+count+" authorised Person's details",'')
              this.el.nativeElement.scrollIntoView();
          }
          else{
            this.notif.error("Please Add "+count+" More authorised Person's details",'')
            this.el.nativeElement.scrollIntoView();
          }
      return {}
        }
        else{
          var jsonData=this.utilServ.setJSONArray(this.AuthorizedTableData)
          var AuthrisedPersonsDetailsXML=jsonxml(jsonData)
        }
        if(this.form.value.modeOfOperation==null){
          this.notif.error("Mode of operation required",'')
          return {}
        }
        let obj={modeOfOperation:this.form.value.modeOfOperation}
        let data: any = []
        let totalData = { ...this.form.controls.RegisteredAddress.value, ...this.AddressProofDocument2,...obj }
        data.push(totalData)
        var JSONData = this.utilServ.setJSONArray(data);
        let registerAddressXML = jsonxml(JSONData);
          var jsonData=this.utilServ.setJSONArray(this.UBOTableData)
          var UBODetailsXML=jsonxml(jsonData)
     
          return {
            status:true,
            data:[{
              correspondenceAddressXML:correspondenceAddressXML,
              registerAddressXML:registerAddressXML,
              promotersDetailsXML:promotersDetailsXML,
              AuthrisedPersonsDetailsXML:AuthrisedPersonsDetailsXML,
              UBODetailsXML:UBODetailsXML?UBODetailsXML:'',
            }
            ]
          }

      
      
  

  }

}
