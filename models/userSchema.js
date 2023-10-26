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
  myBoards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  }],
  participatedBoards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  }]
});

const User = mongoose.model('userSchema', userSchema);

module.exports = User;
