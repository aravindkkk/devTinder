const express                 = require("express");
const userRouter              = express.Router();
const { userAuth }            = require("../Middlewares/auth");
const ConnectionRequestModel  = require("../models/connectionRequest");
const User                    = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoURL about age gender skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
       
        const loggedInUser = req.user;
        const connectionRequestData = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"intrested"
        }).populate("fromUserId", USER_SAFE_DATA);
       // .populate("fromUserId", ["firstName","lastName"]);
        if (connectionRequestData) {
            return res.status(200).json({
                connectionRequestData,
            });
        }

    } catch (error) {
        res.status(400).send("ERROR:" + error.message);
    }
});


userRouter.get("/user/connections/view", userAuth, async (req, res) => {
    try {
          
             const loggedInUser = req.user;

             const connectionRequestData = await ConnectionRequestModel.find({
                $or:[

                    { fromUserId:loggedInUser._id, status:"accepted" },
                    { toUserId:loggedInUser._id, status:"accepted" },
                ]
             }).populate("fromUserId toUserId", USER_SAFE_DATA);

             const data = connectionRequestData.map((row) => {
                if(row.fromUserId._id.toString() === loggedInUser._id.toString())
                {
                    return row.toUserId;
                }
                 return row.fromUserId;
             })

              res.status(200).json({
                data,
            });

        } catch (error) {
        res.status(400).send("ERROR:" + error.message);
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {

    try{

        const loggedInUser = req.user;
        const page  = parseInt(req.query.page || 1);
        let limit  = parseInt(req.query.limit || 10);
        limit      = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
       const connectionRequest = await ConnectionRequestModel.find({
         $or:[
            { fromUserId:loggedInUser._id },
            { toUserId:loggedInUser._id }
         ],
       }).select("fromUserId toUserId");

       const hideUsersFromFeed = new Set();//Set() => collection of unique data
       
       connectionRequest.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
       });

       const users = await User.find({
            $and:[
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ]

       }).select(USER_SAFE_DATA).skip(skip).limit(limit);

       
        res.status(200).json({
            data:users,
        });


    } catch(err){
        res.status(400).json({ messgae: err.message })
    }

});



module.exports = userRouter;