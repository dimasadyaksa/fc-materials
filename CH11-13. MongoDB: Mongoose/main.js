const mongoose = require('mongoose')
const express = require('express')
const app = express()
const { UserRepository } = require('./model/UserRepository')
const { UserController } = require('./controller/UserController')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://user_app:admin@localhost:27017/users'
const PORT = process.env.PORT || 3000

const db = mongoose.createConnection(MONGODB_URI)
const userRepository = new UserRepository(db);
const userController = new UserController(userRepository)

app.use(express.json())
app.post('/register', userController.register)
app.post('/login', userController.login)

app.listen(PORT, () => {
  console.log('Server is running')
})