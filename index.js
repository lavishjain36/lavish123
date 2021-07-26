require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const foodRoute =require('./Routers/foodRoute')
const user = require('./Routers/UserRoute')
const reset = require('./Routers/ResetRoute')
const cors = require('cors')


const app = express()
app.use(express.json())
app.use(cors())


//local server connection
const PORT = process.env.PORT || 5000

// mongodb connection
const URI = process.env.MONGO_URL
mongoose.connect(URI, {
    useCreateIndex:true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err ;
    console.log("::: Successfully Connected to MongoDB Server :::")
})

app.use('/', foodRoute)
app.use('/' , user)
app.use('/' , reset)

app.listen(PORT, () => {
    console.log("::: Your Server Running on PORT", PORT)
})