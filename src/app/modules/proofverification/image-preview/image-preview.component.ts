import { Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { CdkPortal, DomPortalHost } from '@angular/cdk/portal';
import { DataService } from 'shared';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.less']
})
export class ImagePreviewComponentVerification implements OnInit {
  @Input() imageData: any;
  // STEP 1: get a reference to the portal
  @ViewChild(CdkPortal) portal: CdkPortal;
  file1: any;
  file2: any;
  // STEP 2: save a reference to the window so we can close it
  private externalWindow = null;
  PreviewImgData: any = [];

  // STEP 3: Inject all the required dependencies for a PortalHost
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private dataServ: DataService, public sanitizer: DomSanitizer,
    private applicationRef: ApplicationRef,
    private injector: Injector) { }


  ngOnInit() {
    debugger

    // STEP 4: create an external window
  }

  ngOnChanges(changes: SimpleChanges) {
    debugger
    this.PreviewImgData = this.imageData
    var Imagedatakeys=Object.keys(this.PreviewImgData)
    if (Imagedatakeys.length>0) {
      debugger
      // this.openWindowonClick()
      // this.PreviewImgData["DocImage"]= this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,'+this.PreviewImgData.ImgData);

      if (this.PreviewImgData.ImgType && this.PreviewImgData.ImgType.includes('/')) {
        this.openWindowIframe()
      }
      else {
        this.OpenWindowImg()
      }
    }
    // else if (this.externalWindow != null) {
    //   this.externalWindow.close();
    // }
  }
  ngOnDestroy() {
    // STEP 7: close the window when this component destroyed
    this.externalWindow.close()
  }
  openWindowIframe() {
    // var test= 'data:image/jpeg;base64,'+this.PreviewImgData.ImgData
    var test = 'data:' + this.PreviewImgData.ImgType + ';base64,' + this.PreviewImgData.ImgData
    var _frame = document.createElement('iframe');
    _frame.src = test
    _frame.style.width = "100%";
    _frame.style.height = "100%";
    this.externalWindow = window.open('', '', 'width=800,height=600,left=200,top=200');
    this.externalWindow.document.getElementsByTagName('body')[0].appendChild(_frame);
  }
  OpenWindowImg() {
    var test = 'data:image/jpeg;base64,' + this.PreviewImgData.ImgData

    var _Img = document.createElement('img');
    _Img.src = test
    _Img.style.width = "100%";
    _Img.style.height = "100%";
    this.externalWindow = window.open('', '', 'width=800,height=600,left=200,top=200');
    this.externalWindow.document.getElementsByTagName('body')[0].appendChild(_Img);
  }
  openWindowonClick() {
    debugger

    if (this.externalWindow != null) {
      this.externalWindow.close();
    }

    this.externalWindow = window.open('', '', 'width=800,height=600,left=200,top=200');

    // STEP 5: create a PortalHost with the body of the new window document    
    var host = new DomPortalHost(
      this.externalWindow.document.body,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector
    );

    setTimeout(() => {

      // STEP 6: Attach the portal
      host.attach(this.portal);
    });
  }


}

