import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd';

@Injectable()
export class CRFDataService {
  clientBasicData = new BehaviorSubject<any>(1)
  isNRE: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  holderLength: ReplaySubject<number> = new ReplaySubject<number>(1);
  clientSerialNumber: ReplaySubject<number> = new ReplaySubject<number>(1);
  activeTabIndex: ReplaySubject<number> = new ReplaySubject<number>(2);
  tabSelection: ReplaySubject<number> = new ReplaySubject<number>(1);
  hoderDetails: ReplaySubject<any> = new ReplaySubject<any>(1);
  hoder1PanDetails: ReplaySubject<any> = new ReplaySubject<any>(1);
  hoder2PanDetails: ReplaySubject<any> = new ReplaySubject<any>(1);
  hoder3PanDetails: ReplaySubject<any> = new ReplaySubject<any>(1);
  clientSubType: ReplaySubject<any> = new ReplaySubject<any>(1);
  clientType: ReplaySubject<string> = new ReplaySubject<string>(1);
  trigerAcOpening = new BehaviorSubject(false);
  trigerKYC = new BehaviorSubject(false);
  trigerFinancial = new BehaviorSubject(false);
  trigerTrading = new BehaviorSubject(false);
  trigerDp = new BehaviorSubject(false);
  trigerRejection = new BehaviorSubject(false);
  isIdentityProofLoaded = new BehaviorSubject(false);
  chooseAOF = new BehaviorSubject(false);
  chooseKRA = new BehaviorSubject(false);
  isCatholicSyrianBankChoosen = new BehaviorSubject(false);
  isFOselected = new BehaviorSubject(false);
  isCOMselected = new BehaviorSubject(false);
  RunningAccpayoutsettlementtype = new BehaviorSubject<any>(1);
  nomineeRelation = new BehaviorSubject<any>(1);
  introducerDetails = new BehaviorSubject<any>(1);
  nomineeIdProof = new BehaviorSubject<any>(1);
  generalDetails = new BehaviorSubject<any>(1);
  nachFrequency = new BehaviorSubject<any>(1);
  membership = new BehaviorSubject<any>(1);
  POAidentityProof = new BehaviorSubject<any>(1);
  kycReceivedType = new BehaviorSubject<any>(1);
  ClientBasicData = new BehaviorSubject<any>(1);
  nachType = new BehaviorSubject<any>(1);
  changeAccounts = new BehaviorSubject<any>(1);
  changeAccountsXML = new BehaviorSubject<any>(1);
  isAdditionalAddressGiven = new BehaviorSubject(false);
  SavedDataForApproval = new BehaviorSubject<any>(1)
  DataForAprooval = new BehaviorSubject<any>(1);
  forApproval = new BehaviorSubject(false)
  verificationstatus = new BehaviorSubject<any>(1);
  isRejected = new BehaviorSubject(false);
  rejectedreason = new BehaviorSubject<any>(1);
  viewOnly = new BehaviorSubject<boolean>(false);
  clientBankAccouns = new BehaviorSubject<any>(1);
  changeRequest = new BehaviorSubject<any>(1);
  saveButtonFlag = new BehaviorSubject<boolean>(false);
  approveOrRejectButtonFlag = new BehaviorSubject<boolean>(false);
  applicationStatus = new BehaviorSubject<any>(1);
  requestID = new BehaviorSubject<any>(1);
  approvelRemarks = new BehaviorSubject<any>(1);
  rejectionRemarks = new BehaviorSubject<any>(1);
  approvelAccounts = new BehaviorSubject<any>(1);
  derivativeStatus = new BehaviorSubject<any>(1);
  pepStatus = new BehaviorSubject<any>(1);
  finalApproveOrRejectButtonFlag = new BehaviorSubject<any>(1);
  HOModification =new BehaviorSubject<any>(1);
  nriData =new BehaviorSubject<any>(1);
  serielno=new BehaviorSubject<any>(1);  // mod:aksa
  segmentpro=new BehaviorSubject<any>(1);// mod:aksa
  lastfinupdated=new BehaviorSubject<any>(1);// mod:aksa
  hidefins=new BehaviorSubject<any>(1);// mod:aksa
  // ChangeFlag=new BehaviorSubject<any>(1)
  tickedCheckBox=new BehaviorSubject<any>(1);
  productlist=new BehaviorSubject<any>(1);
  segfin=new BehaviorSubject<any>(1);
  additionalterm=new BehaviorSubject<any>(1);
  NomineeOpting = new BehaviorSubject<any>(1);
  NomineeOptingFlag = new BehaviorSubject<any>(1);
  jointAccountHolderForModeOfOperation = new BehaviorSubject<any>(1);


  url: string;
  detailsUrl: string;
  canAdd: boolean = false;
  canModify: boolean = false
  clientBasicDataArray: any;


  proofKeys: any = []
  additionalTC = new BehaviorSubject<any>(1);

  clientId: ReplaySubject<number> = new ReplaySubject<number>(1);

  constructor(
    public http: HttpClient,
    private notif: NzNotificationService,

  ) {
    this.clientBasicData.next([]);
    this.holderLength.next(1);
    this.clientSerialNumber.next(0);
    this.clientType.next('individual');
    this.isNRE.next(false);
    this.hoderDetails.next({})
    this.hoder1PanDetails.next({})
    this.hoder2PanDetails.next({})
    this.hoder3PanDetails.next({})
    this.clientSubType.next({})
    this.generalDetails.next({})
    this.trigerAcOpening.next(false)
    this.trigerKYC.next(false)
    this.trigerFinancial.next(false)
    this.trigerTrading.next(false)
    this.trigerDp.next(false)
    this.trigerRejection.next(false)
    this.isIdentityProofLoaded.next(false)
    this.chooseAOF.next(false)
    this.chooseKRA.next(false)
    this.isFOselected.next(false)
    this.isCOMselected.next(false)
    this.isCatholicSyrianBankChoosen.next(false)
    this.RunningAccpayoutsettlementtype.next([])
    this.nomineeRelation.next([])
    this.introducerDetails.next([])
    this.nachFrequency.next([])
    this.nachType.next([])
    this.nomineeIdProof.next([])
    this.membership.next({})
    this.POAidentityProof.next([])
    this.kycReceivedType.next([])
    this.ClientBasicData.next([])
    this.changeAccounts.next([])
    this.url = "http://devekyc.geojit.net/general.svc/checkKRA"
    this.detailsUrl = "http://devekyc.geojit.net/general.svc/getKRADetails"
    this.isAdditionalAddressGiven.next(false);
    this.changeAccountsXML.next('');
    this.SavedDataForApproval.next([]);
    this.DataForAprooval.next([]);
    this.forApproval.next(false);
    this.verificationstatus.next([]);
    this.isRejected.next(false);
    this.rejectedreason.next('');
    this.viewOnly.next(false);
    this.clientBankAccouns.next([]);
    this.changeRequest.next('');
    this.saveButtonFlag.next(false);
    this.approveOrRejectButtonFlag.next(false);
    this.applicationStatus.next('');
    this.requestID.next('');
    this.approvelRemarks.next([]);
    this.rejectionRemarks.next([]);
    this.approvelAccounts.next([]);
    this.derivativeStatus.next('');
    this.pepStatus.next('');
    this.finalApproveOrRejectButtonFlag.next(false);
    this.HOModification.next('');
    this.nriData.next('');
    this.serielno.next('')  // mod:aksa
    this.segmentpro.next('') // mod:aksa
    this.lastfinupdated.next('') // mod:aksa
    this.hidefins.next('') // mod:aksa
    this.tickedCheckBox.next('') // mod:aksa
    this.productlist.next('')// mod:aksa
    this.NomineeOpting.next(false);
    this.NomineeOptingFlag.next(false);
    this.jointAccountHolderForModeOfOperation.next([]);


  }
  post(url: string, body: any, options?: any) {
    return this.http
      .post(url, body, options)
      // .pipe(map(this.extractData))
      .toPromise()
      .catch(this.handleError); 0
  }
  private handleError(error: Response) {
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
    keys.forEach((ele) => {
      fieldsArray.forEach((element, i) => {
        delete element[ele]

        // delete element['proof'+i]
      });
    })

    return fieldsArray
  }

  getProofOfDetialsDataNominee(formFeilds, idPoofName, fieldname) {
    formFeilds.forEach((ele, i) => {
      ele[idPoofName + i] = ele[fieldname + i] ? ele[fieldname + i] : null
    })
    let x = JSON.stringify(formFeilds)
    let fieldsArray = JSON.parse(x)

    fieldsArray.forEach((element, i) => {
      delete element[fieldname + i]
    })
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
  //     // console.log(data.Response)
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

  convertTrueorFalse(data) {
    var result = data.toString()
    if (result == 'true') {
      return 'Y'
    }  
    else if (result == 'false') {
      return 'N'
    }
    else {
      return result
    }
  }
  validateForm(form, controlNames, label, customErrorMsgs: any = {}, showError: boolean = true) {
    if (form.valid) {
      return true;
    } else if (showError) {
      for (let controlName in form.controls) {
        let control = form.controls[controlName];
        for (let propertyName in control.errors) {
          if (control.errors.hasOwnProperty(propertyName)/* && control.touched*/) {
            let error;
            if (customErrorMsgs[controlName]) {
              error = customErrorMsgs[controlName];
            } else {
              let fieldName = controlNames[controlName] ? controlNames[controlName] : controlName;
              // let fieldName=tempFieldName.match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
              const result = label.find(({ key }) => key === fieldName);
              if (result == undefined) {
                //error = `The ${fieldName} field is required.`
                error = this.getValidatorErrorMessage(propertyName, fieldName, control.errors[propertyName]);
              }
              else {
                //error = `The ${result.value} field is required.`
                error = this.getValidatorErrorMessage(propertyName, result.value, control.errors[propertyName]);
              }

            }
            this.notif.remove()
            setTimeout(() => {
              this.notif.error(error, '', {
                nzDuration: 60000
              });
            }, 200);

            form.controls[controlName].markAsTouched()
            return false;
          }
        }

      }
    }
  }
    getValidatorErrorMessage(validatorName: string, fieldName: string, validatorValue?: any) {
    let config = {
      'required': `The ${fieldName} field is required.`,
      'email': `The ${fieldName} must be a valid email address.`,
      'minlength': `Minimum length for ${fieldName} field is ${validatorValue.requiredLength}`,
      'pattern': `Invalid value for ${fieldName}.`,
      'validateEqual': `The ${fieldName} and ${validatorValue.otherField} must match.`,

      'invalidCreditCard': 'Is invalid credit card number',
      'invalidEmailAddress': 'Invalid email address',
      'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      'customMax': `Max value for ${fieldName} should not be greater than ${validatorValue.maxValue}`,
      'customMin': `Min value for ${fieldName} should not be less than ${validatorValue.minValue}`,
      'maxlength': `Maximum length for ${fieldName} field is ${validatorValue.requiredLength}`
    };

    return config[validatorName];
  }
  
}


