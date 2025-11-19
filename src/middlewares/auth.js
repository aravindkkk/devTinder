const adminAuth = (req, res, next) => {
   
    const token ="xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("unAuthorized Admin Request")
    }
    else{
        next();
    }

}

const userAuth = (req, res, next) => {
   
    const token ="abc";
    const isAdminAuthorized = token === "abc";
    if(!isAdminAuthorized){
        res.status(401).send("unAuthorized user Request")
    }
    else{
        next();
    }

}

module.exports = {
    adminAuth,
    userAuth,
}