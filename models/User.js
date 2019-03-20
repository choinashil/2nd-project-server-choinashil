const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
  facebookId: {type: String, required: true},
  userName: {type: String, required: true},
  nickName: {type: String, required: true},
  photoUrl: {type: String, required: true},
  favorites: {type: Array, required: true}
});

UserSchema.statics.findOneByFacebookId = function(facebookId) {
  try {
    return this.findOne({ facebookId }).exec();
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model('User', UserSchema);
