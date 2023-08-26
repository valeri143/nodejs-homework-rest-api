const express = require('express')

const router = express.Router()

const ctrl = require("../../controllers/contacts")
const {isValidId, isAuthenticate }= require("../../middlewares")


router.get('/', isAuthenticate, ctrl.listContacts)

router.get('/:contactId',isAuthenticate, isValidId, ctrl.getContactById)

router.post('/', isAuthenticate, ctrl.addContact)

router.delete('/:contactId',isAuthenticate, isValidId, ctrl.removeContact)

router.put('/:contactId',isAuthenticate, isValidId, ctrl.updateContact)

router.patch('/:contactId/favorite',isAuthenticate, isValidId, ctrl.updateFavoriteStatus)

module.exports = router
