const express          = require("express");
const { userAuth }     = require("../middlewares/auth");
const paymentRouter    = express.Router();
const razorpayInstance = require("../utils/razorPay")
const Payment          = require("../models/payment");
const User             = require("../models/user");
const membershipAmount = require("../utils/constants");

paymentRouter.post("/payment/create", userAuth, async(req, res) => {

    try{

        const { membershipType } = req.body;

        // Without signup razorpay it wont work because secret keys are invalid

       /* const orders = await razorpayInstance.orders.create({
            "amount": 50000,
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {
                firstName: "value3",
                lastName: "value2",
                membershipType:"Silver"
            }
        })*/

        const payment = new Payment({
            userId:req.user._id,
            orderId:"order1255656565",
            paymentId:"payment66768877",
            amount:membershipAmount[membershipType] * 100,
            currency:"INR",
            receipt:"rec5656576",
            notes: {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                emailId: req.user.emailId,
                membershipType: membershipType
            },
            status:"created"
        })

        const savePayment = await payment.save();

        res.status(200).json({
           ...payment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID
        })


    } catch(err) {
        res.status(400).json({
            msg: err
        })

    }

});

paymentRouter.post("/payment/webhook/", async(req,res) => {
    try{

        const webhookSignature = req.get("x-razorpay-signature");

        const isWebhookValid =  validateWebhookSignature(
                JSON.stringify(req.body), 
                webhookSignature, 
                process.env.RAZORPAY_WEBHOOK_SECRET
            )
        if(!isWebhookValid){
           return res.status(400).json({ msg: "Webhook Signature is invalid..!"})
        }
        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({ orderId:paymentDetails.order_id});
        payment.status = paymentDetails.status;
        await payment.save();

        const user = await User.findOne({ _id: payment.userId});
        user.ispremium      = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        // if(req.body.event === "payment.captured"){

        // }
         // if(req.body.event === "payment.failed"){

        // }
        return res.status(200).json({ msg : "Webhook recevied successfully ..!" })
       
    } catch(err) {
        res.status(400).json({
            msg: err
        })

    }
})





module.exports = paymentRouter;