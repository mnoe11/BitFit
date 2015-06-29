var unirest = require('unirest');
var mongoose = require( 'mongoose' );
require('./models/Users');
mongoose.connect('mongodb://' + process.env.MONGO_HOST + '/bit-fit');

var User = mongoose.model('User');

var bitcoin = require("bitcoinjs-lib");
var bigi    = require("bigi");
var buffer  = require('buffer');

var getPreviousMonth = function(month) {
  if (month = 1) {
    return 12;
  }
  else {
    return month - 1;
  }
};

User.find({}, function(err, users) {

  users.forEach(function(user) {
    if (user.githubHandle) {
      unirest.get('https://api.github.com/users/' + user.githubHandle + '/events')
             .header('User-Agent', 'BitFit cronjob')
             .end(function (response) {

               if (response.body == null) { return; }

               var numCommitLastMonth = response.body.filter(function (commit) {

                 var previousMonth = getPreviousMonth(new Date().getMonth());
                 var commitMonth = new Date(commit.created_at).getMonth();
                 return commit.type == "PushEvent" && previousMonth == commitMonth;

               }).length;

               if (numCommitLastMonth < user.monthlyCommitGoal) {

                 console.log(user.myBitcoinAddress);
                 console.log("A");
                 console.log(user.destinationBitcoinAddress);
                var newtx = {
                   inputs: [{ addresses: [ user.myBitcoinAddress ] }],
                   outputs: [{addresses: [user.destinationBitcoinAddress], value: user.satoshiPenaltyAmount}]
                };

                unirest.post('https://api.blockcypher.com/v1/bcy/test/txs/new')
                       .type('json')
                       .send(newtx)
                       .end(function(tmptx) {
                         tmptx = tmptx.body;

                         var key = new bitcoin.ECKey(bigi.fromHex(user.myBitcoinPrivateKeyHex), true);

                         // signing each of the hex-encoded string required to finalize the transaction
                         tmptx.pubkeys = [];
                         tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
                           tmptx.pubkeys.push(key.pub.toHex());
                           return key.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
                         });
                         // sending back the transaction with all the signatures to broadcast
                         unirest.post('https://api.blockcypher.com/v1/bcy/test/txs/send')
                          .type('json')
                          .send(tmptx)
                          .end(function(finaltx) {
                           user.totalPaidOut = user.totalPaidOut + user.satoshiPenaltyAmount;
                           user.save();
                           console.log("Charged user " + user.username + " " + user.satoshiPenaltyAmount);
                         })
                       });

               }

             });
    }

  });

});
