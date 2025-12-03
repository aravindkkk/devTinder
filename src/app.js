const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());// convert json object to js object
app.use(cookieParser());// reading jwt cookies parcer
const bcrypt = require("bcrypt");




app.post("/signup", async (req, res) => {
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
        await user.save();
        res.send("User Added Successfully!");
    }catch (err) {
        res.status(400).send("Error :" + err.message);
    }

})

app.post("/login", async (req, res) => {
    try{

       const { emailId, password } = req.body;
       const user = await User.findOne({ emailId:emailId });
       if(!user){

           throw new Error("EmailId not found..!");
       }
       
       const isPasswordValid = await bcrypt.compare(password, user.password);
       if(isPasswordValid){
            const token = await jwt.sign({ _id: user._id }, "632103@divtinder",{ expiresIn:"1d"});
            res.cookie("token",token, {
             expires: new Date(Date.now() + 8 * 3600000) 
            });
            res.send("Login Successfull!");
       } else {
             throw new Error("Password is not correct..!");   
       }

    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }

})

app.get("/profile", userAuth,  async (req, res) => {

    try{

    const user = req.user;
    res.send(user);
    if(!user){
        throw new Error("User does not exits..!");
    }
    res.send(user);
  } catch (err) {
        res.status(400).send("Error :" + err.message);
    }
    
})


connectDB()
.then(() => {
    console.log("Database connection established....");
    app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});

})
.catch((err) =>{

    console.error("Database cannot be connected!!");

});


