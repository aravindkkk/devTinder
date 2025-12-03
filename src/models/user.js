const mongoose = require("mongoose");

const userSchema = (
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

 }
// {
  
//   timestamps: true,
// }

);



module.exports = mongoose.model("User", userSchema);