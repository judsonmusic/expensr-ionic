import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/map";
import "rxjs/operator/map";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";
import { UtilsProvider } from "../utils/utils";

/*
  Generated class for the ExpensesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ExpensesProvider {

  public account = new Subject<any>();
  public account$: Observable<any>;
  public account_id = new BehaviorSubject<any>(false);
  public data: any;

  constructor(public http: HttpClient, public utils: UtilsProvider) {}
 

  get(month,year) {
    return this.http
      .get(this.utils.apiUrl + "expenses/" + sessionStorage.getItem("id") + '/' + month + '/' + year)
      .map(res => {
        return res["expenses"];
      })
      .catch((error: any) => Observable.throw(error || "Server error"));
  }

  save(payload) {
    if (!payload) {

      this.utils.showAlert('Alert!', 'Payload was not provided to update the account.');

    } else {
      return this.http
        .put(
          this.utils.apiUrl + "expenses/" + sessionStorage.getItem("id"),
          payload
        )
        .map(res => {
          return res;
        })
        .catch((error: any) => Observable.throw(error || "Server error"));
    }
  }
}
