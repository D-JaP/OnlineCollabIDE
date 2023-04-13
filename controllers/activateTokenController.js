const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.activateAccount = async (req, res) => {
  const { token } = req.params;

  try {
    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find the user by ID in the token payload
    const user = await User.findById(decoded.userId);
    // check if user exists
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // check if user is already activated
    if (user.isActivated) {
      return res.status(400).json({
        status: 'error',
        message: 'Account already activated'
      });
    }

    // activate the user account
    user.isActivated = true;
    await user.save();

    // send a response to the client
    res.status(200).json({
      status: 'success',
      message: 'Account activated'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}