const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: "String",
        required:true
    },
    email:{
        type: "String",
        default:true,
        unique:true
    },
    password:{
        type: "String",
        required:true
    },
    resetToken: "String",
    expireToken: Date,
})
module.exports = mongoose.model("Users", userSchema)