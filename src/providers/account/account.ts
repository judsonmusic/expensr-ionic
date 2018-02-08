import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/map";
import "rxjs/operator/map";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";
import { UtilsProvider } from "../utils/utils";

/*
  Generated class for the AccountProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccountProvider {
  public account = new Subject<any>();
  public account$: Observable<any>;
  public account_id = new BehaviorSubject<any>(false);
  public data: any;

  constructor(public http: HttpClient, public utils: UtilsProvider) {}

  login(payload) {
    return this.http
      .post("http://www.expensr.io/api/authenticate", payload)
      .map(res => {
        //if(res.account.birthDate) res.account.birthDate = new Date(res.birthDate).toISOString();//new Date(moment(res.account.birthDate).format("YYYY-MM-DD"));
        //this.account.next(res.account);
        if (res["token"]) {
          sessionStorage.setItem("jwt", res["token"]);
          sessionStorage.setItem("id", res["user"]["_id"]);
        }
        return res;
      })
      .catch((error: any) => Observable.throw(error || "Server error"));
  }

  get() {
    return this.http
      .get("http://www.expensr.io/api/accounts/" + sessionStorage.getItem("id"))
      .map(res => {
        return res;
      })
      .catch((error: any) => Observable.throw(error || "Server error"));
  }

  save(payload) {
    if (!payload) {

      this.utils.showAlert('Alert!', 'Payload was not provided to update the account.');

    } else {
      return this.http
        .put(
          "http://www.expensr.io/api/accounts/" + sessionStorage.getItem("id"),
          payload
        )
        .map(res => {
          return res;
        })
        .catch((error: any) => Observable.throw(error || "Server error"));
    }
  }
}
