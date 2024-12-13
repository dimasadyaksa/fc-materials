const express = require('express');
const { Sequelize } = require('sequelize');
const { UserRepository } = require('./model/UserRepository');
const { UserController } = require('./controller/UserController');
const app = express();
const PORT = process.env.PORT || 8080;
const Redis = require('ioredis');

const db = new Sequelize(process.env.PG_URI || 'postgres://postgres:postgres@localhost:5432/twitter');
const redisClient = new Redis(process.env.REDIS_URI || 'redis://localhost:6379');

const userRepository = new UserRepository(db, redisClient);
const userController = new UserController(userRepository);

app.use(express.json());
app.post('/register', userController.register);
app.post('/login', userController.login);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
