const {Contacts} = require("../models")
const Joi = require('joi')

const {HttpError, ctrlWrapper} = require('../helpers')

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean()
   })

const addFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
})

const listContacts = async (req, res) => {
  const {_id : owner} = req.user
  const {page = 1, limit = 20, favorite} = req.query 
  const skip = (page - 1) * limit
  if(favorite){
    const allContacts = await Contacts.find({owner, favorite},"", {skip, limit}).populate("owner", "name favorite")
      res.status(200).json(allContacts)
  }
  else{
    const allContacts = await Contacts.find({owner},"", {skip, limit}).populate("owner", "name favorite")
    res.status(200).json(allContacts)
  }
  }

const getContactById =async (req, res) => {
    const {contactId} = req.params
      const oneContact = await Contacts.findById(contactId)
      if(!oneContact){
        throw HttpError(404,"Not found")
      }
      res.status(200).json(oneContact)
  }

const addContact = async (req, res) => {
    const {body} = req
    const {_id : owner} = req.user
      const{error} = addSchema.validate(body)
      if(error){
        throw HttpError(400,  "missing required name field")
      }
      const addedContact = await Contacts.create({...body, owner})
      res.status(201).json(addedContact)
  }

const removeContact =  async (req, res) => {
        const {contactId} = req.params
       const deletedContact =  await Contacts.findByIdAndRemove({_id : contactId})
       if(!deletedContact){
        throw HttpError(404, "Not found")
      }
        res.status(200).json({message: "contact deleted"})
  }

const updateContact =async (req, res) => {
    const {contactId} = req.params
    const {body} = req
      const {error} = addSchema.validate(body)
      if(error){
        throw HttpError(400,  "missing fields")
      }
      const updatedContact = await Contacts.findByIdAndUpdate(contactId,body, {new: true})
      if(!updatedContact){
        throw HttpError(404, "Not found")
      }
      res.status(200).json(updatedContact)
  }

const updateFavoriteStatus = async (req, res) =>{
  const {contactId} = req.params
  const {body} = req
    const {error} = addFavoriteSchema.validate(body)
    if(error){
      throw HttpError(400,  "missing fields favorite")
    }
    const updatedStatusFavorite = await Contacts.findByIdAndUpdate(contactId,body, {new: true})
    if(!updatedStatusFavorite){
      throw HttpError(404, "Not found")
    }
    res.status(200).json(updatedStatusFavorite)
}

module.exports={
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),
    updateFavoriteStatus: ctrlWrapper(updateFavoriteStatus)
}