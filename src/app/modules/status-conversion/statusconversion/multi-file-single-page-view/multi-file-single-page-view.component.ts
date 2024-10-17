import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { StatusconversionService } from '../../statusconversion.service';

@Component({
  selector: 'app-multi-file-single-page-view',
  templateUrl: './multi-file-single-page-view.component.html',
  styleUrls: ['./multi-file-single-page-view.component.css']
})
export class MultiFileSinglePageViewComponent implements OnInit {

  isVisibleView: boolean = false;
  entries: any = [];
  documentDatas: any = [];
  document: any;
  myBase64: SafeResourceUrl;
  isSpining:boolean =false
  constructor(private statusConversionService : StatusconversionService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.statusConversionService.modalview.subscribe(value => {
      if (value) {
        this.isVisibleView = value
        this.documentDatas = this.statusConversionService.getDocumentsDatas();
        this.displayImage(this.documentDatas[0]['Docdoc'])
      } else {
        this.isVisibleView = value
      }
    })
  }

  handleCancelview(): void {
    this.statusConversionService.closemodalview()
    this.isVisibleView = false;
    this.entries = [];
  }

  displayImage(imgData: any){
    this.myBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:image/png;base64, ${imgData}`
    );
  }

}
