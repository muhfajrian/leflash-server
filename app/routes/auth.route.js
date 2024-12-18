module.exports = (app) => {
  require('dotenv').config()

  const jwt = require('jsonwebtoken');
  const User = require('../models/user.model');
  const router = require('express').Router();

  //register
  router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: 'User already exist' });
      }
      const user = new User({
        username, email, password,
      });

      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

  //login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    try {
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

      res.json({ token })
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

  app.use('/api/auth', router);
}