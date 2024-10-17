import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistWindowComponent } from './assist-window.component';
import { SharedModule } from 'shared';

@NgModule({
  imports: [  
    SharedModule      
  ],
  exports: [  
    AssistWindowComponent ,        
  ],
  declarations: [
    AssistWindowComponent,
  ],
  providers: [    
  ],
  entryComponents: [
  ],
  bootstrap: [AssistWindowComponent],
})
export class AssistWindowModule { }
