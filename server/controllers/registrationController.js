const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/users');

exports.register = async (req, res) => {
    try {
      console.log("handling registration request")
      const { email, password } = req.body;
  
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user
      const user = new User({
        email,
        password: hashedPassword,
        isActivate: false,
      });
  
      // Save the user to the database
      await user.save();
  
      // Generate a confirmation token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  
      // Send a confirmation email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Activate your account',
        text: `Please click on this link to activate your account:\n
        https://${process.env.CLIENT_URL}/activate/${token}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
  
      res.status(201).json({ message: 'User registered successfully. Please check your email to activate your account. Then login again.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  