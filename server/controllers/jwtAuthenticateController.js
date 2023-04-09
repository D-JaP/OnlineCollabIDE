const jwt  = require('jsonwebtoken')
const User = require('../models/users')

exports.authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId)

        if (!user) {
            console.log("user authenticating...")
            return res.status(404).json({
              status: 'error',
              message: 'User not authorised'
              
            });
        }
        else {
            return res.status(200).json({
                status: 'success',
                message : 'User authenticated',
                email: user.email
            })
        }
    }
    catch(error){
        next(error)
    }
}