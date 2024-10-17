import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceService } from 'shared';
import { DocumentVerificationService } from './document-verification.service';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'app-document-verification-delphi',
  templateUrl: './document-verification-delphi.component.html',
  styleUrls: ['./document-verification-delphi.component.css']
})
export class DocumentVerificationDelphiComponent implements OnInit {

  checkOptionsOne = [
    { label: 'Select All', value: 'S', checked: true },
    { label: 'Clear All', value: 'C' },
  ];

  rotationAngle = 0; 

  queryParams: any;
  totalData: any = [];
  total: any = [];
  totdata: any;
  selecteddata: any;
  imgdata: any = [];
  imagesignature: any;
  proofArray: any = [];
  //checked: any;
  isSpinVisible: boolean = false;
  tabs: any = ['Document Verification'];
  tot: any = []
  encryptedData: any = ''
  zoomFactor: number=1;

  @ViewChild('pdfViewer') pdfViewer: ElementRef;
  pdfUrl: any;

  constructor(private activeRoute: ActivatedRoute,
    private wsServ: WorkspaceService,
    private docService: DocumentVerificationService,
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private notif: NzNotificationService,
    private zone: NgZone) { }

  ngOnInit() {
    this.getQueryParams();
  }

  getQueryParams() {
    this.activeRoute.queryParams
      .subscribe((params) => {
        this.queryParams = params
        if (this.queryParams) {
          this.Image();
        }
      });
  }

  checkChecked(data, event) {
    data.ischecked = event;
    this.proofArray.forEach((pf: any) => {
      if (pf.DocName === data.DocName) {
        !data.checked ? pf.visible = false : pf.visible = true
      }
    })
    if (event) {
      setTimeout(() => {
        this.scrollToSpecificElement(data.DocName);
      }, 300);
    }
  }

  handleError(event) {
    // console.log(event);
  }

  scrollToElement(docName: string) {
    const element = this.el.nativeElement.querySelector(`[data-doc-name="${docName}"]`);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  scrollToSpecificElement(docname: any) {
    const specificDocName = docname;
    this.scrollToElement(specificDocName);
  }

  Image() {
    this.isSpinVisible = true;
    this.docService.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          SerialNo: this.queryParams.SerialNo ? this.queryParams.SerialNo : '',
          DocView: this.queryParams.DocView ? this.queryParams.DocView : '',
          ScanImageId: ''
        }],
      "requestId": "10000181",
      "outTblCount": "0",
    }).then((response: any) => {
      this.isSpinVisible = false;
      if (response && response.errorCode == 0) {
        let data: any[] = response.results[0];
        let result2: any[] = response.results[1] ? response.results[1] : [];
        if (result2) {
          result2.map((res: any) => data.push(res))
        }
        data.forEach((pf: any) => {
          pf.visible = true;
          pf.checked = true;

          if ((pf.DocType === 'image/jpg') || (pf.DocType === 'image/bmp') || (pf.DocType === 'image/gif') || (pf.DocType === 'image/png')) {
            pf.img = (this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64,' + pf.DocImage));
          }

          if(pf.DocType === 'image/pdf'){          
            pf.pdfSrc = this.loadPDF(pf.DocImage) ? this.loadPDF(pf.DocImage) : ''
          }

          let firstFourLetters = this.getFirstFourLettersOfBase64Data(pf.DocImage);
          if (firstFourLetters === 'SUkq') {
            this.tifToImageConverter(pf.DocImage)
              .then(base64Data => {
                pf.img = (this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64,' + base64Data));
              })
              .catch(error => {
                console.error(error);
              });
          }
        })
        this.proofArray = data;
      } else {
        this.notif.error('Something Went Wrong! Please Try Again', '')
      }
    }, error => {
      this.isSpinVisible = false;
    })

  }

  clear() {
    this.proofArray.map((pf: any) => {
      pf.visible = false;
      pf.checked = false;
    })
  }

  selectAll () {
    this.proofArray.map((pf: any) => {
      pf.visible = true;
      pf.checked = true;
    })
  }

  getFirstFourLettersOfBase64Data(data: any) {
    if (data) {
      let firstFourLetters = data.substring(0, 4);
      return firstFourLetters;
    } else {
      return null
    }
  }

  tifToImageConverter(tifData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let date = new Date();
      let timeStamp = date.getTime()
      const data = {
        data: tifData,
        fileName: timeStamp + 'myTiff',
        type: "png",
      };

      this.docService.post(environment.tifToimageConvertion, data)
        .then((response: any) => {
          if (response && response.base64Data) {
            resolve(response.base64Data);
          } else {
            reject('No base64Data found in the response');
          }
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  }

  rotateImage(index: any, rotate: string) {
    const rotatableImage = document.getElementById('rotatableImage' +index);
    if(rotate === 'R'){
      this.rotationAngle += 90;
    }
    if (rotate === 'L'){
      this.rotationAngle -= 90;
    }
    rotatableImage.style.transform = `rotate(${this.rotationAngle}deg)`;
  } 

  zoomImage(index: any, action: string) {
    const zoomableImage = document.getElementById('rotatableImage' + index);

    if (action === 'in') {
      this.zoomFactor += 0.1; // Increase zoom factor
    } else if (action === 'out' && this.zoomFactor > 0.1) {
      this.zoomFactor -= 0.1; // Decrease zoom factor, ensuring it doesn't go below 0.1
    }

    zoomableImage.style.transform = `scale(${this.zoomFactor})`;
  }

  loadPDF(base64encString: any) {
    const binaryData = atob(base64encString);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    return this.pdfUrl;
  }

}
