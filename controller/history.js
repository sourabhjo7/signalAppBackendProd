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
  exports.getHistoryBySignalID=async(req,res)=>{
       
    try {
      const {id} = req.params;
      console.log(id);
     const indiHistory= await History.find({signalId:id});
  console.log(indiHistory);
      res.status(201).json({success: true,indiHistory});
  
    } catch (e) {
        console.error();
    }
    }