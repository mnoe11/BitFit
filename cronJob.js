var unirest = require('unirest');
var mongoose = require( 'mongoose' );
require('./models/Users');
mongoose.connect('mongodb://localhost/bit-fit');

var User = mongoose.model('User');
var Chain = require('chain-node');
var chain = new Chain({
  keyId: '9d35e52837214172f097b6f5cacc8de5',
  keySecret: '54e377a4b11db3adb915f6f379d2b9cb',
  blockChain: 'testnet3'
});

var BlockIo = require('block_io');
var version = 2;
var block_io = new BlockIo('6881-3654-9813-36af', 'MesQueBarcelona1', version);

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

               var numCommitLastMonth = response.body.filter(function (commit) {

                 var previousMonth = getPreviousMonth(new Date().getMonth());
                 var commitMonth = new Date(commit.created_at).getMonth();
                 return commit.type == "PushEvent" && previousMonth == commitMonth;

               }).length;

               // ALL THAT IS LEFT IS TO IMPLEMENT BITCOIN PART AND CRONJOB
               if (numCommitLastMonth < user.monthlyCommitGoal) {
                 block_io.get_new_address({}, console.log);

               }

               console.log(numCommitLastMonth + ":" + user.monthlyCommitGoal);
             });
    }

  });

});
