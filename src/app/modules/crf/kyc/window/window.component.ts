
import { Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { CdkPortal, DomPortalHost } from '@angular/cdk/portal';
import { DataService } from 'shared';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';

/**
 * This component template wrap the projected content
 * with a 'cdkPortal'.
 */

@Component({
  selector: 'window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css'],
})
export class WindowComponent implements OnInit, OnDestroy {
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

    // STEP 4: create an external window
  }

  ngOnChanges(changes: SimpleChanges) {
    this.PreviewImgData = this.imageData
    if (this.PreviewImgData.length > 0) {
      this.openWindowonClick()
      this.PreviewImgData.forEach(element => {
        element.DocImage = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + element.DocImage);
      });

    }
    else if (this.externalWindow != null) {
      this.externalWindow.close();
    }
  }
  checkedValidation() {
    let count = 0;

    for (var i = 0; i <= this.PreviewImgData.length; i++) {
      if (this.PreviewImgData[i].checked == false) {
        if (this.file1 == this.PreviewImgData[i].DocumentName) {
          this.file1 = null
        }
        if (this.file2 == this.PreviewImgData[i].DocumentName) {
          this.file2 = null
        }
      }


      if (this.PreviewImgData[i].checked == true) {
        count = count + 1;
        if (this.file1 == null) {
          if (this.file2 != this.PreviewImgData[i].DocumentName) {
            this.file1 = this.PreviewImgData[i].DocumentName
          }
        }
        else if (this.file2 == null) {
          if (this.file1 != this.PreviewImgData[i].DocumentName) {
            this.file2 = this.PreviewImgData[i].DocumentName;
          }
        }
      }
      if (count > 1) {
        this.PreviewImgData.forEach(element => {
          if (element.checked == false) {
            element.disable = true
          }
        });
      }
      else {
        this.PreviewImgData.forEach(element => {
          element.disable = false
        });
      }


    }


  }
  swapDocument() {

  }
  ngOnDestroy() {
    // STEP 7: close the window when this component destroyed
    this.externalWindow.close()
  }
  openWindowonClick() {
    setTimeout(() => {
      if (this.externalWindow != null) {
        this.externalWindow.close();
      }
      this.externalWindow = window.open('', '', 'width=800,height=600,left=200,top=200');
      var host = new DomPortalHost(
        this.externalWindow.document.body,
        this.componentFactoryResolver,
        this.applicationRef,
        this.injector
      );

      // STEP 6: Attach the portal
      host.attach(this.portal);
    }, 300);
  }

}