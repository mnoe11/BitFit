var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var validBitcoinAddress = function(bitcoinAddress) {
  return bitcoinAddress.length >= 26 && bitcoinAddress.length <= 35 ;
}

var UserSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, unique: true },
  githubHandle: String,
  destinationBitcoinAddress: { type: String, default: "", validate: [validBitcoinAddress, 'Invalid Bitcoin Address.'] },
  monthlyCommitGoal: { type: Number, min: 0, default: 15 },
  myBitcoinAddress: { type: String, default: "", validate: [validBitcoinAddress, 'Invalid Bitcoin Address.'] },
  myBitcoinPrivateKeyHex: { type: String, default: "" },
  myBitcoinPrivateKeyWif: { type: String, default: "" },
  myBitcoinPublicKey: { type: String, default: "" },
  satoshiPenaltyAmount: { type: Number, min: 5400, default: 0 },
  totalPaidOut: { type: Number, min: 0, default: 0 },
  hash: String,
  salt: String
});

// Hashes the User's password and saves
UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

// Validates that the given password hashes to the
// same password that is stored in the User Model
UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

// Generates a JSON Web Token for the User
UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, process.env.JWT_SECRET);
};

mongoose.model('User', UserSchema);
