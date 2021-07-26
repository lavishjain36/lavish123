const Users = require('../models/UserModel')
const jwt = require('jsonwebtoken')


module.exports =  (req,res,next) => {
    const { authorization } = req.headers
    if(!authorization) {
        res.status(404).json({error: "You must logged In"})
    }
    const accessToken = authorization.replace("Bearer ", "")
    jwt.verify(accessToken,  process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) {
            return res.status(401).json({error: "You must logged In"})
         }
         const {_id} = payload
          Users.findOne(_id)
          .then(userdata => {
            req.user =userdata
            next();
        })
    })
   

}