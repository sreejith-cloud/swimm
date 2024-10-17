export const environment = {
  production: true,

  auth_app_url: '/spice-auth/#/auth',
  api_base_url: '/spice-ws/service/master/',
  api_OTP_url: '/spice-ws/service/public/',
  api_xlrds_url: 'http://192.168.39.207/XLRDS/webresources/SearchSymbol/SymbolSearchService',
  // api_img_url:'https://spice.geojit.com/spice-ws/service/spicePdfService/getImagePdf',
  api_img_url: '/spice-ws/service/spicePdfService/getImagePdf',
  api_collectionreq_sendlink: '/spice-ws/service/spice/getInvoice',
  api_getqrcode_url: '/spice-ws/service/public/getQrCodeWithInfo',
  api_zip_url: '/spice-ws/service/public/getZipFile?Token=',
  api_send_emailormob: '/spice-ws/service/master/generate-link',
  erx_api: '/spice-ws/service/spice/erxFileDataUpload',
  api_encryptdata_url: '/spice-ws/service/public/encryptData',
  downloadPDF: '/spice-ws/service/master/downloadPDF',
  api_kraBulkdata: '/spice-ws/service/spice/statusEnquiryService ',
  tifToimageConvertion: '/spice-ws/service/public/generate-tiff',
  pan_verify:'/spice-ws/service/spicepublic/pan-verify',
  app_version: '2.0.1.17'
};
