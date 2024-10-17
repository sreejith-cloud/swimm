import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd';

@Injectable()
export class ClientMasterService {
  isNRE: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  holderLength: ReplaySubject<number> = new ReplaySubject<number>(1);
  clientSerialNumber: ReplaySubject<number> = new ReplaySubject<number>(1);
  activeTabIndex: ReplaySubject<number> = new ReplaySubject<number>(2);
  tabSelection: ReplaySubject<number> = new ReplaySubject<number>(1);
  lastActivateTabIndex: ReplaySubject<number> = new ReplaySubject<number>(1);
  hoderDetails: ReplaySubject<any> = new ReplaySubject<any>(1);
  clientIdDetails: ReplaySubject<any> = new ReplaySubject<any>(1);
  hoder1PanDetails: ReplaySubject<any> = new ReplaySubject<any>(1);
  hoder2PanDetails: ReplaySubject<any> = new ReplaySubject<any>(1);
  hoder3PanDetails: ReplaySubject<any> = new ReplaySubject<any>(1);
  clientSubType: ReplaySubject<any> = new ReplaySubject<any>(1);
  clientType: ReplaySubject<string> = new ReplaySubject<string>(1);
  riskCountry: ReplaySubject<string> = new ReplaySubject<string>(1);
  trigerAcOpening = new BehaviorSubject(false);
  trigerKYC = new BehaviorSubject(false);
  trigerFinancial = new BehaviorSubject(false);
  trigerTrading = new BehaviorSubject(false);
  trigerDp = new BehaviorSubject(false);
  trigerScheme = new BehaviorSubject(false);
  trigerIU = new BehaviorSubject(false);
  trigerRejection = new BehaviorSubject(false);
  varifykarclicked = new BehaviorSubject(false);
  isIdentityProofLoaded = new BehaviorSubject(false);
  isClientProfileEdit = new BehaviorSubject(false);
  chooseAOF = new BehaviorSubject(false);
  chooseKRA = new BehaviorSubject(false);
  isServiceCallsAllow = new BehaviorSubject(false);
  disableKraFields = new BehaviorSubject(false);
  sameAsPermantAddress = new BehaviorSubject(false);
  finalize = new BehaviorSubject(false);
  // isEntryfinalised= new BehaviorSubject(false);
  isTotalProofDatafound = new BehaviorSubject(true);
  isCatholicSyrianBankChoosen = new BehaviorSubject(false);
  isAdditionalAddressGiven = new BehaviorSubject(false);
  isFOselected = new BehaviorSubject(false);
  isCOMselected = new BehaviorSubject(false);
  isTradingChoosen = new BehaviorSubject(false);
  isPanSelected = new BehaviorSubject(false);
  isDPChoosen = new BehaviorSubject(false);
  isServiceBlocked = new BehaviorSubject(false);
  isDerivativeFinDocUploaded = new BehaviorSubject(false);
  isTradingFetch = new BehaviorSubject(false);
  isfinnacialIFSCloaded = new BehaviorSubject(false);
  isEntryAccess = new BehaviorSubject<any>(1);
  RunningAccpayoutsettlementtype = new BehaviorSubject<any>(1);
  nomineeRelation = new BehaviorSubject<any>(1);
  introducerDetails = new BehaviorSubject<any>(1);
  nomineeIdProof = new BehaviorSubject<any>(1);
  generalDetails = new BehaviorSubject<any>(1);
  nachFrequency = new BehaviorSubject<any>(1);
  membership = new BehaviorSubject<any>(1);
  POAidentityProof = new BehaviorSubject<any>(1);
  kycReceivedType = new BehaviorSubject<any>(1);
  nachType = new BehaviorSubject<any>(1);
  nachBanks = new BehaviorSubject<any>(1);
  autoSaveTiming = new BehaviorSubject<any>(1);
  kycInitialFillingData = new BehaviorSubject<any>(1);
  kraAccountOpeiningFirstHolderData = new BehaviorSubject<any>(1);
  kraAccountOpeiningSecondHolderData = new BehaviorSubject<any>(1);
  kraAccountOpeiningThirdHolderData = new BehaviorSubject<any>(1);
  url: string;
  detailsUrl: string;
  activeTab: ReplaySubject<number> = new ReplaySubject<number>(1);
  isderivativeSegment = new BehaviorSubject(false);
  PAN = new BehaviorSubject<any>(1);
  derivativeStatus= new BehaviorSubject<any>(1);
  defaultBOResStatus= new BehaviorSubject<any>(1);
  merchantnavyStatus =new BehaviorSubject(false);
  applicationStatus = new BehaviorSubject<any>(1);
  nameinpansite = new BehaviorSubject<any>(1);
  proofIdentity = new BehaviorSubject<any>(1);
  proofCorres = new BehaviorSubject<any>(1);
  krafetchdata = new BehaviorSubject<any>(1);
  proceedType = new BehaviorSubject<any>(1);
  proofPassport = new BehaviorSubject<any>(1);
  nriData =new BehaviorSubject<any>(1);

  proofKeys: any = []
  constructor(
    public http: HttpClient,
    private notif: NzNotificationService,

  ) {
    this.holderLength.next(1);
    this.clientSerialNumber.next(0);
    this.clientType.next('individual');
    this.isNRE.next(false);
    this.hoderDetails.next({})
    this.clientIdDetails.next({})
    this.hoder1PanDetails.next({})
    this.hoder2PanDetails.next({})
    this.hoder3PanDetails.next({})
    this.kraAccountOpeiningFirstHolderData.next(null)
    this.kraAccountOpeiningSecondHolderData.next(null)
    this.kraAccountOpeiningThirdHolderData.next(null)
    this.clientSubType.next({})
    this.generalDetails.next({})
    this.trigerAcOpening.next(false)
    this.trigerKYC.next(false)
    this.trigerFinancial.next(false)
    this.isTotalProofDatafound.next(false)
    this.trigerTrading.next(false)
    this.trigerDp.next(false)
    this.trigerScheme.next(false)
    this.trigerIU.next(false)
    this.finalize.next(false)
    // this.isEntryfinalised.next(false)
    this.trigerRejection.next(false)
    this.isClientProfileEdit.next(false)
    this.lastActivateTabIndex.next(0)
    this.varifykarclicked.next(false)
    this.disableKraFields.next(false)
    this.isEntryAccess.next(true)
    this.isIdentityProofLoaded.next(false)
    this.sameAsPermantAddress.next(false)
    this.chooseAOF.next(false)
    this.isTradingChoosen.next(false)
    this.isPanSelected.next(false)
    this.isDPChoosen.next(false)
    this.chooseKRA.next(false)
    this.isAdditionalAddressGiven.next(false)
    this.isFOselected.next(false)
    this.isFOselected.next(false)
    this.isServiceBlocked.next(false)
    this.isTradingFetch.next(false)
    this.isServiceCallsAllow.next(true)
    this.isCatholicSyrianBankChoosen.next(false)
    this.isfinnacialIFSCloaded.next(false)
    this.RunningAccpayoutsettlementtype.next([])
    this.nomineeRelation.next([])
    this.introducerDetails.next([])
    this.nachFrequency.next([])
    this.nachType.next([])
    this.nomineeIdProof.next([])
    this.membership.next([])
    this.POAidentityProof.next([])
    this.kycReceivedType.next([])
    this.nachBanks.next([])
    this.kycInitialFillingData.next([])
    this.autoSaveTiming.next(60000)
    this.riskCountry.next(null)
    this.activeTab.next(0);
    this.url = "http://devekyc.geojit.net/general.svc/checkKRA"
    this.detailsUrl = "http://devekyc.geojit.net/general.svc/getKRADetails"
    this.isderivativeSegment.next(false)
    this.PAN.next('')
    this.derivativeStatus.next('')
    this.defaultBOResStatus.next('')
    this.merchantnavyStatus.next(false)
    this.applicationStatus.next('')
    this.nameinpansite.next('')
    this.proofIdentity.next(false)
    this.proofCorres.next(false)
    this.krafetchdata.next([]);
    this.proceedType.next('');
    this.proofPassport.next(false)
    this.nriData.next('')

  }
  // http://192.168.29.104:8080/spice-ws/service/public/krastatuscheck
  // http://192.168.29.104:8080/spice-ws/service/public/kradetailsfetch

  post(url: string, body: any, options?: any) {
    return this.http
      .post(url, body, options)
      // .pipe(map(this.extractData))
      .toPromise()
      .catch(this.handleError);
  }
  private handleError(error: Response) {
    console.error(error);
    return 'Server error';
    //Observable.throw(error.json(). || );
  }
  getProofOfDetialsData(formFeilds, idPoofName) {
    let keys = Object.keys(this.proofKeys)
    formFeilds.forEach((ele, i) => {
      ele[idPoofName + i] = ele["proof" + i] ? ele["proof" + i] : null
    })
    let x = JSON.stringify(formFeilds)
    let fieldsArray = JSON.parse(x)
    // this.formFeilds.forEach(control => this.form.addControl(control.ProofName, this.fb.control('')));
    // keys.forEach((ele) => {
    //   fieldsArray.forEach((element, i) => {
    //     delete element[ele]

    //     // delete element['proof'+i]
    //   });
    // })

    return fieldsArray
  }

  // checkKRA(pan){
  //   let data= { 
  //     "param": pan
  //  }
  //     return this.post(this.url,data).then(res=>{
  //    let res1:any=res
  //      let data=JSON.parse(res1)
  //     let error = data.Error
  //      if(error[0].ErrorCode==0)
  //       return data
  //       else{
  //         this.notif.error(error.ErrorMessage,'')
  //       return []
  //       }
  //     })
  // }
  // getKRA(value:string){
  //   
  //   let data= { 
  //     "param": value
  //      }  
  //  return this.post(this.detailsUrl,data).then(res=>{
  //     let res1:any=res
  //     let responce=JSON.parse(res1)
  //     let data=JSON.parse(res1)
  //     let error = data.Error
  //     if(error[0].ErrorCode==0){
  //this.getKRAdetails.next(data)
  //     return data
  //     }
  //     else{
  //       this.notif.error(error.ErrorMessage,'')
  //     this.getKRAdetails.next([])
  //     return []
  //     }

  //   })
  // }

  getControls(tfd, val) {
    let result = tfd.filter(ele => {
      return (ele.Code == val)
    })
    return result
  }

  patchData(pfCode, obj, controFieldsArray) {
    obj.forEach((ele, i) => {
      controFieldsArray[i]['proof' + i] = ele[pfCode + i]
    })
    return obj
  }
  generateJSONfromArray(result) {
    var obj = {}
    result.forEach(element => {
      obj = { ...obj, ...element }
    });
    return obj
  }

}
