const mongoose = require("mongoose");

const BoardIdTrackerSchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  hostType: {
    type: String,
    required: true,
  },
});

const BoardIdTracker = mongoose.model(
  "BoardIdTrackerSchema",
  BoardIdTrackerSchema
);

module.exports = BoardIdTracker;
