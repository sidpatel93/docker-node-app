const User = require('../models/userModel')
const bcrypt = require('bcryptjs')


exports.signup = async (req, res, next) => {
  const {username, password} = req.body
  

  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
      username,
      password: hashedPassword
    });
    req.session.user = newUser
    res.status(200).json({
      status: "success",
      data: {
        user: newUser
      }
    })
  } catch(err) {
    res.status(400).json({
      status: "Fail",
    })
  }
}

exports.login = async (req, res, next) => {
  const {username, password} = req.body

  try {
    const user = await User.findOne({username})
    if(!user) {
      res.status(404).json({
        status: "Fail",
        message: "user not found"
      })
    }
    const isCorrect = await bcrypt.compare(password, user.password)
    if(isCorrect){
      req.session.user = user
      res.status(200).json({
        status: "success",
      })
    } else {
      res.status(400).json({
        status: "Fail",
        message: "incorrect username or password"
      })
    }
  } catch(err) {
    res.status(400).json({
      status: "Fail",
    })
  }
}