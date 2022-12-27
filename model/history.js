const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  signalId: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    required: true,
  },
  targetReached: {
    type: Number,
    default: null,
  },
  stopLossReached:{
    type: Number,
    default: null,
  },
  LossPercent:{
    type: Number,
    default: null,
  },
  ProfitPercent:{
    type: Number,
    default: null,
  },

});

module.exports = mongoose.model("History", historySchema);

// https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
