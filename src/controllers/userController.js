const User = require('../models/user');
const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = {
  getAllUsers: (req, res) => {
    User.find((err, users) => {
      if (err) {
        return res.status(400).json({error: err});
      }
      return res.status(200).json({users});
    });
  },
  registerUser: (req, res) => {
    let errors = {};
    if (!req.body.email) {
      errors.email = 'Please provide an email';
    }
    if (!req.body.password) {
      errors.password = 'Please provide a password';
    }
    if (Object.keys(errors).length) {
      return res.status(400).json({errors});
    };
    var user = new User({
      email:req.body.email,
      password: req.body.password
    });

    user.save(function(err) {
      if (err) {
        const duplicateMsg = 'Email already exists';
        return res.status(400).json({error: err.code === 11000 ? duplicateMsg : err});
      } else {
        return res.status(201).json({'message':'User Successfully registered'});
      }
    });     
  },
  loginUser: (req, res) => {
    let errors = {};
    if(!req.body.email){
      errors.email = 'You must provide an email';
    }
    if(!req.body.password){
      errors.password = 'You must provide a password';
    }
    if (Object.keys(errors).length) {
      return res.status(400).json({errors});
    };
    User.findOne({email:req.body.email}).select('password').exec(function(err, user){
      if(err){
        return res.json({error:err});
      }
      if (!user) {
        res.status(404).json({error:'User not found'});
      } else {
        const validPassword = user.comparePassword(req.body.password);
        if(!validPassword){
          return res.status(400).json({error:'Wrong password provided'});
        }
        const token = jwt.sign({
          userId:user._id,
          email: req.body.email
        }, config.secret, {expiresIn:86400}); 
        res.status(200).json({token:token});                    
      }
    });
  }
}
