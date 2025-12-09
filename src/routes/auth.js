const express                = require("express");
const authRouter             = express.Router();
const User                   = require("../models/user");
const bcrypt                 = require("bcrypt");
const { validateSignupData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
    try{
        validateSignupData(req);

        const { firstName, lastName, emailId, password, age, gender, skills } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            gender,
            skills
        });
        const savedUser =  await user.save();
        const token = await user.getjwt();
        res.cookie("token",token, {
            expires: new Date(Date.now() + 8 * 3600000) 
        });
        res.status(200).json({
             message: "User added successfully",
             data: savedUser
        })

        res.send("User Added Successfully!");
    }catch (err) {
        res.status(400).send("Error :" + err.message);
    }

})

authRouter.post("/login", async (req, res) => {
    try{

       const { emailId, password } = req.body;
       const user = await User.findOne({ emailId:emailId });
       if(!user){

           throw new Error("EmailId not found..!");
       }
       
       const isPasswordValid = await user.validatePassword(password);
       if(isPasswordValid){
            const token = await user.getjwt();
            res.cookie("token",token, {
             expires: new Date(Date.now() + 8 * 3600000) 
            });
           res.send(user);
       } else {
             throw new Error("Password is not correct..!");   
       }

    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }

})

authRouter.post("/logout", async (req, res) => {

    res.cookie("token", null, {

         expires: new Date(Date.now()),
    }).send("Logout Successfully..!");
})

module.exports = authRouter;
