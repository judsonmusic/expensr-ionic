var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ExpensesSchema   = new Schema({
    userId: String,
    month: Number,
    year: Number,
    startBalance: String,
    endBalance: String,
    expenseList: Array
});

module.exports = mongoose.model('Expenses', ExpensesSchema);