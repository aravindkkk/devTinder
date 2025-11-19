const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");



app.use("/admin", adminAuth);


app.get("/user", userAuth, (req, res) => {
   res.send("All user Records...");
   
}
);

app.get("/admin/getAllData", (req, res) => {
    res.send("All Admin Records...");
   
}
);

app.delete("/admin/delete", (req, res) => {
    res.send("Delete Admin Records...");
   
}
);


app.listen(3000, () => {
 console.log("Server is successfully listening on port 3000");
});
