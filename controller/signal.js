const Signal = require("../model/signal");
const axios = require("axios");

exports.addNewSignal = async (req, res) => {
  try {
    const {
      Symbol,
      SignalPlan,
      SignalType,
      Category,
      Target,
      EntryPrice,
      StopLoss,
      Status,
    } = req.body;

    const d = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${Symbol}`
    );
    const MarketPrice = d.data.price; // in dollars

    const signal = await Signal.create({
      Symbol,
      SignalPlan,
      SignalType,
      Category,
      Target: Target.split(","),
      MarketPrice,
      EntryPrice,
      StopLoss,
      Status,
    });

    console.log(signal);

    res.status(201).json({ success: true });
  } catch (e) {
    console.error(e);
  }
};
// get all signals for manage signal route
exports.getSignals = async (req, res) => {
  try {
    const signals = await Signal.find();

    res.status(201).json({ success: true, signals });
  } catch (e) {
    console.error(e);
  }
};

// delete signal function
exports.deleteSignal = async (req, res) => {
  try {
    const { id } = req.body;

    await Signal.findByIdAndRemove(id);

    res.status(201).json({ success: true });
  } catch (e) {
    console.error();
  }
};

exports.updateSignal = async (req, res) => {
  const {
    Symbol,
    SignalPlan,
    SignalType,
    Category,
    EntryPrice,
    StopLoss,
    Target,
    Status,
  } = req.body;

  const { id } = req.params;

  Signal.findByIdAndUpdate(
    { _id: id },
    {
      Symbol,
      SignalPlan,
      SignalType,
      Category,
      EntryPrice,
      StopLoss,
      Target: Target.split(","),
      Status,
    },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", docs);
        return res.status(201).json({ success: true });
      }
    }
  );
};

// to get signal by id
exports.getSignalById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const signal = await Signal.findById(id);

    res.status(201).json({ success: true, signal });
  } catch (e) {
    console.error();
  }
};
