const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema =new mongoose.Schema(
{
    firstName: {
        type: String,
        required:true,
        minLength:4,
        maxLength:50
         
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required:true,
        lowercase:true,
        index:true,
        trim:true,
        unique:true
    },
    password: {
        type: String,
    },
     url: {
        type: String,
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){

                throw new Error("Gender is not valid");
            }
        }
    },
    about: {
        type: String,
        default:"This is default skills"
    },
    skills: {
        type: [String],
    },

 },
{
  
  timestamps: true,
}

);

// for jwt & arrow function will not work here because of this keyword
userSchema.methods.getjwt = async function () {
const user = this;
const token = await jwt.sign({ _id: this._id }, "632103@divtinder", { expiresIn: "7d" })
return token;
}

userSchema.methods.validatePassword = async function (userInputPassword) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(userInputPassword, user.password);
    return isPasswordValid;

}


module.exports = mongoose.model("User", userSchema);