var express = require('express');
var router = express.Router();
var Expenses = require('../models/expenses');
var moment = require('moment');


router.route('/:userId')
    .put((req, res) => {

        Expenses.findById(req.body._id, function (err, exp) {

            if (err)
                return res.send(err);

            exp.expenseList = req.body.expenseList;        
            exp.startBalance = req.body.startBalance;
            exp.endBalance = req.body.endBalance;


            // save the account
            exp.save(function (err, doc) {
                if (err)
                    return res.send(err);

                res.send({
                    message: 'Expenses saved!',
                    expenses: doc
                });

            });

        });
    });

router.route('/:userId/:month?/:year?')
    .get((req, res) => {

        console.log('Getting Data!');

        let month = req.params.month || moment().format('M'); //this is required to make match on the year!
        let year = req.params.year || moment().year();
        console.log('Getting data for: ', month, year);

        Expenses.find({
            userId: req.params.userId,
            month: req.params.month,
            year: req.params.year
        }).exec(function (err, expenses) {
            //if expenses are null, we have to create a new record for the requested month.
            //lets find the last record that has expenses in it.
            if (err) res.status(500).send(err);
            if (!expenses) {
                Expenses.find({
                    "userId": req.params.userId,
                    expenseList: {
                        $exists: true,
                        $not: {
                            $size: 0
                        }
                    }
                }).exec(function (err2, doc) {
                    if (err2) res.status(500).send(err2);
                    if (doc[0]) {
                        var newDoc = new Expenses();
                        //newDoc = doc;
                        newDoc.month = moment().format('M');
                        newDoc.year = moment().format('YYYY');
                        newDoc.expenseList = doc[0].expenseList;
                        newDoc.userId = req.params.userId;
                        //console.log(newDoc);

                        // save the doc
                        newDoc.save(function (err, newExpenses) {
                            if (err) return res.status(500).send(err);
                            res.status(200).send({
                                expenses: newExpenses,
                                message: "Created New Record for this month."
                            });

                        });

                    } else {
                        res.status(500).send("There was an error trying to copy a previous expense.");
                    }
                    //res.status(200).send("ok");

                });


            } else {
                // console.log('We found the following...', expenses);
                res.status(200).send({
                    expenses: expenses[0],
                    message: "Normal Response"
                });
            }

        });
    });

module.exports = router; //what ever your export router name.