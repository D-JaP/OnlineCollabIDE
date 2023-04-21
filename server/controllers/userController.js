const User = require('../models/users');
const jwt = require('jsonwebtoken');

exports.user = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // find the user by ID in the token payload
        const user = await User.findById(decoded.userId);
        // check if user exists
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not authorised to this project, cannot get user info'
            });
        }
        const prj_list_id = user.codebase_id;
        let prj_list_link = []
        prj_list_id.forEach((id) => {
            prj_list_link.push(`https://${process.env.CLIENT_URL}/project/` + id)
        })
        if (prj_list_link) {
            return res.status(200).json(prj_list_link)
        }
        else {
            return res.status(404).json({
                message: 'user prj is empty'
            })
        }
    } catch (error) {
        next(error);
        console.log(error)
    }
}

exports.addPrjToUser = async (req,res,next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // find the user by ID in the token payload
        const user = await User.findById(decoded.userId);
        
        // check if user exists
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not authorised to this project, cannot add prj to user'
            });
        }
        
        if (!user.codebase_id.find((e) => e === req.id)) {
            user.codebase_id.push(req.body.id)
            await user.save();
            
            return res.status(200).json({
                message: "added prj to user"
            })
        }
        else {
            return res.status(200).json({
                message: "prj already added"
            })
        }

    }
    catch (error) {

    }
}