const mongoose = require('mongoose');

const signalSchema=new mongoose.Schema({
    Symbol:{
        type:String,
        default:"BTCUSDT"
    },
    SignalPlan:{
        type:String,
        default:null
    },
    SignalType:{
        type:String,
        default:null
    },
    Category:{
        type:String,
        default:null
    },
    MarketPrice:{
        type:Number,
        default:null
    },
    Target:[Number],
    EntryPrice:{
        type:Number ,
        default:null
    },
    StopLoss:{
        type:Number ,
        default:null
    },
    Status:{
        type:String ,
        default:"open"
    },
});

module.exports = mongoose.model("Signal", signalSchema);


// https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
