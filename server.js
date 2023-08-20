const app = require('./app')
const mongoose = require('mongoose');

const DB_HOST = "mongodb+srv://test:8ssgq0HGaL9dK1AJ@cluster0.svupp2w.mongodb.net/db-contacts?retryWrites=true&w=majority"

mongoose.connect(DB_HOST)
.then(() =>{
  console.log("Database connection successful")
  app.listen(3000, () => {
    console.log("Server running. Use our API on port: 3000")
  })
})
.catch((error) =>{
console.log(error)
process.exit(1)
})



