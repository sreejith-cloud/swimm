import { Component, OnInit } from '@angular/core';
import { PhysicalActivationkitService } from '../../physical-activation-kit-upload/physical-activationkit.service';
import { FormHandlerComponent, DataService, FindOptions,User,UtilService, WorkspaceService} from 'shared';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-physical-activation-image-view',
  templateUrl: './physical-activation-image-view.component.html',
  styleUrls: ['./physical-activation-image-view.component.css']
})
export class PhysicalActivationImageViewComponent implements OnInit {
  uploadedDocumentsList: any;
  tradeCode: any;
  loc: any;
  selectedDocument: any;
  selectedDocuments:any=[];
  checkboxSelected: boolean;
  isSpining: boolean;
  textMessage: string;
  isData: boolean =false;
  dpid: any;
  id: any;
  DpAcno: any;

  constructor(private dataServ: DataService,
    private paKitServ:PhysicalActivationkitService,
    private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.getUploadedImage()
  }

  getUploadedImage(){
    this.paKitServ.tradeCode.subscribe((items) => {
      this.tradeCode = items;

    })
    this.paKitServ.loc.subscribe((items) => {
      this.loc = items;

    })
    this.paKitServ.dpid.subscribe((items)=>{
      this.dpid = items
    })
    this.paKitServ.id.subscribe((items)=>{
      this.DpAcno = items
    })
        this.isSpining =true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Loc:this.loc?this.loc:'',
          tradeCode:this.tradeCode?this.tradeCode:'',
          DPId:this.dpid?this.dpid:'',
          DPAcno:this.DpAcno?this.DpAcno:''
                   
        }],
      "requestId": "33902",
      "outTblCount": "0"
    })
      .then((response) => {
        this.isSpining =false;

      if(response && response[0].rows.length>0)
      {
        this.isData = true;
        this.uploadedDocumentsList = response ? response[0].rows:[]

        this.uploadedDocumentsList.forEach(element => {
          element[5]=element[5].replace(/\n/g, '');
          element[5] = element[5].replace(/[;,:|\\]/g, ''); 
          // element[8] = (element[8]=='pdf'|| element[8]=='PDF')? 'application/pdf': 'image/'+element[8]
          // if(element[8] = 'application/pdf' ){
          //   console.log(element[8])
          // }
        });
  
        }
      else{
        this.isData=false;
        this.textMessage ='No record found'
      }     
     })
  }

  onCheckboxChange(image: any, index: number) {
    console.log(image.selected,index)
    if(image.selected){
    this.selectedDocuments.push(image)
    }
    else {
      const indexToRemove = this.selectedDocuments.findIndex(item =>item[0] === image[0]);
      console.log(indexToRemove)
      if (indexToRemove != -1) {
        this.selectedDocuments.splice(indexToRemove, 1);
      }
    }
    console.log(this.selectedDocuments)
    this.selectedDocuments.forEach((element,index) => {
      console.log(index)
    });
    if(this.selectedDocuments.length>0){
      this.checkboxSelected = true
    }
    else{
      this.checkboxSelected = false
    }
    

  }
}
