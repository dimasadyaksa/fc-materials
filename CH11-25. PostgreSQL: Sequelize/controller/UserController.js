const jwt = require('jsonwebtoken');


class UserController {
  #userRepository;
  #jwtSecret = process.env.JWT_SECRET || 'secret'; 

  constructor(userRepository) {
    this.#userRepository = userRepository;
  }

  register = async (req,res)=>{ 
    const {username,email,password} = req.body;
    console.log(username,email,password);
    const result = await this.#userRepository.create(username,email,password);
    if(!result.ok){
      res.status(400).json({message: result.reason});
      return
    }

    res.status(201).json({message: 'User created successfully',data:{username}});
  }


  login = async (req,res)=>{
    const {username,password} = req.body;

    const result = await this.#userRepository.findByUsernamePassword(username,password);
    if(!result.ok){
      res.status(400).json({message: result.reason});
      return
    }

    res.status(200).json({
      message: 'User logged in successfully',
      token: jwt.sign({ username: username }, this.#jwtSecret),
    });
  }
}

exports.UserController = UserController;