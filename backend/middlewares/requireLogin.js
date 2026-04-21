const jwt = require("jsonwebtoken")
const {Jwt_secret} = require("../keys")
const mongoose = require("mongoose")
const USER = mongoose.model("USER")

// module.exports =(req, res, next)=>{
//    const {authorization} = req.headers;
//    if(!authorization){
//     return res.status(401).json({error:"you must have logged in"})
//    }
//   const token  = authorization.replace("Bearer ","")
//   jwt.verify(token,Jwt_secret,(err, payload)=>{
//     if(err){
//         return res.status(401).json({error:"you must have logged in 2"})
//     }
//     const {_id} = payload
//     console.log("id ===>",_id)
//     USER.findById(_id).then(userData =>{
//         console.log("user data  ====>",userData)
//         req.user = userData
//         next();
//     })
//   })
// }
module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must have logged in 1" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, Jwt_secret, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must have logged in 2" })
        }
        const { id } = payload
        USER.findById(id).then(userData => {
            req.user = userData
            next()
        })
    })

}