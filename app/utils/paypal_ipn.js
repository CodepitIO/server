var net = require('net');
var string = require('eden-string');
var ipn = require('paypal-ipn');
var db = require('../../config/sequelize');
var config = require('../../config/paypal');
var mailer = require('../../config/mailer');

exports.verify = function(req, res, next) {

  var params = req.body;

  ipn.verify(params, function(err, msg) {
    if (!err) {
      var transaction_id = params.parent_txn_id || params.txn_id;
      var payment_date = Math.floor((new Date(params.payment_date)).getTime() / 1000);
      var payment_status = params.payment_status;
      var qtd_coins = config.types[params.option_selection1];
      var acc_id = params.custom;
      var gross_paid = params.payment_gross;
      var currency_paid = params.mc_currency;

      if (params.reason_code || params.receiver_email != config.email) {
        mailer.sendError({
          context: "reason_code received in IPN",
          error: params
        });
      }

      db.Transaction.findOrCreate({
        where: {
          id: transaction_id
        },
        defaults: {
          id: transaction_id,
          date: payment_date,
          status: payment_status,
          coins: qtd_coins,
          account_id: acc_id,
          gross: gross_paid,
          currency: currency_paid
        }
      }).success(function(transaction, created) {
        if (!created && transaction.status != payment_status) {
          var in1 = transaction.status;
          var in2 = payment_status;
          if (failTransaction(in1) || canceledReversedTransaction(in1)) {
            return;
          }
          if (completedTransaction(in1) && !reversedTransaction(in2)) {
            return;
          }
          if (reversedTransaction(in1) && !canceledReversedTransaction(in2)) {
            return;
          }

          transaction.status = payment_status;
          transaction.save().success(function() {});
        }
      }).error(function(err) {
        mailer.sendError({
          context: "Trying to save a transaction, something happened",
          error: err
        });
      });
    }
  });

}

var failTransaction = function(in1) {
  return in1 === 'Denied' || in1 === 'Expired' || in1 === 'Failed' || in1 === 'Voided';
}

var completedTransaction = function(in1) {
  return in1 === 'Completed';
}

var canceledReversedTransaction = function(in1) {
  return in1 === 'Canceled_Reversal';
}

var reversedTransaction = function(in1) {
  return in1 === 'Reversed' || in1 === 'Refunded';
}
