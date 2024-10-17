import { Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy, Input, SimpleChanges,Renderer2 } from '@angular/core';
import { CdkPortal, DomPortalHost } from '@angular/cdk/portal';
import { DataService } from 'shared';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'crf-app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.less']
})
export class ImagePreviewComponent implements OnInit {
  @Input() imageData: any;
  @Input() source: any;
  @Input() acccode: any;
  // STEP 1: get a reference to the portal
  @ViewChild(CdkPortal) portal: CdkPortal;


  file1: any;
  file2: any;
  // STEP 2: save a reference to the window so we can close it
  private externalWindow = null;
  PreviewImgData: any = [];
  baseimage: any;
  Signature: any;
  rotationAngle: any = 0
  proofData: any;
  // STEP 3: Inject all the required dependencies for a PortalHost
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private dataServ: DataService, public sanitizer: DomSanitizer,
    private applicationRef: ApplicationRef,
    private injector: Injector,
    private reneder :Renderer2) { }
  ngOnInit() {

    // STEP 4: create an external window
    // var button=this.reneder.createElement('button')
    //     button.value="Click Me"
    //     this.externalWindow = window.open('', 'Test', 'width=800,height=600,left=200,top=200');
    //     this.externalWindow.reneder.getElementsByTagName('body')[0].appendChild(button);
    //     this.externalWindow.reneder.listen(button, 'click', () => {
    //       this.test('Hello')
    //     });
  }
  // test(val)
  // {
  //   alert(val)
  // }

  ngOnChanges(changes: SimpleChanges) {
    
    this.PreviewImgData = this.imageData
    this.openWindowonClick()
    return
    // if (this.PreviewImgData) {
    //   
    //   if (this.source == 'Proof') {
    //     var test = 'data:' + this.PreviewImgData.Doctype + ';base64,' + this.PreviewImgData.Docdoc
    //     console.log(test);
    //     var _frame = document.createElement('iframe');
    //     _frame.src = test
    //     _frame.id = "preview"
    //     _frame.style.width = "100%";
    //     _frame.style.height = "100%";
    //     this.externalWindow = window.open('', 'Test', 'width=800,height=600,left=200,top=200');
    //     this.externalWindow.document.getElementsByTagName('body')[0].appendChild(_frame);
    //     /////////////////////////////////////////////////////
    //     var div = document.createElement('div')
    //     div.innerHTML='<button onClick=OnRotation("C")>Click Me</button>';
    //     var page = document.createDocumentFragment();
    //     page.appendChild(_frame)
    //     page.appendChild(div)
    //     this.externalWindow.document.getElementsByTagName('body')[0].appendChild(page);
    //   }
    //   else {
    //     this.openWindowonClick()
    //   }
    // }
  }

  swapDocument() {

  }
  ngOnDestroy() {
    // STEP 7: close the window when this component destroyed
    this.externalWindow.close()
  }
  openWindowonClick() {

    if (this.externalWindow != null) {
      this.externalWindow.close();
    }
    if (this.source == '' || this.source == undefined) {
      return
    }
    
   
    if (this.source == 'Signature') {
      this.Signature = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + this.PreviewImgData.Docdoc);
      this.externalWindow = window.open('', '_blank', 'width=800,height=600,left=200,top=200');
    }
    if (this.source == 'Proof') {
      this.proofData = this.sanitizer.bypassSecurityTrustResourceUrl('data:' + this.PreviewImgData.Doctype + ';base64,' + this.PreviewImgData.Docdoc);
      this.externalWindow = window.open('', '_blank', 'width=800,height=600,left=200,top=200');
    
    }
    if (this.source == 'Address') {
      this.externalWindow = window.open('', '_blank', 'width=800,height=600,left=200,top=200');
    }
    if (this.source == 'HOMod') {
      this.externalWindow = window.open('', '_blank', 'width=1200,height=300,left=120,top=120');
    }
    var host = new DomPortalHost(
      this.externalWindow.document.body,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector
    );
      // STEP 6: Attach the portal
      host.attach(this.portal);
  }

  OnRotation(direction) {
    var frame = this.externalWindow.document.getElementById('Rotate');
    if (direction == 'C') {
      this.rotationAngle +=90
      frame.style.transform ="rotate("+this.rotationAngle+"deg)";
      frame.style.width ="100%";
      frame.style.height ="100%";

    
      // get element and add 90 degree  clockwise rotation
    }
    if (direction == 'A') {
      this.rotationAngle -= 90
      if (this.rotationAngle == -360)
        this.rotationAngle = 0
        frame.style.transform = "rotate("+this.rotationAngle+"deg)";
        frame.style.width ="100%";
        frame.style.height ="100%";
      //getelement and 90degree anticlockwise rotation
    }

  }
}

