import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionrequestsComponent } from './collectionrequests.component';
import { SharedModule } from 'shared';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    CollectionrequestsComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ],
  bootstrap: [CollectionrequestsComponent],
})
export class CollectionrequestsModule { }
