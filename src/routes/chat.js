const express        = require("express");
const chatRouter     = express.Router();
const { userAuth }   = require("../middlewares/auth");
const Chat           = require("../models/chat");

chatRouter.get("/chat/:targetUserId", userAuth,  async (req, res) => {

    try {
        const userId = req.user._id;
        const targetUserId = req.params.targetUserId;

        let chat = await Chat.findOne(
            { 
                participants: { $all: [userId, targetUserId] 

            } 
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})



module.exports = chatRouter;