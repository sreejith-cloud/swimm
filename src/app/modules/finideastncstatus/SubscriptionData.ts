export class Subscriptiondata {
    public Cheque: boolean;
    public Location: any;
    public TradeCode: any;
    public Name: any;
    public TnC: any;
    public LastUpdatedDate: any;
    public IpAddress: any;
    public ActiveOrInactive: any;
    public clientid: number
    

   
    public constructor(data: any = {}) {debugger
      this.Cheque=false;
      this.Location="";
      this.TradeCode = "";
      this.Name="";
      this.TnC="";
      this.LastUpdatedDate="";
      this.IpAddress="";
      this.ActiveOrInactive="";
      this.clientid=data.clientid || ""
      
    }
}