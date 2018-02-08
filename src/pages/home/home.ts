import { Component } from '@angular/core';
import { AccountProvider } from '../../providers/account/account';
import { IonicPage, NavController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage({name: "home", segment: "home"})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user:any = {};

  constructor(public navCtrl: NavController, public account: AccountProvider, public utils: UtilsProvider) {

    this.user = {
      email: "",
      password: ""
    }

  }

  login(){

    this.utils.showLoading();

      this.account.login(this.user).subscribe((user)=>{
        //this.user = user;
        //lets redirect to portal page...
        this.navCtrl.setRoot("portal");
        this.utils.hideLoading();
      })
  }

}
