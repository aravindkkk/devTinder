const mongoose = require("mongoose");

const connectDB = async () =>  {
    await mongoose.connect(process.env.CONNECTION_DB_SECRET)
    
};

module.exports = connectDB;
