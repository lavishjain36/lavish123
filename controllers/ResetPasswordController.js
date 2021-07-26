const Users = require('../models/UserModel')
const nodeMailer = require('nodemailer')
const bcrypt = require("bcrypt")
const crypto = require("crypto")

const resetController = {
    passwordReset : async(req,res) => {
        let transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD,
                  },
        });
        
        // create a token and set to expire within one hour
        crypto.randomBytes(32, async(err, buffer) => {
            if(err) {
                console.log(err)
            }
            const token = buffer.toString("hex")
       
        const { email} = req.body
        const user = await Users.findOne({email})
              
        if(!email){
          return  res.status(500).json({msg:"Please enter valid email"})
        }

        // save token to db
        user.resetToken = token
        user.expireToken = Date.now() + 3600000

        await user.save()

          let mailOptions = {
            from: "no-reply@the_er.com", 
            to: user.email,
            subject: 'Reset Password',
            html: `<h3> Since you have lost your password , here is your password reset  link  </h3>
                        <br/> This link will expire within one hour
                        <br />
                          <a href="https://authentication-mern-stack.netlify.app/newpassword/${token}"> Click here </a>`
        };
   
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                return console.log('Error occurs' , err);
            }
            return res.status(200).json({message:" Reset link sent successfully. Please check your email"})
        });
    })
    },
    newPassword: async(req, res) => {  
        try {
            const updatePassword = req.body.password
            const sentToken = req.body.token
    
             const user = await Users.findOne({resetToken:sentToken , expireToken:{$gt:Date.now()}})
                  
            if(!user)     return res.status(422).json({msg:" session expired"})
                
            const passwordHash = await bcrypt.hash(updatePassword, 10)
    
            user.password = passwordHash
            user.resetToken = undefined
            user.expireToken = undefined
            
            await user.save()
            console.log(user)
            return res.status(200).json({message:" Password updated successfully..please try to login now..."})
    
        } catch (error) {
            console.log(error)
            
        } 
      
    }
}

module.exports= {resetController}
