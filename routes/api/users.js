const express = require('express')

const router = express.Router()

const ctrl = require("../../controllers/users")
const {isAuthenticate }= require("../../middlewares")


router.post('/register', ctrl.register)

router.post('/login', ctrl.login)

router.post('/logout',isAuthenticate, ctrl.logout)

router.get('/current', isAuthenticate, ctrl.current)

router.patch('/',isAuthenticate, ctrl.updateSubscriptionStatus)

module.exports = router