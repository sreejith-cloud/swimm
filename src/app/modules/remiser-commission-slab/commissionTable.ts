export class commissionTable {
    public slno: number;
    public FromSlab: string;
    public ToSlab: string;
    public percentage: String;


   
    public constructor(data: any = {}) {
      this.slno = data.slno || "";
      this.FromSlab = "";
      this.ToSlab = "";
      this.percentage = "";
    }
}