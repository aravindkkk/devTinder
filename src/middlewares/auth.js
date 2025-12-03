const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
   
    try{

        const { token } = req.cookies;
         if(!token)
        {
            throw new Error("Invalid token..!");
        }
        const isTokenValid = await jwt.verify(token, '632103@divtinder');
        const user = await User.findById(isTokenValid);
        if(!user)
        {
            throw new Error("User does not exits..!");
        }
        req.user = user;
        next();

    } catch (err) {

        res.status(400).send("Error :" + err.message)

    }
    
}

module.exports = {
    userAuth,
}