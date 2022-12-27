const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  tittle:{
    type: String,
    required: true
  },
  imageURL:{
    type: String,
  },
  link: {
    type: String
  }
})

module.exports = mongoose.model("Reward", rewardSchema);
