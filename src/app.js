const express      = require("express");
const connectDB    = require("./config/database");
const app          = express();
const cookieParser = require("cookie-parser");
const cors         = require("cors");
// const  dotenv      = require("dotenv");
// dotenv.config({ path: ".env" });
require("dotenv").config();

app.use(express.json());// convert json object to js object
app.use(cookieParser());// reading jwt cookies parcer

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const authRouter    = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter    = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
.then(() => {
  
    console.log("Database connection established....");
    
    app.listen(process.env.PORT, () => {
    console.log("Server is Successfully listening on port 3000..!");
});

})
.catch((err) =>{

    console.error("Database cannot be connected!!");

});


