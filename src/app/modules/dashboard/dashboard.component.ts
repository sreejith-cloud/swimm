import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';

import { AppConfig } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce, flip, fadeInDown, fadeInLeft, fadeInRight, zoomIn, fadeIn } from 'ng-animate';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceService } from 'shared';
import { findIndex } from 'rxjs-compat/operator/findIndex';
import { DashboardService } from './dashboard.service';
import { Subscription } from 'rxjs';


export interface SquareOffReportForm {
  tranDate: Date;
  clientCode: string;
}

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  animations: [
    trigger('fade', [transition(':enter', useAnimation(fadeIn, {
      params: { timing: 1, delay: 0 }
    }))]),
    trigger('fadeRight', [transition(':enter', useAnimation(fadeInRight, {
      params: { timing: 1, delay: 0 }
    }))]),
    trigger('fadeLeft', [transition(':enter', useAnimation(fadeInLeft, {
      params: { timing: 1, delay: 0 }
    }))]),
    trigger('fadeDown', [transition(':enter', useAnimation(fadeInDown, {
      params: { timing: 1, delay: 0 }
    }))]),
    trigger("zooming", [transition(':enter', useAnimation(zoomIn, {
      params: { timing: 2, delay: 0 }
    }))])
  ],
})

export class DashboardComponent implements OnInit {

  model: SquareOffReportForm;
  clientList: any[] = [];
  reportHtml: string;

  currentUser: User;
  isProcessing: boolean;
  error: string;
  isExpandedPreview: boolean = false;
  totalData: any=[];
  newData: any[];
  color: string;
  queryParams: any;
  paramsSubscription: Subscription;

  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private activeRoute: ActivatedRoute,
    private wsServ: WorkspaceService,
    private dashboardServ: DashboardService
  ) {
    this.model = <SquareOffReportForm>{

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getQueryParams();
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
      [{
        Project: 'crd',
        User: this.currentUser.userCode
      }],
      "requestId": "5042",
      "outTblCount": "0"
    }).then((response) => {
      this.isProcessing = false;
      if (response.results.length) {
      this.totalData=response.results
      // let dashboardData=this.totalData[1]
      let counter=0;
      // console.log(this.totalData)
        this.newData= []
        for(var j=0;j<this.totalData.length;j++){
          let dsData=[];
          let type=this.totalData[j][0].Type;
            var obj = [];        
           for(var i=0;i<this.totalData[j].length;i++){        
             this.totalData[j][i]['color']=this.getRandomColor()                
            if(type==this.totalData[j][i].Type){   
             this.totalData[j][i]['color']=this.getRandomColor()                
              obj.push(this.totalData[j][i])
            }
            else{
              dsData.push(obj);
              obj = [];
              obj.push(this.totalData[j][i]);
              this.totalData[j][i]['color']=this.getRandomColor()                
              type=this.totalData[j][i].Type;
            }
          }
          dsData.push(obj)
          let newArr=[]
          let dataArr=[]
          let rowType=dsData[0][0].Row_type
          for(let k=0;k<dsData.length;k++){
              if(dsData[k][0].Row_type==rowType){
                newArr.push(dsData[k])
              }
              else{
                rowType=dsData[k][0].Row_type
                dataArr.push(newArr)
                newArr=[]
                newArr.push(dsData[k])
              }
          }
          if(newArr.length){
          dataArr.push(newArr)
          }
          this.newData.push(dataArr)
          dataArr=[]
    }
    this.totalData=this.newData;
  }
  })  
  }

  ngOnDestroy() {
    if(this.paramsSubscription){
      this.paramsSubscription.unsubscribe();
    }
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    let col = '#' + ('000000' + color).slice(-6);
    return col

  }

  getQueryParams(){
    this.activeRoute.queryParams
      .subscribe((params) => this.queryParams = params);

    if (this.queryParams && this.queryParams.clientnetid){
      let ws= this.wsServ.workspaces
      let foundIndex = ws.findIndex((wo: any) => wo.type === 'crf');
      if(foundIndex){
        this.wsServ.removeWorkspace(foundIndex);
      }
      this.dashboardServ.setClientNetID(this.queryParams.clientnetid)
      this.wsServ.createWorkspace("crf");
    }
  }
}
