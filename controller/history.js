const History=require("../model/history");
const axios=require("axios");


exports.getHistory = async (req, res) => {
    try {
  
      const history = await History.find();
  
      res.status(201).json({success: true,history});
    } catch (e) {
      console.error(e);
    }
  }