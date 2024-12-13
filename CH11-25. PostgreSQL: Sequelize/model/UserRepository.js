const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');

const UserSchema = {
  username: {
    type: String,
    primaryKey: true
  },
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  created_at: DataTypes.DATE,
}

class UserRepository {
  #userModel;
  #redisClient;
  #saltRounds = 10;

  constructor(db, redisClient) {
    this.#redisClient = redisClient;
    this.#userModel = db.define('user', UserSchema, { schema: 'user_data', timestamps: false });
  }

  create = async (username, email, password) => {
    // Check key `user:username` in Redis
    // user:username -> true (if exists) && false (if not exists)
    // if user:username not exists in redis -> user not exists in database
    // after check in database, set user:username in redis
    const usernameExists = await this.#redisClient.get(`user:${username}`)
    if (usernameExists) {
      console.log("Cache Hit")
      return { ok: false, reason: 'User already exists' };
    }

    console.log("Cache Miss")

    password = bcrypt.hashSync(password, this.#saltRounds);
    const isExists = await this.#userModel.findByPk(username);

    await this.#redisClient.set(`user:${username}`, true);
    if (isExists) {
      return { ok: false, reason: 'User already exists' };
    }

    const result = await this.#userModel.create({ username, email, password, created_at: new Date() });
    return { ok: true, data: result };
  }

  findByUsernamePassword = async (username, password) => {
    const user = await this.#userModel.findByPk(username);
    if (!user) {
      return { ok: false, reason: 'User not found' };
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return { ok: false, reason: 'Invalid password' };
    }

    return { ok: true, data: user };
  }
}

exports.UserRepository = UserRepository;