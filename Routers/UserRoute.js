const router = require('express').Router()
const {userController} = require('../controllers/UserController')
const auth = require("../middleware/auth")


router.post('/signup',userController.register )

router.post('/signin' ,userController.sign_In )

router.get('/protected', auth ,userController.authentication )



module.exports  = router