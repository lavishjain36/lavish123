const mongoose = require('mongoose')
const randomstring= require('randomstring')

const foodSchema = new mongoose.Schema({
    foodName:{
        type: "String",
        required:true
    },
    shortUrl:{
        type: "String",
        default:true
    }
})
module.exports = mongoose.model("FoodData", foodSchema)