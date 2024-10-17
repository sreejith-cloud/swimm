
import { Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { CdkPortal, DomPortalHost } from '@angular/cdk/portal';
import { DataService, User, AuthService } from 'shared';
import { ClientMasterService } from '../client-master.service'
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd';

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
  currentUser: User;
  file1: any;
  file2: any;
  // STEP 2: save a reference to the window so we can close it
  private externalWindow = null;
  PreviewImgData: any = [];
  clientSerialNumber: any;
  branch: string;
  isLoading: boolean = false
  TabandPandetails: any;
  spin: boolean=false;
  // STEP 3: Inject all the required dependencies for a PortalHost
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private dataServ: DataService, public sanitizer: DomSanitizer,
    private applicationRef: ApplicationRef, private cmServ: ClientMasterService, private notif: NzNotificationService,
    private authServ: AuthService,
    private injector: Injector) { }


  ngOnInit() {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
      this.branch = this.dataServ.branch
    })
    this.cmServ.clientSerialNumber.subscribe(val => {
      this.clientSerialNumber = val

    })
    // STEP 4: create an external window
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    this.TabandPandetails = this.imageData
    // this.PreviewImgData = this.imageData

    if(Object.keys(this.TabandPandetails).length==0){
      if (this.externalWindow != null) {
        this.externalWindow.close();
      }
      return
    }
setTimeout(() => {
  this.getImageData(this.imageData)
  },100);

    if (this.PreviewImgData.length > 0) {
      // this.openWindowonClick()
      // this.PreviewImgData.forEach(element => {
      //   element.DocImage = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + element.DocImage);
      // });

    }
    // else if (this.externalWindow != null) {
    //   this.externalWindow.close();
    // }
  }
  getImageData(details,flag?){
    this.spin=true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientSerialNo: this.clientSerialNumber,
          PAN: details.PAN,
          Euser: this.currentUser.userCode,
          ImageFrom: details.ImageFrom
        }],
      "requestId": "6002",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        if (response.results) {
          if (response.results[0].length > 0) {
            // this.showPortal = true;
            this.PreviewImgData = response.results[0]
            this.spin=false;
            if (this.PreviewImgData.length > 0) {
              // if (this.externalWindow != null) {
              //   this.externalWindow.close();
              // }
              if(flag!='fetch')
              this.openWindowonClick()
              this.PreviewImgData.forEach(element => {
                element.DocImage = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + element.DocImage);
              });

            }

          }
          else{
            this.notif.warning('No documents found', '')
            this.spin=false;
          }
        }
       
      }
      else {
        this.spin=false;
        this.notif.error(response.errorMsg, '')
      }

    })
  }
  checkedValidation() {
    let count = 0;
     
    for (var i = 0; i <= this.PreviewImgData.length - 1; i++) {
      let ss = this.PreviewImgData[i].checked;
      if (this.PreviewImgData[i].checked == false) {
        if (this.file1 == this.PreviewImgData[i].DocumentName) {
          this.file1 = null
        }
        if (this.file2 == this.PreviewImgData[i].DocumentName) {
          this.file2 = null
        }
      }
      if (this.PreviewImgData[i].checked == true) {
        let sfs = this.PreviewImgData[i].checked;

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
    if (this.file1 == null) {
      this.notif.error("Please select File1", '', { nzDuration: 30000 })
      return
    }
    if (this.file2 == null) {
      this.notif.error("Please select File2", '', { nzDuration: 30000 })
      return
    }
    this.isLoading = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ClientSerialNo: this.clientSerialNumber,
          FromImage: this.file1,
          ToImage: this.file2,
          Euser: this.currentUser.userCode
        }],
      "requestId": "5033",
      "outTblCount": "0"
    }).then((response) => {
      if (response.errorCode == 0) {
        let details = response.results[0][0]
        if (details.ErrorCode == 0) {
          this.notif.success(details.Msg, '', { nzDuration: 30000 });
          this.getImageData(this.TabandPandetails,'fetch')
          this.file1 = null;
          this.file2 = null;
          this.PreviewImgData.forEach(element => {
            element.checked = false
            element.disable = false

          });
          this.isLoading = false;

        }
        else {
          this.notif.error(details.Msg, '', { nzDuration: 30000 })
          this.isLoading = false;

        }
      } else {
        this.notif.error(response.errorMsg, '')
        this.isLoading = false;

      }

    })
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