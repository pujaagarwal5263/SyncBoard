const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  profileURL:{
    type: String
  }
});

const User = mongoose.model('userSchema', userSchema);

module.exports = User;
