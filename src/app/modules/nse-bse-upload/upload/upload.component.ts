import { Component, OnInit } from '@angular/core';
import { InputMasks, DataService, UtilService, FindOptions, User, AuthService } from 'shared';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import * as moment from 'moment';
import { AppConfig } from 'shared';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  showLoading: any = false;
  savedFileName: any = null;
  fileToUpload: any;
  fileDetails: any = [];
  disableSubmit: boolean = true;
  dis: any = [];
  file: any = [];
  model: any;
  fileName: any;
  inputRemark: any = '';
  fileContent: any;
  tempFileData: any;
  currentUser: any;

  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private utilServ: UtilService,
    // private assetDetailsReportService: AssetDetailsReportService,
    private modalService: NzModalService
  ) {

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
  }

  onFileRemove(event?) {
    if (event.type === "removed") {
      this.savedFileName = null;
      this.fileToUpload = null;
      this.fileDetails = [];
      this.fileDetails = false;
      this.disableSubmit = true;
    }
  }

  beforeUpload = (file: UploadFile): boolean => {
    console.log(file.type);

    if (file.type === 'text/csv') {
      this.dis = [file];
      this.fileToUpload = file;
      this.uploadFileToFtp(file);

      return false;
    }
    else {
      this.notification.error("Please Upload Valid File", "");
      this.reset()
      return false;
    }

  }

  fileChangeEvent = () => {
    return (file: UploadFile): boolean => {
      this.file = [file];
      return false;
    };
  }

  onClickCancel() {
    // this.dis = [];
    // this.fileDetails = [];
    this.inputRemark = '';
    this.reset()
  }
  sendMail() {
    this.showLoading = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          fromDate: this.model && this.model.InvPendingDate ? moment(this.model.InvPendingDate).format(AppConfig.dateFormat.apiMoment) : '',
          flag: 'M'
        }],
      "requestId": "700079",
      "outTblCount": "0"
    }).then((response) => {
      this.showLoading = false;
      if (response || (response[0] && response[0].rows.length > 0)) {
        let resp = this.utilServ.convertToObject(response[0]);
        if (resp[0].ErrorCode == 1) {
          this.notification.success(resp[0].ErrorMsg, '')
        } else {
          this.notification.error(resp[0].ErrorMsg, '')
        }

      }
      else {
        this.notification.error('No data found', '')
      }
    })
  }

  onUpload() {
    this.showLoading = true;
    // if (this.inputRemark == '') { this.notification.error('Remarks are missing', ''); return false }
    if (this.savedFileName == null) { this.notification.error('Please Upload File', ''); return false }



    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser && this.currentUser.firstname ? this.currentUser.firstname : '',
          Filename: this.savedFileName ? this.savedFileName : '',
          // Remarks: this.inputRemark ? this.inputRemark : '',
          flag: 'A',
          Tradecode :'',
          Page: 0,
          FromDate:'',
          ToDate:''
        }],
      "requestId": "10000156",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode === 0) {

        // // this.notification.success('Asset upload file is being processed. Please check the status under `History` tab ', '');
        if (response && response.results && response.results[0] && response.results[0][0] && response.results[0][0].Running && response.results[0][0].Running === 'Data is Okay') {
          this.showLoading = false;
          this.modalService.info({
            nzTitle: '<h3>Alert</h3>',
            nzContent: '<h3>Uploaded file is being processed. Please check the status under `History` tab</h3>',
            nzOnOk: () => { this.onUploadToDB();this.reset(); this.inputRemark = '';
            this.showLoading = false;  }
          });
        }
        else {
          this.notification.error(response.results[0][0].Running, '');
          this.reset();
          this.inputRemark = '';
          this.showLoading = false;
        }

      }
      else {
        // let errorMessage = response.errorMsg ? response.errorMsg : response.results[0][0].Message ? response.results[0][0].Message : 'Something Went Wrong'
        this.notification.error('Upload Failed', '');
        this.reset();
        this.inputRemark = '';
        this.showLoading = false;
      }
    })

  }

  onUploadToDB() {
    // this.showLoading = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser && this.currentUser.firstname ? this.currentUser.firstname : '',
          Filename: this.savedFileName ? this.savedFileName : '',
          // Remarks: this.inputRemark ? this.inputRemark : '',
          flag: 'U',
          Tradecode :'',
          Page: 0,
          FromDate:'',
          ToDate:''
          // KeyNo: ''
        }],
      "requestId": "10000156",
      "outTblCount": "0"
    }).then((response) => {

    })

  }



  uploadFileToFtp(fileToFtp) {
    this.showLoading = true;
    return new Promise((resolve, reject) => {
      let fileName = "";
      if (fileToFtp) {
        const formdata: FormData = new FormData();
        formdata.append('file', fileToFtp);
        this.dataServ.ftpuploadFile(formdata).then((response: any) => {
          if (response && response.errorCode == 0) {
            fileName = response.fileName;
            resolve(fileName);
            this.savedFileName = fileName;
            this.disableSubmit = false;
            this.showLoading = false;
          }
          else {
            this.savedFileName = null;
            this.dis = [];
            this.notification.error(response.errorMsg, '');
            this.showLoading = false;
          }
        });
      } else {
        this.showLoading = false;
      }
    });
  }

  reset() {
    this.savedFileName = null;
    this.fileToUpload = null;
    this.fileDetails = [];
    this.fileDetails = false;
    this.disableSubmit = true;
    this.dis = [];
  }

  // downloadSampleExl(){

  //   // let Heading = [['Fixed asset number', 'Acquisition date', 'Acquisition price','Asset condition','Asset Assigned','Asset Available','Asset Sticker',
  //   // 'Assigned Emp Code','Assigned User','Auditor Comment','Department','Discription','Location','Make','Model',
  //   // 'Name','Old asset number','Physical Location','Responsible Name','Responsible Code','Serial number','Type']];
  //   let Heading = [['Fixed asset number','Old asset number','Name','Asset Name','Posting layer','Type','Location','Physical Location','Responsible',
  //   'Assigned User','Responsible Emp Code','Assigned Emp Code','Department','Asset condition','Discription','Make','Model','Serial number','Vendor Name',
  //   'Invoice No. & Date','Acquisition date','Purchase order','Status','Insurance date 1','Insurance date 2','Insurance vendor','Insured at fair market value',
  //   'Insured value','Main fixed asset','Policy amount','Policy expiration date','Policy number','Barcode Last printed date']]
  //   //Had to create a new workbook and then add the header
  //   const wb = XLSX.utils.book_new();
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  //   XLSX.utils.sheet_add_aoa(ws, Heading);

  //   //Starting in the second row to avoid overriding and skipping headers
  //   // XLSX.utils.sheet_add_json(ws, arr, { origin: 'A2', skipHeader: true });

  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   XLSX.writeFile(wb, 'Upload_Sample_Template.xlsx');

  // }



}
