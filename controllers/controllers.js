const User = require("../models/userSchema");

const helloWorld = (req,res) =>{
    return res.send("Welcome to syncboard server")
}

const saveUser = async (req, res) => {
    try {
      const { name, email, profileURL } = req.body;
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(200).send("User already saved");
      }
  
      const newUser = new User({
        email,
        name,
        profileURL,
      });
  
      await newUser.save();
  
      return res.status(201).send("User saved");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
  };

module.exports={helloWorld,saveUser}