const express = require('express');
var router = express.Router();
const path = require('path');
const open = require('open');
const port = process.env.PORT || 3015;
const app = express();

const dotenv = require('dotenv').config()


const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const runMiddleware = require('run-middleware')(app);
const Account = require('./models/account');

const expenses = require("./middleware/expenses.api");



const opt = {
  user: 'expensr',
  pass: 'ExpensrDev1'
};

mongoose.connect(config.database, function (err) {
  if (err) {
    console.log('###################', err);
  } else {
    console.log('############################ Connected');
  }
});

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(cors());
app.set("superSecret", config.secret);
app.use('/api', router);
app.use('/api/expenses', expenses);

// route middleware to verify a token, dont need this for things like create account etc..
router.use(function (req, res, next) {
  //console.log('Routing you...', req.url);
  var publicUrls = ['/authenticate', '/accounts'];
  if (publicUrls.indexOf(req.url) > -1) {
    //console.log('This is a public URL', req.url.split("/"));
    //this is a public url
    next();

  } else {
    //console.log('Need a token to be here...', req.headers['x-access-token']);
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //console.log('Route', token);
    // decode token
    if (token) {
      //console.log('They have a token...', app.get('superSecret'), req.headers['x-access-token']);
      // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), function (err, decoded) {
        if (err) {
          //console.log('There was an error validating token:', err);
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          //console.log('Your token is valid!');
          req.decoded = decoded;
          next();
        }
      });

    } else {
      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });

    }
  }
});

router.post('/authenticate', function (req, res) {
  //console.log('Authenticate...');
  // find the user
  Account.findOne({
    email: req.body.email,
    password: req.body.password
  }, function (err, account) {


    if (err) {
      //console.log('There was an error finding the account...', err);
      res.send(err).end();

    }

    if (!account) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (account) {

      //console.log('We found an account!', account);

      // check if password matches
      if (account.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        //console.log('*****ACCOUNT', account);
        var token = jwt.sign(account.password, app.get('superSecret'), {
          //expiresIn: 60 * 60 * 5 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          user: account
        });
      }

    }

  });
});////////

// on routes that end in /accounts/:account_id
// ----------------------------------------------------
router.route('/accounts/:account_id')

  .get(function (req, res) {

    Account.findById(req.params.account_id, function (err, account) {
      if (err)
        return res.status(500).send(err);
      res.status(200).send(account);
    });
  })

  .put(function (req, res) {

    // use our account model to find the account we want
    Account.findById(req.params.account_id, function (err, account) {

      if (err)
        return res.send(err);

      account.firstName = req.body.firstName;
      account.lastName = req.body.lastName;
      account.email = req.body.email;
      account.username = req.body.username;
      account.password = req.body.password;
      account.monthlyExpenses = req.body.monthlyExpenses;
      account.date = req.body.date;

      // save the account
      account.save(function (err, account) {
        if (err)
          return res.send(err);

        res.status(200).send({ message: 'Account updated!', account: account });

      });

    });
  })

  .delete(function (req, res) {
    Account.remove({
      _id: req.params.account_id
    }, function (err, account) {
      if (err)
        return res.send(err);

      res.status(200).send({ message: 'Successfully deleted' });
    });
  });



//SERVER////
// serve static assets normally
app.use(express.static(__dirname + '/www'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'www', 'index.html'));
});

app.listen(port, function () {
  console.log('server started on port ' + port);
  //open('http://localhost:' + port);
});

