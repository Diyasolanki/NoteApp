const jwt = require('jsonwebtoken');
const User = require('../models/user.model')

module.exports = async(req,res,next)=> {
    try{
        const { authorization } = req.headers;

        if(!authorization){
            return res.status(404).json({ error : 'invalid user credentials'});
        }
        const token = authorization.replace("Bearer ", "");
        let payload;

        try{
            payload = jwt.verify(token , process.env.JWT_SECRET);
        }catch(err){
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        //id token return
        const {_id} = payload
        const userdata = await User.findById(_id)

        if(!userdata){
            return res.json({error : 'user not found'});
        }
       
        // If the user exists, req.user = userdata; attaches the user document to req.
        req.user = userdata;
        next();

    }catch(err){
        console.log('error in authentication process')
        return res.status(500).json({ error: 'Internal Server Error' });
       
    }
}
