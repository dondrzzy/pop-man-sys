const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {updateChildLocations} = require('../controllers/locationController')

let validMale = function(num){
  if(!num){return false;}
  else{
      const regExp = new RegExp(/^\d/);
      return regExp.test(num);
  }
};

let validFemale = function(num){
  if(!num){return false;}
  else{
      const regExp = new RegExp(/^\d/);
      return regExp.test(num);
  }
};

const maleValidators = [
  { validator: validMale, message: 'Male residents entry is Invalid' }
];

const femaleValidators = [
  { validator: validMale, message: 'Female residents entry is Invalid' }
];


const locationScheme = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  female: { type: String, required: true, validate: maleValidators },
  male: { type: String, required: true, validate: femaleValidators },
  parentId: { type: String },
  createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Location', locationScheme);
