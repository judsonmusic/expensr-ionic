import { Component } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';
import { ViewController } from 'ionic-angular';
import * as moment from 'moment';

/**
 * Generated class for the AddExpenseComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'add-expense',
  templateUrl: 'add-expense.html'
})
export class AddExpenseComponent {

  public types;
  public newExpense:Object={};

  constructor(public utils: UtilsProvider, public viewCtrl: ViewController) {  
    this.types = this.utils.types;
    this.newExpense={
      type: "Check",
      date: moment()
    }
  }

  accept(){
    this.closeModal();
  }

  cancel(){
    this.viewCtrl.dismiss();
  }


  closeModal() {
    this.viewCtrl.dismiss(this.newExpense);
  }

}
