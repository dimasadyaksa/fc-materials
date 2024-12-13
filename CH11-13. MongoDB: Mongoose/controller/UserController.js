const jwt = require('jsonwebtoken');

class UserController {
  #userRepository;
  #jwtSecret = process.env.JWT_SECRET || 'secret';

  constructor(userRepository) {
    this.#userRepository = userRepository;
  }

  register = async (req, res) => {
    const { email, password } = req.body;
    const { ok, data, reason } = await this.#userRepository.create(email, password);

    if (ok) {
      res.status(201).json({
        id: data._id,
        email: data.email
      });
    } else {
      res.status(400).json({
        reason: reason
      });
    }
  }

  login = async (req, res) => {
    const { email, password } = req.body;
    const { ok, data, reason } = await this.#userRepository.findByEmailPassword(email, password);

    if (ok) {
      res.status(200).json({
        token: jwt.sign({ email: data.email }, this.#jwtSecret)
      });
    } else {
      res.status(400).json({
        reason: reason
      });
    }
  }
}

module.exports = {
  UserController
};