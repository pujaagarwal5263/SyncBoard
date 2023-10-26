const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
    },
    boardId:{
      type: String,
    },
    boardName: {
      type: String,
    },
    hostID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  });
  
const Board = mongoose.model("Board", boardSchema); 
  
module.exports = Board;