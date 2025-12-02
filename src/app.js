const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
app.use(express.json());// convert json object to js object
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
            res.send("Login Successfull!");
       } else {
             throw new Error("Password is not correct..!");   
       }

    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }

})

app.get("/user", async (req, res) => {

    const userEmail = req.body.emailId;

    try{

        const users = await User.findOne({ emailId:userEmail });
        if(users){
            
            res.send(users);

        }
        else{

             res.status(404).send("User not found..!")
        }

    } catch (err) {

        res.status(400).send("Somthing went wrong..!")

    }
})

app.get("/userAll", async (req, res) => {

    try{

        const users = await User.find({});
        if(users.length === 0){

              res.status(404).send("User not found..!")
        }
        else{
           
              res.send(users);
           
        }

    } catch (err) {

        res.status(400).send("Somthing went wrong..!")

    }
})

app.delete("/user", async (req, res) =>{
    const userId = req.body.userId;
    try{

        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully..!")

    }  catch (err) {

        res.status(400).send("Somthing went wrong..!")

    }

})

app.patch("/user", async (req, res) => {

    const userId = req.body.userId;
    const userData = req.body;
    try{

        const user = await User.findByIdAndUpdate(userId, userData, {
            returnDocument:"after",
            runValidators:true,
        });
        console.log(user);
        res.send("User updated successfully..!")

    }  catch (err) {

        res.status(400).send("Update failed" + err.message)

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


