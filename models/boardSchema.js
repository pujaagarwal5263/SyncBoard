const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    boardId:{
      type: String,
      required: true,
    },
    boardName: {
      type: String,
    },
    hostID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userSchema", 
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userSchema'
    }]
  });
  
const Board = mongoose.model("Board", boardSchema); 
  
module.exports = Board;