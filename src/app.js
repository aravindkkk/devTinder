const express = require("express");
const app = express();



app.get("/user", (req, res) => {

    res.send({FName:"Aravind",LName:"Kumar"});
})

/* ab is ottional => ex: http://localhost:3000/ad*/
app.get("/a(bc)+d", (req, res) => {
 res.send({ firstName: "Akshay", lastName: "Saini" });
});

/* This will handle all the HTTP API Calls */
app.use("/test", (req, res) => {
    res.send("Server another route test .. ");
})




app.listen(3000, () => {
 console.log("Server is successfully listening on port 3000");
});
