import { WorkspaceSkelton } from "shared";

export const WorkspaceEnum: WorkspaceSkelton[] = [
    {
        title: 'Dashboard',
        key: 'dashboard',
        modulePath: 'src/app/modules/dashboard/dashboard.module#DashboardModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Client Commodity Categorisation Report',
        key: 'CommodityCategoristaionClientwiserpt',
        modulePath: 'src/app/modules/CommodityCategoristaionClientwiserpt/CommodityCategoristaionClientwiserpt.module#CommodityCategoristaionClientwiserptModule',
        maxCount: 1,
        icon: 'user'
    },
    {
        title: 'UCC File Generation',
        key: 'uccuploadfilegeneration',
        modulePath: 'src/app/modules/uccuploadfilegeneration/uccuploadfilegeneration.module#uccfilegenerationModule',
        maxCount: 1,
        icon: 'user'
    },

    {
        title: 'Client Commodity Categorisation Form',
        key: 'clientcommoditycategorisation',
        modulePath: 'src/app/modules/clientcommoditycategorisation/clientcommoditycategorisation.module#clientcommoditycategorisationModule',
        maxCount: 1,
        icon: 'user'

    },
    {
        title: 'UCC File Generation',
        key: 'uccuploadfilegeneration',
        modulePath: 'src/app/modules/uccuploadfilegeneration/uccuploadfilegeneration.module#uccfilegenerationModule',

    },
    {
        title: 'Client Master',
        key: 'clientMaster',
        modulePath: 'src/app/modules/client-master/client-master.module#ClientMasterModule',
        maxCount: 1,
        icon: 'user'
    },
    {
        title: 'Client Profile Edit',
        key: 'ClientProfileEdit',
        modulePath: 'src/app/modules/client-master/client-master.module#ClientMasterModule',
        maxCount: 1,
        icon: 'user'
    },

    {
        title: 'Mtf loc Aproval',
        key: 'mtfLocAproval',
        modulePath: 'src/app/modules/mtf-loc-aproval/mtflocaproval.module#mtflocaprovalModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Mtf loc',
        key: 'mtfLoc',
        modulePath: 'src/app/modules/mtf-loc/mtfloc.module#mtflocModule',
        maxCount: 1,
        icon: 'solution'

    },
    {
        title: 'AcctOpeningrpt',
        key: 'AcctOpeningrpt',
        modulePath: 'src/app/modules/AcctOpeningrpt/AcctOpeningrpt.module#AcctOpeningrptModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Profile Change',
        key: 'crf',
        modulePath: 'src/app/modules/crf/crf.module#CRFModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Profile Change Report',
        key: 'crfrpt',
        modulePath: 'src/app/modules/AcctOpeningrpt/AcctOpeningrpt.module#AcctOpeningrptModule',
        maxCount: 1,
        icon: 'solution'
    },

    {
        title: 'Proof Verification',
        key: 'proofVerification',
        modulePath: 'src/app/modules/proofverification/proofverification.module#ProofverificationModule',
        maxCount: 1,
        icon: 'solution'
    },

    {
        title: 'JV Client Transfer',
        key: 'jvclienttransfer',
        modulePath: 'src/app/modules/jvclienttransfer/jvclienttransfer.module#JvclienttransferModule',
        maxCount: 1,
        icon: 'arrow-right'
    },
    {
        title: 'JV Client Transfer Report',
        key: 'jvclienttransferreport',
        modulePath: 'src/app/modules/jvclienttransferreport/jvclienttransferreport.module#JvclienttransferreportModule',
        maxCount: 1,
        icon: 'arrow-right'
    },
    {
        title: 'Post Opening',
        key: 'PostOpening',
        modulePath: 'src/app/modules/accountopening/accountopening.module#AccountopeningModule',
        maxCount: 1,
        icon: 'solution'
    },

    {
        title: 'Document Verification Report',
        key: 'documentVerificationreport',
        modulePath: 'src/app/modules/document-verification-report/document-verification-report.module#DocumentVerificationReportModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Bank Verification',
        key: 'bankVerification',
        modulePath: 'src/app/modules/bank-change/bank-change.module#BankChangeModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'AOF IPV Process',
        key: 'aofipvprocess',
        modulePath: 'src/app/modules/aof-ipvprocess/aof-ipvprocess.module#AOFIPVProcessModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Franchise Staff Details Report',
        key: 'FranchiseStaffDetailsReport',
        modulePath: 'src/app/modules/franchisestaffdetails-report/franchisestaffdetails-report.module#FranchiseReportModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Additional Agreements Signed',
        key: 'additionalagreementsigned',
        modulePath: 'src/app/modules/additionalagreementssigned/additionalagreementssigned.module#AdditionalagreementssignedModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Client Mapping',
        key: 'clientmapping',
        modulePath: 'src/app/modules/clientmapping/clientmapping.module#ClientmappingModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Client DDPI Entry',
        key: 'clientpoaentry',
        modulePath: 'src/app/modules/clientpoaentry/clientpoaentry.module#ClientpoaentryModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Approaval Dashboard',
        key: 'approavaldashboard',
        modulePath: 'src/app/modules/clientpoadashboard/clientpoadashboard.module#ClientpoadashboardModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'DDPI Approved or Reject',
        key: 'poaapprovedorreject',
        modulePath: 'src/app/modules/poaapprovedorreject/poaapprovedorreject.module#PoaapprovedorrejectModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Custodian Master',
        key: 'custodianmaster',
        modulePath: 'src/app/modules/custodian-master/custodian-master.module#CustodianMasterModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Remiser Commission Slab',
        key: 'remisercommissionslab',
        modulePath: 'src/app/modules/remiser-commission-slab/remiser-commission-slab.module#RemiserCommissionSlabModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'POA Stamped Documents',
        key: 'POAStampedDocuments',
        modulePath: 'src/app/modules/poastamped-documents/poastamped-documents.module#POAStampedDocumentsModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Finideas T&C Status',
        key: 'FINIDEASSTATUS',
        modulePath: 'src/app/modules/finideastncstatus/finideastncstatus.module#FinideastncstatusModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Enable Activation Request',
        key: 'EnableActivationRequest',
        modulePath: 'src/app/modules/enableactivationrequest/enableactivationrequest.module#EnableactivationrequestModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Activation Request Enabled Clients',
        key: 'ActivationEnabledClients',
        modulePath: 'src/app/modules/activationenabledclients/activationenabledclients.module#ActivationenabledclientsModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Additional Agreements',
        key: 'additionalagreements',
        modulePath: 'src/app/modules/additionalagreements/additionalagreements.module#AdditionalagreementsModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Pan Details',
        key: 'pandetails',
        modulePath: 'src/app/modules/pandetails/pandetails.module#PandetailsModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Birthday Details Of Clients',
        key: 'birthdaydetails',
        modulePath: 'src/app/modules/birthdaydetails/birthdaydetails.module#BirthdaydetailsModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Trading Account Transaction Charges',
        key: 'tradingaccounttransactioncharges',
        modulePath: 'src/app/modules/tradingaccounttransactioncharges/tradingaccounttransactioncharges.module#TradingaccounttransactionchargesModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Collection Requests',
        key: 'Collectionrqst',
        modulePath: 'src/app/modules/collectionrequests/collectionrequests.module#CollectionrequestsModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'KRA Dashboard',
        key: 'kraDashboard',
        modulePath: 'src/app/modules/kra/kra.module#KRAModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Status Conversion',
        key: 'statusconversion',
        modulePath: 'src/app/modules/status-conversion/status-conversion.module#StatusConversionModule',
        maxCount: 1,
        icon: 'user'
    },
    {
        title: 'Status Conversion Report',
        key: 'StatusConversionReport',//'FranchiseStaffDetailsReport',
        modulePath: 'src/app/modules/status-conversion-report/status-conversion-report.module#StatusConversionReportModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Profile Change Report Generation',
        key: 'dcnactivationreport',
        modulePath: 'src/app/modules/dcnactivation/dcnactivation.module#DcnactivationModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Advance AMC A/C Opening',
        key: 'advncamcacopening',
        modulePath: 'src/app/modules/advncamcacopening/advncamcacopening.module#AdvncamcacopeningModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
      title: 'DDPI Rejection Report',
      key: 'ddpirejectionreport',
      modulePath: 'src/app/modules/ddpirejectionreport/ddpirejectionreport.module#DdpirejectionreportModule',
      maxCount: 1,
      icon: 'solution'
  },
  {
    title: 'Franchisee Staff Control',
    key: 'franchiseestaffcontrol',
    modulePath: 'src/app/modules/franchiseestaffcontrol/franchiseestaffcontrol.module#FranchiseestaffcontrolModule',
    maxCount: 1,
    icon: 'solution'
},
{
    title: 'Miscellaneous',
    key: 'Miscellaneous',
    modulePath: 'src/app/modules/miscellaneous/miscellaneous.module#MiscellaneousModule',
    maxCount: 1,
    icon: 'solution'
  },
  {
    title: 'Sikkim Clients',
    key: 'SikkimReport',
    modulePath: 'src/app/modules/sikkim-clients/sikkim-clients.module#SikkimClientsModule',
    maxCount: 1,
    icon: 'solution'
    },
    {
        title: 'Email Mobile Validation',
        key: 'EmailMobileValidate',
        modulePath: 'src/app/modules/email-mobile-validate/email-mobile-validate.module#EmailMobileValidateModule',
        maxCount: 1,
        icon: 'solution'
    },
     {
        title: 'Auto Allocation',
        key: 'autoallocation',
        modulePath: 'src/app/modules/autoallocation/autoallocation.module#AutoallocationModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
      title: 'Change Request - Hold',
      key: 'changerequesthold',//'changerequesthold',
      modulePath: 'src/app/modules/crf-hold-request/crf-hold-request.module#CrfHoldRequestModule',
      maxCount: 1,
      icon: 'solution'
    },
    {
        title: 'DCOB- DDPI Report',
        key: 'DcobDDPIReport',
        modulePath: 'src/app/modules/dcob-ddpi-form/dcob-ddpiform.module#DcobDDPIFormModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
      title: 'ERX Client Data Upload',
      key: 'ERXClientDataUpload',
      modulePath: 'src/app/modules/client-data-update/client-data-update.module#ClientDataUpdateModule',
      maxCount: 1,
      icon: 'solution'
    },
    {
      title: 'NRE Accounts with more than one Bank Account',
      key: 'nreaccountwithmorethanonebank',
      modulePath: 'src/app/modules/nre-more-than-one-account/nre-more-than-one-account.module#NreMoreThanOneAccountModule',
      maxCount: 1,
      icon: 'solution'
    },
    {
        title: 'Brokerage Revision',
        key: 'brokeragerevision',
        modulePath: 'src/app/modules/brokerage-revision/brokerage-revision.module#BrokerageRevisionModule',
        maxCount: 1,
        icon: 'solution'
      },
      {
        title: 'Brokerage Revision Approval',
        key: 'BrokerageRevisionApproval',
        modulePath: 'src/app/modules/brokerage-revision-approval/brokerage-revision-approval.module#BrokerageRevisionApprovalModule',
        maxCount: 1,
        icon: 'solution'
      },
      {
        title: 'Brokerage Revision Request Report',
        key: 'brokeragerevisionreport',
        modulePath: 'src/app/modules/brokerage-revision-report/brokerage-revision-report.module#BrokerageRevisionReportModule',
        maxCount: 1,
        icon: 'solution'
      },
      {
        title: 'Permitted To Trade File Upload',
        key: 'nsebseupload',
        modulePath: 'src/app/modules/nse-bse-upload/nse-bse-upload.module#NseBseUploadModule',
        maxCount: 1,
        icon: 'solution'
      },
    {
        title: 'Account closure',
        key: 'AccountClosure',
        modulePath: 'src/app/modules/emailaccountclosure/emailaccountclosure.module#EmailaccountclosureModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'Account Closure Approval',
        key: 'AccountClosureApproval',
        modulePath: 'src/app/modules/accountclosureapproval/accountclosureapproval.module#AccountClosureApprovalModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'KRA Live Enquiry',
        key: 'KRALiveEnquiry',
        modulePath: 'src/app/modules/kraliveenquiry/kraliveenquiry.module#KraliveenquiryModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
      title: 'Inactive Code Activation',
      key: 'InactiveCodeActivation',
      modulePath: 'src/app/modules/inactive-client-activation/inactive-client-activation.module#InactiveClientActivationModule',
      maxCount: 1,
      icon: 'solution'
    },
    {
        title: 'Email/Mobile Change Intimation',
        key: 'EmailMobileChangeIntimation',
        modulePath: 'src/app/modules/email-mobile-changeintimation/email-mobile-changeintimation.module#EmailMobileChangeintimationModule',
        maxCount: 1,
        icon: 'solution'
    },
    {
        title: 'PAN Based Client Profile Master',
        key: 'PANbasedClientProfileMaster',
        modulePath: 'src/app/modules/pan-based-client-profile-master/pan-based-client-profile-master.module#PanBasedClientProfileMasterModule',
        maxCount: 1,
        icon: 'solution'
      },
      {
        title: 'Physical Activation Kit Report',
        key: 'Physicalactivationkitreport',
        modulePath: 'src/app/modules/physical-activation-kit-report/physical-activation-kit-report.module#PhysicalActivationKitReportModule',
        maxCount: 1,
        icon: 'solution'
    },
    
    {
        title: 'Physical Activation Kit Upload',
        key: 'PhysicalActivationKitUpload',
        modulePath: 'src/app/modules/physical-activation-kit-upload/physical-activation-kit-upload.module#PhysicalActivationKitUploadModule',
        maxCount: 1,
        icon: 'solution'
      },
      {
        title: 'View Uploaded Image',
        key: 'physicalActivationKitImageView',
        modulePath: 'src/app/modules/physical-activation-kit-image-view/physical-activation-kit-image-view.module#PhysicalActivationKitImageViewModule',
        maxCount: 1,
        icon: 'solution'
      
    },
      {
        title: 'PAN Verification',
        key: 'PANVerification',
        modulePath: 'src/app/modules/pan-verification/pan-verification.module#PanVerificationModule',
        maxCount: 1,
        icon: 'solution'
      },
      {
        title: 'CKYC Client Log (Email)',
        key: 'CKYCClientLogEmail',
        modulePath: 'src/app/modules/ckycemail-log/ckycemail-log.module#CKYCEmailLogModule',
        maxCount: 1,
        icon: 'solution'
      },
      {
        title: 'Block/Unblock Request By Client',
        key: 'BlockUnblockReport',
        modulePath: 'src/app/modules/block-unblock-report/block-unblock-report.module#BlockUnblockReportModule',
        maxCount: 1,
        icon: 'solution'
      }
];
