const {Users} = require("../models")
const Joi = require('joi')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")
const Jimp = require('jimp');
const path = require("path")
const fs = require("fs/promises")

const {HttpError, ctrlWrapper} = require('../helpers')
const {SECRET_KEY} = process.env

const userAddSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    subscription: Joi.string()
   })

const addSubscriptionSchema = Joi.object({
    subscription: Joi.string()
  })

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const register = async (req, res) => {
    const{error} = userAddSchema.validate(req.body)
      if(error){
        throw HttpError(400)
      }
    const {email, password} = req.body
    const user = await Users.findOne({email})
    if(user){
        throw HttpError(409, "Email in use")
    }
    const hashedPassword = await bcrypt.hash(password, 10)

const avatarURL = gravatar.url(email)

const newUser =  await Users.create({...req.body, password: hashedPassword, avatarURL})
res.status(201).json({
    user: {
        email : newUser.email,
        subscription: newUser.subscription || "starter"
    }
})
}

const login = async (req, res) => {
    const{error} = userAddSchema.validate(req.body)
    if(error){
      throw HttpError(400)
    }

    const {email, password} = req.body
    const user = await Users.findOne({email})
    if(!user){
        throw HttpError(401, "Email or password is wrong")
    }

    const comparedPassword = bcrypt.compare(password, user.password)
    if(!comparedPassword){
        throw HttpError(401, "Email or password is wrong")
    }

    const payload = {id: user._id}
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "24h"})

    res.status(200).json({
        token,
        user : {
            email : user.email,
            subscription: user.subscription || "starter"
        }
    })
}

const logout = async (req, res) => {
    const {_id: id} = req.user

    await Users.findByIdAndUpdate(id, {token:''})

    res.status(204)
}

const current = async (req, res) => {
    const {email, subscription} = req.user

    res.status(200).json({
        email,
        subscription
    })
}


const updateSubscriptionStatus = async (req, res) =>{
    const {_id: id} = req.user
    const {body} = req
      const {error} = addSubscriptionSchema.validate(body)
      if(error){
        throw HttpError(400,  "missing fields subscription")
      }
      const updatedSubscriptionStatus = await Users.findByIdAndUpdate(id ,body, {new: true})

      if(!updatedSubscriptionStatus){
        throw HttpError(404, "Not found")
      }
      res.status(200).json({...body, email: updatedSubscriptionStatus.email})
  }

  const updateAvatar = async (req, res) =>{
    const {_id: id} = req.user
    const {path : tempDir, originalname} = req.file
    const fileName = `${id}_${originalname}`

    Jimp.read(tempDir, (err, image) => {
        if (err) throw err;
        image
          .resize(250, 250) 
      });

    const resultUpload = path.join(avatarsDir, fileName)

    await fs.rename(tempDir, resultUpload)

    const avatarURL = path.join("avatars", fileName)
    await Users.findByIdAndUpdate(id, {avatarURL})

      res.status(200).json({avatarURL})
  }

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current),
    updateSubscriptionStatus: ctrlWrapper(updateSubscriptionStatus),
    updateAvatar: ctrlWrapper(updateAvatar)
}
