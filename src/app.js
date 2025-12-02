const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json());// convert json object to js object


app.post("/signup", async (req, res) => {

    const user = new User(req.body);

    try{
        await user.save();
       // await user.save({ timestamps: { createdAt: true, updatedAt: false } });
        res.send("User Added Successfully!");
    }catch (err) {
        res.status(400).send("Error saving the user:" + err.message);
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


