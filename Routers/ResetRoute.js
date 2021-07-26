const router = require('express').Router()
const {resetController} = require('../controllers/ResetPasswordController')
const auth = require("../middleware/auth")


router.post('/resetpassword', resetController.passwordReset)

router.post('/newpassword', resetController.newPassword)


module.exports  = router