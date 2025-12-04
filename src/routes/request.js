const express                = require("express");
const requestRouter          = express.Router();
const { userAuth }           = require("../Middlewares/auth");
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

         const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
         res.status(200).json({
        message: authUser.firstName + " is " + status + " in " + toUser.firstName,
        data,
        success: true,
      });


    } catch (err) {

        res.status(400).send("ERROR : " + err.message);
    }

});

module.exports = requestRouter;