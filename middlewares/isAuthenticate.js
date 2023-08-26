const jwt = require("jsonwebtoken")
const {SECRET_KEY} = process.env

const {Users} = require("../models")
const {HttpError} = require("../helpers")

const isAuthenticate = async (req, res, next) =>{
    const {authorization = ""} = req.headers
    const [bearer, token] = authorization.split(" ")
    if(bearer !== "Bearer"){
        next(HttpError(401, "Not authorized"))
    }
    try {
        const {id} = jwt.verify(token, SECRET_KEY)
        const user = await Users.findById(id)
        if(!user){
            next(HttpError(401, "Not authorized"))
        }
        req.user = user
        next()    
    } catch {
        next(HttpError(401, "Not authorized"))
    }
}

module.exports = isAuthenticate