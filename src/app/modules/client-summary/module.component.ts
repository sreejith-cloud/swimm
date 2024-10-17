import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';

import { AppConfig } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';

@Component({
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.less'],
  // animations: [bounceInOutAnimation]
})

export class ModuleComponent implements OnInit {

  currentUser: User;
  isProcessing: boolean;
  error: string;

  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notification: NzNotificationService
  ) {
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
  }

  fillClientDetails() {
    this.error = "";
    this.isProcessing = true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "usercode": 'GIT',
          "Password": "tiger1234"
        }],
      "requestId": "1",
      "outTblCount": "0"
    }).then((response) => {
      this.isProcessing = false;
      if (response && response.results) {
      }
    })
  }

}
