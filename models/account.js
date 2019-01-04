var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AccountSchema   = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    monthlyExpenses: Array,
    date: Date
});

module.exports = mongoose.model('Account', AccountSchema);