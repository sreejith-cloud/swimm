


export class dematmodel {
  public Slno: number;
  public AuditorFinding: string
  public HOReviewFlag:string
  //  public Solution:string
  // public valueFlag: string
  public AuditorRemarks: string
  public AuditorReviewFlag:boolean

  
  public constructor(data: any = {}) {debugger
    this.Slno = data.Slno || "";
    this.AuditorFinding = data.AuditorFinding?data.AuditorFinding: null;
    this.HOReviewFlag=data.HOReviewFlags?data.HOReviewFlags:''
    //  this.Solution=data.Solution || null;
    // this.valueFlag = "HO Review Pending";
    this.AuditorRemarks = data.AuditorRemarks|| null;
    this.AuditorReviewFlag=data.AuditorReviewFlag||false;
  }
}

export class dematmodel1 {
  public Slno: number;
  public AuditorFinding: string
  public Solution:string
  public HOReviewFlag:string
  // public valueFlag: string
  public AuditorRemarks: string
  public HORemarks:string
  
  public constructor(data: any = {}) {
    this.Slno = data.Slno?data.Slno:'';
    this.AuditorFinding = data.AuditorFinding?data.AuditorFinding:'';
     this.Solution=data.Solution?data.Solution:'';
     this.HOReviewFlag=data.HOReviewFlag?data.HOReviewFlag:'';

    // this.valueFlag = "Auditor Review Pending";
    this.AuditorRemarks = data.AuditorRemarks?data.AuditorRemarks:''
     this.HORemarks = data.HORemarks?data.HORemarks:''
  }

  
  

}
