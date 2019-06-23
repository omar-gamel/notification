const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('config');

exports.signUp = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = await new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hash,
        }).save();
        return res.status(201).json({ message: 'Signup Successfully.' });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
        const error = new Error('Email Not Exit.');
        error.statusCode = 404;
        throw error;
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
        const error = new Error('Password not match.');
        error.statusCode = 401;
        throw error;
    } 
    const token = jwt.sign({ _id: user._id }, config.get('jwtSecret'), { expiresIn: 600000 });
    res.json({ token:  'bearer ' + token, user:{ user: user } });
  } catch (err) {
    next(err);
  }
};

