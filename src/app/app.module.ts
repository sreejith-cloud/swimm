import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RootModule, SharedModule } from "shared";
import { DefaultLayoutComponent } from "shared";
import { AuthComponent } from "shared";
import { AuthGuard } from "shared";

import { RootComponent } from 'shared';
import { DefaultConfig } from 'shared/lib/models/default-config';
import { environment } from '../environments/environment';
import { WorkspaceEnum } from "./constants/workspace.enum";
import { DocumentVerificationDelphiComponent } from './document-verification-delphi/document-verification-delphi.component';

const routes: Routes = [
  {
    path: 'proof',
    component: DocumentVerificationDelphiComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: DefaultLayoutComponent,
    //  loadChildren: 'app/layout/default/default.module#DefaultLayoutModule',
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  }

];

const defaultConfig: DefaultConfig = {
  auth_app_url: environment.auth_app_url,
  api_base_url: environment.api_base_url,
  api_xlrds_url: environment.api_xlrds_url,
  app_version : environment.app_version,
  api_OTP_url:environment.api_OTP_url,
  projectImgUrl:'assets/img/crd.svg',
  project_id: 1002,
  default_db: 'db',
  project :'CRD'
  
}

@NgModule({
  declarations: [DocumentVerificationDelphiComponent],
  imports: [
    SharedModule,
    BrowserModule,
    RootModule.forRoot(defaultConfig, WorkspaceEnum),
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
