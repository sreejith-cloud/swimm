export class educationqualificationmodel {
    public educationalQualification: any;
    public educationalInstitution: any;
    public educationalPercentage: any;
    public educationalYearofPassing: any;
    public educationalRemarks: any;
   
    public constructor(data: any = {}) {
      this.educationalQualification = "";
      this.educationalInstitution ="";
      this.educationalPercentage = "";
      this.educationalYearofPassing ="";
      this.educationalRemarks ="";
    }
}