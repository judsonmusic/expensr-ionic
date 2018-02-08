import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AccountProvider } from "../../providers/account/account";
import * as moment from "moment";
import { UtilsProvider } from "../../providers/utils/utils";

/**
 * Generated class for the PortalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "portal", segment: "portal" })
@Component({
  selector: "page-portal",
  templateUrl: "portal.html"
})
export class PortalPage {
  public account;
  public currentMonth;
  public currentYear;
  public currentMonthData;
  public types;
  public newExpense;
  public currentDate;
  public editMode = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public account_service: AccountProvider,
    public utils: UtilsProvider
  ) {
    //TODO: please note that the month is 1 off, its actyally being stored as 0 in the DB. Why???
    this.currentMonth = parseInt(moment().format("M")) - 1;
    this.currentYear = parseInt(moment().format("YYYY"));

    this.resetNewExpense();

    this.types = [
      {
        name: "Credit Card",
        value: "Credit Card"
      },
      {
        name: "Mortgage",
        value: "Mortgage"
      },
      {
        name: "Car Loan",
        value: "Car Loan"
      },
      {
        name: "Check",
        value: "Check"
      },
      {
        name: "Utilities",
        value: "Utilities"
      },
      {
        name: "Student Loan",
        value: "Student Loan"
      },
      {
        name: "Personal Loan",
        value: "Personal Loan"
      },
      {
        name: "Health Insurance",
        value: "Health Insurance"
      },
      {
        name: "Car Insurance",
        value: "Car Insurance"
      },
      {
        name: "Maintenance",
        value: "Maintenance"
      },
      {
        name: "HOA",
        value: "HOA"
      },
      {
        name: "Taxes",
        value: "Taxes"
      }
    ];

    // if (localStorage.getItem("date")) {
    //   console.log("The current date is: ", localStorage.getItem("date"));
    //   this.currentDate = localStorage.getItem("date");
    // } else {
    //   this.currentDate = moment();
    //   localStorage.setItem("date", this.currentDate);
    // }
    this.currentDate = moment();
    //console.log('@@CURRENT: ', this.currentDate, this.currentDate.month(), this.currentDate.year());
  } //constructor...

  ionViewDidEnter() {
    this.utils.showLoading();

    this.account_service.get().subscribe(res => {
      let temp;
      this.account = res;
      this.account.monthlyExpenses.map(obj => {
        if (
          parseInt(obj.month) === this.currentMonth &&
          parseInt(obj.year) === this.currentYear
        ) {
          temp = obj;
        }
      });
      //console.log('Current State: ', this.account.monthlyExpenses);
      this.currentMonthData = this.fixData(temp);
      //var index = this.account.monthlyExpenses.indexOf(this.getCurrentMonthData());
      //console.log('The index of the month we are working with is: ', index);
      this.utils.hideLoading();
      //console.log(this.currentMonthData);
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

  ionViewDidLoad() {}

  //old function...
  getCurrentMonthData(date?) {
    var tempDate = this.currentDate;

    if (date) {
      tempDate = moment(this.currentDate).subtract(1, "month");
    }

    var data = this.account.monthlyExpenses.filter(
      item => item.month == tempDate.month() && item.year == tempDate.year()
    )[0];
    return data;
  } ///

  //add item
  add() {
    this.newExpense.date = new Date(); //date we added the line item.
    var index = this.account.monthlyExpenses.indexOf(
      this.getCurrentMonthData()
    );
    this.account.monthlyExpenses[index].expenseList.push(this.newExpense); //push the new line item to the current month
    this.resetNewExpense();

    document.getElementById("company").focus();
    //console.log('Account after expense added', this.account);
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

  saveAccount() {
    //console.log('@@@Saving Account...');
    this.calcEndBalance()
      .then(() => {
        this.account_service.save(this.account).subscribe(res => {
          this.utils.showPromptOk(
            "Complete!",
            "The account information has been saved!",
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
    if (this.currentMonthData.expenseList) {
      var total = 0.0;
      for (var i = 0; i < this.currentMonthData.expenseList.length; i++) {
        if (
          this.currentMonthData.expenseList[i].amountPaid &&
          !this.currentMonthData.expenseList[i].cleared
        ) {
          total += parseFloat(this.currentMonthData.expenseList[i].amountPaid);
        }
      }

      return total.toFixed(2);
    } else {
      return 0.0;
    }
  } //end get uncleared total.

  calcEndBalance() {
    return new Promise((resolve, reject) => {
      let uct = Number(this.getUnClearedTotal());
      this.currentMonthData.startBalance = parseFloat(
        this.fixCurrency(this.currentMonthData.startBalance)
      );
      //console.log('The start balance is:', parseFloat(this.fixCurrency(this.currentMonthData.startBalance)), ' |' , 'The uncleared total is: ', uct);
      this.currentMonthData.endBalance = (
        this.currentMonthData.startBalance - uct
      ).toFixed(2);
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
    //increment date and year accordingly.
    this.currentDate = moment(this.currentDate).add(1, "month");
    //console.log('@@NEXT: ', this.currentDate.month(), this.currentDate.year());
    let temp = this.account.monthlyExpenses.filter(
      item =>
        item.month == this.currentDate.month() &&
        item.year == this.currentDate.year()
    )[0];
    //console.log('Checking to see if we have data for the current month: ' ,temp);
    if (!temp) {
      console.log("We dont have data for the current month so lets build it.");
      temp = {
        month: this.currentDate.month(),
        year: this.currentDate.year(),
        expenseList: []
      };
    }
    //now lets fix the data...
    this.currentMonthData = this.fixData(temp);
    //console.log('Push the new data to the array current array count is: ', this.account.monthlyExpenses.length);
    this.account.monthlyExpenses.push(this.currentMonthData);
    //console.log('The new array count is: ', this.account.monthlyExpenses.length);
  }

  back() {
    //increment date and year accordingly.
    this.currentDate = moment(this.currentDate).add(-1, "month");
    //console.log('@@BACK: ', this.currentDate.month(), this.currentDate.year());
    //console.log('@@BACK: ', this.currentDate);
    //localStorage.setItem("date", this.currentDate);
    let temp = this.account.monthlyExpenses.filter(
      item =>
        item.month == this.currentDate.month() &&
        item.year == this.currentDate.year()
    )[0];
    //set the data.
    this.currentMonthData = this.fixData(temp);
    /**
     * This logic should not apply because anything in the past should already be created.
     * console.log('Checking to see if we have data for the current month: ' ,temp);
    if (!temp) {
      console.log('We dont have data for the current month so lets build it.');
      temp = {
        month: (this.currentDate.month()-1).toString(),
        year: this.currentDate.year().toString(),
        expenseList: []
      };
    }
    //now lets fix the data...
    this.currentMonthData = this.fixData(temp);
    console.log('Push the new data to the array current array count is: ', this.account.monthlyExpenses.length);
    this.account.monthlyExpenses.push(this.currentMonthData);
    console.log('The new array count is: ', this.account.monthlyExpenses.length);
    */
  } //

  copyLastMonth() {
    this.utils.showConfirm(
      "Please confirm",
      "Are you sure you want to copy last month's data? Any current data will be lost!",
      data => {
        //cancel
        console.log("Nevermind..");
      },
      data => {
        //ok
        var index = this.account.monthlyExpenses.indexOf(
          this.getCurrentMonthData()
        );
        console.log(index);
        var lastIndex = index - 1;
        if (
          this.account.monthlyExpenses[lastIndex].expenseList &&
          this.account.monthlyExpenses[lastIndex].expenseList.length > 0
        ) {
          this.account.monthlyExpenses[
            index
          ].startBalance = this.account.monthlyExpenses[lastIndex].startBalance;
          this.account.monthlyExpenses[
            index
          ].endBalance = this.account.monthlyExpenses[lastIndex].endBalance;
          this.account.monthlyExpenses[
            index
          ].expenseList = this.account.monthlyExpenses[lastIndex].expenseList;
          this.currentMonthData = this.account.monthlyExpenses[index];
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
    this.currentMonthData.expenseList.map(obj => {
      obj.amountPaid = 0.0;
    });
    this.calcEndBalance();
  }

  clearAmountDue() {
    this.currentMonthData.expenseList.map(obj => {
      obj.amountDue = 0.0;
    });
    this.calcEndBalance();
  }

  clearCleared() {
    this.currentMonthData.expenseList.map(obj => {
      obj.cleared = false;
    });
    this.calcEndBalance();
  }

  getTotalPaid() {
    if (this.currentMonthData.expenseList) {
      var total = 0;
      for (var i = 0; i < this.currentMonthData.expenseList.length; i++) {
        if (this.currentMonthData.expenseList[i].amountPaid) {
          total += parseFloat(this.currentMonthData.expenseList[i].amountPaid);
        }
      }
      return total;
    } else {
      return 0.0;
    }
  } //end get total paid.
} //end component
