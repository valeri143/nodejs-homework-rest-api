const fs = require('fs/promises')
const path = require("path")
const {nanoid} = require('nanoid')

const contactsPath = path.join(__dirname, "contacts.json")

const listContacts = async () => {
  const allContacts = await fs.readFile(contactsPath)
  return JSON.parse(allContacts) 
}

const getContactById = async (contactId) => {
  const allContacts = await listContacts()
  const oneContact = allContacts.find(({id}) => contactId === id)
  return oneContact || null
}

const removeContact = async (contactId) => {
  const allContacts = await listContacts()
  const index = allContacts.findIndex(({id}) => contactId === id)
  if(index === -1){
      return null
  }
  const [deletedContact] = allContacts.splice(index, 1)
  await fs.writeFile(contactsPath, JSON.stringify(allContacts,null,2))
  return deletedContact
}

const addContact = async (body) => {
  const allContacts = await listContacts()
  const newContact = {
      id: nanoid(),
      ...body
  }
  allContacts.push(newContact)
  await fs.writeFile(contactsPath, JSON.stringify(allContacts,null,2))
  return newContact
}

const updateContact = async (contactId, body) => {
  const allContacts = await listContacts()
  const index = allContacts.findIndex(({id}) => contactId === id)
  if(index === -1){
      return null
  }
  allContacts.splice(index, 1, {
    id:contactId,
    ...body
  })
  await fs.writeFile(contactsPath, JSON.stringify(allContacts,null,2))
  return allContacts[index]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
