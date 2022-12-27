const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../model/user");

exports.allusers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(201).json({ success: true, users });
  } catch (e) {
    console.error(e);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    await User.findByIdAndRemove(id);

    res.status(201).json({ success: true });
  } catch (e) {
    console.error();
  }
};
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      res.status(404).send("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send("User already exist");
    }

    const encPassword = await bcrypt.hash(password, 10);

    let urole = "user";
    if (req.body.userRole) {
      urole = req.body.userRole;
    }
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encPassword,
      role: urole,
    });
    user.password = undefined;

    res.status(201).json(user);
  } catch (e) {
    console.log(e);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      //token
      const token = jwt.sign(
        { user_id: user._id, email, role: user.role },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.password = undefined;

      // Setting Up cookies
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
      });
    }

    res.status(400).send("Email or password incorrect");
  } catch (e) {
    console.log(e);
  }
};

exports.logout = (req, res) => {
  console.log("logout route called ");
  console.log(req.cookies);
  res.clearCookie('token').send("done");
  
}
exports.updateUser=async(req,res)=>{
  const {firstName,lastName,email,password,userRole}=req.body;
    console.log({
      firstName,lastName,password,userRole
    })
      const {id}=req.params;
      if(password==''){ 
        User.findByIdAndUpdate({_id:id}, 
          {firstName,lastName,email,userRole},
          {new: true},
          function (err, docs) {
    if (err){
    console.log(err)
    }
    else{
    console.log("Updated User : ", docs);
    return res.status(201).json({success: true});
    } 
    });
      }  
      else{
        const encPassword = await bcrypt.hash(password, 10);
        User.findByIdAndUpdate({_id:id}, 
          {firstName,lastName,email,password:encPassword,userRole},
          {new: true},
          function (err, docs) {
    if (err){
    console.log(err)
    }
    else{
    console.log("Updated User : ", docs);
    return res.status(201).json({success: true});
    }
    
    
    });
      }    
      
}
     

exports.allusersById=async(req,res)=>{
    
  try {
      const {id} = req.params;
      console.log(id);
     const user= await User.findById(id);
  
      res.status(201).json({success: true,user});
  
    } catch (e) {
        console.error();
    }
}