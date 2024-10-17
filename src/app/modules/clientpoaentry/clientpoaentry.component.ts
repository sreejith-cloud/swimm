import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { getDate } from "date-fns";
import { NzNotificationService, UploadFile } from "ng-zorro-antd";
import { FindOptions, DataService, AuthService, UtilService } from "shared";
import { User } from "shared/lib/models/user";
import * as jsonxml from "jsontoxml";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Console, log } from "console";

@Component({
  selector: "app-clientpoaentry",
  templateUrl: "./clientpoaentry.component.html",
  styleUrls: ["./clientpoaentry.component.less"],
})
export class ClientpoaentryComponent implements OnInit {
  @ViewChild("inputBox") _el: ElementRef;
  locationFindopt: FindOptions;
  TradecodeFindopt: FindOptions;
  dpClientIdFindopt: FindOptions;
  tgt_clientFindOption: FindOptions;
  location: any;
  Tradecode: any;
  dpClientDetails: any;
  dpclientid: any;
  dpid: any;
  DOCFile: any;
  filetype: any;
  filesize: any;
  filename: any;
  fileList: any = [];
  client: any;
  clientid: any;
  tradecode1: any;
  currentUser: User;
  isSpinning: boolean = false;
  clientdata: any;
  Img: any = {};
  imgkeys: any = [];
  ImageXML: any;
  isdisabled: boolean;
  DDPI_Pledge: boolean;
  DDPI_Transfer: boolean;
  DDPI_MFTransactions: boolean;
  DDPI_TenderingofShares: boolean;
  POA_Revocation: boolean;
  isSpinVisible: boolean = false;
  filePreiewContent: any;
  filePreiewContentType: any;
  filePreiewFilename: any;
  filePreiewVisible: boolean = false;
  rejectedremarkarray: any = [];
  enable: boolean = false;
  public isDisabled = true;

  fileList1: any = [];
  imgkeys1: any = [];
  Img1: any = {};
  ddpiDisabled: boolean = false


  constructor(
    private notification: NzNotificationService,
    private dataserv: DataService,
    private authServ: AuthService,
    private utilServ: UtilService
  ) {
    this.TradecodeFindopt = {
      findType: 6180,
      codeColumn: "Tradecode",
      codeLabel: "",
      descColumn: "",
      descLabel: "",
      hasDescInput: false,
      requestId: 8,
      whereClause: "1=1",
    };

    this.authServ.getUser().subscribe((user) => {
      this.currentUser = user;
    });
  }
  setFocus() {
    this._el.nativeElement.focus();
  }
  ngAfterViewInit() {
    this._el.nativeElement.focus();
  }

  ngOnInit() {
    this.getRejectedRemarks();
  }

  getRejectedRemarks() {
    this.dataserv
      .getResultArray({
        batchStatus: "false",
        detailArray: [
          {
            Euser: this.currentUser ? this.currentUser.userCode : "",
            type: "POA",
          },
        ],
        requestId: "7289",
        outTblCount: "0",
      })
      .then((response) => {
        this.rejectedremarkarray = response.results[0];
      });
  }

  beforeUploadPhoto = (file: UploadFile): boolean => {
    const isLt2M = file.size / 1024 / 1024 < 11;
    if (!isLt2M) {
      this.notification.error("File Size must be less than 10MB!", "");
      return false;
    } else {
      if (
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png" ||
        file.type == "application/pdf"
      ) {
        this.fileList = [file];

        this.encodeImageFileAsURL(file);
        return true;
      } else {
        this.notification.error("You can  upload Image or PDF file only!", "");
        return false;
      }
    }
  };

  beforeUpload = (file: UploadFile, fileList): boolean => {
    this.fileList = [file];
    if (
      file.type == "application/pdf" ||
      file.type == "image/jpeg" ||
      file.type == "image/png"
    ) {
      // const isLt2M = true
      const isLt2M = file.size / 1024 < 1536;
      if (!isLt2M) {
        this.notification.error("Image must smaller than 1.5MB!", "");
        return false;
      } else {
        this.encodeImageFileAsURL(file);
      }
    } else {
      this.notification.error("Please upload jpeg/png/pdf", "");
      return false;
    }
  };

  encodeImageFileAsURL(file) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(",")[1];
      this.Img = {
        Docname: "Dis",
        DocnameText: "DisImage",
        Docfile: file.name,
        Doctype: file.type,
        Docuid: file.uid,
        Docsize: file.size,
        Docdoc: document,
      };
      this.imgkeys = Object.keys(this.Img);
    };

    reader.readAsDataURL(file);
  }

  imagePreview() {
    this.filePreiewContent = this.Img.Docdoc;
    this.filePreiewContentType = this.Img.Doctype;
    this.filePreiewFilename = this.Img.Docname;
    this.filePreiewVisible = true;
  }


  // najad mod for poa revoction form upload

  beforeUpload1 = (file: UploadFile, fileList): boolean => {
    this.fileList1 = [file];
    if (
      file.type == "application/pdf" ||
      file.type == "image/jpeg" ||
      file.type == "image/png"
    ) {
      // const isLt2M = true
      const isLt2M = file.size / 1024 < 1536;
      if (!isLt2M) {
        this.notification.error("Image must smaller than 1.5MB!", "");
        return false;
      } else {
        this.encodeImageFileAsURL1(file);
      }
    } else {
      this.notification.error("Please uplaod jpeg/png/pdf", "");
      return false;
    }
  };

  encodeImageFileAsURL1(file) {
    let reader = new FileReader();
    reader.onloadend = () => {
      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(",")[1];
      this.Img1 = {
        Docname: "Dis",
        DocnameText: "DisImage",
        Docfile: file.name,
        Doctype: file.type,
        Docuid: file.uid,
        Docsize: file.size,
        Docdoc: document,
      };
      this.imgkeys1 = Object.keys(this.Img1);
    };

    reader.readAsDataURL(file);
  }

  imagePreview1() {
    this.filePreiewContent = this.Img1.Docdoc;
    this.filePreiewContentType = this.Img1.Doctype;
    this.filePreiewFilename = this.Img1.Docname;
    this.filePreiewVisible = true;
  }


  // end


  submit() {
    // debugger;
    this.dataserv
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            tradecode: this.tradecode1.Tradecode,
            loc: this.dataserv.branch,
            dpclientid: this.tradecode1.DpClientid,
          },
        ],
        requestId: "7281",
        outTblCount: "0",
      })
      .then((response) => {
        // console.log('response',response)
        if (response.length > 0) {
          if (response[0].rows[0][0] == "Error") {
            this.notification.error(response[0].rows[0][1], "");
            this.reset();
          } else {
            this.enable = true;
            this.clientdata = this.utilServ.convertToObject(response[0]);
            //  console.log(this.clientdata);
            // this.dpid =  this.clientdata[0].DPID;
            // this.dpclientid = this.clientdata[0].DpClientid;
            this.location = this.clientdata[0].Location;
            this.Tradecode = this.clientdata[0].Name;
            // this.DDPI_Pledge = this.clientdata[0].DDPI_Pledge;
            // this.DDPI_Transfer = this.clientdata[0].DDPI_Transfer;
            // this.DDPI_MFTransactions = this.clientdata[0].DDPI_MF;
            // this.DDPI_TenderingofShares = this.clientdata[0].DDPI_Tender;
            this.POA_Revocation = this.clientdata[0].POAsigned;
            // if(this.POA_Revocation==true){

            //   this.ddpiDisabled=true

            // }
            // else{
            //   this.ddpiDisabled=false
            // }


          }
        }
      });
  }

  // for select dpclient id

  click(item, index) {
    // debugger;
    console.log(item);
    this.dpclientid = item;
    // console.log(this.dpclientid);
   this.DDPI_Pledge = item.DDPI_Pledge;
   this.DDPI_Transfer =item.DDPI_Transfer;
   this.DDPI_MFTransactions = item.DDPI_MF;
   this.DDPI_TenderingofShares = item.DDPI_Tender;
  }

  save() {
    // debugger;

    if (!this.tradecode1) {
      this.notification.error("Please select a tradecode", "");
      return;
    }

    if (!this.dpclientid) {
      this.notification.error("Please select a Dp client id", "");
      return;
    }


    if (this.Img == "" || this.Img == undefined || this.imgkeys.length == 0) {
      this.notification.error("Please upload document", "");
      return;
    }

    var image = [];
    image.push({ image: this.Img });

    var ImageJsonjson = this.utilServ.setJSONMultipleArray(image);
    this.ImageXML = jsonxml(ImageJsonjson);
    this.isSpinVisible = true;
    this.dataserv
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {

            dpid: this.dpclientid.DPID,
            dpclientid: this.dpclientid.DpClientid,
            loc: this.dpclientid.Location,
            clientid: this.dpclientid.Clientid,
            euser: this.currentUser.userCode,
            FileData: this.ImageXML,
            DDPI_Pledge: this.DDPI_Pledge ? "Y" : "N",
            DDPI_Transfer: this.DDPI_Transfer ? "Y" : "N",
            DDPI_MFTransactions: this.DDPI_MFTransactions ? "Y" : "N",
            DDPI_TenderingofShares: this.DDPI_TenderingofShares ? "Y" : "N",
            POA_REVOCATION: this.POA_Revocation ? "Y" : "N",
          },
        ],
        requestId: "7279",
        outTblCount: "0",
      })
      .then((response) => {
        this.isSpinVisible = false;

        if (response.length > 0) {
          if (response[0].rows[0][0] == "Error") {
            this.notification.error(response[0].rows[0][1], "");
          }
          if (response[0].rows[0][0] == "Success") {
            this.notification.success(response[0].rows[0][1], "");
            this.reset();
          }
        }
      });
  }

  POARevocation() {

    if (this.Img1 == "" || this.Img1 == undefined || this.imgkeys1.length == 0) {
      this.notification.error("Please upload document", "");
      return;
    }

    var image = [];
    image.push({ image: this.Img1 });

    var ImageJsonjson = this.utilServ.setJSONMultipleArray(image);
    this.ImageXML = jsonxml(ImageJsonjson);
    this.isSpinVisible = true;
    this.dataserv
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {

            dpid: this.dpclientid.DPID,
            dpclientid: this.dpclientid.DpClientid,
            loc: this.dpclientid.Location,
            clientid: this.dpclientid.Clientid,
            euser: this.currentUser.userCode,
            FileData: this.ImageXML,
            DDPI_Pledge: this.DDPI_Pledge ? "Y" : "N",
            DDPI_Transfer: this.DDPI_Transfer ? "Y" : "N",
            DDPI_MFTransactions: this.DDPI_MFTransactions ? "Y" : "N",
            DDPI_TenderingofShares: this.DDPI_TenderingofShares ? "Y" : "N",
            POA_REVOCATION: this.POA_Revocation ? "Y" : "N",
          },
        ],
        requestId: "7279",
        outTblCount: "0",
      })
      .then((response) => {
        this.isSpinVisible = false;

        if (response.length > 0) {
          if (response[0].rows[0][0] == "Error") {
            this.notification.error(response[0].rows[0][1], "");
          }
          if (response[0].rows[0][0] == "Success") {
            this.notification.success(response[0].rows[0][1], "");
            this.reset();
          }
        }
      });



  }
  reset() {
    // debugger;
    this.dpid = null;
    this.dpclientid = null;
    this.location = "";
    this.Tradecode = "";
    this.tradecode1 = "";
    this.imgkeys = [];
    this.Img = {};
    this.fileList = "";
    this.DDPI_Pledge = false;
    this.DDPI_Transfer = false;
    this.DDPI_MFTransactions = false;
    this.DDPI_TenderingofShares = false;
    this.POA_Revocation = false;
    this.clientdata = [];
    this.enable = false;
    this.ddpiDisabled = false
    this.setFocus();
    this.ngAfterViewInit();

  }
}
