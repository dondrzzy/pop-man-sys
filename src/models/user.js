const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');

//middleware to prevent storing of empty blanks
let emailLengthChecker = function(email){
    if(!email){return false}
    else{
        if(email.length<5||email.length>30){
            return false;
        }else{
            return true;
        }
    }
}
//valid email checker
let validEmailChecker = function(email){
    if(!email) {return false;}
    else{
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}

let passwordLengthChecker = function(password){
    if(!password){return false}
    else{
        if(password.length<8||password.length>35){
            return false;
        }else{
            return true;
        }
    }
}
let validPassword = function(password){
    if(!password){return false;}
    else{
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
}

const emailValidators = [
    { validator:emailLengthChecker, message:'Email must be atleast 5 characters but no more than 30'},
    {validator:validEmailChecker, message:'Email is invalid'}
];
const passwordValidators = [
    {validator:passwordLengthChecker, message:'password must be atleast 8 characters but no more than 35'},
    {validator:validPassword, message:'Password must have atlease one uppercase, lowercase, special character and number'}
];

const UserSchema = mongoose.Schema({
    email:{type:String, required:true, unique:true, lowercase:true, validate:emailValidators}, 
    password:{type:String, required:true,  validate:passwordValidators, select:false},
    createdAt:{ type:Date, default:Date.now() }
});

//Encrypt passwords before storing them in the database
UserSchema.pre('save', function(next){
    var user = this;
    if(!this.isModified('password')) return next();
    bcrypt.hash(this.password, null, null, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();  
    });
    
});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);
