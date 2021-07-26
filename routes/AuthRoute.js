const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');

router.post("/register", async (req, res) => {
    try {
    //Hash users password with some salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.Password, salt);

    //Create the new user based on the params sent in the request
    const newUser = new User({
        Username: req.body.Username,
        Email: req.body.Email,
        Password: hashedPassword,
    });

    //Save new ueser and send response
    const user = await newUser.save();
    res.status(200).json(user);

    } catch (error) {
        console.log(error)
    }
})


router.post("/login", async (req, res) => {
    try{
    const user = await User.findOne({Email: req.body.Email});

    const validPasswd = await bcrypt.compare(req.body.Password, user.Password);

    if(!user || !validPasswd){
        res.status(404).json("User not found or invalid password");
    }
    else{
        
        const token = jsonwebtoken.sign({user: user.Username}, process.env.jwtSecret);
        res.cookie('token', token, {httpOnly: true});
        res.json({token});

    }

    } catch(error){
        res.status(500).json(error);
    }
})

module.exports = router