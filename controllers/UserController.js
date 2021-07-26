require('dotenv').config();
const Users = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')


// create user
const userController = {
    register :  async(req,res) => {
        try {
            let transporter = nodeMailer.createTransport({
                service: "gmail",
                auth: {
                        user: process.env.GMAIL_USERNAME,
                        pass: process.env.GMAIL_PASSWORD,
                      },
            });
            
            const {username, email, password} = req.body

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg:"User already exist"})
            

            if(password.length < 6) return res.status(400).json({msg:"Password should be atlease 6 characters"})
            
            if(!email || !password || !username){
              return  res.status(500).json({msg:"Please add all the fields"})
            }

            // password encryption
            const passwordHash = await bcrypt.hash(password, 10)

            //save to mongoDB
            const userData = new Users({
                username , 
                email, 
                password:passwordHash
            })
            await userData.save()

            let mailOptions = {
                    from: "Welcome@the_er.com", 
                    to: userData.email,
                    subject: 'Welcome Message',
                    text: 'Thank you for Registering into our site!!!'
                };
           
                transporter.sendMail(mailOptions, (err, data) => {
                    if (err) {
                        return console.log('Error occurs' , err);
                    }
                    return console.log('Email sent!!!', data);
                });
            
            res.status(200).json({userData})

        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    sign_In : async (req, res) => {
        try {
            const {email, password} = req.body 

            if(!email || !password)
            return res.status(422).json({msg:"please add all the fields"})

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg : "User does not exist"})

            const  isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch)  return res.status(400).json({msg : "Incorrect Password"})

            if(isMatch) {
                const accessToken = createAccessToken({_id: user._id})
                const {_id, username, email} = user
                  return res.status(200).json({accessToken, savedUser:{_id, username, email} })
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    authentication : (req,res) => {
        res.send("Hellooo")
    }
}

const  createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

module.exports= {userController}
