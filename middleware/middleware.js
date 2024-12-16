var jwt = require("jsonwebtoken");
const AuthUser = require('../models/authUser')
var moment = require("moment");
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, "ymd2", (err) => {
        if (err) { res.redirect("/login"); } 
        else { next(); }
      });
    } else {
      res.redirect("/login")
    }
  }


  const checkifuser = (req, res, next) =>{
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, "ymd2",async (err,decoded) => {
        if (err) { res.locals.user = null;next() } 
        else { 
          const loginuser = await AuthUser.findById(decoded.id);
          res.locals.user = loginuser;
          next(); }
      });
    } 
    else {
      res.locals.user = null;
      next() 
    }
  }

  module.exports = {requireAuth, checkifuser}