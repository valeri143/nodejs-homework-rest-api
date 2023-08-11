const contacts = require('../models/contacts')
const Joi = require('joi')

const {HttpError, ctrlWrapper} = require('../helpers')

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required()
   })

const listContacts = async (req, res, next) => {
      const allContacts = await contacts.listContacts()
      res.status(200).json(allContacts)
  }

const getContactById =async (req, res, next) => {
    const {contactId} = req.params
      const oneContact = await contacts.getContactById(contactId)
      if(!oneContact){
        throw HttpError(404,"Not found")
      }
      res.status(200).json(oneContact)
  }

const addContact = async (req, res, next) => {
    const {body} = req
      const{error} = addSchema.validate(body)
      if(error){
        throw HttpError(400,  "missing required name field")
      }
      const addedContact = await contacts.addContact(body)
      res.status(201).json(addedContact)
  }

const removeContact =  async (req, res, next) => {
        const {contactId} = req.params
       const deletedContact =  await contacts.removeContact(contactId)
       if(!deletedContact){
        throw HttpError(404, "Not found")
      }
        res.status(200).json({message: "contact deleted"})
  }

const updateContact =async (req, res, next) => {
    const {contactId} = req.params
    const {body} = req
      const {error} = addSchema.validate(body)
      if(error){
        throw HttpError(400,  "missing fields")
      }
      const updatedContact = await contacts.updateContact(contactId,body)
      if(!updatedContact){
        throw HttpError(404, "Not found")
      }
      res.status(200).json(updatedContact)
  }

module.exports={
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact)
}