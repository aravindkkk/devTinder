const express                = require("express");
const requestRouter          = express.Router();
const { userAuth }           = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User                   = require("../models/user");

requestRouter.post("/request/:status/:toUserId", userAuth,  async (req, res) => {

    try{

        const authUser = req.user;//user details from userAuth

        const fromUserId = authUser._id;
        const status     = req.params.status;
        const toUserId   = req.params.toUserId;

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({
                message:"User not found ..!",
                success:false,
            })
        }

        const allowedStatus = ['ignored', 'intrested'];
        if(!allowedStatus.includes(status)){

            return res.status(400).json({
                message:"Invalid Status Type..!" + status,
                success:false,
            })

        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
            { fromUserId, toUserId },
            { fromUserId:toUserId, toUserId:fromUserId }
            ],
        })

        if(existingConnectionRequest){

            return res.status(400).json({
                message:"Already sent the connection before you sent..!" ,
                success:false,
            })
        }

         const connectionRequestData = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        });

      const data = await connectionRequestData.save();
        res.status(200).json({
        message: authUser.firstName + " is " + status + " in " + toUser.firstName,
        data,
        success: true,
      });


    } catch (err) {

        res.status(400).send("ERROR : " + err.message);
    }

});

requestRouter.post("/review/:status/:requestId", userAuth,  async (req, res) => {
    try{

        loggedInuser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
           return  res.status(400).json({
                message: "Status not allowed..!",
                success: false,
            })
        };
        const connectionRequestData = await ConnectionRequestModel.findOne({
            
            _id:requestId,
            toUserId:loggedInuser._id,
            status:"intrested"
        });

        if(!connectionRequestData){
            return  res.status(400).json({
                message: "Connection request not found..!",
                success: false,
            })
        }

        connectionRequestData.status = status;
        const data = await connectionRequestData.save();
        res.status(200).json({
            message: "Connection request " + status,
            data,
            success: true,
        });
        

    } catch (err) {
        res.status(400).send("Errpr : " + err.message);
    }
});

module.exports = requestRouter;