const express = require('express')

const router = express.Router()

const ctrl = require("../../controllers/users")
const {isAuthenticate, upload }= require("../../middlewares")


router.post('/register', ctrl.register)

router.post('/login', ctrl.login)

router.post('/logout',isAuthenticate, ctrl.logout)

router.get('/current', isAuthenticate, ctrl.current)

router.patch('/',isAuthenticate, ctrl.updateSubscriptionStatus)

router.patch('/avatars',isAuthenticate, upload.single("avatarURL"), ctrl.updateAvatar)

module.exports = router