const app = require("./app.js");

const PORT  = process.env.PORT||5000;
const http = require("http");
const server = http.createServer(app);
const axios = require("axios");
const cors = require("cors");
const { Server } = require("socket.io"); //framework to use web sockets
const Signal = require("./model/signal");
const History = require("./model/history");
let globalSignals;
async function first() {
  globalSignals = await Signal.find();
}
first();

//creating a new socket server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
var cron = require("node-cron");

// every hour update the global signal

cron.schedule("0 * * * *", async () => {
  globalSignals = await Signal.find();
});

// every minute job
cron.schedule(" * * * * *", async () => {
    await first();
  const PriceObj = {};
  const signals = globalSignals;
  signals.forEach(async (signal) => {
    // if not present then fetch marketprice so to keep minimum calls to binance in one cron job
    if (!(signal.Symbol in PriceObj)) {
      const d = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${signal.Symbol}`
      );
      PriceObj[signal.Symbol] = d.data.price; // in dollars
      console.log(PriceObj);
    }

    let data = {};
    if (Math.abs(signal.StopLoss - PriceObj[signal.Symbol]) < 1) {
      console.log("loss");
      const lossP =
        (Math.abs(signal.EntryPrice - signal.StopLoss) / signal.EntryPrice) *
        100;
      const history = await History.create({
        signalId: signal._id,
        status: "lose",
        stopLossReached: signal.StopLoss,
        LossPercent: lossP,
      });
      data = {
        title: "StopLoss",
        symbol: signal.Symbol,
        changePercentage: lossP,
        target: signal.StopLoss,
      };

      console.log("loss and history saved data is ==>", history);
    } else {
      signal.Target.forEach(async (target) => {
        if (Math.abs(target - PriceObj[signal.Symbol]) < 1 && target != "") {
          console.log("win");
          const profitP =
            (Math.abs(target - signal.EntryPrice) / signal.EntryPrice) * 100;
          const history = await History.create({
            signalId: signal._id,
            status: "win",
            targetReached: target,
            stopLossReached: profitP,
          });
          data = {
            title: "Target",
            symbol: signal.Symbol,
            changePercentage: profitP,
            target: target,
          };
          console.log("win and history saved data is ==>", history);
        }
      });
    }
    if (Object.keys(data).length != 0) {
      io.sockets.emit("broadcast", data);
    }
  });
  // end of iteration
});



io.on("connection", (socket) => {
      
  console.log(socket.id, " is connected");
});

app.post("/custom-notification", (req, res) => {
  console.log("notification received ");
  const {heading,des}=req.body;
  console.log("===>",heading,des);
  let  data = {
    title: "Custom-Notification",
    heading:heading,
    description:des
  };
  io.sockets.emit("broadcast", data);
res.status(200).json({success:"true"})
});

server.listen(PORT, () => console.log(`Server is running at port ${PORT}...`));
