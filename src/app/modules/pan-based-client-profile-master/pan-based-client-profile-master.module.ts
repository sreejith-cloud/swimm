import { NgModule } from '@angular/core';
import { PanBasedClientProfileMasterComponent } from './pan-based-client-profile-master.component';
import { SharedModule } from 'shared';

@NgModule({
  declarations: [PanBasedClientProfileMasterComponent],
  imports: [
    SharedModule
  ],
  bootstrap:[PanBasedClientProfileMasterComponent]
})
export class PanBasedClientProfileMasterModule { }
