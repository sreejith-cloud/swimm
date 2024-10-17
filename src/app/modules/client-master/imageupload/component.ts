import { Component, OnInit, AfterViewInit, NgZone, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';

import { ClientMasterService } from '../client-master.service';
import { DataService, UtilService, AuthService, User, WorkspaceService } from 'shared';
import * as  jsonxml from 'jsontoxml'
import { NzNotificationService } from 'ng-zorro-antd';
import { UploadFile } from 'ng-zorro-antd/upload';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'client-master-imageupload',
  templateUrl: './component.html',
  styleUrls: ['./component.less']
})


export class ImageuploadComponent implements OnInit, AfterViewInit {
  @ViewChild('video') videoElement: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  videoWidth = 0;
  videoHeight = 0;
  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };



  ImgTypeData: any
  clientSerialNumber: number;
  HolderDetails: any;
  ImgTypeDatalist = [];
  Imglist: any;
  SupportFiles = [];
  currentUser: User;
  ho: boolean;
  fileName: any;
  fileType: any;
  document: any;
  fileList: any = [];
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  index: number = -1;
  showPortal5: boolean;
  previewImageData5: any = false;
  EntryAccess: boolean = true;
  currTabIndex: number;
  wsKey: string;
  clientProfileEdit: boolean = false;
  autosaveTiming: any = 60000;
  spin: boolean;
  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private ngZone: NgZone,
    private modalService: NzModalService,
    private utilServ: UtilService,
    private cmServ: ClientMasterService,
    private notif: NzNotificationService,
    private wsServ: WorkspaceService,
    private renderer: Renderer2
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
      let branch = this.dataServ.branch
      // if(this.EntryAccess==false){
      //   this.ho=true;
      // }
      // else
      // this.ho=false;
    })
  }

  ngOnInit() {
    this.cmServ.isEntryAccess.subscribe((val) => {
      this.EntryAccess = val
    })
    this.cmServ.lastActivateTabIndex.subscribe(val => {
      this.currTabIndex = val;
    })
    this.cmServ.autoSaveTiming.subscribe(val => {
      this.autosaveTiming = val
    })
    this.wsServ.activeWorkspace.subscribe((ws) => {
      this.wsKey = ws.title
      if (this.wsKey == 'Client Profile Edit') {
        this.clientProfileEdit = true
      }
      else {
        this.clientProfileEdit = false
      }
    })

    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val
    })
    this.cmServ.hoderDetails.subscribe((val) => {
      if (val != undefined) {
        if (Object.keys(val).length === 0) {
          return
        }
        else {
          this.HolderDetails = val
          this.getimagedata()

        }
      }
    })

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray": [
        { Euser: '' }
      ],
      "requestId": "5097",
      "outTblCount": "0"
    }).then((response) => {
      if (response.results) {
        console.log(response.results)
        this.ImgTypeDatalist = response.results[0]
      }
    })
  }
  getimagedata() {
    // this.showPortal3 = true;
    // this.previewImageData3={
    //   ImageFrom: 'IMAGE UPLOAD',
    //   PAN: this.HolderDetails["FirstHolderpanNumber"]
    // }

    this.spin = true;

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientSerialNo: this.clientSerialNumber,
          PAN: this.HolderDetails["FirstHolderpanNumber"],
          Euser: this.currentUser.userCode,
          ImageFrom: 'IMAGE UPLOAD'
        }],
      "requestId": "6002",
      "outTblCount": "0"
    }).then((response) => {

      if (response.results) {
        this.spin = false;
        console.log(response.results)
        if (response.results[0].length > 0) {
          this.SupportFiles = response.results[0]
          this.SupportFiles.forEach(element => {
            element.Docname = element.DocumentName
            element.Docdoc = element.DocImage
            element.Doctype = "image/jpeg"
            element.Docsize = element.FileSize

          })
        }
        else {
          this.spin = false
        }
      }
      else {
        this.spin = false
      }
    })
  }


  beforeUpload = (file: UploadFile): boolean => {
    if (file.type == 'application/pdf' || file.type == 'image/jpeg' || file.type == 'image/png') {
      this.encodeImageFileAsURL(file);
      return false;
    } else {
      this.notif.error("Please uplaod jpeg/png/pdf", '')
      return false
    }
  }
  encodeImageFileAsURL(file) {

    let reader = new FileReader();
    reader.onloadend = () => {

      let dataUrl: string = reader.result.toString();
      let document = dataUrl.split(',')[1];

      this.Imglist = {
        Docname: this.ImgTypeData,
        Docfile: file.name,
        Doctype: file.type,
        Docuid: file.uid,
        Docsize: file.size,
        Docdoc: document,

      }
      console.log()
      for (var i = 0; i < this.SupportFiles.length; i++) {
        if (this.SupportFiles[i].Docname == this.ImgTypeData) {
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
          this.ImgTypeData = null;
        }

      }, 300);

    }
    reader.readAsDataURL(file);

  }

  // continueNext() {
  //   this.cmServ.activeTabIndex.next(1);
  // }
  showModal(data) {
    this.filePreiewContent = data.Docdoc
    this.filePreiewFilename = data.Docname
    this.filePreiewContentType = data.Doctype
    this.filePreiewVisible = true;
  }
  save(SupportFiles?) {

    if (this.EntryAccess == false || this.clientProfileEdit) {
      this.cmServ.activeTabIndex.next(7);
      this.cmServ.trigerRejection.next(true)
      return
    }

    if (this.SupportFiles.length == 0) {
      this.notif.error("Please Upload Images", '')
      return
    }
    let samplearay = [];
    SupportFiles.forEach(element => {
      var datas = {
        docname: element.Docname,
        url: element.Docdoc,
        size: element.Docsize,
        type: element.Doctype,

      }
      samplearay.push(datas)
    });

    this.spin = true;
    var JSONData = this.utilServ.setJSONArray(samplearay);
    var xmlData = jsonxml(JSONData);
    let val;


    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{

          Pan: this.HolderDetails["FirstHolderpanNumber"] ? this.HolderDetails["FirstHolderpanNumber"] : '',
          Euser: this.currentUser.userCode,
          ACCXML_ImageDetails: xmlData ? xmlData : '',
          ImageFrom: 'IMAGE UPLOAD',
          ClientSerialNo: this.clientSerialNumber,
          Flag: this.clientProfileEdit ? 'P' : 'A'
        }],
      "requestId": "5098",
      "outTblCount": "0"
    }).then((response) => {
      let data = this.utilServ.convertToObject(response[0]);
      let msg = data[0];
      if (msg.ErrorCode == 0) {
        this.notif.success(data[0].Msg, '')
        this.cmServ.activeTabIndex.next(7);
        this.cmServ.trigerRejection.next(true)
        this.spin = false;
      }
      else {
        this.notif.error(data[0].Msg, '')
        this.spin = false;
      }
    })

  }
  Deleterow(d, i) {
    this.SupportFiles.splice(i, 1)
  }

  ngAfterViewInit() { }

  //   ngAfterViewInit() {
  //     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //       navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
  //   }
  //   }
  //   startCamera() {
  //     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //         navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
  //     }
  // }

  // attachVideo(stream) {
  //     this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
  //     this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
  //         this.videoHeight = this.videoElement.nativeElement.videoHeight;
  //         this.videoWidth = this.videoElement.nativeElement.videoWidth;
  //     });
  // }

  // capture() {
  //     this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
  //     this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
  //     this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
  // }

  // handleError(error) {
  //     console.log('Error: ', error);
  // }
  // @HostListener('window:keydown',['$event'])
  // onKeyPress($event: KeyboardEvent) {
  //     // if($event.altKey && $event.key === 's')
  //     //    this.saveToTemprary()
  //   if(this.currTabIndex==6){
  //     if($event.ctrlKey  && $event.key === 's'){
  //        $event.preventDefault();
  //        $event.stopPropagation();
  //        this.save()
  //     }
  //   }
  // }
}
