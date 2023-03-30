const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/users')
exports.invite = async (req, res, next) => {
  const { sender, link, receiver } = req.body;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find the user by ID in the token payload
    const user = await User.findById(decoded.userId);
    // check if user exists
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not authorised to this project, cannot send invite'
      });
    }

    // Create a Nodemailer transport object with your SMTP settings
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    
    
    // Construct the email message
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: receiver,
        subject: `${sender} is inviting you to join his project`,
        text: `Please click on this link to join :\n
        ${link}`,
      };

    // Send the email using the transporter object
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    next(error);
  }
}
