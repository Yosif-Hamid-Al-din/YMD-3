const AuthUser = require("../models/authUser");
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const cloudinary = require('cloudinary').v2
require('dotenv').config()
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const authUser_signout_post =  (req, res) => {
    res.cookie("jwt", "", {maxAge: 1});
    res.redirect("/")
  }

const authUser_profileImage_post =  function (req, res, next) {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWTSECRET_KEY); 
  cloudinary.uploader.upload(req.file.path, {folder: "YMD2/profile-imgs"} ,async (error, result)=>{
    if (result) {
      const avatar = await AuthUser.updateOne( {_id: decoded.id},{ profileImage: result.secure_url}  )
      res.redirect("/home")
    }
  });
}
  
  const authUser_welcome_get =   (req, res) => {
    res.render("welcome")
  }
  const authUser_login_get =    (req, res) => {
    res.render("auth/login")
  }
  const authUser_login_post =  async (req, res) => {
    const loginuser = await AuthUser.findOne({ email: req.body.email })
    if (loginuser == null) {
      res.json({notFoundEmail: 'Email not found'})
    } else {
      const match = await bcrypt.compare(req.body.password, loginuser.password);
      if (match) {
        var token = jwt.sign({ id: loginuser._id }, process.env.JWTSECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.json({id: loginuser._id})
      } else {
        res.json({wrongPassword:  `Wrong password for  ${req.body.email}` })
      }
    }
  }
  const authUser_signup_get = (req, res) => {
    res.render("auth/signup")
  }
  const authUser_signup_post =  async (req, res) => {
    try {
      const objError = validationResult(req);
      if (objError.errors.length > 0) {
        return res.json({ arrValidationError: objError.errors });
      }
  
      const isCurrentEmail = await AuthUser.findOne({email: req.body.email})
      if (isCurrentEmail) {
      return   res.json({ existEmail: "email already exist" });
      }
  
      const newUser = await AuthUser.create(req.body);
      var token = jwt.sign({ id: newUser._id }, process.env.JWTSECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.json({id: newUser._id})
    } catch (error) {
      console.log(error)
    }
  }
  

  module.exports ={
    authUser_signout_post,
    authUser_welcome_get,
    authUser_login_get,
    authUser_signup_get,
    authUser_signup_post,
    authUser_login_post,
    authUser_profileImage_post,
  }