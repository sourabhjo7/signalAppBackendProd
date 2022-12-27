const Reward = require("../model/reward");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

exports.addNewReward = async (req, res) => {
  try {

    const {
      tittle,
      link
    } = req.body

    const file = req.files.selectedFile;

    let imageURL;
    await cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
      imageURL = result.url;
    });

    const reward = await Reward.create({
      tittle,
      link,
      imageURL
    });

    console.log(reward);

    res.status(201).json({success: true});
  } catch (e) {
    console.error(e);
  }
}

exports.getRewards = async (req, res) => {
  try {

    const rewards = await Reward.find();

    res.status(201).json({success: true, rewards});
  } catch (e) {
    console.error(e);
  }
}

exports.deleteReward = async (req, res) => {
  try {
    const {id} = req.body;

    await Reward.findByIdAndRemove(id);

    res.status(201).json({success: true});

  } catch (e) {
      console.error();
  }
}
