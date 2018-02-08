import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  public globalLoader;

  constructor(public http: HttpClient, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    //console.log('Hello UtilsProvider Provider');
  }

  showLoading() {
    this.globalLoader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: `
        <div>
          Please wait...
        </div>`
    });

    // loading.onDidDismiss(() => {
    //   console.log('Dismissed loading');
    // });

    this.globalLoader.present();
  }

  hideLoading(){

    this.globalLoader.dismiss();
  }//

  showAlert(title, message, callback?) {
    let alert = this.alertCtrl.create({
      title: title || 'Alert',
      subTitle: message,
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            if (callback) callback(data);
          }
        }
      ]
    });
    alert.present();
  }//

  showConfirm(title, message, cancelCallback, okCallback) {
    let alert = this.alertCtrl.create({
      title: title || 'Alert!',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            if (cancelCallback) cancelCallback(data);
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (okCallback) okCallback(data);
          }
        }
      ]
    });
    alert.present();
  }

  showPromptOk(title, message, callback) {
    let prompt = this.alertCtrl.create({
      title: title || 'Alert!',
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            if (callback) callback(data);
          }
        }
      ]
    });
    prompt.present();
  }

  showPromptOkCancel(title, message) {
    let prompt = this.alertCtrl.create({
      title: title || 'Alert!',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            //console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }




  openModal(component, inData?, callback?) {

    let modal = this.modalCtrl.create(component, inData, callback);
    modal.onDidDismiss(data => {
      if (callback) callback(data);
    });
    modal.present();

  }

}
