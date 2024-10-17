export class industryqualificationmodel {
    public industryQualification: any;
    public industryInstitution: any;
    public industryPercentage: any;
    public industryYearofPassing: any;
    public industryRemarks: any;
   
    public constructor(data: any = {}) {
      this.industryQualification = "";
      this.industryInstitution ="";
      this.industryPercentage = "";
      this.industryYearofPassing ="";
      this.industryRemarks ="";
    }
}