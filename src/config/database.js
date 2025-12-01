const mongoose = require("mongoose");

const connectDB = async () =>  {
    await mongoose.connect(
        "mongodb+srv://aravindsujithh_db_user:pW9vsIoLxnOsnHPr@firstnodeproject.4qo9tqe.mongodb.net/devTinder"
    )
};

module.exports = connectDB;
