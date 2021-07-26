const router = require('express').Router()
const {foodController, readAllFood, updateFood, deleteFood} = require('../controllers/foodController')
const auth = require("../middleware/auth")


router.post('/insert',foodController.food )

router.get('/read' ,readAllFood.allFood )

router.delete('/delete/:id' ,deleteFood.removeFood )


module.exports  = router