
import { NgModule } from '@angular/core';
import { ACManagementComponent } from './acmanagement/acmanagement.component';
import { SharedModule } from 'shared';

@NgModule({
  imports: [  
    SharedModule      
  ],
  exports: [  
    ACManagementComponent        
  ],
  declarations: [
    ACManagementComponent
  ],
  providers: [    
  ],
  entryComponents: [
  ],
  bootstrap: [ACManagementComponent],
})

export class AcOpeningShared { }
