import { ExpensesProvider } from './../../providers/expenses/expenses';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AccountProvider } from "../../providers/account/account";
import * as moment from "moment";
import { UtilsProvider } from "../../providers/utils/utils";
import { AddExpenseComponent } from '../../components/add-expense/add-expense';

@IonicPage({ name: "portal", segment: "portal" })
@Component({
  selector: "page-portal",
  templateUrl: "portal.html"
})
export class PortalPage {
  public account;
  public currentMonth;
  public currentYear;
  public types;
  public newExpense;
  public currentDate;
  public editMode = false;
  public updated;
  public expenses;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public account_service: AccountProvider,
    public expenses_provider: ExpensesProvider,
    public utils: UtilsProvider,
    public modalCtrl: ModalController) {
    this.currentMonth = parseInt(moment().format("M"));
    this.currentYear = parseInt(moment().format("YYYY"));

    this.resetNewExpense();

    this.types = this.utils.types;
    this.currentDate = moment();
  } //constructor...

  ionViewDidEnter() {
    this.utils.showLoading();

    this.account_service.get().subscribe(res => {
      this.account = res;
      this.getExpenses(moment().format('M'), moment().format('YYYY'));

    });


  }

  getExpenses(month, year){      
    console.log('Getting Expenses for ', month, year);
    this.expenses_provider.get(month,year).subscribe(res => {
      this.expenses = res;
      console.log(this.expenses);
      this.utils.hideLoading();
      this.expenses = res;  
    });
  }

  fixData(data?) {
    if (data) {
      //we need to fix the incoming data and pass it back...
      data.startBalance = data.startBalance
        ? this.fixCurrency(data.startBalance)
        : 0.0;
      data.endBalance = data.endBalance
        ? this.fixCurrency(data.endBalance)
        : 0.0;

      data.expenseList.map(obj => {
        obj.amountDue || obj.amountDue == 0
          ? (obj.amountDue = parseFloat(obj.amountDue).toFixed(2))
          : 0.0;
        obj.amountPaid || obj.amountPaid == 0
          ? (obj.amountPaid = parseFloat(obj.amountPaid).toFixed(2))
          : 0.0;
        obj.month = isNaN(obj.month) ? parseInt(obj.month) : obj.month;
        obj.year = isNaN(obj.year) ? parseInt(obj.year) : obj.year;
        if (
          !obj.cleared ||
          obj.cleared == "" ||
          typeof obj.cleared === undefined
        ) {
          obj.cleared = false;
        }
      });
      //console.log('@after fixing data: ', data);
      return data;
    } else {
      console.error("No data was supplied to fixData function.");
    }
  }

  ionViewDidLoad() { }


  //add item
  add() {
    this.newExpense.date = new Date(); //date we added the line item.
    var index = this.account.monthlyExpenses.indexOf(
      //this.getexpenses()
    );
    this.account.monthlyExpenses[index].expenseList.push(this.newExpense); //push the new line item to the current month
    this.resetNewExpense();

    document.getElementById("company").focus();
  } //end add item

  resetNewExpense() {
    this.newExpense = {
      date: "",
      company: "",
      totalDue: "0",
      amountDue: "0",
      amountPaid: "0",
      balance: "0",
      totalBalance: "0",
      endBalance: "0",
      cleared: false,
      type: "Credit Card",
      autopay: ""
    };
  }

  saveExpense() {
    this.utils.showLoading();
    console.log('@@@Saving Expenses...', this.expenses);
    this.calcEndBalance()
      .then(() => {
        this.expenses_provider.save(this.expenses).subscribe(res => {
          this.utils.hideLoading();
          this.utils.showPromptOk(
            "Complete!",
            "The expense information for this month has been saved!",
            data => {
              this.editMode = false;
            }
          );
        });
      })
      .catch(reason => {
        this.utils.showAlert("ERROR!", reason.toString());
      });
  }

  toggleEditMode(x) {
    this.editMode = x || !this.editMode;
    if (this.editMode) {
    }
  } //end toggle edit mode...

  getUnClearedTotal() {
    if (this.expenses.expenseList) {
      var total = 0.00;
      for (var i = 0; i < this.expenses.expenseList.length; i++) {
        if (
          this.expenses.expenseList[i].amountPaid && !this.expenses.expenseList[i].cleared
        ) {
          total += parseFloat(this.expenses.expenseList[i].amountPaid);
        }
      }
      return Number(total).toFixed(2);
    } else {
      return 0.00;
    }
  } //end get uncleared total.

  calcEndBalance() {
    return new Promise((resolve, reject) => {
      let uct = this.fixCurrency(this.getUnClearedTotal());
      this.expenses.startBalance = this.fixCurrency(this.expenses.startBalance);      
      this.expenses.endBalance = this.fixCurrency(this.expenses.startBalance - uct).toFixed(2);
      resolve();
    });
  } //end calculate end balance.

  /**
   *
   * @param string
   * this function converts string currency amounts in to floats.
   */
  fixCurrency(string) {
    if (typeof string === "string") {
      //console.log('string we are checking: ', string)
      let re = new RegExp(/\$|,/g);
      let value = parseFloat(string.replace(re, "")).toFixed(2);
      //console.log('The new value is: ', value)
      return value;
    } else {
      return string;
    }
  }

  //back and next functions...
  next() {
    // //increment date and year accordingly.
    // this.currentDate = moment(this.currentDate).add(1, "month");
    // //console.log('@@NEXT: ', this.currentDate.month(), this.currentDate.year());
    // let temp = this.expenses.filter(
    //   item =>
    //     item.month == this.currentDate.month() &&
    //     item.year == this.currentDate.year()
    // )[0];
    // if (!temp) {
    //   console.log("We dont have data for the current month so lets build it.");
    //   temp = {
    //     month: this.currentDate.month(),
    //     year: this.currentDate.year(),
    //     expenseList: []
    //   };
    // }
    // //now lets fix the data...
    // this.expenses = this.fixData(temp);
    // this.account.monthlyExpenses.push(this.expenses);
  }

  back() {
    // /**TODO
    //  * we need to query the database each time they hit next and back and use the middleware to build a new table if needed...
   
    //  */
    // //increment date and year accordingly.
    // this.currentDate = moment(this.currentDate).add(-1, "month");
    // let temp = this.expenses.filter(
    //   item =>
    //     item.month == this.currentDate.month() &&
    //     item.year == this.currentDate.year()
    // )[0];
    // //set the data.
    // this.expenses = this.fixData(temp);
    
  } //

  copyLastMonth() {
    this.utils.showConfirm("Please confirm", "Are you sure you want to copy last month's data? Any current data will be lost!", data => {
        //cancel
        console.log("Nevermind..");
      },
      data => {
        //ok
        var index = this.account.monthlyExpenses.indexOf(
          //this.getexpenses()
        );
        console.log(index);
        var lastIndex = index - 1;
        if (this.account.monthlyExpenses[lastIndex].expenseList && this.account.monthlyExpenses[lastIndex].expenseList.length > 0) {
          this.account.monthlyExpenses[index].startBalance = this.account.monthlyExpenses[lastIndex].startBalance;
          this.account.monthlyExpenses[index].endBalance = this.account.monthlyExpenses[lastIndex].endBalance;
          this.account.monthlyExpenses[index].expenseList = this.account.monthlyExpenses[lastIndex].expenseList;
          this.expenses = this.account.monthlyExpenses[index];
        } else {
          this.utils.showAlert(
            "Alert!",
            "There is nothing to copy from last month. Please click ok to abort."
          );
        }
      }
    );
  }

  clearAmountPaid() {
    this.expenses.expenseList.map(obj => {
      obj.amountPaid = 0.0;
    });
    this.calcEndBalance();
  }

  clearAmountDue() {
    this.expenses.expenseList.map(obj => {
      obj.amountDue = 0.0;
    });
    this.calcEndBalance();
  }

  clearCleared() {
    this.expenses.expenseList.map(obj => {
      obj.cleared = false;
    });
    this.calcEndBalance();
  }

  getTotalPaid() {
    if (this.expenses.expenseList) {
      var total = 0;
      for (var i = 0; i < this.expenses.expenseList.length; i++) {
        if (this.expenses.expenseList[i].amountPaid) {
          total += parseFloat(this.expenses.expenseList[i].amountPaid);
        }
      }
      return total;
    } else {
      return 0.0;
    }
  } //end get total paid.

  addExpense() {

    this.utils.openModal(AddExpenseComponent, {}, (data) => {
      // if (data) {
      //   var index = this.expenses.expenseList.indexOf(this.getexpenses());
      //   this.expenses.expenseList.push(data);
      //   this.expenses = this.expenses
      //   this.updated = new Date();
      //   this.saveExpense();
      // }
    });


  }

  deleteExpense(item) {
    this.utils.showConfirm("Please confirm", "Are you sure you want to delete this expense?", data => {
      //cancel
      console.log("Nevermind..");
    },
    data => { 
      console.log(item);
       var index = this.expenses.expenseList.indexOf(item);
       console.log(index);
       this.expenses.expenseList.splice(index, 1);
       //this.expenses = this.account.monthlyExpenses[index];
       this.updated = new Date();
       this.saveExpense();
    });

  }

} //end component
