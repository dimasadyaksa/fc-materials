const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const { type } = require("os");

const UserSchema = Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
});

class UserRepository {
   #userModel;
   #saltRounds = 10;

   constructor(db) {
      this.#userModel = db.model('User', UserSchema);
   }

   create = async (email, password) => {
      console.log(await this.#userModel.find({ email: email }))
      const emailTaken = await this.#userModel.findOne({ email: email })
      if (emailTaken) {
         return { ok: false, reason: "email already taken" }
      }

      const salt = bcrypt.genSaltSync(this.#saltRounds);
      const passwordHash = bcrypt.hashSync(password, salt);

      const user = new this.#userModel({
         email: email,
         password: passwordHash,
      });

      const result = await user.save();
      return { ok: true, data: result };
   }

   findByEmailPassword = async (email, password) => {
      const user = await this.#userModel.findOne({ email: email })
      if (!user) {
         return { ok: false, reason: "user not found" }
      };

      const isPasswordMatch = bcrypt.compareSync(password, user.password);
      if (!isPasswordMatch) {
         return { ok: false, reason: "password is not match" };
      }

      return { ok: true, data: user };
   }
}

module.exports = {
   UserRepository
};
