const User = require("../model/User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


//register controller
const register = async (req, res) => {
  try {
    //extract user info from req body
    const { username, email, password, role } = req.body;

    const checkExistingUser = await User.findOne({ $or: [{ username, email }] })
    if (checkExistingUser) {
      return res.status(400).json({
        sucesss: false,
        message: 'User is already exist.'
      })
    }

    //now, we have to hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //now,create new user and save in db
    const newCreatedUser = new User({
      username,
      email,
      password: hashPassword,
      role: role || 'user'
    })

    await newCreatedUser.save();

    if (newCreatedUser) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        data: newCreatedUser
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Unable to register user!'
      })
    }

  } catch (e) {
    console.log(e);
    res.status(500).json({
      sucesss: true,
      message: "Something went wrong!!"
    })
  }
}


//login controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //find if the current user is exists in db or not 
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn`t exist."
      })
    }

    //if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials."
      })
    }

    //create user token
    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })

    res.status(200).json({
      sucesss: true,
      message: "Logged in successfully.",
      token
    })

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: true,
      message: "Something went wrong!!"
    })
  }
}

module.exports = { register, login }