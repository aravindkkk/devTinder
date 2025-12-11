const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");


cron.schedule("20 15 * * *", async () => {

    try{

        const yesterday      = subDays(new Date(), 0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd   = endOfDay(yesterday);

        const pendingConnectionReq = await ConnectionRequestModel.find({
            status:"intrested",
            createdAt: {
                $gte: yesterdayStart,
                $lt:yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        // [ ...new ] => converting to array
        const listOfEmails = [
            ...new Set(pendingConnectionReq.map((req) => req.toUserId.emailId))
        ];

        for(const email of listOfEmails){

            console.log(email);
        }




    } catch(err){
        console.error(err);
    }

})