const {isValidObjectId} = require("mongoose")
const {HttpError} = require("../helpers")

const isValidId = (req, _, next) =>{
    const {contactId} = req.params
    if(!isValidObjectId(contactId)){
        next  (HttpError(400, `this id :${contactId} was not valid`))
    }
    next()
}

module.exports = isValidId