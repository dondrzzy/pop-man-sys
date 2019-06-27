var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
const jwt = require('jsonwebtoken');

// config
const config = require('./config');

const conn = require('./config/database');
conn.connect();

// routes
const locationRouter = require('./routes/locationRoutes');
const userRouter = require('./routes/userRoutes');

var app = express();

// add middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false 
}));


app.get('/', (req, res) => {
  return res.send('Welcome to POP-MAN-SYS. Check out the docs https://github.com/dondrzzy/sms-man-api/blob/master/README.md');
});

app.use('/api/v1/users', userRouter);

app.use(function(req, res, next){
  const token = req.headers['token-x'];
  if(!token){
      res.status(400).json({error:'No token provided'});
  }else{
    jwt.verify(token, config.secret, function(err, decoded){
      if (err) {
        res.status(400).json({token: false, error:'token Invalid: '+err});}
      else{
        req.decoded = decoded;
        next(); 
      }
    });
  }
});
app.use('/api/v1/locations', locationRouter);

module.exports = app;
