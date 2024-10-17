import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentVerificationService {


  constructor(private http: HttpClient) {


  }


  getResultArray(body: any, options?: any) {
    return this.post(environment.api_OTP_url + 'ExecuteSPformated', body, options)
      .then((response: any) => {
        if (response.results && response.results.length) {
          response.results.forEach((result, i) => {
            if (result.rows && result.rows.length)
              response.results[i] = this.convertToObject(result);
            else
              response.results[i] = [];
          });
        }
        return response;
      });
  }

  post(url: string, body: any, options?: any) {
    return this.http
      .post(url, body, options)
      // .pipe(map(this.extractData))
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return 'Server error';
  }

  convertToObject(response: any) {

    let objArr = [];
    for (let row of response.rows) {
      let object = {};
      for (let i in row) {
        if (row[i] != null || row[i] != undefined) {
          if (typeof row[i] == 'string') {
            row[i] = row[i].trim()
          }
          if (row[i] == "Y" || row[i] == "N") {
            if (row[i] == "Y") {
              object[response.metadata.columns[i]] = true;
            }
            else {
              object[response.metadata.columns[i]] = false;
            }
          }
          else {
            if (typeof row[i] == 'string' && row[i].indexOf("12:00:00 AM") >= 0) {
              object[response.metadata.columns[i]] = row[i].substr(0, 2) + "/" + row[i].substr(3, 2) + "/" + row[i].substr(6, 4);
            } else {
              object[response.metadata.columns[i]] = row[i];
            }
          }
        }
        else {
          object[response.metadata.columns[i]] = row[i];
        }
      }
      objArr.push(object);
    }
    return objArr;
  }

  // encryptData(body: any, options?: any): Promise<any>;

}
