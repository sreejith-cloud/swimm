import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WorkspaceService } from 'shared';
@Injectable({
  providedIn: 'root'
})
export class CollectionrequestsService {
  collectionReqDetail = new BehaviorSubject<any>(1);
  constructor(
    private wsServ: WorkspaceService
  ) { 
    this.collectionReqDetail.next([]); //array used to pass client details
  }
  /**
   * viewCollectionServ function will invoke the collection requests module
   */
  viewCollectionServ(){ 
    //debugger
    let workspaceData = this.wsServ.workspaces;
    let approveTab: boolean = false
    var approveIndex
    for (let i = 0; i < this.wsServ.workspaces.length; i++) {
      if ((workspaceData[i]['type']) == "Collectionrqst") {
        approveTab = true
        approveIndex = i;
      }
    }
    if (approveTab) {
      this.wsServ.removeWorkspace(approveIndex);
      setTimeout(() => {
        this.wsServ.createWorkspace("Collectionrqst");
      }, 200);
    }
    else {
      setTimeout(() => {
        this.wsServ.createWorkspace("Collectionrqst");
      }, 200);
    }
  }

}
