const express      = require("express");
const connectDB    = require("./config/database");
const app          = express();
const cookieParser = require("cookie-parser");
const cors         = require("cors");
const http         = require("http");// this is for socket io configuration
require("dotenv").config();
require("./utils/cronJobs");


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
const paymentRouter = require("./routes/payment");
const chatRouter    = require("./routes/chat");
const initializationSocket = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);// this is for socket io configuration

initializationSocket(server);

connectDB()
.then(() => {
  
    console.log("Database connection established....");
    
    server.listen(process.env.PORT, () => {
    console.log("Server is Successfully listening on port 3000..!");
});

})
.catch((err) =>{

    console.error("Database cannot be connected!!");

});


