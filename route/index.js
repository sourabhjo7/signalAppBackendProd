const express = require("express");
const router = express.Router();

const {valToken} = require("../middleware/auth");
const controller = require('../controller/reward');//Requring Controllers
const SignalController=require('../controller/signal');
const {getHistory,getHistoryBySignalID}=require("../controller/history");
router.get("/", valToken, (req, res) => {
  res.status(200).json({page: "Home", user: req.userData});
});

router.post("/addreward", controller.addNewReward)

router.get("/getrewards", controller.getRewards)

router.post("/delreward", controller.deleteReward)

router.post("/addsignal", SignalController.addNewSignal);
router.get("/getsignals",  SignalController.getSignals);
router.post("/delsignal",  SignalController.deleteSignal);
router.post("/updatesignal/:id",SignalController.updateSignal);
router.get("/getsignals/:id",SignalController.getSignalById);
router.get("/gethistory",getHistory);
router.get("/gethistory/:id",getHistoryBySignalID);
module.exports = router
