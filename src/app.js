const express = require("express");
const app = express();

// app.use("/", (req, res) => {
//     res.send("Default route.. ")
// })

app.use("/test", (req, res) => {
    res.send("Server another route test .. ")
})

app.use("/main", (req, res) => {
    res.send("another route main ..")
})


app.listen(3000, () => {
 console.log("Server is successfully listening on port 3000");
});
