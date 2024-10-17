// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_xlrds_url: 'http://192.168.39.207/XLRDS/webresources/SearchSymbol/SymbolSearchService',
  auth_app_url: 'http://spicedev.geojittechnologies.com:8080/spice-auth/#/auth',
  api_OTP_url: 'http://spicedev.geojittechnologies.com:8080/spice-ws/service/public/',
  api_base_url: 'http://spicedev.geojittechnologies.com:8080/spice-ws/service/master/',
  api_img_url:'http://spicedev.geojittechnologies.com:8080/spice-ws/service/spicePdfService/getImagePdf',
  api_collectionreq_sendlink: 'http://spicedev.geojittechnologies.com:8080/spice-ws/service/spice/getInvoice',
  api_getqrcode_url:'http://spicedev.geojittechnologies.com:8080/spice-ws/service/public/getQrCodeWithInfo',
  // api_img_url:'https://spice.geojit.com/spice-ws/service/spicePdfService/getImagePdf',
  api_zip_url:'http://spicedev.geojittechnologies.com:8080/kraDashBoard/service/public/getZipFile?Token=',
  api_send_emailormob: 'http://spicedev.geojittechnologies.com:8080/spice-ws/service/master/generate-link',
  api_encryptdata_url : 'http://spicedev.geojittechnologies.com:8080/spice-ws/service/public/encryptData',
  api_kraBulkdata: 'http://spicedev.geojittechnologies.com:8080/spice-ws/service/spice/statusEnquiryService ',
  downloadPDF: 'http://spicedev.geojittechnologies.com:8080/spice-ws/service/master/downloadPDF',
  pan_verify:'http://spicedev.geojittechnologies.com:8080/pan-verification/service/rest/pan/verify',
  erx_api: 'http://spicedev.geojittechnologies.com:8080/spice-ws/service/spice/erxFileDataUpload',

  tifToimageConvertion: 'http://spicedev.geojittechnologies.com:8080/spice-ws/service/public/generate-tiff',
  app_version: '2.0.1.16'
 
  };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


